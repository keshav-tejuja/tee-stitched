const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getDemandAnalytics,
  getCustomerInsights,
} = require('../controllers/analyticsController');

router.get('/demand', authMiddleware, adminMiddleware, getDemandAnalytics);
router.get('/customers', authMiddleware, adminMiddleware, getCustomerInsights);

module.exports = router;
