const dbService = require('../services/dbService');

const createExperience = async (req, res, next) => {
  try {
    const data = await dbService.createExperience(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dbService.updateExperience(id, req.body);
    res.json(data);
  } catch (err) {
    if (err.message === 'Experience entry not found') {
      res.status(404);
    }
    next(err);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await dbService.deleteExperience(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Experience entry not found') {
      res.status(404);
    }
    next(err);
  }
};

module.exports = {
  createExperience,
  updateExperience,
  deleteExperience
};
