const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Server-side authentication check
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === expectedPassword) {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const token = jwt.sign({ role: 'admin' }, secret, { expiresIn: '24h' });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect admin passcode!' });
  }
});

module.exports = router;
