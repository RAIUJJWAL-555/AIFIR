const Complaint = require('../models/Complaint');

// Get Analytics Data
exports.getAnalytics = async (req, res) => {
  try {
    // 1. Area-wise Crime Count
    const areaStats = await Complaint.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Crime Type Distribution
    const crimeTypeStats = await Complaint.aggregate([
      { $group: { _id: "$crimeType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 3. Lethality Distribution
    const lethalityStats = await Complaint.aggregate([
      { $group: { _id: "$lethality", count: { $sum: 1 } } }
    ]);

    // 4. Monthly Trends (Last 12 Months)
    const monthlyStats = await Complaint.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      areaStats,
      crimeTypeStats,
      lethalityStats,
      monthlyStats
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
