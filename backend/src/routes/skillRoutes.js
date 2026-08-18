const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const requireAuth = require('../middleware/auth');

router.post('/skills', requireAuth, skillController.createSkill);
router.put('/skills/:id', requireAuth, skillController.updateSkill);
router.delete('/skills/:id', requireAuth, skillController.deleteSkill);

module.exports = router;
