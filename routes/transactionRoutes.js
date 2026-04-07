const express = require('express');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();


// CHECKOUT
router.post('/checkout', authenticate, upload.single('document'), async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // RULE: must be Available
    if (item.status !== 'Available') {
      return res.status(400).json({ message: 'Item not available for checkout' });
    }

    item.status = 'In-Use';
    item.assignedTo = userId;
    await item.save();

    const transaction = await Transaction.create({
      item: itemId,
      user: userId,
      type: 'checkout',
      document: req.file ? req.file.path : null
    });

    res.json({ message: 'Item checked out', transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// CHECKIN
router.post('/checkin', authenticate, upload.single('document'), async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'In-Use') {
      return res.status(400).json({ message: 'Item is not currently checked out' });
    }

    const transaction = await Transaction.create({
      item: itemId,
      user: item.assignedTo,
      type: 'checkin',
      document: req.file ? req.file.path : null
    });

    item.status = 'Available';
    item.assignedTo = null;
    await item.save();

    res.json({ message: 'Item checked in', transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ITEM HISTORY
router.get('/:itemId/history', authenticate, async (req, res) => {
  try {
    const history = await Transaction.find({ item: req.params.itemId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;