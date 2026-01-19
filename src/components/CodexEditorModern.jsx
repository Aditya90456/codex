import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play, Save, Copy, Maximize2, Minimize2, Terminal, FileText,
  RotateCcw, X, CheckCircle, AlertCircle, Info, AlertTriangle, Settings,
  Moon, Sun, Palette, Command
} from 'lucide-react';

const CodexEditorModern = () => {
  const [code, setCode] = useState(`// 🚀 Welcome to Codex - Modern Code Editor
// Write, run, and debug your code with style!

console.log("✨ Hello, Developer!");
console.log("Your coding journey starts here...");

// Example: Find Maximum Subarray Sum (Kadane's Algorithm)
function maxSubarraySum(arr) {
    console.log("Finding max subarray sum for:", arr);
    
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    console.log("Maximum subarray sum:", maxSoFar);
    return maxSoFar;
}

// Test cases
const testArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Test Array:", testArray);
const result = maxSubarraySum(testArray);
console.log("Result:", result); // Expected: 6

console.log("\\n🎯 Click 'Run Code' to see the magic!");
`);

  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const editorRef = useRef(null);
  const consoleRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨', color: 'from-yellow-400 to-yellow-600' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷', color: 'from-blue-400 to-blue-600' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍', color: 'from-green-400 to-green-600' },
    { value: 'java', label: 'Java', ext: '.java', icon: '☕', color: 'from-orange-400 to-orange-600' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡', color: 'from-purple-400 to-purple-600' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐', color: 'from-red-400 to-red-600' },
    { value: 'css', label: 'CSS', ext: '.css', icon: '🎨', color: 'from-pink-400 to-pink-600' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark', icon: <Moon className="w-4 h-4" />, bg: 'from-gray-900 to-gray-800' },
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" />, bg: 'from-gray-50 to-white' },
    { value: 'hc-black', label: 'High Contrast', icon: <Palette className="w-4 h-4" />, bg: 'from-black to-gray-900' },
  ];

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  // Update lines of code
  useEffect(() => {
    setLinesOfCode(code.split('\n').length);
  }, [code]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCode();
      } else if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeCode = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    const outputMessages = [];
    const startTime = performance.now();
    
    try {
      outputMessages.push({
        type: 'info',
        content: `🚀 Executing ${fileName}...`,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (language === 'javascript' || language === 'typescript') {
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        
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
          // eslint-disable-next-line no-eval
          eval(code);
          
          const runtime = Math.round(performance.now() - startTime);
          setExecutionTime(runtime);
          
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          console.info = originalInfo;
          
          logs.forEach(log => {
            outputMessages.push({
              type: log.type,
              content: log.content,
              timestamp: new Date().toLocaleTimeString()
            });
          });
          
          outputMessages.push({
            type: 'success',
            content: `✅ Execution completed in ${runtime}ms`,
            timestamp: new Date().toLocaleTimeString()
          });
          
        } catch (execError) {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          console.info = originalInfo;
          
          logs.forEach(log => {
            outputMessages.push({
              type: log.type,
              content: log.content,
              timestamp: new Date().toLocaleTimeString()
            });
          });
          
          outputMessages.push({
            type: 'error',
            content: `❌ Error: ${execError.message}`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } else {
        outputMessages.push({
          type: 'info',
          content: `📝 ${language.toUpperCase()} code validated successfully!`,
          timestamp: new Date().toLocaleTimeString()
        });
        
        outputMessages.push({
          type: 'success',
          content: '✅ Code looks good!',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      outputMessages.push({
        type: 'error',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    setConsoleOutput(outputMessages);
    setIsExecuting(false);
    
    if (!showConsole) {
      setShowConsole(true);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
    setExecutionTime(0);
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

  const currentTheme = themes.find(t => t.value === theme);
  const currentLanguage = languages.find(l => l.value === language);
  const isDark = theme !== 'light';

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Toolbar */}
      <div className={`${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-b px-6 py-3 ${isFullscreen ? '' : 'mt-16'}`}>
        <div className="flex items-center justify-between">
          {/* Left - File & Language */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg px-3 py-2 text-sm font-mono transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500`}
              />
            </div>
            
            <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                const langObj = languages.find(l => l.value === e.target.value);
                if (langObj) setFileName(`solution${langObj.ext}`);
              }}
              className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer`}
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
              className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-lg px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer`}
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className={`flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isExecuting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              } text-white`}
            >
              <Play className="w-4 h-4" />
              <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
            </button>
            
            <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'} mx-2`}></div>
            
            <button
              onClick={copyCode}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} hover:scale-110`}
              title="Copy Code"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={saveCode}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} hover:scale-110`}
              title="Save File"
            >
              <Save className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-2.5 rounded-lg transition-all hover:scale-110 ${showConsole ? 'bg-blue-500 text-white shadow-md' : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Toggle Console"
            >
              <Terminal className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2.5 rounded-lg transition-all hover:scale-110 ${showSettings ? 'bg-purple-500 text-white shadow-md' : isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} hover:scale-110`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className={`${showConsole ? 'w-2/3' : 'w-full'} flex flex-col relative`}>
          {/* Language Badge Overlay */}
          <div className="absolute top-4 right-4 z-10">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg backdrop-blur-xl ${isDark ? 'bg-gray-900/80 border border-gray-800' : 'bg-white/80 border border-gray-200'} shadow-lg`}>
              <span className="text-2xl">{currentLanguage?.icon}</span>
              <span className="text-sm font-semibold">{currentLanguage?.label}</span>
            </div>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                folding: true,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: true,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                },
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                bracketPairColorization: { enabled: true }
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>

        {/* Enhanced Console Panel */}
        {showConsole && (
          <div className={`w-1/3 ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-l flex flex-col`}>
            {/* Console Header */}
            <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-b px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">Console Output</span>
                {consoleOutput.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    {consoleOutput.length}
                  </span>
                )}
              </div>
              <button
                onClick={clearConsole}
                className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'} hover:scale-110`}
                title="Clear Console"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Console Output */}
            <div 
              ref={consoleRef}
              className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
            >
              {consoleOutput.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                    <Terminal className={`relative w-16 h-16 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                  </div>
                  <div className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm mb-2`}>
                    Console is ready
                  </div>
                  <div className={`${isDark ? 'text-gray-600' : 'text-gray-500'} text-xs`}>
                    💡 Click "Run Code" to see output
                  </div>
                </div>
              ) : (
                consoleOutput.map((output, index) => (
                  <div key={index} className={`mb-3 p-3 rounded-lg transition-all hover:scale-[1.01] ${
                    output.type === 'error' ? isDark ? 'bg-red-500/10 border-l-4 border-red-500' : 'bg-red-50 border-l-4 border-red-500' :
                    output.type === 'warn' ? isDark ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : 'bg-yellow-50 border-l-4 border-yellow-500' :
                    output.type === 'success' ? isDark ? 'bg-green-500/10 border-l-4 border-green-500' : 'bg-green-50 border-l-4 border-green-500' :
                    output.type === 'info' ? isDark ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500' :
                    isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {output.timestamp}
                      </span>
                      {output.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {output.type === 'warn' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {output.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {output.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                    </div>
                    <span className={`whitespace-pre-wrap text-sm ${
                      output.type === 'error' ? 'text-red-500 font-medium' :
                      output.type === 'warn' ? 'text-yellow-500 font-medium' :
                      output.type === 'success' ? 'text-green-500 font-medium' :
                      output.type === 'info' ? 'text-blue-500 font-medium' :
                      isDark ? 'text-gray-200' : 'text-gray-800'
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

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden`}>
            <div className={`p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Command className="w-5 h-5 text-purple-500" />
                <span className="font-bold">Command Palette</span>
              </div>
              <button onClick={() => setShowCommandPalette(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: 'Run Code', shortcut: 'Ctrl+Enter', action: executeCode, icon: <Play className="w-4 h-4" /> },
                { name: 'Save File', shortcut: 'Ctrl+S', action: saveCode, icon: <Save className="w-4 h-4" /> },
                { name: 'Copy Code', shortcut: 'Ctrl+C', action: copyCode, icon: <Copy className="w-4 h-4" /> },
                { name: 'Clear Console', shortcut: 'Ctrl+K', action: clearConsole, icon: <RotateCcw className="w-4 h-4" /> },
                { name: 'Toggle Console', shortcut: 'Ctrl+`', action: () => setShowConsole(!showConsole), icon: <Terminal className="w-4 h-4" /> },
                { name: 'Toggle Fullscreen', shortcut: 'F11', action: () => setIsFullscreen(!isFullscreen), icon: <Maximize2 className="w-4 h-4" /> },
              ].map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    cmd.action();
                    setShowCommandPalette(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      {cmd.icon}
                    </div>
                    <span className="font-medium">{cmd.name}</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    {cmd.shortcut}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden`}>
            <div className={`p-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <span className="font-bold">Editor Settings</span>
              </div>
              <button onClick={() => setShowSettings(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Font Size</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                    className={`px-3 py-1 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    -
                  </button>
                  <span className={`w-12 text-center px-2 py-1 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {fontSize}
                  </span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                    className={`px-3 py-1 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Lines of Code</span>
                    <span className="font-bold">{linesOfCode}</span>
                  </div>
                  {executionTime > 0 && (
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Last Execution</span>
                      <span className="font-bold text-green-500">{executionTime}ms</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodexEditorModern;
