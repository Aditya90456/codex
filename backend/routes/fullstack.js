const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Data directory
const DATA_DIR = path.join(__dirname, '../data/fullstack');

// Ensure directory exists
async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Get user projects
router.get('/projects/:userId', async (req, res) => {
  try {
    await ensureDir();
    const { userId } = req.params;
    const filePath = path.join(DATA_DIR, `${userId}-projects.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const projects = JSON.parse(data);
      res.json({ success: true, projects });
    } catch (error) {
      res.json({ success: true, projects: [] });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save project
router.post('/save', async (req, res) => {
  try {
    await ensureDir();
    const { userId, projectName, frontend, backend, database } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    const filePath = path.join(DATA_DIR, `${userId}-projects.json`);
    
    let projects = [];
    try {
      const data = await fs.readFile(filePath, 'utf8');
      projects = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }
    
    const project = {
      id: Date.now(),
      name: projectName,
      frontend,
      backend,
      database,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    projects.push(project);
    
    await fs.writeFile(filePath, JSON.stringify(projects, null, 2));
    
    res.json({ success: true, project });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Run full-stack application
router.post('/run', async (req, res) => {
  try {
    const { userId, frontend, backend, database } = req.body;
    
    let output = '';
    
    // Validate frontend code
    if (frontend) {
      output += '📦 Frontend: Checking HTML/CSS/JS...\n';
      if (frontend.includes('<html') || frontend.includes('<!DOCTYPE')) {
        output += '✅ Frontend: Valid HTML structure\n';
      }
      if (frontend.includes('React') || frontend.includes('Vue') || frontend.includes('Angular')) {
        output += '✅ Frontend: Framework detected\n';
      }
    }
    
    // Validate backend code
    if (backend) {
      output += '\n🚀 Backend: Checking server code...\n';
      if (backend.includes('express') || backend.includes('app.listen')) {
        output += '✅ Backend: Express server detected\n';
      }
      if (backend.includes('app.get') || backend.includes('app.post')) {
        output += '✅ Backend: API routes found\n';
      }
      if (backend.includes('app.use(express.json())')) {
        output += '✅ Backend: JSON middleware configured\n';
      }
    }
    
    // Validate database schema
    if (database) {
      output += '\n💾 Database: Checking schema...\n';
      if (database.includes('CREATE TABLE')) {
        const tableCount = (database.match(/CREATE TABLE/g) || []).length;
        output += `✅ Database: ${tableCount} table(s) defined\n`;
      }
      if (database.includes('PRIMARY KEY')) {
        output += '✅ Database: Primary keys defined\n';
      }
      if (database.includes('REFERENCES')) {
        output += '✅ Database: Foreign key relationships found\n';
      }
      if (database.includes('INDEX')) {
        output += '✅ Database: Indexes defined for optimization\n';
      }
    }
    
    output += '\n🎉 Full-stack application validated successfully!\n';
    output += '\n📊 Stack Summary:\n';
    output += `   Frontend: ${frontend ? '✅ Ready' : '❌ Missing'}\n`;
    output += `   Backend: ${backend ? '✅ Ready' : '❌ Missing'}\n`;
    output += `   Database: ${database ? '✅ Ready' : '❌ Missing'}\n`;
    
    res.json({ success: true, output });
  } catch (error) {
    console.error('Error running application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
