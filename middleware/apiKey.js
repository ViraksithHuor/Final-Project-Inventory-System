const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }

    const hashedKey = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    const keyRecord = await ApiKey.findOne({
      key: hashedKey,
      isActive: true
    });

    if (!keyRecord) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = validateApiKey;