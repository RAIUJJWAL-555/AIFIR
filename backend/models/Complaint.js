const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel' // Dynamic reference
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Admin', 'Citizen'],
    default: 'Citizen'
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  incidentType: {
    type: String,
    required: true,
    enum: ['Theft', 'Cyber Crime', 'Harassment', 'Physical Assault', 'Lost Property', 'Fraud', 'Traffic Violation', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    required: true
  },
  incidentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'FIR Registered', 'Rejected', 'Solved by Officer', 'Resolved'],
    default: 'Pending'
  },
  evidence: {
    type: String,
    required: false
  },
  aiDraft: {
    type: String,
    required: false
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
