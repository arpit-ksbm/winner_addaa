// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the schema for the user data
// const UserSchema = new Schema({
//   user_id: { type: Number },
//   first_name: { type: String, default: ""},
//   last_name: { type: String, default: "" },
//   email: { type: String, default: "" },
//   mobile_no: { type: String, required: true },
//   otp: { type: String, default: "" },
//   otpExpiry: { type: Date },
//   country_code: { type: String, },
//   refer_code: { type: String, default: "" },
//   join_code: { type: String, default: "" },
//   no_of_participate: { type: String },
//   no_of_loose: { type: String },
//   no_of_total_win: { type: String },
//   no_of_2win: { type: String },
//   no_of_4win: { type: String },
//   device_type: { type: String },
//   device_token: { type: String, default: "" },
//   profile_image: { type: String },
//   banned: { type: Boolean, default: false },
//   first_offer: { type: Number },
//   isVerify: { type: Boolean, default: false },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

// const User = mongoose.model('User', UserSchema);

// module.exports = User;

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
