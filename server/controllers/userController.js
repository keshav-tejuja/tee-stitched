const { db } = require('../database');

// Get user profile
const getUserProfile = (req, res) => {
  try {
    const user = db.users.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = (req, res) => {
  try {
    const { name, email } = req.body;
    const user = db.users.updateById(req.userId, { name, email });

    const { password, ...userWithoutPassword } = user;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin)
const getAllUsers = (req, res) => {
  try {
    const users = db.users.findAll().map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user loyalty points
const getUserLoyaltyPoints = (req, res) => {
  try {
    const user = db.users.findById(req.userId);
    res.json({
      loyaltyPoints: user.loyaltyPoints || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserLoyaltyPoints,
};
