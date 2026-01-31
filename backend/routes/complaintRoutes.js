const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  getComplaintById,
  updateComplaintStatus,
  getOfficerComplaints,
  addInvestigationNote,
  findSimilarCases
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyComplaints)
  .post(protect, createComplaint);

router.get('/all', protect, getAllComplaints);
router.post('/similar', protect, findSimilarCases); // New Route
router.get('/officer/my', protect, getOfficerComplaints);
router.post('/:id/notes', protect, addInvestigationNote);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaintStatus);

module.exports = router;
