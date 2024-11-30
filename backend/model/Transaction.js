const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;

// From
// To
// Amount
// Timestamp
// Description
// Category