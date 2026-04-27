const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String, // hashed
      required: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    purpose: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApiKey', apiKeySchema);