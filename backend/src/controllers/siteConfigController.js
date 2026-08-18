const dbService = require('../services/dbService');

const updateSiteConfig = async (req, res, next) => {
  try {
    const updated = await dbService.updateSiteConfig(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateSiteConfig
};
