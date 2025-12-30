import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/AuthContext';
import { languageConfigs, generateProjectTemplates } from '../utils/languageTemplates';
import {
  Play,
  Save,
  Settings,
  FolderOpen,
  Folder,
  File,
  Plus,
  ChevronRight,
  ChevronDown,
  Terminal,
  GitBranch,
  Code,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  X,
  Search,
  Trash2,
  Loader,
  CheckCircle,
  AlertCircle,
  Info,
  Database,
  RefreshCw,
  FolderPlus,
  FilePlus,
  Activity,
  User,
  Box
} from 'lucide-react';

const VSCodeEditor = ({ onBack }) => {
  const { user } = useAuth();
  const [activeFile, setActiveFile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(['src']);
  const [activeView, setActiveView] = useState('explorer');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const editorRef = useRef(null);

  // Generate project templates dynamically
  const projectTemplates = generateProjectTemplates();

  // Quick language starters
  const quickLanguages = Object.entries(languageConfigs).map(([id, config]) => ({
    id,
    name: config.name,
    icon: config.icon,
    extension: config.extension,
    executable: config.executable
  }));

  useEffect(() => {
    const savedProjects = localStorage.getItem('vscode-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const createQuickProject = (languageId, projectName = 'QuickStart') => {
    const config = languageConfigs[languageId];
    if (!config) return null;

    return {
      id: Date.now().toString(),
      name: projectName,
      language: languageId,
      files: {
        [`main${config.extension}`]: {
          type: 'file',
          content: config.template(projectName)
        }
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
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

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('vscode-projects', JSON.stringify(updatedProjects));
    setCurrentProject(newProject);
    setShowProjectModal(false);

    const mainFile = template.id === 'javascript' ? 'main.js' : 
                    template.id === 'python' ? 'main.py' : 
                    template.id === 'java' ? 'main.java' : 
                    template.id === 'cpp' ? 'main.cpp' : 'main.js';
    openFile(mainFile);
  };

  const getFileContent = (path) => {
    if (!currentProject) return '';
    
    const parts = path.split('/');
    let current = currentProject.files;
    
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

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const getFileIcon = (fileName, isFolder = false) => {
    if (isFolder) return <Folder className="w-4 h-4 text-blue-400" />;
    
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
      py: <Code className="w-4 h-4 text-green-400" />,
      java: <Code className="w-4 h-4 text-orange-500" />,
      cpp: <Code className="w-4 h-4 text-blue-500" />,
      cs: <Code className="w-4 h-4 text-purple-400" />,
      go: <Code className="w-4 h-4 text-cyan-400" />,
      rs: <Code className="w-4 h-4 text-orange-600" />,
      php: <Code className="w-4 h-4 text-indigo-400" />,
      rb: <Code className="w-4 h-4 text-red-400" />,
      png: <Image className="w-4 h-4 text-purple-400" />,
      jpg: <Image className="w-4 h-4 text-purple-400" />,
      mp3: <Music className="w-4 h-4 text-pink-400" />,
      mp4: <Video className="w-4 h-4 text-red-400" />,
      zip: <Archive className="w-4 h-4 text-gray-400" />
    };
    
    return iconMap[ext] || <File className="w-4 h-4 text-gray-400" />;
  };

  const renderFileTree = (structure, path = '') => {
    if (!structure) return null;
    
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

  const runCode = async () => {
    if (!activeFile) return;
    
    setIsRunning(true);
    const timestamp = Date.now();
    
    const fileExtension = activeFile.split('.').pop().toLowerCase();
    const languageConfig = Object.values(languageConfigs).find(config => 
      config.extension === `.${fileExtension}`
    );
    
    setConsoleOutput(prev => [...prev, {
      type: 'info',
      message: `🚀 Running ${activeFile}${languageConfig ? ` (${languageConfig.name})` : ''}...`,
      timestamp
    }]);

    try {
      const code = getFileContent(activeFile);
      
      if (fileExtension === 'js' || fileExtension === 'jsx') {
        const outputs = [];
        
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ type: 'log', message, timestamp: Date.now() });
          originalLog(...args);
        };
        
        console.error = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ type: 'error', message, timestamp: Date.now() });
          originalError(...args);
        };
        
        console.warn = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ type: 'warning', message, timestamp: Date.now() });
          originalWarn(...args);
        };

        const func = new Function(code);
        await func();
        
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        
        setConsoleOutput(prev => [...prev, ...outputs, {
          type: 'success',
          message: '✅ JavaScript execution completed successfully',
          timestamp: Date.now()
        }]);
      } else {
        const languageInfo = {
          py: { name: 'Python', command: 'python main.py' },
          java: { name: 'Java', command: 'javac Main.java && java Main' },
          cpp: { name: 'C++', command: 'g++ -o main main.cpp && ./main' },
          cs: { name: 'C#', command: 'dotnet run' },
          go: { name: 'Go', command: 'go run main.go' },
          rs: { name: 'Rust', command: 'cargo run' },
          php: { name: 'PHP', command: 'php main.php' },
          rb: { name: 'Ruby', command: 'ruby main.rb' },
          ts: { name: 'TypeScript', command: 'tsc main.ts && node main.js' }
        };
        
        const langInfo = languageInfo[fileExtension];
        if (langInfo) {
          setConsoleOutput(prev => [...prev, {
            type: 'info',
            message: `📝 ${langInfo.name} code ready for execution`,
            timestamp: Date.now()
          }, {
            type: 'info',
            message: `💡 To run: ${langInfo.command}`,
            timestamp: Date.now()
          }]);
        } else {
          setConsoleOutput(prev => [...prev, {
            type: 'warning',
            message: `⚠️ Browser execution not supported for .${fileExtension} files`,
            timestamp: Date.now()
          }]);
        }
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
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
          <div className="flex items-center space-x-3">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-medium">VS Code Editor</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
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
                activeView === view.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                {activeView === 'explorer' && 'Explorer'}
                {activeView === 'search' && 'Search'}
                {activeView === 'git' && 'Source Control'}
                {activeView === 'extensions' && 'Extensions'}
              </h3>
              <div className="flex items-center space-x-1">
                {activeView === 'explorer' && (
                  <>
                    <button
                      onClick={() => setShowProjectModal(true)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      title="New Project"
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                      <FilePlus className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'explorer' && (
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
                    
                    {/* Quick Language Starters */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        Quick Start
                      </h4>
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
                              <div className="text-xs text-gray-400">
                                Create {lang.name.toLowerCase()} file
                                {lang.executable && ' • Executable'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-2 bg-gray-700 rounded">
                      <div className="flex items-center space-x-2 text-sm">
                        <Folder className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">{currentProject.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {currentProject.language || currentProject.template} project
                      </div>
                    </div>
                    {renderFileTree(currentProject.files)}
                  </div>
                )}
              </div>
            )}

            {activeView === 'search' && (
              <div className="p-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Search files..."
                    className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Replace..."
                    className="w-full bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Search
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'git' && (
              <div className="p-4">
                <div className="text-center py-8">
                  <GitBranch className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-sm text-gray-400">No git repository</p>
                </div>
              </div>
            )}

            {activeView === 'extensions' && (
              <div className="p-4">
                <div className="text-center py-8">
                  <Box className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-sm text-gray-400">Extensions marketplace</p>
                </div>
              </div>
            )}
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
                disabled={!activeFile}
                className={`p-1.5 rounded text-sm transition-colors ${
                  !activeFile
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Save className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              {activeFile && (
                <>
                  <span>Ln 1, Col 1</span>
                  <span>•</span>
                  <span>UTF-8</span>
                  <span>•</span>
                  <span>{activeFile.split('.').pop().toUpperCase()}</span>
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
                  className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
                    activeFile === tab 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
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
                  activeFile.endsWith('.ts') || activeFile.endsWith('.tsx') ? 'typescript' :
                  activeFile.endsWith('.py') ? 'python' :
                  activeFile.endsWith('.java') ? 'java' :
                  activeFile.endsWith('.cpp') || activeFile.endsWith('.cc') || activeFile.endsWith('.cxx') ? 'cpp' :
                  activeFile.endsWith('.cs') ? 'csharp' :
                  activeFile.endsWith('.go') ? 'go' :
                  activeFile.endsWith('.rs') ? 'rust' :
                  activeFile.endsWith('.php') ? 'php' :
                  activeFile.endsWith('.rb') ? 'ruby' :
                  activeFile.endsWith('.json') ? 'json' :
                  activeFile.endsWith('.css') ? 'css' :
                  activeFile.endsWith('.html') ? 'html' :
                  activeFile.endsWith('.md') ? 'markdown' : 'plaintext'
                }
                value={getFileContent(activeFile)}
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
              <span className="text-sm font-medium text-white">Terminal</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleOutput([])}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConsole(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
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
                  <p className="text-sm">Terminal output will appear here</p>
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
          {activeFile && <span>{activeFile.split('.').pop().toUpperCase()}</span>}
        </div>
      </div>

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Project</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-white"
              >
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
                    if (projectName) {
                      createProject(template, projectName);
                    }
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

            <div className="flex justify-end space-x-3">
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
    </div>
  );
};

export default VSCodeEditor;