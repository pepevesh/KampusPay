const mongoose = require('mongoose');
const User = require('../model/User');
const Transaction = require('../model/Transaction');
const Coupon = require('../model/Coupon');
const bcrypt = require('bcrypt');
const {comparePassword,hashPassword} = require('../utils/passwordUtils');

exports.createTransaction = async (req, res) => {
    const { senderId, receiverId, amount, category, couponId, pin } = req.body;

    const user = await User.findOne({userId: senderId});
    const isPinValid = await bcrypt.compare(pin.toString(), user.pin);
    if (!isPinValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    sendAmount = amount;

    try {
        if(couponId){
            const isCouponUsed = user.usedCoupons.includes(couponId);

            if(isCouponUsed){
                return res.status(200).json({ success: true, message: 'Coupon already used.' });
            }

            const coupon = await Coupon.findOne({ couponId: couponId});

            if (!coupon) {
                return res.status(404).json({ success: false, message: 'Coupon not found in the database.' });
            }

            const discount = coupon.discountValue;

            sendAmount -= discount;
        }
        const sender = await User.findOne({ userId: senderId }).session(session);
        const receiver = await User.findOne({ userId: receiverId }).session(session);

        if (!sender || !receiver) {
            throw new Error('Sender or Receiver not found.');
        }

        if (sender.balance < sendAmount) {
            throw new Error('Insufficient balance.');
        }

        sender.balance -= sendAmount;
        receiver.balance += amount;

        await sender.save({ session });
        await receiver.save({ session });

        const transaction = new Transaction({
            sender,
            receiver,
            amount,
            category
        });

        const savedTransaction = await transaction.save({ session });

        // Update the Transactions array for both sender and receiver
        sender.transactions.push(savedTransaction);
        receiver.transactions.push(savedTransaction);

        if(couponId){
            sender.usedCoupons.push(couponId);
        }

        await sender.save({ session });
        await receiver.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ message: 'Transaction successful.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        res.status(500).send({ error: error.message });
    }
};