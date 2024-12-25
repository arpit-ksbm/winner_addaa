const mongoose = require("mongoose");

const PromoWalletDetailSchema = new mongoose.Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    bonus_wallet_ref_number: {
      type: String,
      required: true,
      maxlength: 200,
    },
    total_amt_added: {
      type: Number,
      required: true,
      min: 0,
    },
    total_amt_used: {
      type: Number,
      required: true,
      min: 0,
    },
    current_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    last_used_date: {
      type: Date,
      required: true,
    },
    last_added_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("PromoWalletDetail", PromoWalletDetailSchema);
