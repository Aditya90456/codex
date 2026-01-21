const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Mock project data structure
let projects = [];

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const userProjects = projects.filter(p => p.userId === req.user.id);
    
    res.json({
      success: true,
      data: userProjects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, language, code } = req.body;
    
    const project = {
      id: Date.now().toString(),
      userId: req.user.id,
      name,
      description,
      language,
      code: code || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(project);
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// Get specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const { name, description, language, code } = req.body;
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: name || projects[projectIndex].name,
      description: description || projects[projectIndex].description,
      language: language || projects[projectIndex].language,
      code: code || projects[projectIndex].code,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: projects[projectIndex]
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    projects.splice(projectIndex, 1);
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;