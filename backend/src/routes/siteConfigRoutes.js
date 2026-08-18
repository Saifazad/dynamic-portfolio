const express = require('express');
const router = express.Router();
const siteConfigController = require('../controllers/siteConfigController');
const requireAuth = require('../middleware/auth');

router.put('/site-config', requireAuth, siteConfigController.updateSiteConfig);

module.exports = router;
