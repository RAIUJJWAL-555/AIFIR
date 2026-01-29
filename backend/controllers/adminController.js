const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

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

module.exports = {
  getDashboardStats,
};
