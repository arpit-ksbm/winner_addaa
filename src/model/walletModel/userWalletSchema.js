const mongoose = require('mongoose');

const userWalletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
    },
    screenshot: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      required: true,
      default: 0, // 0 = pending, 1 = accept, 2 = decline
      enum: [0, 1, 2],
    },
    txn_id: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      default: null,
    },
    country: {
      type: String,
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Automatically manage created_at and updated_at
  }
);

const UserWallet = mongoose.model('UserWallet', userWalletSchema);

module.exports = UserWallet;
