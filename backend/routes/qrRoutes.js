const express = require('express');
const router = express.Router();
const { decryptqr} = require('../controller/qrcodeController');

// router.post('/encrypt',encryptqr);
router.post('/decrypt',decryptqr);

module.exports = router;
