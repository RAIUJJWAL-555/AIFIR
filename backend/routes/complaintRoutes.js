const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  getComplaintById,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyComplaints)
  .post(protect, createComplaint);

router.get('/all', protect, getAllComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaintStatus);

module.exports = router;
