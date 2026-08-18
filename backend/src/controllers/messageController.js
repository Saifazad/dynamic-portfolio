const dbService = require('../services/dbService');

// Submit visitor contact query (Public)
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }

    const newMessage = await dbService.createMessage({ name, email, subject, message });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

// Retrieve contact messages (Admin Protected)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await dbService.getMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// Delete a contact message (Admin Protected)
exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await dbService.deleteMessage(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
