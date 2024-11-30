const express=require('express');
const authcontroller = require('../controller/authController');
const router =express.Router();

router.post('/login',authcontroller.login);
router.post('/logout',authcontroller.logout);
router.post('/token', authcontroller.refreshAccessToken);
router.get('/validate',authcontroller.validateToken);
router.post('/update', authcontroller.updateUser);
module.exports = router;