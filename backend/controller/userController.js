const User = require('../model/User');
const {hashPassword} = require('../utils/passwordUtils');

exports.createUser = async (req, res) => {
    try {
        const { userId, name, role, email, password, balance, pin, dailyLimit, availability, transactions, usedCoupons, notification } = req.body;
        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password, pin before saving
        password = await hashPassword(password);
        pin = await hashPassword(pin);
        const newUser = new User({
            userId, name, role, email, password, balance, pin, dailyLimit, availability, transactions, usedCoupons, notification
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
