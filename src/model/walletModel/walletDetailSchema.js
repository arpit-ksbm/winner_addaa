const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletDetailSchema = new Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming `player_id` references another collection (e.g., Player)
      ref: 'Player', // Replace 'Player' with the actual model name of the Player collection
      required: true,
    },
    wallet_ref_number: {
      type: String,
      required: true,
    },
    total_amt_load: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total_amt_withdraw: {
      type: Number,
      required: true,
      default: 0.0,
    },
    current_amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    no_of_load: {
      type: String,
      default: null,
    },
    no_of_withdraw: {
      type: String,
      default: null,
    },
    last_withdraw_date: {
      type: Date,
      default: null,
    },
    last_load_date: {
      type: Date,
      default: null,
    },
    game_type: {
      type: Number,
      enum: [1, 2], // 1="ludo", 2="wheel"
      required: true,
      default: 1,
    },
    is_first_recharge: {
      type: String,
      enum: ['YES', 'NO'],
      required: true,
      default: 'YES',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Automatically handle timestamps
  }
);

module.exports = mongoose.model('WalletDetail', WalletDetailSchema);
