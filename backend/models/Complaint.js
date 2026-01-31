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
  
  // AI-Assisted Classification
  crimeType: { type: String, default: "Unclassified" }, 
  lethality: { type: String, default: "Unknown" },
  crimeConfidence: { type: Number, default: 0 },
  lethalityConfidence: { type: Number, default: 0 },

  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  investigationUpdates: [{
    note: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    officerName: { type: String } 
  }]
}, {
  timestamps: true
});

// Add Text Index for Search
complaintSchema.index({ description: 'text', title: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
