const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/generate-otp').post(authController.generateOtp);
router.route('/verify-otp').post(authController.verifyOtp);
router
  .route('/signup')
  .post(authController.isNumberVerified, authController.signup);

module.exports = router;
