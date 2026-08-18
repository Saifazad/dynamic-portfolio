const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const requireAuth = require('../middleware/auth');

router.post('/projects', requireAuth, projectController.createProject);
router.put('/projects/:id', requireAuth, projectController.updateProject);
router.delete('/projects/:id', requireAuth, projectController.deleteProject);

module.exports = router;
