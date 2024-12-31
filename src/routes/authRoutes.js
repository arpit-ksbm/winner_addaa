const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controller/AuthController');

// authRouter.post('/login', AuthController.Login);
// authRouter.post('/register', AuthController.Register);
authRouter.post('/mobileLogin', AuthController.mobileLogin);

module.exports = authRouter;