import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, Download, Upload, Copy, Maximize2, Minimize2, Terminal,
  Code, FileText, Folder, Plus, X, RefreshCw, Settings, Smartphone,
  Globe, Server, Package, Eye, EyeOff, Layout, Palette, Zap, Monitor,
  Tablet, Layers, GitBranch, Database, Cloud, Cpu, Wifi, WifiOff,
  Bug, TestTube, Rocket, Box, Wrench, Search, Filter, MoreHorizontal,
  ChevronDown, ChevronRight, FolderOpen, Image, Video, Music, Archive,
  Split, Sidebar, PanelLeft, PanelRight, PanelTop, PanelBottom
} from 'lucide-react';

const AdvancedWebEditor = ({ onBack }) => {
  // Advanced project templates
  const [projectTemplates] = useState([
    {
      id: 'react-ts-advanced',
      name: 'React TypeScript Pro',
      description: 'Advanced React with TypeScript, Tailwind, and modern tooling',
      icon: '⚛️',
      category: 'frontend',
      files: {
        'index.html': {
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React TypeScript Pro</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" data-type="module" src="app.tsx"></script>
</body>
</html>`,
          language: 'html',
          type: 'html'
        },
        'app.tsx': {
          content: `// TypeScript-style React component (browser-compatible)
// Interfaces are for documentation only - removed at runtime

const App = () => {
  // State: { users: [], loading: boolean, error: string | null }
  const [state, setState] = React.useState({
    users: [],
    loading: false,
    error: null
  });

  const [newUser, setNewUser] = React.useState({ name: '', email: '' });

  const fetchUsers = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ];
      
      setState(prev => ({ ...prev, users: mockUsers, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to fetch users' 
      }));
    }
  };

  const addUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: Date.now(),
        name: newUser.name,
        email: newUser.email
      };
      
      setState(prev => ({ 
        ...prev, 
        users: [...prev.users, user] 
      }));
      
      setNewUser({ name: '', email: '' });
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Advanced React TypeScript
          </h1>
          <p className="text-gray-600">Modern web development with type safety</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add User Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New User</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button
                onClick={addUser}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
              <button
                onClick={fetchUsers}
                disabled={state.loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {state.loading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {state.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {state.error}
              </div>
            )}

            <div className="space-y-3">
              {state.users.map((user) => (
                <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
          language: 'typescript',
          type: 'typescript'
        }
      }
    }
  ]);
  // Core editor state
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState('');
  const [theme, setTheme] = useState('vs-dark');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [layout, setLayout] = useState('horizontal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('react-ts-advanced');
  
  // Advanced features state
  const [showDevTools, setShowDevTools] = useState(false);
  const [showNetworkPanel, setShowNetworkPanel] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const [responsiveMode, setResponsiveMode] = useState('desktop');
  const [showLiveReload, setShowLiveReload] = useState(true);
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);
  const [showTypeChecker, setShowTypeChecker] = useState(true);
  const [showLinter, setShowLinter] = useState(true);
  const [showFormatter, setShowFormatter] = useState(true);
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [showDatabasePanel, setShowDatabasePanel] = useState(false);
  const [showAPITester, setShowAPITester] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);
  
  // Terminal and Package Management
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', message: '🚀 Advanced Web IDE Terminal v2.0', timestamp: Date.now() },
    { type: 'system', message: 'Type "help" for available commands', timestamp: Date.now() }
  ]);
  const [installedPackages, setInstalledPackages] = useState([
    { name: 'react', version: '18.2.0', description: 'A JavaScript library for building user interfaces' },
    { name: 'typescript', version: '5.0.0', description: 'TypeScript is a superset of JavaScript' },
    { name: 'tailwindcss', version: '3.3.0', description: 'A utility-first CSS framework' }
  ]);
  const [isInstalling, setIsInstalling] = useState(false);
  
  // User Authorization and Preview Management
  const [previewSessions, setPreviewSessions] = useState(new Map());
  const [authorizedUsers, setAuthorizedUsers] = useState(new Set());
  const [userLimit] = useState(1000000000); // 1 billion users
  const [currentUsers, setCurrentUsers] = useState(0);
  const [previewPermissions, setPreviewPermissions] = useState({
    public: true,
    requireAuth: false,
    allowedDomains: [],
    maxConcurrentUsers: 10000
  });
  
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  // Advanced configurations
  const themes = [
    { value: 'vs-dark', label: 'Dark Pro', icon: '🌙' },
    { value: 'light', label: 'Light Pro', icon: '☀️' },
    { value: 'hc-black', label: 'High Contrast', icon: '🔲' },
    { value: 'monokai', label: 'Monokai Pro', icon: '🎨' },
    { value: 'github-dark', label: 'GitHub Dark', icon: '🐙' },
    { value: 'dracula', label: 'Dracula', icon: '🧛' }
  ];

  const layouts = [
    { value: 'horizontal', label: 'Horizontal Split', icon: '⬌' },
    { value: 'vertical', label: 'Vertical Split', icon: '⬍' },
    { value: 'preview-only', label: 'Preview Only', icon: '👁️' },
    { value: 'editor-only', label: 'Editor Only', icon: '📝' },
    { value: 'grid', label: 'Grid Layout', icon: '⊞' }
  ];

  const responsiveModes = [
    { value: 'desktop', label: 'Desktop', icon: '🖥️', width: '100%', height: '100%' },
    { value: 'laptop', label: 'Laptop', icon: '💻', width: '1366px', height: '768px' },
    { value: 'tablet', label: 'Tablet', icon: '📱', width: '768px', height: '1024px' },
    { value: 'mobile', label: 'Mobile', icon: '📱', width: '375px', height: '667px' },
    { value: 'mobile-large', label: 'Mobile L', icon: '📱', width: '414px', height: '896px' }
  ];

  // Initialize with template
  useEffect(() => {
    const template = projectTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      setFiles(template.files);
      setActiveFile(Object.keys(template.files)[0]);
    }
  }, [selectedTemplate, projectTemplates]);

  // Monaco editor setup with advanced features
  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      declare module 'react' {
        export = React;
        export as namespace React;
        namespace React {
          interface FC<P = {}> {
            (props: P): ReactElement | null;
          }
          interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
            type: T;
            props: P;
            key: Key | null;
          }
          function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
          function useEffect(effect: EffectCallback, deps?: DependencyList): void;
          type Dispatch<A> = (value: A) => void;
          type SetStateAction<S> = S | ((prevState: S) => S);
          type EffectCallback = () => (void | (() => void | undefined));
          type DependencyList = ReadonlyArray<any>;
          type Key = string | number;
          type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
          class Component<P, S> {}
        }
      }
    `, 'react.d.ts');

    // Custom themes
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'function', foreground: 'a6e22e' },
        { token: 'variable', foreground: 'f8f8f2' },
        { token: 'type', foreground: '66d9ef' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#90908a',
        'editor.selectionBackground': '#49483e',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorCursor.foreground': '#f8f8f0',
      }
    });

    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'function', foreground: '50fa7b' },
        { token: 'variable', foreground: 'f8f8f2' },
        { token: 'type', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editorLineNumber.foreground': '#6272a4',
        'editor.selectionBackground': '#44475a',
        'editor.lineHighlightBackground': '#44475a',
        'editorCursor.foreground': '#f8f8f0',
      }
    });

    // Advanced keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => handleSave());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => handleRun());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => openPreviewInNewTab());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => duplicateLine());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => deleteLines());
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => moveLinesUp());
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => moveLinesDown());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => toggleComment());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => formatDocument());
  }, []);

  // Advanced editor actions
  const duplicateLine = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.copyLinesDownAction', {});
    }
  };

  const deleteLines = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.deleteLines', {});
    }
  };

  const moveLinesUp = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.moveLinesUpAction', {});
    }
  };

  const moveLinesDown = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.moveLinesDownAction', {});
    }
  };

  const toggleComment = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.commentLine', {});
    }
  };

  const formatDocument = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.trigger('keyboard', 'editor.action.formatDocument', {});
    }
  };

  // Terminal Command Processing
  const processTerminalCommand = (command) => {
    const cmd = command.trim().toLowerCase();
    const args = command.trim().split(' ');
    const timestamp = Date.now();
    
    // Add command to history
    setTerminalHistory(prev => [...prev, command]);
    
    // Add command to output
    setTerminalOutput(prev => [...prev, {
      type: 'command',
      message: `$ ${command}`,
      timestamp
    }]);

    // Process different commands
    if (cmd === 'help') {
      setTerminalOutput(prev => [...prev, {
        type: 'info',
        message: `Available commands:
  npm install <package>  - Install npm package
  npm i <package>       - Install npm package (short)
  npm list             - List installed packages
  npm uninstall <pkg>  - Remove package
  clear                - Clear terminal
  ls                   - List files
  pwd                  - Show current directory
  help                 - Show this help`,
        timestamp: timestamp + 1
      }]);
    } else if (cmd === 'clear') {
      setTerminalOutput([{
        type: 'system',
        message: '🚀 Advanced Web IDE Terminal v2.0',
        timestamp
      }]);
    } else if (cmd === 'ls') {
      const fileList = Object.keys(files).join('  ');
      setTerminalOutput(prev => [...prev, {
        type: 'success',
        message: fileList || 'No files in current directory',
        timestamp: timestamp + 1
      }]);
    } else if (cmd === 'pwd') {
      setTerminalOutput(prev => [...prev, {
        type: 'info',
        message: '/workspace/advanced-web-project',
        timestamp: timestamp + 1
      }]);
    } else if (cmd.startsWith('npm install') || cmd.startsWith('npm i')) {
      const packageName = args[args.length - 1];
      if (packageName && packageName !== 'install' && packageName !== 'i') {
        installPackage(packageName);
      } else {
        setTerminalOutput(prev => [...prev, {
          type: 'error',
          message: 'Usage: npm install <package-name>',
          timestamp: timestamp + 1
        }]);
      }
    } else if (cmd === 'npm list' || cmd === 'npm ls') {
      const packageList = installedPackages.map(pkg => 
        `${pkg.name}@${pkg.version} - ${pkg.description}`
      ).join('\n');
      setTerminalOutput(prev => [...prev, {
        type: 'info',
        message: `Installed packages:\n${packageList}`,
        timestamp: timestamp + 1
      }]);
    } else if (cmd.startsWith('npm uninstall')) {
      const packageName = args[2];
      if (packageName) {
        uninstallPackage(packageName);
      } else {
        setTerminalOutput(prev => [...prev, {
          type: 'error',
          message: 'Usage: npm uninstall <package-name>',
          timestamp: timestamp + 1
        }]);
      }
    } else {
      setTerminalOutput(prev => [...prev, {
        type: 'error',
        message: `Command not found: ${args[0]}. Type 'help' for available commands.`,
        timestamp: timestamp + 1
      }]);
    }
  };

  // Package Installation Simulation
  const installPackage = async (packageName) => {
    setIsInstalling(true);
    const timestamp = Date.now();
    
    setTerminalOutput(prev => [...prev, {
      type: 'info',
      message: `📦 Installing ${packageName}...`,
      timestamp
    }]);

    // Simulate installation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock package data
    const mockPackages = {
      'lodash': { version: '4.17.21', description: 'A modern JavaScript utility library' },
      'axios': { version: '1.4.0', description: 'Promise based HTTP client for the browser and node.js' },
      'moment': { version: '2.29.4', description: 'Parse, validate, manipulate, and display dates' },
      'uuid': { version: '9.0.0', description: 'RFC4122 (v1, v4, and v5) UUIDs' },
      'express': { version: '4.18.2', description: 'Fast, unopinionated, minimalist web framework' },
      'socket.io': { version: '4.7.1', description: 'Real-time bidirectional event-based communication' },
      'three': { version: '0.153.0', description: '3D library for JavaScript' },
      'chart.js': { version: '4.3.0', description: 'Simple yet flexible JavaScript charting' },
      'framer-motion': { version: '10.12.16', description: 'A production-ready motion library for React' },
      'styled-components': { version: '6.0.0', description: 'CSS-in-JS library for styling React components' }
    };

    const packageInfo = mockPackages[packageName] || {
      version: '1.0.0',
      description: `${packageName} package`
    };

    // Check if already installed
    if (installedPackages.find(pkg => pkg.name === packageName)) {
      setTerminalOutput(prev => [...prev, {
        type: 'warning',
        message: `⚠️ ${packageName} is already installed`,
        timestamp: timestamp + 2000
      }]);
    } else {
      // Add to installed packages
      setInstalledPackages(prev => [...prev, {
        name: packageName,
        ...packageInfo
      }]);

      setTerminalOutput(prev => [...prev, {
        type: 'success',
        message: `✅ Successfully installed ${packageName}@${packageInfo.version}`,
        timestamp: timestamp + 2000
      }]);

      // Update package.json file if it exists
      if (files['package.json']) {
        try {
          const packageJson = JSON.parse(files['package.json'].content);
          packageJson.dependencies = packageJson.dependencies || {};
          packageJson.dependencies[packageName] = `^${packageInfo.version}`;
          
          setFiles(prev => ({
            ...prev,
            'package.json': {
              ...prev['package.json'],
              content: JSON.stringify(packageJson, null, 2)
            }
          }));
        } catch (error) {
          console.error('Error updating package.json:', error);
        }
      }
    }

    setIsInstalling(false);
  };

  // Package Uninstallation
  const uninstallPackage = (packageName) => {
    const packageExists = installedPackages.find(pkg => pkg.name === packageName);
    
    if (packageExists) {
      setInstalledPackages(prev => prev.filter(pkg => pkg.name !== packageName));
      setTerminalOutput(prev => [...prev, {
        type: 'success',
        message: `✅ Successfully uninstalled ${packageName}`,
        timestamp: Date.now()
      }]);
    } else {
      setTerminalOutput(prev => [...prev, {
        type: 'error',
        message: `❌ Package ${packageName} is not installed`,
        timestamp: Date.now()
      }]);
    }
  };

  // User Authorization Management
  const authorizeUser = (userId) => {
    if (currentUsers >= userLimit) {
      return { success: false, message: 'User limit reached' };
    }
    
    setAuthorizedUsers(prev => new Set([...prev, userId]));
    setCurrentUsers(prev => prev + 1);
    
    return { success: true, message: 'User authorized successfully' };
  };

  const deauthorizeUser = (userId) => {
    setAuthorizedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    setCurrentUsers(prev => Math.max(0, prev - 1));
  };

  // Preview Session Management
  const createPreviewSession = (userId) => {
    if (!previewPermissions.public && !authorizedUsers.has(userId)) {
      return { success: false, message: 'Unauthorized access' };
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      previewUrl: previewUrl
    };

    setPreviewSessions(prev => new Map([...prev, [sessionId, session]]));
    
    return { success: true, sessionId, session };
  };

  // Handle terminal input
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (terminalInput.trim()) {
      processTerminalCommand(terminalInput);
      setTerminalInput('');
    }
  };
  // Advanced preview generation with hot reload
  const generatePreview = useCallback(() => {
    const htmlFile = files['index.html'];
    const cssFile = files['style.css'];
    const jsFile = files['script.js'] || files['app.js'] || files['app.tsx'] || files['main.js'];
    
    if (!htmlFile) {
      setConsoleOutput(prev => [...prev, { 
        type: 'error', 
        message: '❌ No HTML file found', 
        timestamp: Date.now() 
      }]);
      return;
    }

    let htmlContent = htmlFile.content;
    
    // Inject CSS
    if (cssFile) {
      htmlContent = htmlContent.replace(
        /<link[^>]*href="style\.css"[^>]*>/g,
        `<style>${cssFile.content}</style>`
      );
    }
    
    // Inject JavaScript/TypeScript - Handle multiple possible script references
    if (jsFile) {
      // Replace various script tag patterns
      const scriptPatterns = [
        /<script[^>]*src="app\.tsx"[^>]*><\/script>/g,
        /<script[^>]*src="app\.js"[^>]*><\/script>/g,
        /<script[^>]*src="script\.js"[^>]*><\/script>/g,
        /<script[^>]*src="main\.js"[^>]*><\/script>/g
      ];
      
      let scriptReplaced = false;
      scriptPatterns.forEach(pattern => {
        if (htmlContent.match(pattern)) {
          htmlContent = htmlContent.replace(
            pattern,
            `<script type="text/babel" data-type="module">${jsFile.content}</script>`
          );
          scriptReplaced = true;
        }
      });
      
      // If no script tag found, append to body
      if (!scriptReplaced) {
        htmlContent = htmlContent.replace(
          '</body>',
          `<script type="text/babel" data-type="module">${jsFile.content}</script>\n</body>`
        );
      }
    }
    
    // Add advanced error boundary and development tools
    if (showErrorOverlay) {
      htmlContent = htmlContent.replace(
        '</head>',
        `<style>
          .error-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            color: white;
            padding: 20px;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            z-index: 9999;
            overflow: auto;
            backdrop-filter: blur(10px);
          }
          .error-overlay h3 {
            color: #ff6b6b;
            margin-bottom: 15px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .error-details {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #ff6b6b;
          }
          .error-stack {
            background: rgba(0,0,0,0.5);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            max-height: 300px;
            overflow-y: auto;
            font-size: 0.9rem;
            line-height: 1.4;
          }
          .error-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }
          .error-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
          }
          .error-btn-close {
            background: #ff6b6b;
            color: white;
          }
          .error-btn-close:hover {
            background: #ff5252;
            transform: translateY(-1px);
          }
          .error-btn-copy {
            background: #4dabf7;
            color: white;
          }
          .error-btn-copy:hover {
            background: #339af0;
            transform: translateY(-1px);
          }
          .error-suggestions {
            background: rgba(74, 222, 128, 0.1);
            border: 1px solid rgba(74, 222, 128, 0.3);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .error-suggestions h4 {
            color: #4ade80;
            margin-bottom: 10px;
          }
          .error-suggestions ul {
            margin: 0;
            padding-left: 20px;
          }
          .error-suggestions li {
            margin: 5px 0;
            color: #e5e7eb;
          }
        </style>
        <script>
          // Advanced error handling with suggestions
          const errorSuggestions = {
            'Cannot read property': [
              'Check if the object exists before accessing properties',
              'Use optional chaining: obj?.property',
              'Add null/undefined checks',
              'Verify API response structure'
            ],
            'is not a function': [
              'Check if the variable is actually a function',
              'Verify import/export statements',
              'Check for typos in function names',
              'Ensure the function is defined before calling'
            ],
            'Unexpected token': [
              'Check for syntax errors (missing brackets, commas)',
              'Verify JSON format if parsing JSON',
              'Check for unclosed strings or comments',
              'Validate JSX syntax'
            ],
            'Network Error': [
              'Check internet connection',
              'Verify API endpoint URL',
              'Check CORS settings',
              'Verify server is running'
            ]
          };

          function getSuggestions(errorMessage) {
            for (const [key, suggestions] of Object.entries(errorSuggestions)) {
              if (errorMessage.includes(key)) {
                return suggestions;
              }
            }
            return [
              'Check the console for more details',
              'Review recent code changes',
              'Verify all dependencies are loaded',
              'Check browser compatibility'
            ];
          }

          function copyErrorToClipboard(errorInfo) {
            const errorText = \`Error Report:
Message: \${errorInfo.message}
File: \${errorInfo.filename}
Line: \${errorInfo.lineno}:\${errorInfo.colno}
Stack: \${errorInfo.stack}
Timestamp: \${new Date().toISOString()}
User Agent: \${navigator.userAgent}\`;
            
            navigator.clipboard.writeText(errorText).then(() => {
              alert('Error details copied to clipboard!');
            });
          }

          window.addEventListener('error', function(e) {
            // Filter out generic cross-origin "Script error" messages
            // These are browser security messages, not actual code errors
            if (e.message === 'Script error.' && e.lineno === 0 && e.colno === 0) {
              return; // Ignore cross-origin script errors
            }
            
            // Also ignore if no meaningful error information
            if (!e.message || e.message === 'Script error.') {
              return;
            }

            const suggestions = getSuggestions(e.message);
            const overlay = document.createElement('div');
            overlay.className = 'error-overlay';
            overlay.innerHTML = \`
              <h3>🚨 Runtime Error Detected</h3>
              
              <div class="error-details">
                <p><strong>💬 Message:</strong> \${e.message}</p>
                <p><strong>📁 File:</strong> \${e.filename || 'Unknown'}</p>
                <p><strong>📍 Location:</strong> Line \${e.lineno}, Column \${e.colno}</p>
                <p><strong>🕐 Time:</strong> \${new Date().toLocaleTimeString()}</p>
              </div>

              <div class="error-suggestions">
                <h4>💡 Suggested Solutions:</h4>
                <ul>
                  \${suggestions.map(suggestion => \`<li>\${suggestion}</li>\`).join('')}
                </ul>
              </div>

              <div class="error-stack">
                <strong>📋 Stack Trace:</strong><br>
                <pre>\${e.error ? e.error.stack : 'No stack trace available'}</pre>
              </div>

              <div class="error-actions">
                <button class="error-btn error-btn-close" onclick="this.closest('.error-overlay').remove()">
                  ✕ Close
                </button>
                <button class="error-btn error-btn-copy" onclick="copyErrorToClipboard({
                  message: '\${e.message}',
                  filename: '\${e.filename}',
                  lineno: '\${e.lineno}',
                  colno: '\${e.colno}',
                  stack: '\${e.error ? e.error.stack.replace(/'/g, "\\\\'") : 'No stack trace'}'
                })">
                  📋 Copy Error Details
                </button>
              </div>
            \`;
            document.body.appendChild(overlay);

            // Log to console with enhanced details
            console.group('🚨 Runtime Error Details');
            console.error('Message:', e.message);
            console.error('Location:', e.filename, 'Line:', e.lineno, 'Column:', e.colno);
            console.error('Stack:', e.error?.stack);
            console.error('Suggestions:', suggestions);
            console.groupEnd();
          });

          // Enhanced unhandled promise rejection handling
          window.addEventListener('unhandledrejection', function(e) {
            console.group('🚨 Unhandled Promise Rejection');
            console.error('Reason:', e.reason);
            console.error('Promise:', e.promise);
            console.groupEnd();

            const overlay = document.createElement('div');
            overlay.className = 'error-overlay';
            overlay.innerHTML = \`
              <h3>⚠️ Unhandled Promise Rejection</h3>
              
              <div class="error-details">
                <p><strong>💬 Reason:</strong> \${e.reason}</p>
                <p><strong>🕐 Time:</strong> \${new Date().toLocaleTimeString()}</p>
              </div>

              <div class="error-suggestions">
                <h4>💡 Suggested Solutions:</h4>
                <ul>
                  <li>Add .catch() handlers to your promises</li>
                  <li>Use try-catch with async/await</li>
                  <li>Check API endpoints and network connectivity</li>
                  <li>Verify async function implementations</li>
                </ul>
              </div>

              <div class="error-actions">
                <button class="error-btn error-btn-close" onclick="this.closest('.error-overlay').remove()">
                  ✕ Close
                </button>
              </div>
            \`;
            document.body.appendChild(overlay);
          });

          // Performance monitoring
          if (window.performance && window.performance.mark) {
            window.performance.mark('app-start');
            
            window.addEventListener('load', function() {
              window.performance.mark('app-loaded');
              window.performance.measure('app-load-time', 'app-start', 'app-loaded');
              
              const measure = window.performance.getEntriesByName('app-load-time')[0];
              if (measure.duration > 3000) {
                console.warn('⚠️ Slow app load time:', measure.duration + 'ms');
              }
            });
          }
        </script>
        </head>`
      );
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    
    setConsoleOutput(prev => [...prev, { 
      type: 'success', 
      message: '✅ Preview updated with hot reload!', 
      timestamp: Date.now() 
    }]);
  }, [files, showErrorOverlay]);

  // Auto-generate preview with debounce
  useEffect(() => {
    if (!showLiveReload) return;
    
    const timer = setTimeout(() => {
      generatePreview();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [files, generatePreview, showLiveReload]);

  // Initial preview generation
  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const handleRun = () => {
    setIsExecuting(true);
    generatePreview();
    
    // Run linting and type checking
    if (showLinter || showTypeChecker) {
      runCodeAnalysis();
    }
    
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: `🚀 Running ${activeFile}...`, 
      timestamp: Date.now() 
    }]);
    
    setTimeout(() => setIsExecuting(false), 1000);
  };

  const runCodeAnalysis = () => {
    const currentFile = files[activeFile];
    if (!currentFile) return;

    // Simulate linting
    if (showLinter) {
      const issues = [];
      const lines = currentFile.content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('console.log')) {
          issues.push({
            line: index + 1,
            message: 'Consider removing console.log statements',
            severity: 'warning'
          });
        }
        if (line.includes('var ')) {
          issues.push({
            line: index + 1,
            message: 'Use const or let instead of var',
            severity: 'error'
          });
        }
      });

      if (issues.length > 0) {
        setConsoleOutput(prev => [...prev, { 
          type: 'warning', 
          message: `⚠️ Linting found ${issues.length} issues`, 
          timestamp: Date.now() 
        }]);
      } else {
        setConsoleOutput(prev => [...prev, { 
          type: 'success', 
          message: '✅ No linting issues found', 
          timestamp: Date.now() 
        }]);
      }
    }

    // Simulate type checking for TypeScript
    if (showTypeChecker && (currentFile.language === 'typescript' || activeFile.endsWith('.tsx'))) {
      setConsoleOutput(prev => [...prev, { 
        type: 'info', 
        message: '🔍 TypeScript type checking passed', 
        timestamp: Date.now() 
      }]);
    }
  };

  const handleSave = () => {
    const blob = new Blob([files[activeFile].content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
    
    setConsoleOutput(prev => [...prev, { 
      type: 'success', 
      message: `💾 File saved: ${activeFile}`, 
      timestamp: Date.now() 
    }]);
  };

  const openPreviewInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
      setConsoleOutput(prev => [...prev, { 
        type: 'success', 
        message: '🌐 Preview opened in new tab!', 
        timestamp: Date.now() 
      }]);
    }
  };

  const addNewFile = () => {
    const fileName = prompt('Enter file name (e.g., component.tsx, utils.js, styles.css):');
    if (fileName && !files[fileName]) {
      const extension = fileName.split('.').pop();
      let language = 'plaintext';
      let content = '';
      
      switch (extension) {
        case 'html':
          language = 'html';
          content = '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>';
          break;
        case 'css':
          language = 'css';
          content = '/* Add your styles here */\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}';
          break;
        case 'js':
          language = 'javascript';
          content = '// Add your JavaScript here\nconsole.log("Hello World!");';
          break;
        case 'jsx':
          language = 'javascriptreact';
          content = 'import React from "react";\n\nconst Component = () => {\n    return <div>Hello World!</div>;\n};\n\nexport default Component;';
          break;
        case 'ts':
          language = 'typescript';
          content = '// Add your TypeScript here\ninterface User {\n    id: number;\n    name: string;\n}\n\nconst user: User = {\n    id: 1,\n    name: "John Doe"\n};';
          break;
        case 'tsx':
          language = 'typescript';
          content = 'import React from "react";\n\ninterface Props {\n    title: string;\n}\n\nconst Component: React.FC<Props> = ({ title }) => {\n    return <div>{title}</div>;\n};\n\nexport default Component;';
          break;
        case 'json':
          language = 'json';
          content = '{\n    "name": "new-file",\n    "version": "1.0.0"\n}';
          break;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileName]: { content, language, type: extension }
      }));
      setActiveFile(fileName);
    }
  };

  const deleteFile = (fileName) => {
    if (Object.keys(files).length > 1) {
      const newFiles = { ...files };
      delete newFiles[fileName];
      setFiles(newFiles);
      
      if (activeFile === fileName) {
        setActiveFile(Object.keys(newFiles)[0]);
      }
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'js': return '⚡';
      case 'jsx': return '⚛️';
      case 'tsx': return '🔷';
      case 'ts': return '🔵';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'svg': return '🖼️';
      case 'png': case 'jpg': case 'jpeg': case 'gif': return '🖼️';
      case 'mp4': case 'webm': return '🎥';
      case 'mp3': case 'wav': return '🎵';
      case 'zip': case 'tar': case 'gz': return '📦';
      default: return '📄';
    }
  };

  const toggleLayout = () => {
    const layoutOrder = ['horizontal', 'vertical', 'preview-only', 'editor-only', 'grid'];
    const currentIndex = layoutOrder.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layoutOrder.length;
    setLayout(layoutOrder[nextIndex]);
  };

  const exportProject = () => {
    const projectData = {
      name: 'advanced-web-project',
      files: files,
      settings: {
        theme,
        layout,
        responsiveMode
      },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    a.click();
    URL.revokeObjectURL(url);
    
    setConsoleOutput(prev => [...prev, { 
      type: 'success', 
      message: '📦 Project exported successfully!', 
      timestamp: Date.now() 
    }]);
  };

  const importProject = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const projectData = JSON.parse(e.target.result);
          setFiles(projectData.files);
          setActiveFile(Object.keys(projectData.files)[0]);
          
          if (projectData.settings) {
            setTheme(projectData.settings.theme || 'vs-dark');
            setLayout(projectData.settings.layout || 'horizontal');
            setResponsiveMode(projectData.settings.responsiveMode || 'desktop');
          }
          
          setConsoleOutput(prev => [...prev, { 
            type: 'success', 
            message: '📁 Project imported successfully!', 
            timestamp: Date.now() 
          }]);
        } catch (error) {
          setConsoleOutput(prev => [...prev, { 
            type: 'error', 
            message: '❌ Failed to import project: Invalid JSON', 
            timestamp: Date.now() 
          }]);
        }
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className={`h-screen bg-gray-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Advanced Header */}
      <div className="bg-gray-800 border-gray-700 border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Code className="w-4 h-4" />
                <span className="text-sm">← Back</span>
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Advanced Web IDE
                </h1>
                <p className="text-xs text-gray-400">Professional web development environment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Template Selector */}
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              {projectTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.icon} {template.name}
                </option>
              ))}
            </select>

            {/* Theme Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>

            {/* Responsive Mode */}
            <select
              value={responsiveMode}
              onChange={(e) => setResponsiveMode(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              {responsiveModes.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.icon} {mode.label}
                </option>
              ))}
            </select>

            {/* Layout Toggle */}
            <button
              onClick={toggleLayout}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              title={`Current: ${layout}`}
            >
              <Layout size={16} />
              <span className="hidden sm:inline">{layouts.find(l => l.value === layout)?.icon}</span>
            </button>

            {/* Advanced Tools */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowDevTools(!showDevTools)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  showDevTools ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title="Developer Tools"
              >
                <Wrench size={16} />
              </button>

              <button
                onClick={() => setShowLiveReload(!showLiveReload)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  showLiveReload ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title="Live Reload"
              >
                {showLiveReload ? <Wifi size={16} /> : <WifiOff size={16} />}
              </button>

              <button
                onClick={() => setShowGitPanel(!showGitPanel)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  showGitPanel ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title="Git Panel"
              >
                <GitBranch size={16} />
              </button>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRun}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              disabled={isExecuting}
            >
              {isExecuting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
              <span>Run</span>
            </button>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                showPreview 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Export/Import */}
            <div className="flex items-center space-x-1">
              <button
                onClick={exportProject}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                title="Export Project"
              >
                <Download size={16} />
              </button>

              <label className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors cursor-pointer" title="Import Project">
                <Upload size={16} />
                <input
                  type="file"
                  accept=".json"
                  onChange={importProject}
                  className="hidden"
                />
              </label>
            </div>

            {/* New Tab */}
            <button
              onClick={openPreviewInNewTab}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              title="Open in new tab (Ctrl+Shift+Enter)"
            >
              <Globe size={16} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Developer Tools Panel */}
      {showDevTools && (
        <div className="bg-gray-800 border-gray-700 border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200">Developer Tools</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTypeChecker(!showTypeChecker)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showTypeChecker ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setShowLinter(!showLinter)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showLinter ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Linter
              </button>
              <button
                onClick={() => setShowFormatter(!showFormatter)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showFormatter ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Formatter
              </button>
              <button
                onClick={() => setShowErrorOverlay(!showErrorOverlay)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showErrorOverlay ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Error Overlay
              </button>
              <button
                onClick={() => setShowNetworkPanel(!showNetworkPanel)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showNetworkPanel ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setShowPerformancePanel(!showPerformancePanel)}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  showPerformancePanel ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Performance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Advanced File Explorer */}
        {showFileExplorer && layout !== 'preview-only' && (
          <div className="w-80 bg-gray-800 border-gray-700 border-r flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-200">Project Explorer</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={addNewFile}
                    className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                    title="Add new file"
                  >
                    <Plus size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => setShowFileExplorer(false)}
                    className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                    title="Hide explorer"
                  >
                    <PanelLeft size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <div className="mb-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                    <FolderOpen size={14} />
                    <span>Files ({Object.keys(files).length})</span>
                  </div>
                  {Object.keys(files).map(fileName => (
                    <div
                      key={fileName}
                      className={`group flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-md transition-colors ${
                        activeFile === fileName ? 'bg-gray-700 border-l-2 border-purple-500' : ''
                      }`}
                      onClick={() => setActiveFile(fileName)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getFileIcon(fileName)}</span>
                        <div>
                          <span className="text-sm text-gray-200">{fileName}</span>
                          <div className="text-xs text-gray-500">
                            {files[fileName]?.language}
                          </div>
                        </div>
                      </div>
                      {Object.keys(files).length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(fileName);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor and Preview Area */}
        <div className="flex-1 flex flex-col">
          {layout === 'preview-only' ? (
            /* Preview Only Mode */
            <div className="flex-1 bg-white">
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-200">Live Preview</span>
                      <span className="text-xs text-gray-400">({responsiveMode})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={generatePreview}
                        className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                        title="Refresh Preview"
                      >
                        <RefreshCw size={14} className="text-gray-400" />
                      </button>
                      <button
                        onClick={openPreviewInNewTab}
                        className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                        title="Open in New Tab"
                      >
                        <Globe size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                  {previewUrl ? (
                    <div 
                      className="bg-white shadow-2xl rounded-lg overflow-hidden"
                      style={{
                        width: responsiveModes.find(m => m.value === responsiveMode)?.width || '100%',
                        height: responsiveModes.find(m => m.value === responsiveMode)?.height || '100%',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                    >
                      <iframe
                        ref={previewRef}
                        src={previewUrl}
                        className="w-full h-full border-none"
                        title="Live Preview"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <Eye size={40} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No Preview Available</p>
                      <p className="text-sm">Edit your code to see the preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : layout === 'editor-only' ? (
            /* Editor Only Mode */
            <div className="flex-1 flex flex-col">
              {/* Editor Toolbar */}
              <div className="bg-gray-800 border-gray-700 border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getFileIcon(activeFile)}</span>
                    <span className="font-medium text-gray-200">{activeFile}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                      {files[activeFile]?.language}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={formatDocument}
                      className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      <Palette size={14} />
                      <span>Format</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      <Save size={14} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={files[activeFile]?.language || 'javascript'}
                  value={files[activeFile]?.content || ''}
                  theme={theme}
                  onChange={(value) => {
                    setFiles(prev => ({
                      ...prev,
                      [activeFile]: {
                        ...prev[activeFile],
                        content: value || ''
                      }
                    }));
                  }}
                  onMount={handleEditorDidMount}
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
                    bracketPairColorization: { enabled: true },
                    suggest: { showKeywords: true, showSnippets: true },
                    quickSuggestions: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    renderWhitespace: 'selection',
                    folding: true,
                    foldingStrategy: 'indentation',
                    showFoldingControls: 'always',
                    unfoldOnClickAfterEndOfLine: true,
                    contextmenu: true,
                    mouseWheelZoom: true,
                    multiCursorModifier: 'ctrlCmd',
                    accessibilitySupport: 'auto',
                  }}
                />
              </div>
            </div>
          ) : (
            /* Split Layout Mode */
            <div className={`flex-1 flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'}`}>
              {/* Editor Panel */}
              <div className={`${showPreview ? (layout === 'vertical' ? 'h-1/2' : 'w-1/2') : 'w-full h-full'} flex flex-col`}>
                {/* Editor Toolbar */}
                <div className="bg-gray-800 border-gray-700 border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFileIcon(activeFile)}</span>
                      <span className="font-medium text-gray-200">{activeFile}</span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                        {files[activeFile]?.language}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={formatDocument}
                        className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                      >
                        <Palette size={14} />
                        <span>Format</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                      >
                        <Save size={14} />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={files[activeFile]?.language || 'javascript'}
                    value={files[activeFile]?.content || ''}
                    theme={theme}
                    onChange={(value) => {
                      setFiles(prev => ({
                        ...prev,
                        [activeFile]: {
                          ...prev[activeFile],
                          content: value || ''
                        }
                      }));
                    }}
                    onMount={handleEditorDidMount}
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
                      bracketPairColorization: { enabled: true },
                      suggest: { showKeywords: true, showSnippets: true },
                      quickSuggestions: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                      renderWhitespace: 'selection',
                      folding: true,
                      foldingStrategy: 'indentation',
                      showFoldingControls: 'always',
                      unfoldOnClickAfterEndOfLine: true,
                      contextmenu: true,
                      mouseWheelZoom: true,
                      multiCursorModifier: 'ctrlCmd',
                      accessibilitySupport: 'auto',
                    }}
                  />
                </div>
              </div>

              {/* Live Preview Panel */}
              {showPreview && (
                <div className={`${layout === 'vertical' ? 'h-1/2 border-t' : 'w-1/2 border-l'} border-gray-700 bg-white flex flex-col`}>
                  <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-200">Live Preview</span>
                        <span className="text-xs text-gray-400">({responsiveMode})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={generatePreview}
                          className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                          title="Refresh Preview"
                        >
                          <RefreshCw size={14} className="text-gray-400" />
                        </button>
                        <button
                          onClick={openPreviewInNewTab}
                          className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                          title="Open in New Tab"
                        >
                          <Globe size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center bg-gray-100">
                    {previewUrl ? (
                      <div 
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                        style={{
                          width: responsiveMode === 'desktop' ? '100%' : responsiveModes.find(m => m.value === responsiveMode)?.width || '100%',
                          height: responsiveMode === 'desktop' ? '100%' : responsiveModes.find(m => m.value === responsiveMode)?.height || '100%',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      >
                        <iframe
                          ref={previewRef}
                          src={previewUrl}
                          className="w-full h-full border-none"
                          title="Live Preview"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                          <Zap size={32} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">Building Preview...</p>
                        <p className="text-sm text-gray-500">Your code will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Advanced Console with Terminal */}
          {showConsole && layout !== 'preview-only' && (
            <div className="h-80 bg-gray-900 border-gray-700 border-t flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Terminal size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-200">Terminal & Console</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowTerminal(!showTerminal)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        showTerminal ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Terminal
                    </button>
                    <button
                      onClick={() => setShowNetworkPanel(!showNetworkPanel)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        showNetworkPanel ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Network
                    </button>
                    <button
                      onClick={() => setShowPerformancePanel(!showPerformancePanel)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        showPerformancePanel ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Performance
                    </button>
                    <button
                      onClick={() => setShowPackageManager(!showPackageManager)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        showPackageManager ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Packages
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    Users: {currentUsers.toLocaleString()}/{userLimit.toLocaleString()}
                  </div>
                  <button
                    onClick={() => {
                      setConsoleOutput([]);
                      setTerminalOutput([{
                        type: 'system',
                        message: '🚀 Advanced Web IDE Terminal v2.0',
                        timestamp: Date.now()
                      }]);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowConsole(false)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex">
                {/* Terminal Section */}
                {showTerminal && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-950">
                      {/* Terminal Output */}
                      {terminalOutput.map((output, index) => (
                        <div key={index} className={`mb-1 flex items-start space-x-2 ${
                          output.type === 'error' ? 'text-red-400' :
                          output.type === 'success' ? 'text-green-400' :
                          output.type === 'warning' ? 'text-yellow-400' :
                          output.type === 'command' ? 'text-blue-400' :
                          output.type === 'system' ? 'text-purple-400' :
                          'text-gray-300'
                        }`}>
                          <span className="text-gray-500 text-xs mt-0.5 min-w-[60px]">
                            {new Date(output.timestamp).toLocaleTimeString()}
                          </span>
                          <pre className="flex-1 whitespace-pre-wrap">{output.message}</pre>
                        </div>
                      ))}
                      
                      {/* Loading indicator for npm install */}
                      {isInstalling && (
                        <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                          <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                          <span>Installing package...</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Terminal Input */}
                    <form onSubmit={handleTerminalSubmit} className="border-t border-gray-700 p-3 bg-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-mono">$</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type command (try: npm install lodash)"
                          className="flex-1 bg-transparent text-white font-mono focus:outline-none"
                          disabled={isInstalling}
                        />
                        <button
                          type="submit"
                          disabled={isInstalling || !terminalInput.trim()}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          Run
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Package Manager Panel */}
                {showPackageManager && (
                  <div className="w-80 border-l border-gray-700 bg-gray-900">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-200 mb-3">Package Manager</h3>
                      <div className="text-xs text-gray-400 mb-2">
                        Installed: {installedPackages.length} packages
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {installedPackages.map((pkg, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">{pkg.name}</span>
                              <span className="text-xs text-gray-400">v{pkg.version}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{pkg.description}</p>
                            <button
                              onClick={() => uninstallPackage(pkg.name)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Uninstall
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Console Output Section */}
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm border-l border-gray-700">
                  <div className="mb-2 text-xs text-gray-400 border-b border-gray-700 pb-2">
                    Console Output & Logs
                  </div>
                  {consoleOutput.map((output, index) => (
                    <div key={index} className={`mb-2 flex items-start space-x-2 ${
                      output.type === 'error' ? 'text-red-400' :
                      output.type === 'success' ? 'text-green-400' :
                      output.type === 'warning' ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}>
                      <span className="text-gray-500 text-xs mt-0.5 min-w-[60px]">
                        {new Date(output.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="flex-1">{output.message}</span>
                    </div>
                  ))}
                  {consoleOutput.length === 0 && (
                    <div className="text-gray-500 text-center py-4">
                      <p>Console output will appear here...</p>
                      <p className="text-xs mt-1">Run your code to see logs and errors</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Console Toggle (when hidden) */}
      {!showConsole && layout !== 'preview-only' && (
        <button
          onClick={() => setShowConsole(true)}
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Show Console"
        >
          <Terminal size={20} />
        </button>
      )}

      {/* File Explorer Toggle (when hidden) */}
      {!showFileExplorer && layout !== 'preview-only' && (
        <button
          onClick={() => setShowFileExplorer(true)}
          className="fixed bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Show File Explorer"
        >
          <Folder size={20} />
        </button>
      )}
    </div>
  );
};

export default AdvancedWebEditor;