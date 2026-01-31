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

  console.log('Login Attempt:', { email, badgeId, hasPassword: !!password });

  let user;

  if (badgeId) {
    // Login with Badge ID (Police) - Only check Admin collection
    user = await Admin.findOne({ badgeId });
    console.log('Searching by BadgeID:', badgeId, 'Found:', user ? user.role : 'No user');
  } else if (email) {
    // Login with Email - Check Admin first, then Citizen
    user = await Admin.findOne({ email });
    console.log('Searching Admin by Email:', email, 'Found:', user ? user.role : 'No user');
    
    if (!user) {
        user = await Citizen.findOne({ email });
        console.log('Searching Citizen by Email:', email, 'Found:', user ? user.role : 'No user');
    }
  }

  if (!user) {
      console.log('Login failed: User not found');
      return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await user.matchPassword(password);
  console.log('Password Match Result:', isMatch);

  if (user && isMatch) {
    console.log('Login Successful for:', user.email);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      badgeId: user.badgeId,
      token: generateToken(user.id),
    });
  } else {
    console.log('Login failed: Invalid password');
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
