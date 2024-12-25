const mongoose = require('mongoose');

const tournamentRegistrationSchema = new mongoose.Schema({
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
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
  },
  bonus_money: {
    type: Number,
    default: null,
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

module.exports = mongoose.model('TournamentRegistration', tournamentRegistrationSchema);
