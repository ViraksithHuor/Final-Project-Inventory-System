const express = require('express');
const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');

const router = express.Router();


// GENERATE KEY
router.post('/', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const { label, purpose } = req.body;

    const rawKey = crypto.randomBytes(32).toString('hex');

    const hashedKey = crypto
      .createHash('sha256')
      .update(rawKey)
      .digest('hex');

    const apiKey = await ApiKey.create({
      key: hashedKey,
      label: label || 'Unnamed Key',
      purpose: purpose || ''
    });

    res.json({
      message: 'API key generated',
      apiKey: rawKey, // show once
      keyRecord: {
        id: apiKey._id,
        label: apiKey.label,
        purpose: apiKey.purpose,
        isActive: apiKey.isActive,
        createdAt: apiKey.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LIST KEYS
router.get('/', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const keys = await ApiKey.find().sort({ createdAt: -1 });
    res.json(keys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// REVOKE KEY
router.delete('/:id', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const key = await ApiKey.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!key) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key revoked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;