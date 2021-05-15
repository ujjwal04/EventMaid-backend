const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const fast2sms = require('fast-two-sms');

const User = require('./../models/User');
const AppError = require('./../utils/appError');

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
      message: `Your OTP is: ${otp}`,
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

  res.json({
    status: 'success',
    number: req.body.number,
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
    const newUser = await User.create({
      name: req.body.name,
      dob: req.body.dob,
      number: req.body.number,
    });

    res.status(201).json({
      status: 'success',
      newUser,
    });
  } catch {
    next(err);
  }
};
