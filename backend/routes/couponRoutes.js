const express = require('express');
const router = express.Router();
const { createCoupon } = require('../controller/couponController');

router.post('/createCoupon', createCoupon);

module.exports = router;
