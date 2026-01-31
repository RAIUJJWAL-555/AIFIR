const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllOfficers, registerOfficer, verifyIdentity, getPendingVerifications } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.route('/officers')
    .get(protect, getAllOfficers)
    .post(protect, registerOfficer);

router.get('/pending-identities', protect, getPendingVerifications);
router.patch('/verify-identity/:userId', protect, verifyIdentity);

module.exports = router;
