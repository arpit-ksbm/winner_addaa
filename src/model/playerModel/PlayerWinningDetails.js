const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerWinningDetailSchema = new Schema({
  game_type: {
    type: String,
    enum: ['1', '2'],
    default: '1',
  },
  game_id: {
    type: String,
    default: null,
  },
  player_id: {
    type: String,
    required: true, // Player ID is required
  },
  bet_amount: {
    type: String,
    // required: true,
  },
  winning_amount: {
    type: Number,
    // required: true,
  },
  winning_time: {
    type: String, // Can also use Date if needed
    default: null,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const PlayerWinningDetail = mongoose.model('PlayerWinningDetail', playerWinningDetailSchema);

module.exports = PlayerWinningDetail;
