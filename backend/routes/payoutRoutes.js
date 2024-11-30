const express = require('express');
const router = express.Router();
const { makePayout } = require('../controller/payoutController');

router.post('/makePayout', makePayout);

module.exports = router;
