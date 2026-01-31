const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const citizenSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  dob: {
    type: Date,
    required: [true, 'Please add Date of Birth']
  },
  identityStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  identityRemark: {
    type: String,
    default: ''
  },
  ocrResult: {
    hasAadhaarWord: Boolean,
    has12DigitNumber: Boolean,
    hasDOB: Boolean,
    rawText: String
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  address: {
    type: String,
    required: false
  },
  aadharNumber: {
    type: String,
    required: [true, 'Please add Aadhar Number'],
    unique: true
  },
  aadharCardPath: {
    type: String,
    required: false // Optional for now to avoid breaking existing users/admins
  },
  role: {
    type: String,
    default: 'citizen'
  }
}, {
  timestamps: true
});

citizenSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

citizenSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Citizen', citizenSchema);
