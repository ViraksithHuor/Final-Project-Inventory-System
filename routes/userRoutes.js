const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authenticate = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');

const router = express.Router();
const SALT_ROUNDS = 10;

// CREATE USER (Admin only)
router.post('/', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'Technician'
    });

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE ROLE (Admin only)
router.patch('/:id/role', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['Admin', 'Technician'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ENABLE / DISABLE USER (Admin only)
router.patch('/:id/status', authenticate, authorizeRole('Admin'), async (req, res) => {
  try {
    const { isEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isEnabled },
      { new: true }
    );

    res.json({ message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;