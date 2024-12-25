const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BonusWalletDetailSchema = new Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming `player_id` references another collection (e.g., Player)
      ref: 'Player', // Replace 'Player' with the actual model name of the Player collection
      required: true,
    },
    bonus_wallet_ref_number: {
      type: String,
      required: true,
    },
    total_amt_added: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total_amt_used: {
      type: Number,
      required: true,
      default: 0.0,
    },
    current_amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    last_used_date: {
      type: Date,
      default: null,
    },
    last_added_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Automatically handle created_at and updated_at
  }
);

module.exports = mongoose.model('BonusWalletDetail', BonusWalletDetailSchema);
