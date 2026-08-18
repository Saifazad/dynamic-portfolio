const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/portfolio-data', portfolioController.getPortfolioData);

module.exports = router;
