const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');

// @desc    Get all complaints (Police/Admin view)
// @route   GET /api/complaints/all
// @access  Private (Police/Admin)
const getAllComplaints = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized. Only Admins can view all complaints.');
  }
  const complaints = await Complaint.find()
    .populate('user', 'name email phone')
    .populate('assignedOfficer', 'name badgeId')
    .sort({ createdAt: -1 });
  res.status(200).json(complaints);
});

// @desc    Get user complaints
// @route   GET /api/complaints
// @access  Private
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user.id })
    .populate('assignedOfficer', 'name badgeId')
    .sort({ createdAt: -1 });
  res.status(200).json(complaints);
});

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, incidentType, location, incidentDate, incidentTime, aiDraft, evidence } = req.body;

  if (!title || !description || !incidentType || !location || !incidentDate || !incidentTime) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const complaint = await Complaint.create({
    user: req.user.id,
    onModel: req.user.role === 'citizen' ? 'Citizen' : 'Admin',
    title,
    description,
    incidentType,
    location,
    incidentDate,
    incidentTime,
    aiDraft, // Optional, can be added if generated
    evidence
  });

  res.status(201).json(complaint);
});

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('user', 'name email')
    .populate('assignedOfficer', 'name badgeId');

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Make sure user owns the complaint or is an official
  if (req.user.id !== complaint.user._id.toString() && req.user.role === 'citizen') {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.status(200).json(complaint);
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (Police only)
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  if (req.user.role === 'citizen') {
    res.status(401);
    throw new Error('Not authorized to update status');
  }

  const updatedComplaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedComplaint);
});

// @desc    Get Officer Complaints
// @route   GET /api/complaints/officer/my
// @access  Private (Police only)
const getOfficerComplaints = asyncHandler(async (req, res) => {
  // Check if role is police
  if (req.user.role !== 'police') {
     res.status(401);
     throw new Error('Not authorized as an officer');
  }

  const complaints = await Complaint.find({ assignedOfficer: req.user.id })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
    
  res.status(200).json(complaints);
});

module.exports = {
  getAllComplaints,
  getMyComplaints,
  createComplaint,
  getComplaintById,
  updateComplaintStatus,
  getOfficerComplaints,
};
