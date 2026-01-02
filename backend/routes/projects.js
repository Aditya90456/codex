const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Mock database for projects (in production, use MongoDB)
let projects = [];
let databases = [];

// Get all projects for a user
router.get('/', auth, async (req, res) => {
  try {
    const userProjects = projects.filter(p => p.userId === req.user.id);
    res.json(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, template, files } = req.body;
    
    const newProject = {
      id: Date.now().toString(),
      name,
      template,
      files,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, files } = req.body;
    const projectIndex = projects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: name || projects[projectIndex].name,
      files: files || projects[projectIndex].files,
      lastModified: new Date().toISOString()
    };
    
    res.json(projects[projectIndex]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    projects.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Database management routes

// Get all databases for a user
router.get('/databases/list', auth, async (req, res) => {
  try {
    const userDatabases = databases.filter(db => db.userId === req.user.id);
    res.json(userDatabases);
  } catch (error) {
    console.error('Error fetching databases:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new database connection
router.post('/databases', auth, async (req, res) => {
  try {
    const { name, type, connectionString } = req.body;
    
    const newDatabase = {
      id: Date.now().toString(),
      name,
      type,
      connectionString,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      status: 'connected' // In production, test the connection
    };
    
    databases.push(newDatabase);
    res.status(201).json(newDatabase);
  } catch (error) {
    console.error('Error adding database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test database connection
router.post('/databases/:id/test', auth, async (req, res) => {
  try {
    const database = databases.find(db => db.id === req.params.id && db.userId === req.user.id);
    
    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }
    
    // In production, implement actual connection testing based on database type
    const isConnected = Math.random() > 0.2; // Mock 80% success rate
    
    database.status = isConnected ? 'connected' : 'disconnected';
    database.lastTested = new Date().toISOString();
    
    res.json({
      success: isConnected,
      status: database.status,
      message: isConnected ? 'Connection successful' : 'Connection failed'
    });
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Execute database query
router.post('/databases/:id/query', auth, async (req, res) => {
  try {
    const { query } = req.body;
    const database = databases.find(db => db.id === req.params.id && db.userId === req.user.id);
    
    if (!database) {
      return res.status(404).json({ message: 'Database not found' });
    }
    
    if (database.status !== 'connected') {
      return res.status(400).json({ message: 'Database not connected' });
    }
    
    // Mock query execution
    const mockResults = {
      mongodb: {
        query: query,
        results: [
          { _id: '1', name: 'John Doe', email: 'john@example.com' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ],
        count: 2,
        executionTime: '15ms'
      },
      postgresql: {
        query: query,
        results: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        rowCount: 2,
        executionTime: '12ms'
      },
      mysql: {
        query: query,
        results: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        affectedRows: 2,
        executionTime: '18ms'
      },
      sqlite: {
        query: query,
        results: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        changes: 2,
        executionTime: '8ms'
      }
    };
    
    const result = mockResults[database.type] || mockResults.sqlite;
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ 
      success: false,
      message: 'Query execution failed',
      error: error.message 
    });
  }
});

// Delete database connection
router.delete('/databases/:id', auth, async (req, res) => {
  try {
    const databaseIndex = databases.findIndex(db => db.id === req.params.id && db.userId === req.user.id);
    
    if (databaseIndex === -1) {
      return res.status(404).json({ message: 'Database not found' });
    }
    
    databases.splice(databaseIndex, 1);
    res.json({ message: 'Database connection removed successfully' });
  } catch (error) {
    console.error('Error removing database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;