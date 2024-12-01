const express = require('express');
const router = express.Router();
const { createUser,sendOtp, verifyOtp, updatePassword, updatePin, getUserTransactions, getUserWithoutTransactions, getDailySpending } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createUser', createUser);
router.post('/userotp', sendOtp);
router.post('/verifyuserotp', verifyOtp);
router.post('/getUserTransactions', authMiddleware(), getUserTransactions);
router.post('/getUserWithoutTransactions', authMiddleware(), getUserWithoutTransactions);
router.post('/update-password', authMiddleware(), updatePassword);
router.post('/update-pin', authMiddleware(), updatePin);
router.get('/:userId/daily-spending', authMiddleware(), getDailySpending);

module.exports = router;