const express = require('express');
const router = express.Router();
const { analyzeComplaintParams } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/classify', protect, analyzeComplaintParams);

module.exports = router;
