const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalOrders: Number,
  totalRevenue: Number,
  itemsSold: Number,
  popularSizes: {
    XS: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 },
  },
  popularColors: Map,
  popularFabrics: {
    cotton: { type: Number, default: 0 },
    polyester: { type: Number, default: 0 },
    'cotton-blend': { type: Number, default: 0 },
  },
  popularFits: {
    oversized: { type: Number, default: 0 },
    slim: { type: Number, default: 0 },
    regular: { type: Number, default: 0 },
  },
  newCustomers: Number,
  returningCustomers: Number,
  averageOrderValue: Number,
});

module.exports = mongoose.model('Analytics', analyticsSchema);
