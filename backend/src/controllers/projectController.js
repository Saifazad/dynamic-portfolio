const dbService = require('../services/dbService');

const createProject = async (req, res, next) => {
  try {
    const data = await dbService.createProject(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await dbService.updateProject(id, req.body);
    res.json(data);
  } catch (err) {
    // If project not found, set appropriate status
    if (err.message === 'Project not found') {
      res.status(404);
    }
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await dbService.deleteProject(id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Project not found') {
      res.status(404);
    }
    next(err);
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject
};
