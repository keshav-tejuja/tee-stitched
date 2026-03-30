const { db } = require('../database');

// Get demand analytics
const getDemandAnalytics = (req, res) => {
  try {
    const aggregated = db.analytics.getDemandAnalytics();

    if (!aggregated.totalOrders) {
      return res.json({
        message: 'No analytics data available',
        ...aggregated,
      });
    }

    res.json(aggregated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer insights
const getCustomerInsights = (req, res) => {
  try {
    const insights = db.analytics.getCustomerInsights();
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDemandAnalytics,
  getCustomerInsights,
};
