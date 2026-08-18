const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const requireAuth = require('../middleware/auth');

router.post('/education', requireAuth, educationController.createEducation);
router.put('/education/:id', requireAuth, educationController.updateEducation);
router.delete('/education/:id', requireAuth, educationController.deleteEducation);

module.exports = router;
