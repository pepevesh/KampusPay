const express = require('express');
const router = express.Router();
const { getCategoryWiseTransactions } = require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId/categories', authMiddleware(["Student"]) ,getCategoryWiseTransactions);

module.exports = router;
