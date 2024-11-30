const Coupon = require('../model/Coupon');

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};