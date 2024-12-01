const mongoose = require('mongoose');
const User = require('../model/User');
const Transaction = require('../model/Transaction')
const {comparePassword,hashPassword} = require('../utils/passwordUtils');
const crypto = require('crypto');
const { redisClient} = require('../config/redisdatabase');
const {sendOTPEmail}= require('../services/OTPservice');
const { promisify } = require('util');
// const { Transaction } = require('mongodb');
require('dotenv').config();
const { encrypt } = require('../utils/encryptionUtils');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = crypto.randomInt(100000, 999999).toString();

        await redisClient.set(email, otp,{EX:10*60});  

        sendOTPEmail({
            email,
            OTP: otp
        });

        res.status(200).json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const redotp = await redisClient.get(email);
        if (redotp === String(otp)) {
            redisClient.del(email);
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying otp" });
    }
};

exports.createUser = async (req, res) => {
    try {
        let { userId, name, email, password,  pin } = req.body;  // Use 'let' instead of 'const'

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const dailyLimit = 100; 
        const transactions = [];
        const usedCoupons = [];
        const balance=0;
        const role="Student";
        const qrcode =encrypt(userId); 
        // Hash the password and pin before saving
        password = await hashPassword(password);
        pin = await hashPassword(pin);

        const newUser = new User({
            userId, name, role, email, password, balance, pin, dailyLimit, transactions, usedCoupons, qrcode
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error)
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { userId } = req.user;  // Extract userId from token/session
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        // Find the user
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordCheck = await comparePassword(currentPassword, user.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash and update the new password
        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.updatePin = async (req, res) => {
    try {
        const { userId } = req.user;  // Extract userId from token/session
        const { currentPin, newPin } = req.body;

        // Validate input
        if (!currentPin || !newPin) {
            return res.status(400).json({ message: 'Current and new PIN are required' });
        }

        // Find the user
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current PIN is correct
        const isPinValid = comparePassword(currentPin.toString(), user.pin);
        if (!isPinValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash and update the new PIN
        user.pin = await hashPassword(newPin.toString()); 
        await user.save();

        res.status(200).json({ message: 'PIN updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user and populate the transactions along with sender and receiver details
        const user = await User.findOne({ userId }).populate({
            path: 'transactions',
            populate: [
                { path: 'sender', select: 'userId name' },
                { path: 'receiver', select: 'userId name' },
            ],
        });

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        // Get the last 20 transactions
        const last20Transactions = user.transactions.slice(-20);

        res.status(200).send({ transactions: last20Transactions });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getUserWithoutTransactions = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findOne({ userId }, '-transactions');

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getUserBalance = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findOne({ userId }, '-transactions');

        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.status(200).send({balance: user.balance});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getDailySpending = async (req, res) => {
  const { userId } = req.params;
  console.log('User ID:', userId);

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Start of today in IST
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day in IST (local time)
    const offset = today.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
    const todayInUTC = new Date(today.getTime() - offset); // Convert to UTC

    // Start of tomorrow in UTC
    const tomorrow = new Date(todayInUTC);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = await Transaction.aggregate([
      {
        $match: {
          sender: new mongoose.Types.ObjectId(userId),
          category: { $ne: "Wallet Top-up" }, // Exclude wallet top-ups
          time: { $gte: todayInUTC, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" }
        }
      }
    ]);

    console.log('Aggregation result:', result);

    const totalSpent = result.length > 0 ? result[0].totalSpent : 0;
    res.status(200).json({ totalSpent });

  } catch (error) {
    console.error('Error fetching daily spending:', error);
    res.status(500).json({ message: 'Error fetching daily spending', error: error.message || error });
  }
};

exports.getWeeklySpending = async (req, res) => {
    const { userId } = req.params;
    console.log('User ID:', userId);

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const offset = today.getTimezoneOffset() * 60000;
        const startDateInUTC = new Date(startDate.getTime() - offset);
        const endDateInUTC = new Date(today.getTime() - offset);

        const result = await Transaction.aggregate([
            {
                $match: {
                    sender: new mongoose.Types.ObjectId(userId),
                    category: { $ne: "Wallet Top-up" },
                    time: { $gte: startDateInUTC, $lt: endDateInUTC }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
                    totalSpent: { $sum: "$amount" }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date
            }
        ]);

        const spendingByDay = Array(7).fill(0);
        const startOfWeek = new Date(startDateInUTC);

        result.forEach(({ _id, totalSpent }) => {
            const dayIndex = Math.round(
                (new Date(_id).getTime() - startOfWeek.getTime()) / (24 * 60 * 60 * 1000)
            );
            spendingByDay[dayIndex] = totalSpent;
        });

        res.status(200).json({ spendingByDay });
    } catch (error) {
        console.error('Error fetching weekly spending:', error);
        res.status(500).json({ message: 'Error fetching weekly spending', error: error.message || error });
    }
};

  
  

exports.updateLimit = async (req, res) => {
    try {
        const { userId, newLimit } = req.body;

        // Find the user
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.dailyLimit = newLimit; 
        await user.save();

        res.status(200).json({ message: 'Limit updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
