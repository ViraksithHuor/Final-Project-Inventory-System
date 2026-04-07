const express = require('express');
const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');

const router = express.Router();


// GENERATE KEY
router.post('/', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const rawKey = crypto.randomBytes(32).toString('hex');

    const hashedKey = crypto
      .createHash('sha256')
      .update(rawKey)
      .digest('hex');

    await ApiKey.create({ key: hashedKey });

    res.json({
      message: 'API key generated',
      apiKey: rawKey // show once
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LIST KEYS
router.get('/', authenticate, authorizeRole('Admin'), async (req, res) => {
  const keys = await ApiKey.find();
  res.json(keys);
});


// REVOKE KEY
router.delete('/:id', authenticate, authorizeRole('Admin'), async (req, res) => {
  await ApiKey.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'API key revoked' });
});

module.exports = router;