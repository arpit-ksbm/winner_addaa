const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { UserModel, PlayerModel, WalletDetail, BonusWalletDetail, BonusWalletTransactionDetail } = require('../model/index');
const { hash256, Response } = require('../utils/helper');
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
}

module.exports = AuthController;
