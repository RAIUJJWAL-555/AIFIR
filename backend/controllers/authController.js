const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Citizen = require('../models/Citizen');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, phone, role, badgeId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check existence in both collections
  const adminExists = await Admin.findOne({ email });
  const citizenExists = await Citizen.findOne({ email });

  if (adminExists || citizenExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  let user;

  if (role === 'citizen') {
      // Create Citizen
      user = await Citizen.create({
          name,
          email,
          password,
          phone
      });
  } else {
      // Create Official (Admin)
      if (role === 'police' && !badgeId) {
          return res.status(400).json({ message: 'Badge ID required for police' });
      }
      user = await Admin.create({
          name,
          email,
          password,
          phone,
          role: role || 'police',
          badgeId
      });
  }

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, badgeId, password } = req.body;

  let user;

  if (badgeId) {
    // Login with Badge ID (Police)
    user = await Admin.findOne({ badgeId });
  } else if (email) {
    // Login with Email (Admin or Citizen)
    user = await Admin.findOne({ email }) || await Citizen.findOne({ email });
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      badgeId: user.badgeId,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
