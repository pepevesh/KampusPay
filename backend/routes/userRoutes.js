const express = require('express');
const router = express.Router();
const { createUser,sendOtp, verifyOtp, updatePassword, updatePin, getUserTransactions, getUserWithoutTransactions, getDailySpending, updateLimit } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createUser', createUser);
router.post('/userotp', sendOtp);
router.post('/verifyuserotp', verifyOtp);
router.post('/getUserTransactions',authMiddleware(["Student"]), getUserTransactions);
router.post('/getUserWithoutTransactions', getUserWithoutTransactions);
router.post('/updateLimit', updateLimit);
router.post('/update-password', updatePassword);
router.post('/update-pin', updatePin);
router.get('/:userId/daily-spending', getDailySpending);

module.exports = router;