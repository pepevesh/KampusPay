const express = require('express');
const router = express.Router();
const { createUser,sendOtp, verifyOtp } = require('../controller/userController');

router.post('/createUser', createUser);
router.post('/userotp', sendOtp);
router.post('/verifyuserotp', verifyOtp);

module.exports = router;