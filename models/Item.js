const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true
    },
    serialNumber: {
      type: String,
      required: true
    },
    model: String,
    brand: String,
    category: {
      type: String,
      enum: ['Laptop', 'Desktop', 'Server', 'Monitor', 'Keyboard', 'Other'],
      default: 'Other'
    },
    status: {
      type: String,
      enum: ['Available', 'In-Use', 'Maintenance', 'Retired'],
      default: 'Available'
    },
    dateAcquired: {
      type: Date,
      default: Date.now
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);