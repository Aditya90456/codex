cc# VS Code-Style Editor

A professional VS Code-inspired editor with project management and database integration capabilities.

## Features

### 🎨 VS Code-Like Interface
- **Activity Bar**: Quick access to different views (Explorer, Search, Git, Database, Extensions)
- **Sidebar**: Context-sensitive panels for each activity
- **Editor Area**: Monaco editor with VS Code themes and features
- **Terminal**: Integrated console for code execution and output
- **Status Bar**: File information, cursor position, and system status

### 📁 Project Management
- **Create Projects**: Multiple templates available (React, Node.js, Python Flask)
- **File Explorer**: Tree view of project files and folders
- **Project Templates**:
  - **React App**: Complete Vite + React setup
  - **Node.js API**: Express.js with MongoDB integration
  - **Python Flask**: Flask web application with SQLite

### 🗄️ Database Integration
- **Multiple Database Types**: MongoDB, PostgreSQL, MySQL, SQLite
- **Connection Management**: Add, test, and manage database connections
- **Query Execution**: Run queries directly from the editor
- **Visual Status**: Connection status indicators

### ⚡ Code Execution
- **JavaScript Support**: Run JavaScript code in the browser
- **Real-time Output**: Console output with timestamps and type indicators
- **Error Handling**: Detailed error messages and stack traces

## Usage

### Accessing the VS Code Editor
1. From the welcome screen, click "VS Code Editor" button
2. The editor opens with a full VS Code-like interface

### Creating a New Project
1. Click the folder+ icon in the activity bar
2. Choose from available templates:
   - React App
   - Node.js API  
   - Python Flask
3. Enter a project name
4. The project files are automatically generated

### Managing Databases
1. Click the database icon in the activity bar
2. Click the + button to add a new database
3. Select database type and enter connection details
4. Test the connection and start querying

### File Management
- **Explorer View**: Browse and open project files
- **Tabs**: Multiple files can be open simultaneously
- **File Icons**: Different icons for different file types
- **Folder Expansion**: Collapsible folder structure

### Code Editing
- **Syntax Highlighting**: Language-specific highlighting
- **IntelliSense**: Code completion and suggestions
- **Error Detection**: Real-time syntax error detection
- **Multiple Languages**: JavaScript, TypeScript, Python, HTML, CSS, JSON

### Running Code
- Click the "Run" button or press Ctrl+Enter
- Output appears in the integrated terminal
- Supports console.log, console.error, console.warn
- Error handling with stack traces

## Technical Implementation

### Components
- **VSCodeEditor.jsx**: Main editor component
- **Project Templates**: Predefined file structures for different project types
- **Database Types**: Configuration for different database systems

### Backend Integration
- **Projects API**: `/api/projects` - CRUD operations for projects
- **Database API**: `/api/projects/databases` - Database connection management
- **Query Execution**: Mock query execution with realistic responses

### State Management
- **Local Storage**: Projects and databases persist locally
- **React State**: Component state for UI interactions
- **Monaco Editor**: Advanced code editing capabilities

## File Structure

```
src/components/
├── VSCodeEditor.jsx          # Main VS Code-style editor
├── WelcomeScreen.jsx         # Updated with VS Code editor option
└── ...

backend/routes/
├── projects.js               # Project and database management API
└── ...
```

## API Endpoints

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Databases
- `GET /api/projects/databases/list` - Get user databases
- `POST /api/projects/databases` - Add database connection
- `POST /api/projects/databases/:id/test` - Test connection
- `POST /api/projects/databases/:id/query` - Execute query
- `DELETE /api/projects/databases/:id` - Remove connection

## Future Enhancements

- **Git Integration**: Version control within the editor
- **Extensions**: Plugin system for additional functionality
- **Collaborative Editing**: Real-time collaboration features
- **Deployment**: Direct deployment to cloud platforms
- **Advanced Debugging**: Breakpoints and step-through debugging
- **Terminal Integration**: Full terminal emulation
- **File Upload/Download**: Import/export project files
- **Theme Customization**: Custom color themes and layouts

## Getting Started

1. Start the backend server: `npm run dev` (in backend directory)
2. Start the frontend: `npm run dev` (in root directory)
3. Open the application and click "VS Code Editor"
4. Create your first project and start coding!

The VS Code-style editor provides a familiar and powerful development environment right in your browser, complete with project management and database integration capabilities.