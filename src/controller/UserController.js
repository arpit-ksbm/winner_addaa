const jwt = require('jsonwebtoken');
const User = require('../model/userModel/UserSchema');
const {
    ErrorCatch,
    Error,
    Response,
    validations,
    generateOtp,
    validatePhoneNumber, // Added the new helper
} = require('../utils/helper');
require('dotenv').config();

class UserController {
    static async loginRegister(req, res) {
        try {
            const { mobile_no } = req.body;

            const validationResponse = validations(res, { mobile_no });
            if (validationResponse) return validationResponse;

            if (!validatePhoneNumber(mobile_no)) {
                return Response(res, false, 400, "Invalid mobile number format. Please enter a 10-digit mobile number.");
            }

            // Generate OTP
            const otp = generateOtp();
            console.log(`Generated OTP: ${otp}`);

            // Set OTP expiration time (5 minutes)
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

            // Check if the user already exists
            let user = await User.findOne({ mobile_no });
            if (user) {
                // Update OTP and expiry time for existing user
                user.otp = otp;
                user.otpExpiry = otpExpiry;
                await user.save();
            } else {
                // Create a new user with OTP and expiry time
                user = new User({
                    mobile_no,
                    otp,
                    otpExpiry,
                });
                await user.save();
            }

            // Send OTP response
            Response(res, true, 200, "OTP generated successfully", otp);

        } catch (error) {
            console.error("Error during login/registration:", error);
            ErrorCatch(res, error);
        }
    }

    static async verifyOtp(req, res) {
        try {
            const { mobile_no, otp } = req.body;
    
            // Validation for request body fields
            const validationResponse = validations(res, { mobile_no, otp });
            if (validationResponse) return validationResponse;
    
            // Check if the mobile number format is valid
            if (!validatePhoneNumber(mobile_no)) {
                return Response(res, false, 400, "Invalid mobile number format. Please enter a 10-digit mobile number.");
            }
    
            // Find the user by mobile number
            let user = await User.findOne({ mobile_no });
            if (!user) {
                return Response(res, false, 400, "User not found");
            }
    
            // Check if the provided OTP matches the stored OTP
            if (user.otp !== otp) {
                return Response(res, false, 400, "Invalid OTP");
            }
    
            // Check if the OTP has expired
            const currentTime = new Date();
            if (currentTime > user.otpExpiry) {
                return Response(res, false, 400, "OTP expired. Please request a new OTP.");
            }
    
            // Mark the user as verified and clear OTP fields
            user.isVerify = true;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
    
            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT, { expiresIn: '1h' });
    
            // Return a success response with the token and user data
            return Response(res, true, 200, "OTP verified successfully", { user, token });
    
        } catch (error) {
            console.error("Error during OTP verification:", error);
            return ErrorCatch(res, error);
        }
    }
}

module.exports = UserController;
