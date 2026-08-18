const express = require('express');
const router = express.Router();

const portfolioRoutes = require('./portfolioRoutes');
const siteConfigRoutes = require('./siteConfigRoutes');
const projectRoutes = require('./projectRoutes');
const educationRoutes = require('./educationRoutes');
const experienceRoutes = require('./experienceRoutes');
const skillRoutes = require('./skillRoutes');
const messageRoutes = require('./messageRoutes');
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount all route modules
router.use('/', portfolioRoutes);
router.use('/', siteConfigRoutes);
router.use('/', projectRoutes);
router.use('/', educationRoutes);
router.use('/', experienceRoutes);
router.use('/', skillRoutes);
router.use('/', messageRoutes);
router.use('/', authRoutes);
router.use('/', chatRoutes);
router.use('/', uploadRoutes);


module.exports = router;

