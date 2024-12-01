const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, sendNotification } = require('../controller/notifController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/subscribe', authMiddleware(["Student"]), subscribe);
router.post('/unsubscribe', authMiddleware(["Student"]), unsubscribe);
router.post('/sendNotification', authMiddleware(["Student"]), sendNotification);

module.exports = router;