const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema');
const { ErrorCatch, Error, Response, validations, generateToken, hash256, generateOtp, paginate, generateRandomPassword,mongooseValidation,generateOrderId,generatePurchaseId} = require('../utils/helper')
require('dotenv').config();

class UserController {
    static async loginRegister(req, res) {
        try {
            const { mobile_no } = req.body;
    
            const validationResponse = validations(res, { mobile_no });
            if (validationResponse) return validationResponse;
    
            // Validate mobile number format (must be 10 digits)
            const mobileNumberPattern = /^\d{10}$/;
            if (!mobileNumberPattern.test(mobile_no)) {
                return Response(res, false, 400, "Invalid mobile number format. Please enter a 10-digit mobile number.");
            }
    
            // Generate OTP
            const otp = generateOtp();
            console.log(`Generated OTP: ${otp}`);
    
            // Create expiration time for OTP
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    
            // Check if user already exists
            let user = await User.findOne({ mobile_no });
            if (user) {
                // If the user exists, update the OTP and expiry time
                user.otp = otp;
                user.otpExpiry = otpExpiry;
                await user.save();
            } else {
                user = new User({
                    mobile_no,
                    otp,
                    otpExpiry,
                });
                await user.save();
            }
    
            Response(res, true, 200, "OTP generated successfully", otp);
    
        } catch (error) {
            console.error("Error during login/registration:", error);
            ErrorCatch(res, error);
        }
    }

    static async verifyOtp(req, res) {
        try {
            const { mobile_no, otp } = req.body;
    
            const validationResponse = validations(res, { mobile_no, otp });
            if (validationResponse) return validationResponse;
    
            const mobileNumberPattern = /^\d{10}$/;
            if (!mobileNumberPattern.test(mobile_no)) {
                return Response(res, false, 400, "Invalid mobile number format. Please enter a 10-digit mobile number.");
            }
    
            let user = await User.findOne({ mobile_no });
            if (!user) {
                return Response(res, false, 400, "User not found");
            }
    
            if (user.otp !== otp) {
                return Response(res, false, 400, "Invalid OTP");
            }
    
            const currentTime = new Date();
            if (currentTime > user.otpExpiry) {
                return Response(res, false, 400, "OTP expired. Please request a new OTP.");
            }
    
            // If OTP is valid and not expired, update the isVerify field
            user.isVerify = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
    
            const token = jwt.sign({ userId: user._id }, process.env.JWT , { expiresIn: '1h' });
    
            Response(res, true, 200, "OTP verified successfully", user, token);
    
        } catch (error) {
            console.error("Error during OTP verification:", error);
            ErrorCatch(res, error);
        }
    }
}

module.exports = UserController;
