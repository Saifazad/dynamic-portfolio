const dbService = require('../services/dbService');

const getPortfolioData = async (req, res, next) => {
  try {
    const data = await dbService.getPortfolioData();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPortfolioData
};
