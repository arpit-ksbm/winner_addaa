const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user data
const UserSchema = new Schema({
  user_id: { type: Number },
  first_name: { type: String, default: ""},
  last_name: { type: String, default: "" },
  email: { type: String, default: "" },
  mobile_no: { type: String, required: true },
  otp: { type: String, default: "" },
  otpExpiry: { type: Date },
  country_code: { type: String, },
  refer_code: { type: String, default: "" },
  join_code: { type: String, default: "" },
  no_of_participate: { type: String },
  no_of_loose: { type: String },
  no_of_total_win: { type: String },
  no_of_2win: { type: String },
  no_of_4win: { type: String },
  device_type: { type: String },
  device_token: { type: String, default: "" },
  profile_image: { type: String },
  banned: { type: Boolean, default: false },
  first_offer: { type: Number },
  isVerify: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
