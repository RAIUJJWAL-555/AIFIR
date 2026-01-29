const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Citizen = require('../models/Citizen');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check User (Official) collection first
      let user = await User.findById(decoded.id).select('-password');
      
      // If not found, check Citizen collection
      if (!user) {
        user = await Citizen.findById(decoded.id).select('-password');
      }

      if (!user) {
          throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
