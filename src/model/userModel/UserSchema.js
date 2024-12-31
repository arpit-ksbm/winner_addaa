const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  email_verified_at: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  mobile_no: {
    type: String,
    default: null,
  },
  otpExpiry: { 
    type: Date 
  },
  country_code: { 
    type: String, 
    default: "+91"
  },
  isVerify: { 
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null,
  },
  aadhar_refId: {
    type: String,
    default: null,
  },
  aadhar_verified: {
    type: String,
    enum: ['YES', 'NO'],
    default: 'NO',
  },
  name: {
    type: String,
    default: null,
  },
  aadhar_no: {
    type: String,
    length: 12,
    default: null,
  },
  pan_no: {
    type: String,
    default: null,
  },
  pan_verified: {
    type: String,
    enum: ['YES', 'NO'],
    default: 'NO',
  },
  name_at_bank: {
    type: String,
    default: null,
  },
  account_no: {
    type: String,
  },
  ifsc: {
    type: String,
  },
  acc_verified: {
    type: String,
    enum: ['YES', 'NO', ''],
    default: 'NO',
  },
  state: {
    type: String,
  },
  last_active_at: {
    type: Date,
  },
  game_type: {
    type: String,
    enum: ['1', '2'], // Assuming '1' = Ludo, '2' = Wheel, can add more game types if necessary
    default: '1',
  },
  country_code: {
    type: Number,
    default: 1,
  },
  user_type: {
    type: Number,
    default: 2, // 1 - Owner, 2 - Customer
    enum: [1, 2],
  },
  remember_token: {
    type: String,
    default: null,
  },
  status: {
    type: Boolean,
    default: true, // 1 = Active, 0 = Deactive
  },
  created_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', UserSchema);
