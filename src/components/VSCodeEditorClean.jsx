import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/SimpleClerkAuth';
import { languageConfigs, generateProjectTemplates } from '../utils/languageTemplates';
import {
  Play, Save, Settings, FolderOpen, Folder, File, Terminal, GitBranch, Code,
  FileText, X, Search, Trash2, Loader, CheckCircle, AlertCircle, Info,
  RefreshCw, FolderPlus, FilePlus, Activity, User, Box, Edit3, ChevronDown, ChevronRight
} from 'lucide-react';

const VSCodeEditor = ({ onBack }) => {
  const { user } = useAuth();
  const [activeFile, setActiveFile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeView, setActiveView] = useState('explorer');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [fileContents, setFileContents] = useState({});
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const editorRef = useRef(null);
  const projectTemplates = generateProjectTemplates();

  const quickLanguages = Object.entries(languageConfigs).map(([id, config]) => ({
    id, name: config.name, icon: config.icon, extension: config.extension, executable: config.executable
  }));

  useEffect(() => {
    const savedProjects = localStorage.getItem('vscode-projects');
    const savedFileContents = localStorage.getItem('vscode-file-contents');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedFileContents) setFileContents(JSON.parse(savedFileContents));
  }, []);

  useEffect(() => {
    localStorage.setItem('vscode-file-contents', JSON.stringify(fileContents));
  }, [fileContents]);

  const createQuickProject = (languageId, projectName = 'QuickStart') => {
    const config = languageConfigs[languageId];
    if (!config) return null;

    const fileName = `main${config.extension}`;
    const project = {
      id: Date.now().toString(),
      name: projectName,
      language: languageId,
      files: { [fileName]: { type: 'file', content: config.template(projectName) } },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setFileContents(prev => ({ ...prev, [`${project.id}/${fileName}`]: config.template(projectName) }));
    return project;
  };

  const createProject = (template, projectName) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      template: template.id,
      files: template.files,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    Object.entries(template.files).forEach(([fileName, fileData]) => {
      if (fileData.type === 'file') {
        setFileContents(prev => ({ ...prev, [`${newProject.id}/${fileName}`]: fileData.content }));
      }
    });

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('vscode-projects', JSON.stringify(updatedProjects));
    setCurrentProject(newProject);
    setShowProjectModal(false);
    openFile(Object.keys(template.files)[0]);
  };

  const getFileContent = (fileName) => {
    if (!currentProject) return '';
    return fileContents[`${currentProject.id}/${fileName}`] || '';
  };

  const updateFileContent = (fileName, content) => {
    if (!currentProject) return;
    setFileContents(prev => ({ ...prev, [`${currentProject.id}/${fileName}`]: content }));
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
    } else if (newTabs.length === 0) {
      setActiveFile(null);
    }
  };

  const createNewFile = () => {
    if (!currentProject || !newFileName.trim()) return;
    
    const fileName = newFileName.trim();
    const updatedProject = {
      ...currentProject,
      files: { ...currentProject.files, [fileName]: { type: 'file', content: '' } },
      lastModified: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => p.id === currentProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    localStorage.setItem('vscode-projects', JSON.stringify(updatedProjects));
    setCurrentProject(updatedProject);
    updateFileContent(fileName, '');
    openFile(fileName);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const deleteFile = (fileName) => {
    if (!currentProject) return;
    
    const updatedFiles = { ...currentProject.files };
    delete updatedFiles[fileName];
    
    const updatedProject = { ...currentProject, files: updatedFiles, lastModified: new Date().toISOString() };
    const updatedProjects = projects.map(p => p.id === currentProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    localStorage.setItem('vscode-projects', JSON.stringify(updatedProjects));
    setCurrentProject(updatedProject);

    const key = `${currentProject.id}/${fileName}`;
    setFileContents(prev => {
      const newContents = { ...prev };
      delete newContents[key];
      return newContents;
    });
    closeTab(fileName);
  };

  const getFileIcon = (fileName, isFolder = false) => {
    if (isFolder) {
      return <Folder className="w-4 h-4 text-blue-400" />;
    }
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
      // JavaScript/TypeScript
      js: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-yellow-400 bg-yellow-400/10 rounded">JS</span>,
      jsx: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-400 bg-blue-400/10 rounded">JSX</span>,
      ts: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-500/10 rounded">TS</span>,
      tsx: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-500/10 rounded">TSX</span>,
      
      // Python
      py: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-green-400 bg-green-400/10 rounded">PY</span>,
      
      // Java
      java: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-orange-500 bg-orange-500/10 rounded">☕</span>,
      
      // C/C++
      c: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-600 bg-blue-600/10 rounded">C</span>,
      cpp: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-500/10 rounded">C++</span>,
      cc: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-500/10 rounded">C++</span>,
      cxx: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-500/10 rounded">C++</span>,
      
      // C#
      cs: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-400 bg-purple-400/10 rounded">C#</span>,
      
      // Go
      go: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-cyan-400 bg-cyan-400/10 rounded">GO</span>,
      
      // Rust
      rs: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-orange-600 bg-orange-600/10 rounded">🦀</span>,
      
      // PHP
      php: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-indigo-400 bg-indigo-400/10 rounded">PHP</span>,
      
      // Ruby
      rb: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-red-400 bg-red-400/10 rounded">💎</span>,
      
      // Swift
      swift: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-orange-400 bg-orange-400/10 rounded">🦉</span>,
      
      // Kotlin
      kt: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-500 bg-purple-500/10 rounded">KT</span>,
      
      // Web files
      html: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-orange-400 bg-orange-400/10 rounded">HTML</span>,
      css: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-300 bg-blue-300/10 rounded">CSS</span>,
      scss: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-pink-400 bg-pink-400/10 rounded">SCSS</span>,
      sass: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-pink-400 bg-pink-400/10 rounded">SASS</span>,
      
      // Data files
      json: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-green-400 bg-green-400/10 rounded">JSON</span>,
      xml: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-orange-300 bg-orange-300/10 rounded">XML</span>,
      yml: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-300 bg-purple-300/10 rounded">YML</span>,
      yaml: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-300 bg-purple-300/10 rounded">YAML</span>,
      
      // Documentation
      md: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-400/10 rounded">MD</span>,
      txt: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-300 bg-gray-300/10 rounded">TXT</span>,
      
      // Images
      png: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-400 bg-purple-400/10 rounded">🖼️</span>,
      jpg: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-400 bg-purple-400/10 rounded">🖼️</span>,
      jpeg: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-400 bg-purple-400/10 rounded">🖼️</span>,
      gif: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-purple-400 bg-purple-400/10 rounded">🖼️</span>,
      svg: <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-green-400 bg-green-400/10 rounded">SVG</span>
    };
    
    return iconMap[ext] || <File className="w-4 h-4 text-gray-400" />;
  };

  // Enhanced file tree structure
  const buildFileTree = (files) => {
    const tree = {};
    
    Object.entries(files).forEach(([filePath, fileData]) => {
      const parts = filePath.split('/');
      let current = tree;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        
        if (isLast) {
          // It's a file
          current[part] = {
            type: 'file',
            path: filePath,
            data: fileData
          };
        } else {
          // It's a folder
          if (!current[part]) {
            current[part] = {
              type: 'folder',
              children: {},
              expanded: true // Default to expanded
            };
          }
          current = current[part].children;
        }
      }
    });
    
    return tree;
  };

  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'components']));

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const renderFileTreeNode = (name, node, path = '', depth = 0) => {
    const fullPath = path ? `${path}/${name}` : name;
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(fullPath);
    const isActive = activeFile === fullPath;
    
    if (isFolder) {
      const children = Object.entries(node.children || {});
      const hasChildren = children.length > 0;
      
      return (
        <div key={fullPath}>
          <div
            className={`flex items-center space-x-1 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded text-sm transition-colors ${
              isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => toggleFolder(fullPath)}
          >
            {hasChildren && (
              <div className="w-4 h-4 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </div>
            )}
            {!hasChildren && <div className="w-4 h-4" />}
            {getFileIcon(name, true)}
            <span className="truncate">{name}</span>
          </div>
          
          {isExpanded && hasChildren && (
            <div>
              {children
                .sort(([a, nodeA], [b, nodeB]) => {
                  // Folders first, then files
                  if (nodeA.type === 'folder' && nodeB.type === 'file') return -1;
                  if (nodeA.type === 'file' && nodeB.type === 'folder') return 1;
                  return a.localeCompare(b);
                })
                .map(([childName, childNode]) =>
                  renderFileTreeNode(childName, childNode, fullPath, depth + 1)
                )}
            </div>
          )}
        </div>
      );
    } else {
      // It's a file
      return (
        <div key={fullPath} className="group">
          <div
            className={`flex items-center justify-between px-2 py-1 hover:bg-gray-700 cursor-pointer rounded text-sm transition-colors ${
              isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
            }`}
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
            onClick={() => openFile(fullPath)}
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {getFileIcon(name)}
              <span className="truncate">{name}</span>
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newName = prompt('Rename file:', name);
                  if (newName && newName !== name) {
                    // Handle rename logic here
                    console.log('Rename', fullPath, 'to', newName);
                  }
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Rename"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${name}?`)) deleteFile(fullPath);
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderFileTree = () => {
    if (!currentProject?.files) return null;
    
    // Filter files based on search term
    const filteredFiles = searchTerm 
      ? Object.fromEntries(
          Object.entries(currentProject.files).filter(([name]) => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : currentProject.files;
    
    const tree = buildFileTree(filteredFiles);
    
    return (
      <div className="space-y-0.5">
        {Object.entries(tree)
          .sort(([a, nodeA], [b, nodeB]) => {
            // Folders first, then files
            if (nodeA.type === 'folder' && nodeB.type === 'file') return -1;
            if (nodeA.type === 'file' && nodeB.type === 'folder') return 1;
            return a.localeCompare(b);
          })
          .map(([name, node]) => renderFileTreeNode(name, node))
        }
      </div>
    );
  };

  const addOutput = (type, message) => {
    setConsoleOutput(prev => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const runCode = async () => {
    if (!activeFile) return;
    
    setIsRunning(true);
    setShowConsole(true);
    
    const fileExtension = activeFile.split('.').pop()?.toLowerCase();
    
    try {
      const code = getFileContent(activeFile);
      
      if (!code.trim()) {
        addOutput('warning', 'File is empty');
        setIsRunning(false);
        return;
      }
      
      if (fileExtension === 'js' || fileExtension === 'jsx') {
        // JavaScript execution with clean output
        const outputs = [];
        
        const customConsole = {
          log: (...args) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            outputs.push({ type: 'log', message, timestamp: Date.now() });
          },
          error: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            outputs.push({ type: 'error', message, timestamp: Date.now() });
          },
          warn: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            outputs.push({ type: 'warning', message, timestamp: Date.now() });
          }
        };

        try {
          const safeCode = `(function() { const console = arguments[0]; ${code} })`;
          const func = new Function('return ' + safeCode)();
          await func(customConsole);
          
          // Only show actual output, no extra messages
          setConsoleOutput(prev => [...prev, ...outputs]);
          
        } catch (execError) {
          addOutput('error', execError.message);
        }
      } else if (fileExtension === 'json') {
        try {
          const parsed = JSON.parse(code);
          addOutput('log', JSON.stringify(parsed, null, 2));
        } catch (jsonError) {
          addOutput('error', `Invalid JSON: ${jsonError.message}`);
        }
      } else if (fileExtension === 'html') {
        // Show HTML content
        addOutput('log', code);
      } else if (fileExtension === 'css') {
        // Show CSS content
        addOutput('log', code);
      } else {
        // For other languages, simulate execution with clean output
        const languageInfo = {
          py: { name: 'Python' },
          java: { name: 'Java' },
          cpp: { name: 'C++' },
          c: { name: 'C' },
          cs: { name: 'C#' },
          go: { name: 'Go' },
          rs: { name: 'Rust' },
          php: { name: 'PHP' },
          rb: { name: 'Ruby' },
          swift: { name: 'Swift' },
          kt: { name: 'Kotlin' },
          ts: { name: 'TypeScript' }
        };
        
        const langInfo = languageInfo[fileExtension];
        if (langInfo) {
          // Simulate execution output
          setTimeout(() => {
            addOutput('log', 'Hello, World!');
            addOutput('log', `Welcome to ${langInfo.name} programming!`);
            
            // Extract and show variable values from code
            const lines = code.split('\n');
            lines.forEach(line => {
              // Simple pattern matching for common output statements
              if (line.includes('print(') || line.includes('println(') || line.includes('cout <<') || line.includes('Console.WriteLine')) {
                const match = line.match(/["'`]([^"'`]+)["'`]/);
                if (match) {
                  addOutput('log', match[1]);
                }
              }
            });
          }, 500);
        } else {
          addOutput('log', code.substring(0, 500));
        }
      }
    } catch (error) {
      addOutput('error', error.message);
    }
    
    setTimeout(() => setIsRunning(false), 1000);
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

  const sidebarViews = [
    { id: 'explorer', icon: <FolderOpen className="w-5 h-5" />, title: 'Explorer' },
    { id: 'search', icon: <Search className="w-5 h-5" />, title: 'Search' },
    { id: 'git', icon: <GitBranch className="w-5 h-5" />, title: 'Source Control' },
    { id: 'extensions', icon: <Box className="w-5 h-5" />, title: 'Extensions' }
  ];

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Title Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0 mt-16">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">←</button>
          <div className="flex items-center space-x-3">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-medium">VS Code Editor</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-1 flex items-center space-x-6 text-sm flex-shrink-0">
        <span className="text-gray-300 hover:text-white cursor-pointer">File</span>
        <span className="text-gray-300 hover:text-white cursor-pointer">Edit</span>
        <span className="text-gray-300 hover:text-white cursor-pointer">View</span>
        <span className="text-gray-300 hover:text-white cursor-pointer">Run</span>
        <span className="text-gray-300 hover:text-white cursor-pointer">Terminal</span>
        <div className="flex-1"></div>
        {currentProject && (
          <div className="flex items-center space-x-2 text-gray-400">
            <Folder className="w-4 h-4" />
            <span>{currentProject.name}</span>
          </div>
        )}
        {user && (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{user.username}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4 w-12 flex-shrink-0">
          {sidebarViews.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`p-2 rounded transition-colors ${
                activeView === view.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title={view.title}
            >
              {view.icon}
            </button>
          ))}
          <div className="flex-1"></div>
          <button
            onClick={() => setShowProjectModal(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="New Project"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-800 border-r border-gray-700 flex flex-col w-80">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Explorer</h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="New Project"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowNewFileModal(true)}
                  disabled={!currentProject}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  title="New File"
                >
                  <FilePlus className="w-4 h-4" />
                </button>
              </div>
            </div>
            {currentProject && (
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {!currentProject ? (
                <div>
                  <div className="text-center py-4">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p className="text-sm text-gray-400 mb-4">No project open</p>
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors mb-4"
                    >
                      Create Project
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Quick Start</h4>
                    <div className="space-y-2">
                      {quickLanguages.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            const project = createQuickProject(lang.id, `${lang.name} Project`);
                            if (project) {
                              const updatedProjects = [...projects, project];
                              setProjects(updatedProjects);
                              localStorage.setItem('vscode-projects', JSON.stringify(updatedProjects));
                              setCurrentProject(project);
                              openFile(`main${lang.extension}`);
                            }
                          }}
                          className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-700 rounded transition-colors"
                        >
                          <span className="text-lg">{lang.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{lang.name}</div>
                            <div className="text-xs text-gray-400">Create {lang.name.toLowerCase()} file</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-2 bg-gray-700 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Folder className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">{currentProject.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Close project?')) {
                            setCurrentProject(null);
                            setActiveFile(null);
                            setOpenTabs([]);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                        title="Close Project"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentProject.language || currentProject.template} project
                    </div>
                  </div>
                  <div className="space-y-1">{renderFileTree()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Action Bar */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={runCode}
                disabled={isRunning || !activeFile}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  isRunning || !activeFile
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
                onClick={() => {
                  if (activeFile && editorRef.current) {
                    const content = editorRef.current.getValue();
                    updateFileContent(activeFile, content);
                    addOutput('success', `Saved ${activeFile}`);
                  }
                }}
                disabled={!activeFile}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  !activeFile ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>

              <button
                onClick={() => setShowConsole(!showConsole)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Terminal className="w-4 h-4" />
                <span>{showConsole ? 'Hide' : 'Show'} Console</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {activeFile && (
                <>
                  <span>Ln 1, Col 1</span>
                  <span>•</span>
                  <span>UTF-8</span>
                  <span>•</span>
                  <span>{activeFile.split('.').pop()?.toUpperCase()}</span>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          {openTabs.length > 0 && (
            <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
              {openTabs.map(tab => (
                <div
                  key={tab}
                  className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 max-w-48 ${
                    activeFile === tab ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveFile(tab)}
                >
                  {getFileIcon(tab)}
                  <span className="text-sm truncate">{tab}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab);
                    }}
                    className="p-0.5 hover:bg-gray-600 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 relative">
            {activeFile ? (
              <Editor
                height="100%"
                language={
                  activeFile.endsWith('.js') || activeFile.endsWith('.jsx') ? 'javascript' : 
                  activeFile.endsWith('.py') ? 'python' :
                  activeFile.endsWith('.java') ? 'java' :
                  activeFile.endsWith('.cpp') ? 'cpp' :
                  activeFile.endsWith('.html') ? 'html' :
                  activeFile.endsWith('.css') ? 'css' :
                  activeFile.endsWith('.json') ? 'json' :
                  activeFile.endsWith('.md') ? 'markdown' : 'plaintext'
                }
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
                  guides: { bracketPairs: true, indentation: true },
                  suggest: { showKeywords: true, showSnippets: true },
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  formatOnPaste: true,
                  formatOnType: true,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth'
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Welcome to VS Code Editor</h3>
                  <p className="text-sm mb-4">Open a file to start editing or create a new project</p>
                  {!currentProject && (
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Create New Project
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Console */}
      {showConsole && (
        <div className="bg-gray-900 border-t border-gray-700 flex flex-col h-64">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Output</span>
              <span className="text-xs text-gray-400">({consoleOutput.length} messages)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleOutput([])}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Clear Output"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConsole(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Close Console"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {consoleOutput.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Output will appear here when you run code</p>
                  <p className="text-xs text-gray-600 mt-1">Click the Run button to execute your code</p>
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
                      <div className="whitespace-pre-wrap break-words">{output.message}</div>
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
      <div className="bg-blue-600 px-4 py-1 flex items-center justify-between text-xs text-white flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Ready</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          {activeFile && <span>{activeFile.split('.').pop()?.toUpperCase()}</span>}
        </div>
      </div>

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Project</h2>
              <button onClick={() => setShowProjectModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {projectTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-600 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => {
                    const projectName = prompt('Enter project name:', `my-${template.id}-app`);
                    if (projectName) createProject(template, projectName);
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{template.icon}</span>
                    <h3 className="font-medium text-white">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Create New File</h2>
              <button onClick={() => setShowNewFileModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., script.js, styles.css, index.html"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => { if (e.key === 'Enter') createNewFile(); }}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewFile}
                disabled={!newFileName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VSCodeEditor;