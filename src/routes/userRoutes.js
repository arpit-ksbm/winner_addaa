const express = require('express');
const userRouter = express.Router();
const UserController = require('../controller/UserController');

userRouter.post('/mobileLogin', UserController.loginRegister);
userRouter.post('/verifyOtp', UserController.verifyOtp);

module.exports = userRouter;