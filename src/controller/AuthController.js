const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { 
  UserModel, 
  PlayerModel, 
  WalletDetail, 
  BonusWalletDetail,  
  WalletTransactionDetail, 
  PromoWalletDetail,
  Coupon
} = require('../model/index');
const { hash256, Response } = require('../utils/helper');

  // Helper Functions
const generateRandomString = (length) => {
  return crypto.randomBytes(length / 2).toString('hex'); // Generates a random string of the desired length
};

const generateToken = (userId) => {
  const secretKey = process.env.JWT; // Replace with an environment variable
  const expiresIn = "1d"; // Token expiration (1 day in this case)

  return jwt.sign({ id: userId }, secretKey, { expiresIn });
};

const generateRandomCode = () => {
  return crypto.randomBytes(4).toString('hex'); // Generates an 8-character random code
};

class AuthController {

    static async Register(req, res) {
        
        try {
          // Extract data from request
          const { name, email, user_type, mobile_no } = req.body;

          const existingEmail = await UserModel({ email });
          if (existingEmail) {
            return Response(res, false, 400, 'Email already exists');
        }
    
          // Hash the password and generate a token
          const hashedPassword = hash256('admin123');  // Hardcoded password as in the original code
          const rememberToken = Math.random().toString(36).substr(2, 10);  // Random token
    
          // Create the user
          const newUser = new UserModel({
            name,
            email,
            user_type,
            mobile_no,
            password: hashedPassword,
            remember_token: rememberToken
          });
    
          // Save the user to the database
          await newUser.save();
    
          // Generate an authentication token
          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT,  // Use your own secret key
            { expiresIn: '1h' }
          );
    
          // Return the response with the token
          return res.status(200).json({ success:true, message: 'User registered successfully', token });
    
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Server error' });
        }
    }
    
    
    static async Login(req, res){
        try {
            const { email, mobile_no, first_name, last_name, device_type, device_token } = req.body;
        
            // Validation
            if (!email || !email.includes('@')) {
              return res.status(422).json({ errors: ['Email is required and must be valid'] });
            }
        
            // Check if the user already exists
            let user = await UserModel.findOne({ email })
            if (user) {
              // Check password (hardcoded as "admin123" in this case)
              const isPasswordValid = await bcrypt.compare('admin123', user.password);
              if (isPasswordValid) {
                // Generate a token
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
                return res.status(200).json({
                  status: 'Login',
                  message: 'User Successfully Logged in',
                  token,
                  data: user,
                  mobile_no: user.mobile_no,
                });
              } else {
                return res.status(422).json({ message: 'Password mismatch' });
              }
            } else {
              // Register a new user
              const hashedPassword = hash256('admin123');
              const newUser = new UserModel({
                email,
                password: hashedPassword,
                remember_token: crypto.randomBytes(10).toString('hex'),
                user_type: 2,
                mobile_no: mobile_no || '',
              });
        
              user = await newUser.save();
        
              // Create player details
              const playerDetails = new PlayerModel({
                id: mobile_no,
                user_id: user._id,
                first_name: first_name || '',
                last_name: last_name || '',
                refer_code: generateRandomCode(), // Implement this function
                profile_image: '5225698231638.jpg',
                join_code: '',
                no_of_participate: 0,
                no_of_loose: 0,
                no_of_total_win: 0,
                no_of_2win: 0,
                no_of_4win: 0,
                device_type: device_type || '',
                device_token: device_token || '',
                banned: 0,
              });
        
              await playerDetails.save();
        
              // Create wallet details
              const walletDetails = new WalletDetail({
                player_id: playerDetails.id,
                wallet_ref_number: crypto.randomBytes(8).toString('hex'),
                total_amt_load: 0,
                total_amt_withdraw: 0,
                current_amount: 0,
                no_of_load: 1,
                no_of_withdraw: 0,
                game_type: 1,
              });
        
              await walletDetails.save();
        
              // Create bonus wallet details
              const bonusWalletDetails = new BonusWalletDetail({
                player_id: playerDetails.id,
                bonus_wallet_ref_number: crypto.randomBytes(8).toString('hex'),
                total_amt_added: 0,
                total_amt_used: 0,
                current_amount: 0,
              });
        
              await bonusWalletDetails.save();
        
              // Create bonus wallet transaction details
              const coupon = new BonusWalletTransactionDetail({
                player_id: playerDetails.id,
              });
        
              await coupon.save();
        
              // Generate a token
              const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
              return res.status(200).json({
                status: 'Register',
                message: 'User Registered and Successfully Logged in',
                token,
                player_id: playerDetails.id,
                data: user,
              });
            }
          } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ status: 'Error', message: 'Internal server error' });
          }
    }


    static async mobileLogin(req, res) {
      try {
          const { mobile_no, device_type, device_token, country_code, first_name, last_name } = req.body;
  
          const existingMobile = await UserModel.findOne({ mobile_no} );
          if (existingMobile) {
              return res.status(400).json({ message: "Mobile number already exists" });
          }
  
          // Validate mobile number
          if (!mobile_no || typeof mobile_no !== 'string' || mobile_no.length > 25) {
              return res.status(422).json({ errors: ["Mobile number is required and must be a string with a maximum of 25 characters."] });
          }
  
          // Check if the user already exists
          let user = await UserModel.findOne({ mobile_no });
  
          if (user) {
              // If the user exists, check password (default is 'admin123')
              const isPasswordValid = await bcrypt.compare('admin123', user.password);
              if (isPasswordValid) {
                  // Update device token in PlayerModel
                  await PlayerModel.updateOne({ user_id: user._id }, { device_token });
  
                  // Fetch Player details
                  const playerDetails = await PlayerModel.findOne({ user_id: user._id });
  
                  // Generate token
                  const token = generateToken(user._id);
  
                  // Send response
                  return res.status(200).json({
                      status: "Login",
                      message: "User Successfully Logged in",
                      token,
                      data: {
                          ...user._doc,
                          player_details: playerDetails,
                      },
                  });
              } else {
                  return res.status(422).json({ message: "Password mismatch" });
              }
          } else {
              // Create a new user
              const hashedPassword = await bcrypt.hash('admin123', 10);
              const newUser = new UserModel({
                  mobile_no,
                  password: hashedPassword,
                  remember_token: generateRandomString(10),
                  user_type: 2,
                  country_code,
              });
              user = await newUser.save();
  
              // Generate token
              const token = generateToken(user._id);
  
              // Create player details
              const playerDetails = new PlayerModel({
                  user_id: user._id,
                  first_name: first_name || '',
                  last_name: last_name || '',
                  refer_code: generateRandomCode(),
                  join_code: '',
                  no_of_participate: 0,
                  no_of_loose: 0,
                  no_of_total_win: 0,
                  no_of_2win: 0,
                  no_of_4win: 0,
                  device_type: device_type || '',
                  device_token: device_token || '',
                  banned: 0,
                  profile_image: 'default.jpg',
              });
              await playerDetails.save();
  
              // Create wallet details
              const walletDetails = new WalletDetail({
                  player_id: playerDetails._id,
                  wallet_ref_number: generateRandomString(16),
                  total_amt_load: 0,
                  total_amt_withdraw: 0,
                  current_amount: 0,
                  no_of_load: 1,
                  no_of_withdraw: 0,
                  game_type: 1,
              });
              await walletDetails.save();
  
              // Create bonus wallet details
              const bonusWalletDetails = new BonusWalletDetail({
                  player_id: playerDetails._id,
                  bonus_wallet_ref_number: generateRandomString(16),
                  total_amt_added: 50,
                  total_amt_used: 0,
                  current_amount: 50,
              });
              await bonusWalletDetails.save();
  
              // Create transaction details for bonus
              const transactionDetails = new WalletTransactionDetail({
                  player_id: playerDetails._id,
                  wallet_id: bonusWalletDetails._id,
                  type: 'credit',
                  use_of: 'first_login',
                  notes: 'First login',
                  trans_date: new Date(),
                  amount: 50,
                  wallet_type: 'bonus_balance',
              });
              await transactionDetails.save();
  
              // Create promo wallet details
              const promoWalletDetails = new PromoWalletDetail({
                  player_id: playerDetails._id,
                  bonus_wallet_ref_number: generateRandomString(16),
                  total_amt_added: 0,
                  total_amt_used: 0,
                  current_amount: 0,
              });
              await promoWalletDetails.save();
  
              // Create coupon
              const coupon = new Coupon({
                  player_id: playerDetails._id,
              });
              await coupon.save();
  
              // Send response
              return res.status(200).json({
                  status: "Login",
                  message: "User Registered and Successfully Logged in",
                  token,
                  player_id: playerDetails._id,
                  data: {
                      ...user._doc,
                      player_details: playerDetails,
                  },
              });
          }
      } catch (error) {
          console.error("Error during mobile login:", error);
          return res.status(500).json({ message: "Internal server error", error: error.message });
      }
  }
  
}

module.exports = AuthController;
