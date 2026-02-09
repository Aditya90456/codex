const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// File-based storage for web projects
const PROJECTS_DIR = path.join(__dirname, '../data/web-projects');

// Ensure projects directory exists
async function ensureProjectsDir() {
  try {
    await fs.access(PROJECTS_DIR);
  } catch {
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
  }
}

// Get user's projects file path
function getUserProjectsFile(userId) {
  return path.join(PROJECTS_DIR, `${userId}.json`);
}

// Load user's projects
async function loadUserProjects(userId) {
  try {
    await ensureProjectsDir();
    const filePath = getUserProjectsFile(userId);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return default structure if file doesn't exist
    return {
      folders: [
        { id: 'default', name: 'My Projects', color: 'blue', icon: '📁' }
      ],
      projects: []
    };
  }
}

// Save user's projects
async function saveUserProjects(userId, data) {
  await ensureProjectsDir();
  const filePath = getUserProjectsFile(userId);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Get all projects and folders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await loadUserProjects(userId);
    
    res.json({
      success: true,
      folders: data.folders,
      projects: data.projects,
      stats: {
        totalProjects: data.projects.length,
        totalFolders: data.folders.length,
        byFramework: data.projects.reduce((acc, p) => {
          acc[p.framework] = (acc[p.framework] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// Create new folder
router.post('/folder/create', async (req, res) => {
  try {
    const { userId, name, color, icon } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        error: 'User ID and folder name are required'
      });
    }
    
    const data = await loadUserProjects(userId);
    
    const newFolder = {
      id: `folder_${Date.now()}`,
      name,
      color: color || 'blue',
      icon: icon || '📁',
      createdAt: new Date().toISOString()
    };
    
    data.folders.push(newFolder);
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      folder: newFolder,
      folders: data.folders
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create folder'
    });
  }
});

// Rename folder
router.put('/folder/rename', async (req, res) => {
  try {
    const { userId, folderId, newName } = req.body;
    
    const data = await loadUserProjects(userId);
    const folder = data.folders.find(f => f.id === folderId);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        error: 'Folder not found'
      });
    }
    
    folder.name = newName;
    folder.updatedAt = new Date().toISOString();
    
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      folder,
      folders: data.folders
    });
  } catch (error) {
    console.error('Error renaming folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rename folder'
    });
  }
});

// Delete folder
router.delete('/folder/delete', async (req, res) => {
  try {
    const { userId, folderId } = req.body;
    
    const data = await loadUserProjects(userId);
    
    // Don't allow deleting the default folder
    if (folderId === 'default') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete default folder'
      });
    }
    
    // Move projects from deleted folder to default
    data.projects.forEach(project => {
      if (project.folderId === folderId) {
        project.folderId = 'default';
      }
    });
    
    data.folders = data.folders.filter(f => f.id !== folderId);
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      folders: data.folders,
      projects: data.projects
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete folder'
    });
  }
});

// Create/Save project
router.post('/project/save', async (req, res) => {
  try {
    const { userId, projectId, name, folderId, framework, html, css, js, description } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        error: 'User ID and project name are required'
      });
    }
    
    const data = await loadUserProjects(userId);
    
    if (projectId) {
      // Update existing project
      const project = data.projects.find(p => p.id === projectId);
      if (project) {
        project.name = name;
        project.folderId = folderId || 'default';
        project.framework = framework || 'vanilla';
        project.html = html;
        project.css = css;
        project.js = js;
        project.description = description;
        project.updatedAt = new Date().toISOString();
        
        await saveUserProjects(userId, data);
        
        return res.json({
          success: true,
          project,
          message: 'Project updated successfully'
        });
      }
    }
    
    // Create new project
    const newProject = {
      id: `project_${Date.now()}`,
      name,
      folderId: folderId || 'default',
      framework: framework || 'vanilla',
      html: html || '',
      css: css || '',
      js: js || '',
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.projects.push(newProject);
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      project: newProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save project'
    });
  }
});

// Get single project
router.get('/project/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const data = await loadUserProjects(userId);
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// Delete project
router.delete('/project/delete', async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    
    const data = await loadUserProjects(userId);
    data.projects = data.projects.filter(p => p.id !== projectId);
    
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      projects: data.projects,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

// Move project to folder
router.put('/project/move', async (req, res) => {
  try {
    const { userId, projectId, folderId } = req.body;
    
    const data = await loadUserProjects(userId);
    const project = data.projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    project.folderId = folderId;
    project.updatedAt = new Date().toISOString();
    
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      project,
      projects: data.projects
    });
  } catch (error) {
    console.error('Error moving project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to move project'
    });
  }
});

// Duplicate project
router.post('/project/duplicate', async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    
    const data = await loadUserProjects(userId);
    const original = data.projects.find(p => p.id === projectId);
    
    if (!original) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    const duplicate = {
      ...original,
      id: `project_${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.projects.push(duplicate);
    await saveUserProjects(userId, data);
    
    res.json({
      success: true,
      project: duplicate,
      projects: data.projects
    });
  } catch (error) {
    console.error('Error duplicating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate project'
    });
  }
});

module.exports = router;
