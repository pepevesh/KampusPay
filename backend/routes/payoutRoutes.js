const express = require('express');
const router = express.Router();
const { makePayout } = require('../controller/payoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/makePayout', authMiddleware(), makePayout);

module.exports = router;
