const express = require('express');
const router = express.Router();

// Get connected accounts
router.get('/', (req, res) => {
  res.json({ accounts: [] });
});

// Connect account
router.post('/', (req, res) => {
  const { platform, accessToken } = req.body;
  res.json({ message: 'Account connected', platform });
});

// Disconnect account
router.delete('/:id', (req, res) => {
  res.json({ message: 'Account disconnected', id: req.params.id });
});

module.exports = router;