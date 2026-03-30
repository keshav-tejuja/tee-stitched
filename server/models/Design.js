const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fabric: {
    type: String,
    enum: ['cotton', 'polyester', 'cotton-blend'],
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    required: true,
  },
  fit: {
    type: String,
    enum: ['oversized', 'slim', 'regular'],
    required: true,
  },
  designData: {
    type: Object,
    required: true, // Store frontend preview data
  },
  isSaved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Design', designSchema);
