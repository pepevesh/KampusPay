const express = require('express');
const router = express.Router();
const { makePayment, webhook } = require('../controller/paymentController');

router.post('/makePayment', makePayment);
router.post('/makePaymentsuccess',webhook);

module.exports = router;
