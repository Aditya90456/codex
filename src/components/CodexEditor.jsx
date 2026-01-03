import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import WelcomeScreen from './WelcomeScreen';
import ClerkAuthModal from './Auth/ClerkAuthModal';
import ClerkDebug from './Debug/ClerkDebug';
import TestCaseDemo from './TestCaseDemo';
import IDEDemo from './IDEDemo';
import IDEOutput from './IDEOutput';
import Dashboard from './Dashboard';
import { useAuth } from '../contexts/ClerkAuthContext';
import { 
  Play, 
  Save, 
  Copy,
  Maximize2,
  Minimize2,
  Terminal,
  Code,
  User,
  LogOut,
  FileText,
  RotateCcw,
  BarChart3
} from 'lucide-react';

const CodexEditor = () => {
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showTestDemo, setShowTestDemo] = useState(false);
  const [showIDEDemo, setShowIDEDemo] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [code, setCode] = useState(`// Welcome to Codex - Professional Code Editor
// TUF+ Inspired Design for Competitive Programming

function solveProblem() {
    // Your solution here
    console.log("Ready to code!");
}

// Example: Two Sum Problem
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}

// Test the solution
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log("Happy coding! 🚀");
`);
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);
  const consoleRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍' },
    { value: 'java', label: 'Java', ext: '.java', icon: '☕' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐' },
    { value: 'css', label: 'CSS', ext: '.css', icon: '🎨' },
    { value: 'json', label: 'JSON', ext: '.json', icon: '📋' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'hc-black', label: 'High Contrast', icon: '⚫' },
  ];

  const handleShowAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  // Auto-scroll console to bottom when new output is added
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleCreateNew = (selectedLanguage = 'javascript') => {
    setShowWelcome(false);
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
      const langObj = languages.find(l => l.value === selectedLanguage);
      if (langObj) {
        setFileName(`solution${langObj.ext}`);
      }
    }
  };

  if (showDashboard) {
    return (
      <Dashboard 
        onBack={() => setShowDashboard(false)}
        onCreateProject={(project) => {
          setShowDashboard(false);
          // Handle project creation - could set initial code based on project template
          if (project) {
            console.log('Creating project:', project);
            // Set up new project template
            const templates = {
              javascript: `// ${project.name || 'New Project'}
// ${project.description || 'Project description'}

function main() {
    console.log("Welcome to ${project.name || 'your new project'}!");
    // Your code here
}

main();`,
              python: `# ${project.name || 'New Project'}
# ${project.description || 'Project description'}

def main():
    print("Welcome to ${project.name || 'your new project'}!")
    # Your code here

if __name__ == "__main__":
    main()`,
              java: `// ${project.name || 'New Project'}
// ${project.description || 'Project description'}

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ${project.name || 'your new project'}!");
        // Your code here
    }
}`,
              cpp: `// ${project.name || 'New Project'}
// ${project.description || 'Project description'}

#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to ${project.name || 'your new project'}!" << endl;
    // Your code here
    return 0;
}`
            };
            
            const projectLanguage = project.language || 'javascript';
            setLanguage(projectLanguage);
            setCode(templates[projectLanguage] || templates.javascript);
            setFileName(`${project.name || 'project'}.${languages.find(l => l.value === projectLanguage)?.ext.slice(1) || 'js'}`);
            
            setConsoleOutput(prev => [...prev, { 
              type: 'success', 
              message: `🎉 Created new project: ${project.name || 'Untitled Project'}`, 
              timestamp: Date.now() 
            }]);
          }
        }}
        onOpenProject={(project) => {
          setShowDashboard(false);
          // Handle opening existing project - could load project code
          if (project) {
            console.log('Opening project:', project);
            // You could load project-specific code here
            // setCode(project.code || '');
            // setLanguage(project.language || 'javascript');
          }
        }}
      />
    );
  }

  if (showIDEDemo) {
    return (
      <IDEDemo onBack={() => setShowIDEDemo(false)} />
    );
  }

  if (showTestDemo) {
    return (
      <TestCaseDemo onBack={() => setShowTestDemo(false)} />
    );
  }

  if (showWelcome) {
    return (
      <>
        <WelcomeScreen 
          onCreateNew={handleCreateNew}
          onShowAuth={handleShowAuth}
          onShowDashboard={() => setShowDashboard(true)}
        />
        <ClerkAuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          mode={authMode === 'login' ? 'sign-in' : 'sign-up'}
        />
      </>
    );
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Custom TUF+ inspired theme
    monaco.editor.defineTheme('tuf-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#0F1419',
        'editor.foreground': '#E6EDF3',
        'editorLineNumber.foreground': '#7D8590',
        'editor.selectionBackground': '#264F78',
        'editor.lineHighlightBackground': '#1C2128',
        'editorCursor.foreground': '#E6EDF3',
        'editor.findMatchBackground': '#FFA500',
        'editor.findMatchHighlightBackground': '#FFFF00',
        'editorWidget.background': '#161B22',
        'editorWidget.border': '#30363D',
      }
    });
    
    monaco.editor.setTheme('tuf-dark');

    // Key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });

    // Additional key bindings for navigation
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Home, () => {
      scrollToTop();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.End, () => {
      scrollToBottom();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      goToLine();
    });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    const langObj = languages.find(l => l.value === newLanguage);
    if (langObj) {
      setFileName(`solution${langObj.ext}`);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    setConsoleOutput(prev => [...prev, { 
      type: 'success', 
      message: `💾 File saved as ${fileName}`, 
      timestamp: Date.now() 
    }]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '📋 Code copied to clipboard', 
      timestamp: Date.now() 
    }]);
  };

  const handleRun = () => {
    const timestamp = Date.now();
    setIsExecuting(true);
    
    if (language === 'javascript') {
      try {
        // Store original console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        const originalDebug = console.debug;
        const originalTable = console.table;
        const outputs = [];
        
        outputs.push({ 
          type: 'info', 
          message: '🚀 Executing JavaScript code...', 
          timestamp 
        });
        
        // Override console methods to capture output
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

        console.info = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ 
            type: 'info', 
            message, 
            timestamp: Date.now() 
          });
          originalInfo(...args);
        };

        console.debug = (...args) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push({ 
            type: 'log', 
            message: `[DEBUG] ${message}`, 
            timestamp: Date.now() 
          });
          originalDebug(...args);
        };

        console.table = (data) => {
          outputs.push({ 
            type: 'log', 
            message: `[TABLE]\n${JSON.stringify(data, null, 2)}`, 
            timestamp: Date.now() 
          });
          originalTable(data);
        };

        // Execute the code
        const func = new Function(code);
        const result = func();
        
        // If function returns a value, log it
        if (result !== undefined) {
          outputs.push({ 
            type: 'log', 
            message: `Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`, 
            timestamp: Date.now() 
          });
        }
        
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.info = originalInfo;
        console.debug = originalDebug;
        console.table = originalTable;
        
        outputs.push({ 
          type: 'success', 
          message: '✅ Code executed successfully!', 
          timestamp: Date.now() 
        });
        
        setConsoleOutput(prev => [...prev, ...outputs]);
        setShowConsole(true);
        
      } catch (error) {
        setConsoleOutput(prev => [...prev, 
          { 
            type: 'error', 
            message: `❌ Runtime Error: ${error.message}\n${error.stack || ''}`, 
            timestamp: Date.now() 
          }
        ]);
        setShowConsole(true);
      }
    } else {
      setConsoleOutput(prev => [...prev, { 
        type: 'warning', 
        message: '⚠️ Code execution is only supported for JavaScript in this demo', 
        timestamp: Date.now() 
      }]);
      setShowConsole(true);
    }
    
    setTimeout(() => setIsExecuting(false), 1000);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const scrollToTop = () => {
    if (editorRef.current) {
      editorRef.current.setPosition({ lineNumber: 1, column: 1 });
      editorRef.current.revealLine(1);
    }
  };

  const scrollToBottom = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const lineCount = model.getLineCount();
        editorRef.current.setPosition({ lineNumber: lineCount, column: 1 });
        editorRef.current.revealLine(lineCount);
      }
    }
  };

  const goToLine = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.gotoLine').run();
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowWelcome(true);
  };

  const resetCode = () => {
    setCode(`// New ${language} file
// Start coding here...

`);
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: '🔄 Code reset to default template', 
      timestamp: Date.now() 
    }]);
  };

  return (
    <div className={`h-screen bg-slate-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowWelcome(true)}
              className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Codex
                </h1>
                <p className="text-xs text-gray-400">TUF+ Editor</p>
              </div>
            </button>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Problems</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Practice</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Learn</a>
              {user && (
                <button
                  onClick={() => setShowDashboard(true)}
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-1"
                >
                  <BarChart3 size={14} />
                  <span>Dashboard</span>
                </button>
              )}
              <button
                onClick={() => setShowTestDemo(true)}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Test Cases Demo
              </button>
              <button
                onClick={() => setShowIDEDemo(true)}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                IDE Output Demo
              </button>
            </nav>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-white font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleShowAuth('login')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleShowAuth('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - File Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText size={16} className="text-gray-400" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none min-w-0"
              />
            </div>
            
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
            
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={resetCode}
              className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
              title="Reset Code"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button
              onClick={handleRun}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm transition-colors font-medium"
              title="Run Code (Ctrl+Enter)"
            >
              <Play size={16} />
              <span>Run</span>
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
              title="Save File (Ctrl+S)"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
              title="Copy Code"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                showConsole ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <Terminal size={16} />
              <span className="hidden sm:inline">Console</span>
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden editor-container">
        {/* Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme === 'vs-dark' ? 'tuf-dark' : theme}
            onChange={(value) => setCode(value || '')}
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
              cursorBlinking: 'smooth',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: true,
                horizontalHasArrows: true,
                verticalScrollbarSize: 14,
                horizontalScrollbarSize: 14,
              },
              mouseWheelScrollSensitivity: 1,
              fastScrollSensitivity: 5,
            }}
          />
        </div>

        {/* IDE Output Panel */}
        <IDEOutput
          isVisible={showConsole}
          onToggle={() => setShowConsole(!showConsole)}
          onExecute={handleRun}
          isExecuting={isExecuting}
          language={language}
          outputs={consoleOutput}
          onClearOutput={() => setConsoleOutput([])}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Line {editorRef.current?.getPosition()?.lineNumber || 1}</span>
          <span>Col {editorRef.current?.getPosition()?.column || 1}</span>
          <span className="flex items-center space-x-1">
            <span>{languages.find(l => l.value === language)?.icon}</span>
            <span>{language.toUpperCase()}</span>
          </span>
          <span>{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{code.length} chars</span>
          <span className="text-green-400 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Ready</span>
          </span>
        </div>
      </div>

      {/* Auth Modal */}
      <ClerkAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode === 'login' ? 'sign-in' : 'sign-up'}
      />

      {/* Debug Component */}
      <ClerkDebug />
    </div>
  );
};

export default CodexEditor;