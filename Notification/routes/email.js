const express = require('express');
const router = express.Router();

// Send email
router.post('/send', (req, res) => {
  const { to, subject, body } = req.body;
  res.json({ message: 'Email queued', to, subject });
});

// Get email history
router.get('/history', (req, res) => {
  res.json({ history: [] });
});

module.exports = router;