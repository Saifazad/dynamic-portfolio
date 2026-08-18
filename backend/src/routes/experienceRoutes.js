const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const requireAuth = require('../middleware/auth');

router.post('/experience', requireAuth, experienceController.createExperience);
router.put('/experience/:id', requireAuth, experienceController.updateExperience);
router.delete('/experience/:id', requireAuth, experienceController.deleteExperience);

module.exports = router;
