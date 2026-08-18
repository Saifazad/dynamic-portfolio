const dbService = require('../services/dbService');

const createSkill = async (req, res, next) => {
  try {
    const data = await dbService.createSkill(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dbService.updateSkill(id, req.body);
    res.json(data);
  } catch (err) {
    if (err.message === 'Skill not found') {
      res.status(404);
    }
    next(err);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await dbService.deleteSkill(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Skill not found') {
      res.status(404);
    }
    next(err);
  }
};

module.exports = {
  createSkill,
  updateSkill,
  deleteSkill
};
