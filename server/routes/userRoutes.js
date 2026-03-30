const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserLoyaltyPoints,
} = require('../controllers/userController');

router.get('/profile', authMiddleware, getUserProfile);
router.patch('/profile', authMiddleware, updateUserProfile);
router.get('/loyalty-points', authMiddleware, getUserLoyaltyPoints);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
