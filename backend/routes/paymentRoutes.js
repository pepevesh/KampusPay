const express = require('express');
const router = express.Router();
const { makePayment, webhook } = require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/makePayment', authMiddleware(), makePayment);
router.post('/makePaymentsuccess', authMiddleware(), webhook);

module.exports = router;
