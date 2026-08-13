const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    enum: [
      'ROADS',
      'SANITATION',
      'ELECTRICITY',
      'WATER',
      'PUBLIC_PROPERTY',
      'DRAINAGE',
      'OTHER'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
