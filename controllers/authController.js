const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
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
  const userExists = await User.findOne({ email });
  const citizenExists = await Citizen.findOne({ email });

  if (userExists || citizenExists) {
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
      // Create Official (User)
      if (role === 'police' && !badgeId) {
          return res.status(400).json({ message: 'Badge ID required for police' });
      }
      user = await User.create({
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
  const { email, password } = req.body;

  // Try finding in User (Official) first
  let user = await User.findOne({ email });
  
  // If not found, try Citizen
  if (!user) {
      user = await Citizen.findOne({ email });
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
