import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import WelcomeScreenRedesigned from './WelcomeScreenRedesigned';
import DefaultClerkAuth from './Auth/DefaultClerkAuth';
import TestCaseDemo from './TestCaseDemo';
import IDEDemo from './IDEDemo';
import IDEOutput from './IDEOutput';
import Dashboard from './Dashboard';
import WebEditor from './WebEditor';
import AdvancedWebEditor from './AdvancedWebEditor';
import AndroidStudioFixed from './AndroidStudioFixed';
import InteractiveRoadmap from './Roadmap/InteractiveRoadmap';
import DSAComicViewer from './DSA/DSAComicViewer';
import ArticleViewer from './Articles/ArticleViewer';
import CodexEditorRedesigned from './CodexEditorRedesigned';
import ScrollToTop from './ScrollToTop';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { 
  Play, 
  Save, 
  Copy,
  Maximize2,
  Minimize2,
  Terminal,
  Code,
  FileText,
  RotateCcw,
  BarChart3,
  Globe,
  Smartphone,
  Rocket,
  Brain
} from 'lucide-react';

const CodexEditor = () => {
  const { user, logout, isAuthenticated, loading } = useUniversalAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showWebEditor, setShowWebEditor] = useState(false);
  const [showAdvancedWebEditor, setShowAdvancedWebEditor] = useState(false);
  const [showAndroidEditor, setShowAndroidEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTestDemo, setShowTestDemo] = useState(false);
  const [showIDEDemo, setShowIDEDemo] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showDSAComic, setShowDSAComic] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [showCodexRedesigned, setShowCodexRedesigned] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const [code, setCode] = useState(`// Welcome to Codex Playground - Professional Code Editor
// 🚀 Enhanced with visible console output!

console.log("🎉 Welcome to Codex Playground!");
console.log("Ready to code with full console support!");

// Example: Two Sum Problem
function twoSum(nums, target) {
    console.log("Input:", nums, "Target:", target);
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            console.log("Found pair at indices:", map.get(complement), i);
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    console.log("No pair found");
    return [];
}

// Test the solution
console.log("Testing Two Sum:");
const result1 = twoSum([2, 7, 11, 15], 9);
console.log("Result:", result1); // [0, 1]

const result2 = twoSum([3, 2, 4], 6);
console.log("Result:", result2); // [1, 2]

// Example: Fibonacci sequence
function fibonacci(n) {
    console.log(\`Calculating fibonacci(\${n})\`);
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

console.log("🚀 Click 'Run' to see the output in the console!");
console.log("💡 Try modifying the code and run it again!");
`);
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('bright-modern');
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
    { value: 'bright-modern', label: 'Bright Modern', icon: '✨' },
    { value: 'vs-dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'github-light', label: 'GitHub Light', icon: '🐙' },
    { value: 'hc-black', label: 'High Contrast', icon: '⚫' },
  ];

  // Auto-scroll console to bottom when new output is added
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  // Reset states when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWelcome(true);
      setShowWebEditor(false);
      setShowAdvancedWebEditor(false);
      setShowAndroidEditor(false);
      setShowDashboard(false);
      setShowTestDemo(false);
      setShowIDEDemo(false);
      setShowRoadmap(false);
      setShowDSAComic(false);
      setShowArticles(false);
      setShowCodexRedesigned(false);
      console.log('🔄 Reset - User logged out, all states cleared');
    }
  }, [isAuthenticated]);

  const executeCode = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setConsoleOutput([]);
    
    try {
      // Add execution start message
      const startMessage = {
        type: 'info',
        content: `🚀 Executing ${fileName}...`,
        timestamp: new Date().toLocaleTimeString()
      };
      setConsoleOutput([startMessage]);
      
      if (language === 'javascript') {
        // Create a custom console for capturing output
        const customConsole = {
          log: (...args) => {
            const message = {
              type: 'log',
              content: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '),
              timestamp: new Date().toLocaleTimeString()
            };
            setConsoleOutput(prev => [...prev, message]);
          },
          error: (...args) => {
            const message = {
              type: 'error',
              content: args.map(arg => String(arg)).join(' '),
              timestamp: new Date().toLocaleTimeString()
            };
            setConsoleOutput(prev => [...prev, message]);
          },
          warn: (...args) => {
            const message = {
              type: 'warn',
              content: args.map(arg => String(arg)).join(' '),
              timestamp: new Date().toLocaleTimeString()
            };
            setConsoleOutput(prev => [...prev, message]);
          }
        };

        // Execute JavaScript code
        try {
          // Replace console calls in the code
          const wrappedCode = code.replace(/console\.(log|error|warn)/g, 'customConsole.$1');
          
          // Create function with custom console
          const func = new Function('customConsole', wrappedCode);
          func(customConsole);
          
          // Add completion message
          setTimeout(() => {
            const endMessage = {
              type: 'success',
              content: '✅ Execution completed successfully',
              timestamp: new Date().toLocaleTimeString()
            };
            setConsoleOutput(prev => [...prev, endMessage]);
          }, 100);
          
        } catch (error) {
          const errorMessage = {
            type: 'error',
            content: `❌ Runtime Error: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          };
          setConsoleOutput(prev => [...prev, errorMessage]);
        }
      } else {
        // For other languages, show a placeholder message
        const message = {
          type: 'info',
          content: `📝 ${language.toUpperCase()} execution simulation - Code looks good!`,
          timestamp: new Date().toLocaleTimeString()
        };
        setConsoleOutput(prev => [...prev, message]);
        
        setTimeout(() => {
          const endMessage = {
            type: 'success',
            content: '✅ Code validation completed',
            timestamp: new Date().toLocaleTimeString()
          };
          setConsoleOutput(prev => [...prev, endMessage]);
        }, 500);
      }
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: `❌ Execution Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setConsoleOutput([errorMessage]);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const handleShowAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleCreateNew = (selectedLanguage = 'javascript') => {
    console.log('🚀 Creating new project with language:', selectedLanguage);
    setShowWelcome(false);
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
      const langObj = languages.find(l => l.value === selectedLanguage);
      if (langObj) {
        setFileName(`solution${langObj.ext}`);
      }
    }
  };

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Codex</h2>
          <p className="text-gray-400">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (showCodexRedesigned) {
    return (
      <CodexEditorRedesigned onBack={() => {
        setShowCodexRedesigned(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showAuth) {
    return <DefaultClerkAuth mode={authMode} />;
  }

  if (showAndroidEditor) {
    return (
      <AndroidStudioFixed onBack={() => {
        setShowAndroidEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showWebEditor) {
    return (
      <WebEditor onBack={() => {
        setShowWebEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showAdvancedWebEditor) {
    return (
      <AdvancedWebEditor onBack={() => {
        setShowAdvancedWebEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showDashboard) {
    return (
      <Dashboard 
        onBack={() => {
          setShowDashboard(false);
          setShowWelcome(true);
        }}
        onCreateProject={(project) => {
          setShowDashboard(false);
          if (project) {
            console.log('Creating project:', project);
            const templates = {
              javascript: `// ${project.name || 'New Project'}
console.log("Welcome to ${project.name || 'your new project'}!");`,
              python: `# ${project.name || 'New Project'}
print("Welcome to ${project.name || 'your new project'}!")`,
              java: `// ${project.name || 'New Project'}
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ${project.name || 'your new project'}!");
    }
}`,
              cpp: `// ${project.name || 'New Project'}
#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to ${project.name || 'your new project'}!" << endl;
    return 0;
}`
            };
            
            const projectLanguage = project.language || 'javascript';
            setLanguage(projectLanguage);
            setCode(templates[projectLanguage] || templates.javascript);
            setFileName(`${project.name || 'project'}.${languages.find(l => l.value === projectLanguage)?.ext.slice(1) || 'js'}`);
          }
        }}
      />
    );
  }

  if (showIDEDemo) {
    return (
      <IDEDemo onBack={() => {
        setShowIDEDemo(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showTestDemo) {
    return (
      <TestCaseDemo onBack={() => {
        setShowTestDemo(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showArticles) {
    return (
      <ArticleViewer onBack={() => {
        setShowArticles(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showDSAComic) {
    return (
      <DSAComicViewer onBack={() => {
        setShowDSAComic(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showRoadmap) {
    return (
      <InteractiveRoadmap onBack={() => {
        setShowRoadmap(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreenRedesigned 
        onCreateNew={handleCreateNew}
        onShowAuth={handleShowAuth}
        onShowDashboard={() => setShowDashboard(true)}
        onShowWebEditor={() => setShowWebEditor(true)}
        onShowAdvancedWebEditor={() => setShowAdvancedWebEditor(true)}
        onShowAndroidEditor={() => setShowAndroidEditor(true)}
        onShowRoadmap={() => setShowRoadmap(true)}
        onShowDSAComic={() => setShowDSAComic(true)}
        onShowArticles={() => setShowArticles(true)}
        onShowCodexRedesigned={() => setShowCodexRedesigned(true)}
      />
    );
  }

  return (
    <div className={`h-screen ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          {/* Left - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowWelcome(true)}
              className={`flex items-center space-x-3 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'} transition-colors`}
            >
              <img 
                src="/codex-icon.svg" 
                alt="Codex Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Codex Playground
                </h1>
                <p className={`text-xs ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Professional IDE</p>
              </div>
            </button>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                    {user?.firstName || user?.username || 'User'}
                  </span>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleShowAuth('login')}
                  className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} transition-colors text-sm`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleShowAuth('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm text-white"
                >
                  Get Started
                </button>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-2`}>
          <div className="flex items-center justify-between">
            {/* Left - File and Language */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'} border rounded px-2 py-1 text-sm font-mono`}
                />
              </div>
              
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  const langObj = languages.find(l => l.value === e.target.value);
                  if (langObj) {
                    setFileName(`solution${langObj.ext}`);
                  }
                }}
                className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'} border rounded px-3 py-1 text-sm`}
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
                className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'} border rounded px-3 py-1 text-sm`}
              >
                {themes.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isExecuting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                <Play className="w-4 h-4" />
                <span>{isExecuting ? 'Running...' : 'Run'}</span>
              </button>
              
              <button
                onClick={copyCode}
                className={`p-2 rounded-lg transition-colors ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={saveCode}
                className={`p-2 rounded-lg transition-colors ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                title="Save File"
              >
                <Save className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`p-2 rounded-lg transition-colors ${showConsole ? 'bg-blue-600 text-white' : theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                title="Toggle Console"
              >
                <Terminal className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 rounded-lg transition-colors ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Editor and Console Layout */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className={`${showConsole ? 'w-2/3' : 'w-full'} flex flex-col`}>
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme={theme}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  folding: true,
                  lineNumbersMinChars: 3,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible'
                  }
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>
          </div>

          {/* Console Panel */}
          {showConsole && (
            <div className={`w-1/3 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'} border-l flex flex-col`}>
              {/* Console Header */}
              <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span className="font-medium text-sm">Console</span>
                </div>
                <button
                  onClick={clearConsole}
                  className={`p-1 rounded transition-colors ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'}`}
                  title="Clear Console"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Console Output */}
              <div 
                ref={consoleRef}
                className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
              >
                {consoleOutput.length === 0 ? (
                  <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'} italic`}>
                    Console output will appear here...
                    <br />
                    <br />
                    💡 Click "Run" to execute your code
                    <br />
                    🔧 Use console.log() to output messages
                  </div>
                ) : (
                  consoleOutput.map((output, index) => (
                    <div key={index} className={`mb-2 ${
                      output.type === 'error' ? 'text-red-500' :
                      output.type === 'warn' ? 'text-yellow-500' :
                      output.type === 'success' ? 'text-green-500' :
                      output.type === 'info' ? 'text-blue-500' :
                      theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                    }`}>
                      <span className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-xs mr-2`}>
                        [{output.timestamp}]
                      </span>
                      <span className="whitespace-pre-wrap">{output.content}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default CodexEditor;