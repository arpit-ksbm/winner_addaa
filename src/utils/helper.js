
// otpGenerator.js

const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
// const multer = require("multer");
// const updateProfileUpload = multer({
//   dest: "/static/assets/admin/adminimages/",
// });
// const emailServiceInstance = require('./emailService')
const mongoose = require('mongoose');
// const { UserModel } = require("../model");



// const CompanyAuthModel = require('../model/Company/CompanyModel')

module.exports = {
    generateOtp: (digits = 6) => {
        if (digits <= 0) {
            throw new Error('Number of digits must be greater than 0');
        }
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;

        const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
        return otp;
        return "1234";
    },

    validatePhoneNumber: (mobile_no) => {
        const mobileNumberPattern = /^\d{10}$/;
        return mobileNumberPattern.test(mobile_no);
    },

    sendMail: (maildata) => {
        // {
        //   name: result.first_name || "",
        //   email: result.email,
        //   to: result.email,
        //   msg: `Your verification OTP is ${payload.otp}`,
        //   otp: payload.otp,
        //   subject: "OTP Verification mail !!",
        //   view_name: "otpmail.ejs",
        // };
        // emailServiceInstance.sendEmail(maildata);
        console.log("Email sent:", maildata);
    },

    hash256: (data) => {
        console.log(data);
        const hash = crypto.createHash("sha256");
        hash.update(data);
        return hash.digest("hex");
    },

    generateToken: () => {
        const token = crypto.randomBytes(16).toString("hex");
        return token;
    },

    singleUpload: async (file, fieldName, destinationPath) => {
        try {
            const uploadDir = path.join(__dirname, "..", destinationPath);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}_${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);

            // Move the file to the specified path (not needed with multer)
            // await file.mv(filePath);

            // Return the file path or other relevant information
            return fileName;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },

    decryptionID: (result_id) => {
        const id = result_id.substring(10);
        const decrypted_id = id.substring(0, id.length - 10);
        return decrypted_id;
    },

    Response: (res, success = true, status = 200, message = "", data = [], extra = []) => {
        return res.status(status).json({
            success: success,
            message: message,
            data: data,
            ...extra
        });
    },

    Error: (res, result = -1, status = 500, msg = "", errors = []) => {
        res.status(status).send({ result: result, msg: msg });
        return;
    },
    ErrorCatch: (res, error) => {
        var responseObject = {
            result: -1,
            msg: error.message,
        };
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors)[0].message;
            responseObject = {
                result: -1,
                msg: errorMessage,
            };
        } else if (error.code === 11000 && error.keyPattern && error.keyValue) {
            // Duplicate key violation
            const fieldName = Object.keys(error.keyPattern)[0];
            const duplicatedValue = error.keyValue[fieldName];
            const errorMessage = `${module.exports.ucWords(fieldName)} '${duplicatedValue}' must be unique.`;
            responseObject = {
                result: -1,
                msg: errorMessage,
            };
        }
        if (error.response && error.response.status && typeof error.response.status === 'function') {
            responseObject.msg = error.message;
            error.response.status(500).send(responseObject);
            return;
        } else {
            res.status(500).send(responseObject);
            return;
        }


    },

    ucWords: (str) => {
        // Split the string into an array of words
        var words = str.split('_') || str.split(' ');

        // Capitalize the first letter of each word
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }

        // Join the words back into a string
        return words.join(' ');
    },

    // validator.js

    validations: (res, obj) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];

                if (Array.isArray(value)) {
                    // If the value is an array, check each element
                    for (const element of value) {
                        if (element === undefined || element === null || element === "") {
                            return res
                                .status(200)
                                .json({ result: 0, msg: `${module.exports.ucWords(key)} array elements are required` });
                        }
                    }
                } else {
                    // If the value is not an array, check for undefined, null, or empty string
                    if (value === undefined || value === null || value === "") {
                        return res
                            .status(200)
                            .json({ result: 0, msg: `${module.exports.ucWords(key)} is required` });
                    }
                }
            }
        }
    },
    explode: (delimiter, string) => {
        return string.split(delimiter);
    },
    implode: (separator, array) => {
        return array.join(separator);
    },
    // userAuthentication: async (req, res) => {
    //     try {
    //         const token = req.get('token');

    //         if (typeof token === 'undefined') {
    //             res.send({ result: 2, msg: 'Header token is required!' });
    //             return null;
    //         }

    //         if (!token) {
    //             res.status(401).json({ result: 2, msg: 'Header token is required!' });
    //             return null;
    //         }

    //         const user = await UserModel.getUserByToken(token);

    //         if (!user || user === null) {
    //             res.status(401).json({ result: 2, msg: 'User Not Found!' });
    //             return null;
    //         }

    //         // if (user.is_verified === 'no') {
    //         //   return res.status(401).json({ result: -2, msg: 'Please verify yourself. We have resent the verification link to your email. Please check your mail.' });
    //         // }

    //         switch (user.status) {
    //             case 'Deleted':
    //                 return res.status(401).json({ result: 2, msg: 'Your account has been deleted.' });
    //             case 'Disabled':
    //                 return res.status(401).json({ result: 2, msg: 'Your account is disabled.' });
    //             case 'Blocked':
    //                 return res.status(401).json({ result: 2, msg: 'Your account is blocked.' });
    //             case 'Inactive':
    //                 return res.status(401).json({ result: 2, msg: 'Your account has been inactive by admin.' });
    //             default:
    //                 return user;
    //         }


    //     } catch (error) {
    //         console.error(error, "error");
    //         return res.status(500).send('Internal Server Error');
    //     }
    // },

    paginate: async (model, pageNumber, pageSize, query = {}) => {
        try {
            // Calculate the number of documents to skip
            const skip = (pageNumber - 1) * pageSize;

            // Query documents, skipping appropriate number of documents based on page number and limiting to pageSize
            const documents = await model.find(query)
                .skip(skip)
                .limit(pageSize)
                .exec();

            // Count total number of documents for pagination
            const totalDocuments = await model.countDocuments(query);

            // Calculate total pages
            const totalPages = Math.ceil(totalDocuments / pageSize);

            return {
                documents,
                currentPage: pageNumber,
                totalPages,
                totalDocuments
            };
        } catch (err) {
            throw new Error(`Pagination failed: ${err.message}`);
        }
    },

    generateRandomPassword: async (length) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    ,
    mongooseValidation: async (value, is_array = false) => {
        if (is_array === true) {
            for (let element of value) {
                if (!mongoose.Types.ObjectId.isValid(element)) {
                    return true;
                }
            }
        } else {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return true;
            }
        }
        return false;
    },
    generateOrderId: () => {
        // Generate a random number between 100000 and 999999
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        // Convert the random number to a string
        const purchaseId = "OI-" + randomNumber.toString();
        return purchaseId;
    },
    generatePurchaseId: () => {
        // Generate a random number between 100000 and 999999
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        // Convert the random number to a string
        const purchaseId = "PO-" + randomNumber.toString();
        return purchaseId;
    },
    salesOrderId: () => {
        // Generate a random number between 100000 and 999999
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        // Convert the random number to a string
        const purchaseId = "SO-" + randomNumber.toString();
        return purchaseId;
    }


}
