const mongoose = require('mongoose');

// Define the schema for the Teen Patti game
const teenPattiGameSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
    },
    pot_limit: {
      type: Number,
      required: true,
    },
    boot: {
      type: Number,
      required: true,
    },
    min_entry: {
      type: Number,
      required: true,
    },
    min_real_player: {
      type: Number,
      required: true,
    },
    commission: {
      type: String,
      enum: ['Y', 'N'],
      default: 'N',
    },
    commission_amount: {
      type: Number,
      default: null,
    },
    win_preference: {
      type: String,
      enum: ['BOT', 'REAL'],
      default: 'REAL',
      required: true,
    },
    game_order: {
      type: Number,
      required: true,
    },
    active_users: {
      type: Number,
      default: 0,  // Default to 0 as per the SQL table
    },
    created_at: {
      type: Date,
      default: Date.now,  // Automatically set the current date if not provided
    },
    updated_at: {
      type: Date,
      default: Date.now,  // Automatically set the current date if not provided
    },
  }
);

// Create a model from the schema
const TeenPattiGame = mongoose.model('TeenPattiGame', teenPattiGameSchema);

module.exports = TeenPattiGame;
