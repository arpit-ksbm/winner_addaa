const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  level: {
    type: String,
    // required: true,
    maxlength: 200,
  },
  tournament_name: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  bet_amount: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  no_players: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  min_player: {
    type: Number,
    // required: true,
  },
  no_of_winners: {
    type: String,
    // required: true,
    maxlength: 255,
  },
  commission: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N',
    required: true,
  },
  commission_amount: {
    type: Number,
    // required: true,
  },
  win_preference: {
    type: String,
    enum: ['BOT', 'REAL'],
    default: 'REAL',
    // required: true,
  },
  two_player_winning: {
    type: String,
    default: null,
  },
  three_player_winning_1: {
    type: String,
    default: null,
  },
  three_player_winning_2: {
    type: String,
    default: null,
  },
  four_player_winning_1: {
    type: String,
    default: null,
  },
  four_player_winning_2: {
    type: String,
    default: null,
  },
  four_player_winning_3: {
    type: String,
    default: null,
  },
  start_time: {
    type: String,  // We can store time as string format in Mongoose
    default: null,
  },
  end_time: {
    type: String,  // We can store time as string format in Mongoose
    default: null,
  },
  tournament_interval: {
    type: String,
    default: null,
  },
  status: {
    type: Number,
    enum: [1, 2, 3, 4],  // 1 - yet_to_start, 2 - started, 3 - completed, 4 - cancelled
    default: 1,
    // required: true,
  },
  bot: {
    type: Number,
    default: 1,
    // required: true,
  },
  order: {
    type: Number,
    // required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Tournament model
module.exports = mongoose.model('Tournament', TournamentSchema);
