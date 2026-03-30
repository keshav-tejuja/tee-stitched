const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  description: String,
  fabrics: {
    type: [String],
    default: ['cotton', 'polyester', 'cotton-blend'],
  },
  colors: {
    type: [String],
    default: ['black', 'white', 'red', 'blue', 'green', 'yellow', 'gray'],
  },
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  fits: {
    type: [String],
    default: ['oversized', 'slim', 'regular'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
