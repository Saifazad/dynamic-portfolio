const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const requireAuth = require('../middleware/auth');

// Public route to submit a query
router.post('/messages', messageController.sendMessage);

// Protected routes to view and delete queries inside dashboard
router.get('/messages', requireAuth, messageController.getMessages);
router.delete('/messages/:id', requireAuth, messageController.deleteMessage);

module.exports = router;
