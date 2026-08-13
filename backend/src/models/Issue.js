const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
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
  location: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    address: {
      type: String,
      trim: true
    }
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  photo: {
    url: {
      type: String,
      trim: true
    },
    publicId: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: [
      'REPORTED',
      'ACKNOWLEDGED',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED'
    ],
    default: 'REPORTED'
  },
  priority: {
    type: String,
    enum: [
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL'
    ],
    default: 'MEDIUM'
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  resolution: {
    notes: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    photo: {
      url: {
        type: String,
        trim: true
      },
      publicId: {
        type: String,
        trim: true
      }
    },
    resolvedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Issue', issueSchema);
