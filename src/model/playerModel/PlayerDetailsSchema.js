const mongoose = require('mongoose');

const PlayerDetailsSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//     auto: true,
//   },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  refer_code: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  join_code: {
    type: String,
    default: null,
  },
  no_of_participate: {
    type: String,
    default: null,
  },
  no_of_loose: {
    type: String,
    default: null,
  },
  no_of_total_win: {
    type: String,
    default: null,
  },
  no_of_2win: {
    type: String,
    default: null,
  },
  no_of_4win: {
    type: String,
    default: null,
  },
  device_type: {
    type: String,
    default: null,
  },
  device_token: {
    type: String,
    default: null,
  },
  profile_image: {
    type: String,
    default: '',
  },
  banned: {
    type: Boolean,
    default: false, // 0 = No, 1 = Yes
  },
  first_offer: {
    type: Number,
    default: 0,
  },
  bonus_updated_at: {
    type: String
  },
  spin_updated_at: {
    type: String
  },
  point_updated_at: {
    type: String
  },
  current_month_point: {
    type: String,
    // required: true,
    default: 0.0,
  },
  last_month_point: {
    type: String,
    // required: true,
    default: 0.0,
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

module.exports = mongoose.model('PlayerDetails', PlayerDetailsSchema);
