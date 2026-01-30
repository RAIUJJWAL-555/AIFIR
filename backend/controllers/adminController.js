const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const Admin = require('../models/Admin');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin/Police)
const getDashboardStats = asyncHandler(async (req, res) => {
  // Check if user is authorized (Police or Admin)
  if (req.user.role === 'citizen') {
    res.status(403);
    throw new Error('Not authorized to view admin stats');
  }

  // 1. Complaint status counts
  const totalComplaints = await Complaint.countDocuments();
  const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
  const firRegistered = await Complaint.countDocuments({ status: 'FIR Registered' });
  const resolvedCases = await Complaint.countDocuments({ status: 'Resolved' });
  const rejectedCases = await Complaint.countDocuments({ status: 'Rejected' });

  // 2. Incident Type Distribution (for charts)
  const complaintsByType = await Complaint.aggregate([
    {
      $group: {
        _id: '$incidentType',
        count: { $sum: 1 }
      }
    }
  ]);

  // 3. Recent Activity (Latest 5)
  const recentComplaints = await Complaint.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  // 4. Officer Performance (Optional: Count cases assigned vs resolved)
  // This is a basic implementation
  
  res.status(200).json({
    overview: {
      total: totalComplaints,
      pending: pendingComplaints,
      firRegistered: firRegistered,
      resolved: resolvedCases,
      rejected: rejectedCases
    },
    byType: complaintsByType,
    recentActivity: recentComplaints
  });
});

// @desc    Get All Officers
// @route   GET /api/admin/officers
// @access  Private (Admin/Police)
const getAllOfficers = asyncHandler(async (req, res) => {
  if (req.user.role === 'citizen') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const officers = await Admin.find({ role: 'police' }).select('-password');
  res.status(200).json(officers);
});

// @desc    Register a new Police Officer
// @route   POST /api/admin/officers
// @access  Private (Admin only)
const registerOfficer = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized. Only Admins can register officers.');
  }

  const { name, email, password, phone, badgeId } = req.body;

  if (!name || !email || !password || !badgeId) {
    res.status(400);
    throw new Error('Please include name, email, password, and badge ID');
  }

  const officerExists = await Admin.findOne({ 
    $or: [
      { email },
      { badgeId }
    ] 
  });

  if (officerExists) {
    res.status(400);
    throw new Error('Officer with this email or badge ID already exists');
  }

  const officer = await Admin.create({
    name,
    email,
    password,
    phone,
    badgeId,
    role: 'police'
  });

  if (officer) {
    res.status(201).json({
      _id: officer._id,
      name: officer.name,
      email: officer.email,
      badgeId: officer.badgeId,
      role: officer.role
    });
  } else {
    res.status(400);
    throw new Error('Invalid officer data');
  }
});

module.exports = {
  getDashboardStats,
  getAllOfficers,
  registerOfficer
};
