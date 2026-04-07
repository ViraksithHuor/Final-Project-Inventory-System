const express = require('express');
const Item = require('../models/Item');

const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');
const validateApiKey = require('../middleware/apiKey');

const router = express.Router();


// CREATE ITEM
router.post('/', authenticate, async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET items: allow JWT OR API key
router.get('/', async (req, res, next) => {
  if (req.headers['authorization']) {
    return authenticate(req, res, next);
  } else {
    return validateApiKey(req, res, next);
  }
}, async (req, res) => {
  const items = await Item.find({ isDeleted: false });
  res.json(items);
});


// UPDATE ITEM
router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE ITEM (Admin only, soft delete)
router.delete('/:id', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Item deleted (soft)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;