const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    }
});

const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = CouponModel;

// Title
// Description
// Discount Value
// Coupon ID
