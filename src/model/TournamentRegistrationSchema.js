const mongoose = require('mongoose');

const TournamentRegistrationSchema = new mongoose.Schema({
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Tournament collection
    // required: true,
    ref: 'Tournament', // Assuming you have a Tournament model to reference
  },
  player_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Player collection
    // required: true,
    ref: 'PlayerDetails', // Assuming you have a PlayerDetails model to reference
  },
  register_date: {
    type: Date,
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  players: {
    type: Number,
    default: null,
  },
  play_money: {
    type: Number,
    default: null,
    get: v => parseFloat(v.toFixed(2)), // Ensures 2 decimal places for monetary values
  },
  bonus_money: {
    type: Number,
    default: null,
    get: v => parseFloat(v.toFixed(2)), // Ensures 2 decimal places for monetary values
  },
  room_no: {
    type: Number,
    default: null,
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

// Create a model based on the schema
const TournamentRegistration = mongoose.model('TournamentRegistration', TournamentRegistrationSchema);

module.exports = TournamentRegistration;
