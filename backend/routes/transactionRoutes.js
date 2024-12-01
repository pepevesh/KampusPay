const express = require('express');
const router = express.Router();
const { createTransaction } = require('../controller/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createTransaction',createTransaction);

module.exports = router;
