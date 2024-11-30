const express = require('express');
const router = express.Router();
const { createUser,sendOtp, verifyOtp, updatePassword, updatePin, getUserTransactions, getUserWithoutTransactions } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createUser', createUser);
router.post('/userotp', sendOtp);
router.post('/verifyuserotp', verifyOtp);
router.post('/getUserTransactions', getUserTransactions);
router.post('/getUserWithoutTransactions', getUserWithoutTransactions);
router.post('/update-password', authMiddleware(), updatePassword);
router.post('/update-pin', authMiddleware(), updatePin);

module.exports = router;