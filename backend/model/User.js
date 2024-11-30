const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: "Student",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    pin: {
        type: String,
        required: true,
    },
    dailyLimit: {
        type: Number,
    },
    availability: {
        type: Boolean,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    usedCoupons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
        }
    ],
    notification: {
        type: String,
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

// ID(Roll no)
// Name
// Email
// Password
// Pin
// Transactions - 
// Balance
// Daily Limit
// Availability
// Used Coupons - 
// Role
// Notifications