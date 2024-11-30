const User = require('../model/User');
const {hashPassword} = require('../utils/passwordUtils');
const crypto = require('crypto');
const { redisClient} = require('../config/redisdatabase');
const {sendOTPEmail}= require('../services/OTPservice');

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = crypto.randomInt(100000, 999999).toString();

        await redisClient.setEx(email, 600, otp);  

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
        redisClient.get(email, async (err, storedOtp) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error retrieving OTP" });
            }

            if (!storedOtp) {
                return res.status(400).json({ success: false, message: "OTP has expired or does not exist" });
            }

            if (storedOtp === otp) {
                redisClient.del(email);

                res.status(200).json({ success: true, message: "OTP verified successfully" });
            } else {
                res.status(400).json({ success: false, message: "Invalid OTP" });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { userId, name, role, email, password, balance, pin, } = req.body;

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const dailyLimit=100; 
        const transactions =[];
        const usedCoupons=[];
        // Hash the password, pin before saving
        password = await hashPassword(password);
        pin = await hashPassword(pin);
        const newUser = new User({
            userId, name, role, email, password, balance, pin, dailyLimit, transactions, usedCoupons
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
