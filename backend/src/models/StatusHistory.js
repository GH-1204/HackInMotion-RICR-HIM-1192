const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  previousStatus: {
    type: String,
    required: true,
    enum: [
      'REPORTED',
      'ACKNOWLEDGED',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED'
    ]
  },
  newStatus: {
    type: String,
    required: true,
    enum: [
      'REPORTED',
      'ACKNOWLEDGED',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED'
    ]
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
