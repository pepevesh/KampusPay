const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, sendNotification } = require('../controller/notifController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/subscribe', authMiddleware(), subscribe);
router.post('/unsubscribe', authMiddleware(), unsubscribe);
router.post('/sendNotification', authMiddleware(), sendNotification);

module.exports = router;