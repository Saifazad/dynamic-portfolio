const dbService = require('../services/dbService');

const createEducation = async (req, res, next) => {
  try {
    const data = await dbService.createEducation(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dbService.updateEducation(id, req.body);
    res.json(data);
  } catch (err) {
    if (err.message === 'Education entry not found') {
      res.status(404);
    }
    next(err);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await dbService.deleteEducation(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Education entry not found') {
      res.status(404);
    }
    next(err);
  }
};

module.exports = {
  createEducation,
  updateEducation,
  deleteEducation
};
