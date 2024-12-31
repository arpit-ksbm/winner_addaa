const mongoose = require('mongoose');

const PlayerCouponSchema = new mongoose.Schema(
  {
    player_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Player model
      ref: 'PlayerDetails',
      required: true,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the CouponDetails model
      ref: 'CouponDetails',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Automatically handle timestamps
  }
);

module.exports = mongoose.model('PlayerCoupon', PlayerCouponSchema);
