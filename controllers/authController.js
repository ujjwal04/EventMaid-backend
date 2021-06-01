const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/User');
const AppError = require('./../utils/AppError');
const VerifiedNumber = require('../models/VerifiedNumber');

const signToken = (number) => {
  return jwt.sign({ number }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.generateOtp = async (req, res, next) => {
  try {
    // 1) Check if the number is valid
    if (!req.body.number || req.body.number.length != 10)
      return next(new AppError('Invalid Number', 400));

    // 2) Generate a random 6 digit otp
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // 3) Add an expiry date to the OTP
    const expires = Date.now() + 1 * 60 * 1000;

    // 4) Data to be hashed
    const data = `${req.body.number}.${otp}.${expires}`;

    // 5) Generating a cryptographic hash
    const hash = crypto
      .createHmac('sha256', process.env.SECRET)
      .update(data)
      .digest('hex');

    // 6) Sending the otp to the number
    const resp = await fast2sms.sendMessage({
      authorization: process.env.FAST2SMS_API_KEY,
      message: `${otp} is the One Time Password (OTP) for EventMaid and will be valid only for 1 min only. NEVER SHARE YOUR OTP WITH ANYONE.`,
      numbers: [req.body.number],
    });

    res.json({
      hash,
      expires,
      otp,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  // 1) Validating all the request body fields
  if (!req.body.hash) return next(new AppError('Hash not provided', 400));

  if (!req.body.number)
    return next(new AppError('Phone number not provided', 400));

  if (!req.body.otp) return next(new AppError('Otp not provided', 400));

  if (!req.body.expires)
    return next(new AppError('Expiry time not provided', 400));

  // 2) Checking if the OTP has expired
  const currentTime = Date.now();
  if (currentTime > parseInt(req.body.expires))
    return next(new AppError('the token has expired', 401));

  // 3) Generating a new hash to verify the details in the request
  const data = `${req.body.number}.${req.body.otp}.${req.body.expires}`;
  const verifyHash = crypto
    .createHmac('sha256', process.env.SECRET)
    .update(data)
    .digest('hex');

  // 4) Checking if the hash in the request field is valid
  if (req.body.hash !== verifyHash)
    return next(new AppError('Invalid Token', 401));

  const token = signToken(req.body.number);

  // 5) Add the verified number in the verified number collection
  await VerifiedNumber.create({
    number: req.body.number,
  });
  res.json({
    status: 'success',
    number: req.body.number,
    token,
  });
};

exports.signup = async (req, res, next) => {
  try {
    // 1) Check if all the incoming fields in the body are valid
    if (
      !req.body.number ||
      req.body.number.toString().length != 10 ||
      !req.body.name ||
      !req.body.dob
    ) {
      return next(new AppError('Invalid Request Body', 400));
    }

    // 2) Create the new user in the db
    await User.create({
      name: req.body.name,
      dob: new Date(req.body.dob),
      number: req.body.number,
    });

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findOne({
    where: {
      number: decoded.number,
    },
  });
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS
  req.user = freshUser;
  next();
};

exports.isNumberVerified = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    // 3) Check if number is verified
    const verifiedNumber = await VerifiedNumber.findOne({
      number: parseInt(decoded.number),
    });
    if (!verifiedNumber) {
      return next(new AppError('The number is not otp verified', 401));
    }

    // GRANT ACCESS
    next();
  } catch (err) {
    next(err);
  }
};
