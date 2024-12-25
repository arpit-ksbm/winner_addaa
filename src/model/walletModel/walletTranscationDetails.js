const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletTransactionDetailSchema = new Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WalletDetail',
      required: true,
    },
    amount: {
      type: Number,
      default: 0.00,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    trans_date: {
      type: Date,
      default: null,
    },
    final_wallet_balance: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    use_of: {
      type: String,
      default: '0',
    },
    use_of_id: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: 'Win Play Card',
      required: true,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    wallet_type: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAIL'],
      default: null,
    },
    game_type: {
      type: Number,
      default: 1, // 1 = "ludo", 2 = "wheel"
      required: true,
    },
    game_id: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Automatically handle created_at and updated_at
  }
);

module.exports = mongoose.model('WalletTransactionDetail', WalletTransactionDetailSchema);
