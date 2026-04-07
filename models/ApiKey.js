const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String, // hashed
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApiKey', apiKeySchema);