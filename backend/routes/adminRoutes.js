const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllOfficers, registerOfficer } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.route('/officers')
    .get(protect, getAllOfficers)
    .post(protect, registerOfficer);

module.exports = router;
