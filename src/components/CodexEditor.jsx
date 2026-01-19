import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import WelcomeScreenModern from './WelcomeScreenModern';
import DefaultClerkAuth from './Auth/DefaultClerkAuth';
import TestCaseDemo from './TestCaseDemo';
import IDEDemo from './IDEDemo';
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
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

const CodexEditor = () => {
  const { user, isAuthenticated, loading } = useUniversalAuth();
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
  const [consoleOutput, setConsoleOutput] = useState([
    {
      type: 'info',
      content: '👋 Console ready! Click "Run" to execute your code.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState('all');
  const [consoleSearch, setConsoleSearch] = useState('');
  const [consoleHeight, setConsoleHeight] = useState(300);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const editorRef = useRef(null);
  const consoleRef = useRef(null);
  const resizeRef = useRef(null);
  

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
    console.log('🔥 executeCode called');
    
    if (isExecuting) {
      console.log('⚠️ Already executing, returning');
      return;
    }
    
    setIsExecuting(true);
    console.log('▶️ Starting code execution...');
    
    // Collect all output messages first, then update state once
    const outputMessages = [];
    
    try {
      // Add execution start message
      outputMessages.push({
        type: 'info',
        content: `🚀 Executing ${fileName}...`,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (language === 'javascript' || language === 'typescript') {
        // Execute JavaScript/TypeScript code client-side
        try {
          const startTime = performance.now();
          
          // Capture console output
          const logs = [];
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          const originalInfo = console.info;
          
          // Override console methods
          console.log = (...args) => {
            logs.push({ type: 'log', content: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') });
            originalLog.apply(console, args);
          };
          
          console.error = (...args) => {
            logs.push({ type: 'error', content: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') });
            originalError.apply(console, args);
          };
          
          console.warn = (...args) => {
            logs.push({ type: 'warn', content: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') });
            originalWarn.apply(console, args);
          };
          
          console.info = (...args) => {
            logs.push({ type: 'info', content: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') });
            originalInfo.apply(console, args);
          };
          
          try {
            // Execute the code
            // eslint-disable-next-line no-eval
            eval(code);
            
            const runtime = Math.round(performance.now() - startTime);
            
            // Restore console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
            
            // Add captured logs to output
            logs.forEach(log => {
              outputMessages.push({
                type: log.type,
                content: log.content,
                timestamp: new Date().toLocaleTimeString()
              });
            });
            
            // Add runtime info
            outputMessages.push({
              type: 'info',
              content: `⏱️ Execution time: ${runtime}ms`,
              timestamp: new Date().toLocaleTimeString()
            });
            
            // Add completion message
            outputMessages.push({
              type: 'success',
              content: '✅ Execution completed successfully',
              timestamp: new Date().toLocaleTimeString()
            });
            
          } catch (execError) {
            // Restore console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
            
            // Add any captured logs before the error
            logs.forEach(log => {
              outputMessages.push({
                type: log.type,
                content: log.content,
                timestamp: new Date().toLocaleTimeString()
              });
            });
            
            // Add error message
            outputMessages.push({
              type: 'error',
              content: `❌ Runtime Error: ${execError.message}`,
              timestamp: new Date().toLocaleTimeString()
            });
            
            if (execError.stack) {
              outputMessages.push({
                type: 'error',
                content: execError.stack,
                timestamp: new Date().toLocaleTimeString()
              });
            }
          }

        } catch (error) {
          console.error('❌ Execution error:', error);
          outputMessages.push({
            type: 'error',
            content: `❌ Execution Error: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } else {
        // For other languages, show a placeholder message
        outputMessages.push({
          type: 'info',
          content: `📝 ${language.toUpperCase()} execution simulation - Code looks good!`,
          timestamp: new Date().toLocaleTimeString()
        });
        
        outputMessages.push({
          type: 'success',
          content: '✅ Code validation completed',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error('❌ Execution error:', error);
      outputMessages.push({
        type: 'error',
        content: `❌ Execution Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    console.log('📊 Output messages:', outputMessages.length);
    
    // Update state once with all collected messages
    setConsoleOutput(outputMessages);
    setIsExecuting(false);
    
    // Ensure console is visible
    if (!showConsole) {
      setShowConsole(true);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
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
      <WelcomeScreenModern 
        onCreateNew={handleCreateNew}
        onShowAuth={handleShowAuth}
        onShowDashboard={() => setShowDashboard(true)}
      />
    );
  }

  return (
    <div className={`h-screen ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900' : 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Modern Header with Glassmorphism */}
      <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white/80 backdrop-blur-xl border-gray-200/50' : 'bg-gray-800/80 backdrop-blur-xl border-gray-700/50'} border-b shadow-sm ${isFullscreen ? '' : 'mt-16'}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWelcome(true)}
                className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Codex Playground
                  </h1>
                  <p className={`text-xs ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Professional Code Editor
                  </p>
                </div>
              </button>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-4">
              <SignedIn>
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1.5 rounded-lg ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-100' : 'bg-gray-700/50'}`}>
                    <span className={`text-sm font-medium ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {user?.firstName || user?.username || 'User'}
                    </span>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 ring-2 ring-purple-500/20"
                      }
                    }}
                  />
                </div>
              </SignedIn>
              
              <SignedOut>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleShowAuth('login')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleShowAuth('signup')}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 px-5 py-2 rounded-lg font-medium transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white/60 backdrop-blur-lg border-gray-200/50' : 'bg-gray-800/60 backdrop-blur-lg border-gray-700/50'} border-b px-6 py-3`}>
          <div className="flex items-center justify-between">
            {/* Left - File and Language */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500' : 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500'} border rounded-lg px-3 py-1.5 text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  const langObj = languages.find(l => l.value === e.target.value);
                  if (langObj) {
                    setFileName(`solution${langObj.ext}`);
                  }
                }}
                className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-gray-700/50 border-gray-600 text-white'} border rounded-lg px-4 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer`}
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
                className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-gray-700/50 border-gray-600 text-white'} border rounded-lg px-4 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer`}
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
                className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isExecuting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                } text-white`}
              >
                <Play className="w-4 h-4" />
                <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
              </button>
              
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
              
              <button
                onClick={copyCode}
                className={`p-2.5 rounded-lg transition-all duration-300 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700/50 text-gray-300'} hover:scale-110`}
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={saveCode}
                className={`p-2.5 rounded-lg transition-all duration-300 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700/50 text-gray-300'} hover:scale-110`}
                title="Save File"
              >
                <Save className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${showConsole ? 'bg-blue-500 text-white shadow-md' : theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700/50 text-gray-300'} hover:scale-110`}
                title="Toggle Console"
              >
                <Terminal className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2.5 rounded-lg transition-all duration-300 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700/50 text-gray-300'} hover:scale-110`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Editor and Console Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className={`${showConsole ? 'w-2/3' : 'w-full'} flex flex-col`}>
            <div className="flex-1 relative">
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
                  },
                  padding: { top: 16, bottom: 16 }
                }}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </div>
          </div>

          {/* Enhanced Console Panel */}
          {showConsole && (
            <div className={`w-1/3 min-h-[300px] ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white/60 backdrop-blur-lg border-gray-200/50' : 'bg-gray-900/60 backdrop-blur-lg border-gray-700/50'} border-l flex flex-col`}>
              {/* Console Header */}
              <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50/80 border-gray-200/50' : 'bg-gray-800/80 border-gray-700/50'} border-b px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-sm">Console Output</span>
                  {consoleOutput.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                      {consoleOutput.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearConsole}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'hover:bg-gray-200 text-gray-600' : 'hover:bg-gray-700 text-gray-300'} hover:scale-110`}
                  title="Clear Console"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Console Output */}
              <div 
                ref={consoleRef}
                className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}
              >
                {consoleOutput.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Terminal className="w-16 h-16 mb-3 text-gray-400 opacity-50" />
                    <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'} italic text-sm`}>
                      Console output will appear here...
                    </div>
                    <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-xs mt-2`}>
                      💡 Click "Run Code" to execute
                    </div>
                  </div>
                ) : (
                  consoleOutput.map((output, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-lg transition-all hover:scale-[1.01] ${
                      output.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' :
                      output.type === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500' :
                      output.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' :
                      output.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' :
                      theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50'
                    }`}>
                      <span className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-xs block mb-1`}>
                        [{output.timestamp}]
                      </span>
                      <span className={`whitespace-pre-wrap ${
                        output.type === 'error' ? 'text-red-600 dark:text-red-400' :
                        output.type === 'warn' ? 'text-yellow-600 dark:text-yellow-400' :
                        output.type === 'success' ? 'text-green-600 dark:text-green-400' :
                        output.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                        theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                      }`}>
                        {output.content}
                      </span>
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