const mongoose = require('mongoose');

const CouponDetailsSchema = new mongoose.Schema({
    coupon_name: { type: String, default: '1' },
    coupon_type: { type: String, default: null },
    min: { type: Number, required: true },
    max: { type: Number, default: 5000 },
    single_use: { type: Boolean, default: true }, // true = 1, false = 0
    balance_type: { type: String, default: null },
    expire_on: { type: Date, default: null },
    coupon_description: { type: String, required: true },
    coupon_amount: { type: Number, required: true },
    status: { type: Boolean, default: true }, // true = Active, false = Disable
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model('CouponDetails', CouponDetailsSchema);
