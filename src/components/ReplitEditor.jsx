import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/ClerkAuthContext';
import {
  Play,
  Send,
  ChevronDown,
  ChevronUp,
  Terminal,
  Code,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Settings,
  RotateCcw,
  BookOpen,
  TestTube,
  Award
} from 'lucide-react';

const ReplitEditor = ({ onBack }) => {
  const { user } = useAuth();
  const [activeFile, setActiveFile] = useState('main.js');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [showConsole, setShowConsole] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [openTabs, setOpenTabs] = useState(['main.js']);
  const [expandedFolders, setExpandedFolders] = useState(['src']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const editorRef = useRef(null);
  const sidebarRef = useRef(null);
  const consoleRef = useRef(null);

  // Mock file structure
  const [fileStructure, setFileStructure] = useState({
    'main.js': {
      type: 'file',
      content: `// Welcome to Replit-style Editor
// Build, run, and share your code instantly

console.log("Hello, World! 🚀");

// Example: Simple calculator
function calculator(a, b, operation) {
  switch(operation) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error: Division by zero';
    default: return 'Invalid operation';
  }
}

// Test the calculator
console.log('5 + 3 =', calculator(5, 3, '+'));
console.log('10 - 4 =', calculator(10, 4, '-'));
console.log('7 * 6 =', calculator(7, 6, '*'));
console.log('15 / 3 =', calculator(15, 3, '/'));

// Interactive features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Original:', numbers);
console.log('Doubled:', doubled);

// Async example
async function fetchData() {
  console.log('Fetching data...');
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Data fetched successfully!');
  return { message: 'Hello from async function!' };
}

fetchData().then(data => console.log(data));`
    },
    'package.json': {
      type: 'file',
      content: `{
  "name": "replit-project",
  "version": "1.0.0",
  "description": "A Replit-style project",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "dev": "nodemon main.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}`
    },
    'README.md': {
      type: 'file',
      content: `# My Replit Project

Welcome to my awesome project! This is built with the Replit-style editor.

## Features
- 🚀 Instant code execution
- 📁 File management
- 🎨 Beautiful UI
- 🔧 Built-in tools

## Getting Started
1. Edit the code in \`main.js\`
2. Click the Run button
3. See the output in the console

Happy coding! 🎉`
    },
    'src': {
      type: 'folder',
      children: {
        'utils.js': {
          type: 'file',
          content: `// Utility functions
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};`
        },
        'components': {
          type: 'folder',
          children: {
            'Button.js': {
              type: 'file',
              content: `// Button component
export const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  return (
    <button 
      className={\`\${baseClasses} \${variants[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`
            }
          }
        }
      }
    },
    'styles.css': {
      type: 'file',
      content: `/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #1a1a1a;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: #007acc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  background: #005a9e;
}`
    }
  });

  const getFileIcon = (fileName, isFolder = false) => {
    if (isFolder) return <FolderOpen className="w-4 h-4 text-blue-400" />;
    
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      js: <Code className="w-4 h-4 text-yellow-400" />,
      jsx: <Code className="w-4 h-4 text-blue-400" />,
      ts: <Code className="w-4 h-4 text-blue-500" />,
      tsx: <Code className="w-4 h-4 text-blue-500" />,
      html: <FileText className="w-4 h-4 text-orange-400" />,
      css: <FileText className="w-4 h-4 text-blue-300" />,
      json: <FileText className="w-4 h-4 text-green-400" />,
      md: <FileText className="w-4 h-4 text-gray-400" />,
      png: <Image className="w-4 h-4 text-purple-400" />,
      jpg: <Image className="w-4 h-4 text-purple-400" />,
      mp3: <Music className="w-4 h-4 text-pink-400" />,
      mp4: <Video className="w-4 h-4 text-red-400" />,
      zip: <Archive className="w-4 h-4 text-gray-400" />
    };
    
    return iconMap[ext] || <File className="w-4 h-4 text-gray-400" />;
  };

  const getFileContent = (path) => {
    const parts = path.split('/');
    let current = fileStructure;
    
    for (const part of parts) {
      if (current[part]) {
        current = current[part];
        if (current.children) {
          current = current.children;
        }
      } else {
        return '';
      }
    }
    
    return current.content || '';
  };

  const updateFileContent = (path, content) => {
    // In a real app, this would update the file structure
    console.log('Updating file:', path, 'with content:', content);
  };

  const runCode = async () => {
    setIsRunning(true);
    const timestamp = Date.now();
    
    setConsoleOutput(prev => [...prev, {
      type: 'info',
      message: '🚀 Running code...',
      timestamp
    }]);

    try {
      const code = getFileContent(activeFile);
      
      if (activeFile.endsWith('.js')) {
        // Store original console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const outputs = [];
        
        // Override console methods
        console.log = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ 
            type: 'log', 
            message, 
            timestamp: Date.now() 
          });
          originalLog(...args);
        };
        
        console.error = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ 
            type: 'error', 
            message, 
            timestamp: Date.now() 
          });
          originalError(...args);
        };

        console.warn = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ 
            type: 'warning', 
            message, 
            timestamp: Date.now() 
          });
          originalWarn(...args);
        };

        // Execute code
        const func = new Function(code);
        await func();
        
        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        
        setConsoleOutput(prev => [...prev, ...outputs, {
          type: 'success',
          message: '✅ Execution completed successfully',
          timestamp: Date.now()
        }]);
      } else {
        setConsoleOutput(prev => [...prev, {
          type: 'warning',
          message: '⚠️ File type not executable. Only JavaScript files can be run.',
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, {
        type: 'error',
        message: `❌ Error: ${error.message}`,
        timestamp: Date.now()
      }]);
    }
    
    setTimeout(() => setIsRunning(false), 1000);
  };

  const stopExecution = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, {
      type: 'warning',
      message: '⏹️ Execution stopped',
      timestamp: Date.now()
    }]);
  };

  const openFile = (fileName) => {
    setActiveFile(fileName);
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName]);
    }
  };

  const closeTab = (fileName) => {
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    
    if (activeFile === fileName && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1]);
    }
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const renderFileTree = (structure, path = '') => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isFolder = item.type === 'folder';
      const isExpanded = expandedFolders.includes(name);
      
      return (
        <div key={fullPath} className="select-none">
          <div
            className={`flex items-center space-x-2 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded text-sm ${
              activeFile === fullPath ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
            }`}
            onClick={() => isFolder ? toggleFolder(name) : openFile(fullPath)}
            style={{ paddingLeft: `${(path.split('/').length) * 16 + 8}px` }}
          >
            {isFolder && (
              isExpanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
            )}
            {getFileIcon(name, isFolder)}
            <span className="truncate">{name}</span>
          </div>
          
          {isFolder && isExpanded && item.children && (
            <div>
              {renderFileTree(item.children, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const getOutputIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Terminal className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-300 border-l-red-500';
      case 'warning': return 'text-yellow-300 border-l-yellow-500';
      case 'success': return 'text-green-300 border-l-green-500';
      case 'info': return 'text-blue-300 border-l-blue-500';
      default: return 'text-gray-300 border-l-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Replit Editor</h1>
              <p className="text-xs text-gray-400">Build, run, and share instantly</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Run Controls */}
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                isRunning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </>
              )}
            </button>
            
            <button
              onClick={stopExecution}
              disabled={!isRunning}
              className={`p-2 rounded text-sm transition-colors ${
                !isRunning 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-red-400 hover:text-red-300 hover:bg-gray-600'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-300">{user.username}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div 
            className="bg-gray-800 border-r border-gray-700 flex flex-col"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Files</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white text-sm pl-7 pr-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto p-2">
              {renderFileTree(fileStructure)}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{Object.keys(fileStructure).length} files</span>
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3 h-3" />
                  <span>main</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab}
                className={`flex items-center space-x-2 px-4 py-3 border-r border-gray-700 cursor-pointer min-w-0 ${
                  activeFile === tab 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveFile(tab)}
              >
                {getFileIcon(tab)}
                <span className="text-sm truncate">{tab}</span>
                {openTabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab);
                    }}
                    className="p-0.5 hover:bg-gray-600 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            
            {openTabs.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-8 text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No files open</p>
                  <p className="text-xs mt-1">Click on a file to open it</p>
                </div>
              </div>
            )}
          </div>

          {/* Editor */}
          {activeFile && (
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={activeFile.endsWith('.js') ? 'javascript' : 
                         activeFile.endsWith('.json') ? 'json' :
                         activeFile.endsWith('.css') ? 'css' :
                         activeFile.endsWith('.md') ? 'markdown' : 'plaintext'}
                value={getFileContent(activeFile)}
                onChange={(value) => updateFileContent(activeFile, value || '')}
                onMount={(editor) => { editorRef.current = editor; }}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: 'line',
                  glyphMargin: true,
                  folding: true,
                  showFoldingControls: 'always',
                  bracketPairColorization: { enabled: true },
                  guides: {
                    bracketPairs: true,
                    indentation: true,
                  },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  formatOnPaste: true,
                  formatOnType: true,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Console */}
      {showConsole && (
        <div 
          className="bg-gray-900 border-t border-gray-700 flex flex-col"
          style={{ height: `${consoleHeight}px` }}
        >
          {/* Console Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Console</span>
              {consoleOutput.length > 0 && (
                <span className="text-xs text-gray-400">
                  {consoleOutput.length} messages
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleOutput([])}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Clear Console"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConsole(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Hide Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Console Content */}
          <div 
            ref={consoleRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-sm"
          >
            {consoleOutput.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Console output will appear here</p>
                  <p className="text-xs mt-1">Run your code to see results</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {consoleOutput.map((output, index) => (
                  <div
                    key={`${output.timestamp}-${index}`}
                    className={`flex items-start space-x-3 p-2 rounded border-l-2 ${getOutputColor(output.type)} bg-gray-800/30`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getOutputIcon(output.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="whitespace-pre-wrap break-words">
                        {output.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(output.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
          <span>{activeFile || 'No file selected'}</span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Ready</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="hover:text-white transition-colors"
          >
            Console {showConsole ? '↓' : '↑'}
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hover:text-white transition-colors"
          >
            Files {showSidebar ? '←' : '→'}
          </button>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
};

export default ReplitEditor;