const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  getComplaintById,
  updateComplaintStatus,
  getOfficerComplaints,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyComplaints)
  .post(protect, createComplaint);

router.get('/all', protect, getAllComplaints);
router.get('/officer/my', protect, getOfficerComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaintStatus);

module.exports = router;
