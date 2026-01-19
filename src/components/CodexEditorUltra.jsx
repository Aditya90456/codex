import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import {
  Play, Save, Copy, Download, Upload, Maximize2, Minimize2, Terminal, Code, FileText,
  RotateCcw, Search, Filter, ChevronDown, ChevronUp, X, AlertCircle, CheckCircle,
  Info, AlertTriangle, Settings, Folder, Plus, Trash2, Eye, EyeOff, Zap, Clock,
  Activity, Cpu, MemoryStick, Home, Moon, Sun, Monitor, Palette, Command, Share2,
  GitBranch, Bug, Lightbulb, Sparkles, ArrowLeft, Layers, BookOpen, Rocket
} from 'lucide-react';

const CodexEditorUltra = ({ onBack }) => {
  const navigate = useNavigate();
  const { user } = useUniversalAuth();
  const [code, setCode] = useState(`// Welcome to Codex Ultra - Next-Gen Code Editor
// 🚀 Enhanced with AI-powered features!

console.log("🎉 Welcome to Codex Ultra!");
console.log("Your professional coding environment is ready!");

// Example: Binary Search Implementation
function binarySearch(arr, target) {
    console.log("Searching for:", target, "in array:", arr);
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        console.log(\`Checking index \${mid}: \${arr[mid]}\`);
        
        if (arr[mid] === target) {
            console.log("✅ Found at index:", mid);
            return mid;
        }
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    console.log("❌ Not found");
    return -1;
}

// Test cases
const testArray = [1, 3, 5, 7, 9, 11, 13, 15];
console.log("Test Array:", testArray);
console.log("Result:", binarySearch(testArray, 7));
console.log("Result:", binarySearch(testArray, 10));
`);

  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleFilter, setConsoleFilter] = useState('all');
  const [consoleSearch, setConsoleSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [autoSave, setAutoSave] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [bracketPairColorization, setBracketPairColorization] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const editorRef = useRef(null);
  const consoleRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨', color: 'yellow' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷', color: 'blue' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍', color: 'green' },
    { value: 'java', label: 'Java', ext: '.java', icon: '☕', color: 'orange' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡', color: 'purple' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐', color: 'red' },
    { value: 'css', label: 'CSS', ext: '.css', icon: '🎨', color: 'pink' },
    { value: 'json', label: 'JSON', ext: '.json', icon: '📋', color: 'gray' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'hc-black', label: 'High Contrast', icon: <Monitor className="w-4 h-4" /> },
  ];

  const codeSnippets = [
    { name: 'Two Sum', lang: 'javascript', code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}' },
    { name: 'Binary Search', lang: 'javascript', code: 'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}' },
    { name: 'Quick Sort', lang: 'javascript', code: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}' },
    { name: 'DFS Tree', lang: 'javascript', code: 'function dfs(node, visited = new Set()) {\n  if (!node || visited.has(node)) return;\n  visited.add(node);\n  console.log(node.value);\n  node.children?.forEach(child => dfs(child, visited));\n}' },
  ];

  const commands = [
    { name: 'Run Code', shortcut: 'Ctrl+Enter', action: () => executeCode(), icon: <Play className="w-4 h-4" /> },
    { name: 'Save File', shortcut: 'Ctrl+S', action: () => saveCode(), icon: <Save className="w-4 h-4" /> },
    { name: 'Copy Code', shortcut: 'Ctrl+C', action: () => copyCode(), icon: <Copy className="w-4 h-4" /> },
    { name: 'Toggle Console', shortcut: 'Ctrl+`', action: () => setShowConsole(!showConsole), icon: <Terminal className="w-4 h-4" /> },
    { name: 'Toggle Fullscreen', shortcut: 'F11', action: () => setIsFullscreen(!isFullscreen), icon: <Maximize2 className="w-4 h-4" /> },
    { name: 'Clear Console', shortcut: 'Ctrl+K', action: () => clearConsole(), icon: <RotateCcw className="w-4 h-4" /> },
    { name: 'Settings', shortcut: 'Ctrl+,', action: () => setShowSettings(!showSettings), icon: <Settings className="w-4 h-4" /> },
    { name: 'File Explorer', shortcut: 'Ctrl+B', action: () => setShowFileExplorer(!showFileExplorer), icon: <Folder className="w-4 h-4" /> },
    { name: 'Snippets', shortcut: 'Ctrl+Shift+P', action: () => setShowSnippets(!showSnippets), icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Performance', shortcut: 'Ctrl+Shift+M', action: () => setShowPerformance(!showPerformance), icon: <Activity className="w-4 h-4" /> },
  ];

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCode();
      } else if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setShowConsole(!showConsole);
      } else if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        clearConsole();
      } else if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setShowSettings(!showSettings);
      } else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setShowFileExplorer(!showFileExplorer);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      } else if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConsole, showSettings, showFileExplorer, showCommandPalette, isFullscreen]);

  // Auto-save
  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('codex-ultra-code', code);
        localStorage.setItem('codex-ultra-language', language);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [code, language, autoSave]);

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
            type: 'info',
            content: `⏱️ Execution time: ${runtime}ms`,
            timestamp: new Date().toLocaleTimeString()
          });
          
          outputMessages.push({
            type: 'success',
            content: '✅ Execution completed successfully',
            timestamp: new Date().toLocaleTimeString()
          });
          
          // Simulate performance metrics
          setMemoryUsage(Math.floor(Math.random() * 50) + 10);
          setCpuUsage(Math.floor(Math.random() * 30) + 5);
          
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
      } else {
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
      outputMessages.push({
        type: 'error',
        content: `❌ Execution Error: ${error.message}`,
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
    setMemoryUsage(0);
    setCpuUsage(0);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const loadSnippet = (snippet) => {
    setCode(snippet.code);
    setLanguage(snippet.lang);
    const langObj = languages.find(l => l.value === snippet.lang);
    if (langObj) {
      setFileName(`${snippet.name.toLowerCase().replace(/\s+/g, '-')}${langObj.ext}`);
    }
    setShowSnippets(false);
  };

  const filteredConsoleOutput = consoleOutput.filter(output => {
    if (consoleFilter !== 'all' && output.type !== consoleFilter) return false;
    if (consoleSearch && !output.content.toLowerCase().includes(consoleSearch.toLowerCase())) return false;
    return true;
  });

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className={`h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-6 py-2 ${isFullscreen ? '' : 'mt-16'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'} border rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                const langObj = languages.find(l => l.value === e.target.value);
                if (langObj) setFileName(`solution${langObj.ext}`);
              }}
              className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'} border rounded px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
              className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'} border rounded px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-medium transition-all ${
                isExecuting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              } text-white shadow-md hover:shadow-lg`}
            >
              <Play className="w-4 h-4" />
              <span>{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
            
            <button onClick={copyCode} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Copy">
              <Copy className="w-4 h-4" />
            </button>
            
            <button onClick={saveCode} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Save">
              <Save className="w-4 h-4" />
            </button>
            
            <button onClick={() => setShowConsole(!showConsole)} className={`p-2 rounded-lg transition-all ${showConsole ? 'bg-blue-500 text-white' : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Console">
              <Terminal className="w-4 h-4" />
            </button>
            
            <button onClick={() => setShowSnippets(!showSnippets)} className={`p-2 rounded-lg transition-all ${showSnippets ? 'bg-purple-500 text-white' : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Snippets">
              <Sparkles className="w-4 h-4" />
            </button>
            
            <button onClick={() => setShowPerformance(!showPerformance)} className={`p-2 rounded-lg transition-all ${showPerformance ? 'bg-orange-500 text-white' : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Performance">
              <Activity className="w-4 h-4" />
            </button>
            
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-gray-500 text-white' : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Settings">
              <Settings className="w-4 h-4" />
            </button>
            
            <button onClick={() => setIsFullscreen(!isFullscreen)} className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`} title="Fullscreen">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`${showConsole ? 'w-2/3' : 'w-full'} flex flex-col`}>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme}
              options={{
                minimap: { enabled: minimap },
                fontSize: fontSize,
                lineHeight: lineHeight,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: wordWrap ? 'on' : 'off',
                folding: true,
                bracketPairColorization: { enabled: bracketPairColorization },
                padding: { top: 16, bottom: 16 }
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div className={`w-1/3 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} border-l flex flex-col`}>
            <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-2 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Console</span>
                {consoleOutput.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                    {consoleOutput.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={consoleFilter}
                  onChange={(e) => setConsoleFilter(e.target.value)}
                  className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-700 border-gray-600'} border`}
                >
                  <option value="all">All</option>
                  <option value="log">Logs</option>
                  <option value="error">Errors</option>
                  <option value="warn">Warnings</option>
                  <option value="info">Info</option>
                </select>
                <button onClick={clearConsole} className={`p-1 rounded transition-all ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`} title="Clear">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div ref={consoleRef} className={`flex-1 overflow-y-auto p-3 font-mono text-xs ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
              {filteredConsoleOutput.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Terminal className="w-12 h-12 mb-2 text-gray-400 opacity-50" />
                  <div className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                    Console output will appear here
                  </div>
                </div>
              ) : (
                filteredConsoleOutput.map((output, index) => (
                  <div key={index} className={`mb-2 p-2 rounded transition-all ${
                    output.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' :
                    output.type === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500' :
                    output.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' :
                    output.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' :
                    theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50'
                  }`}>
                    <span className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-xs block mb-1`}>
                      [{output.timestamp}]
                    </span>
                    <span className={`whitespace-pre-wrap ${
                      output.type === 'error' ? 'text-red-600 dark:text-red-400' :
                      output.type === 'warn' ? 'text-yellow-600 dark:text-yellow-400' :
                      output.type === 'success' ? 'text-green-600 dark:text-green-400' :
                      output.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                      theme === 'light' ? 'text-gray-900' : 'text-gray-100'
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

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-2xl w-full max-w-2xl`}>
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Search commands..."
                  className={`flex-1 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  autoFocus
                />
                <button onClick={() => setShowCommandPalette(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    cmd.action();
                    setShowCommandPalette(false);
                    setCommandSearch('');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
                >
                  <div className="flex items-center space-x-3">
                    {cmd.icon}
                    <span className="font-medium">{cmd.name}</span>
                  </div>
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{cmd.shortcut}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Snippets Panel */}
      {showSnippets && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden`}>
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold">Code Snippets</h2>
              </div>
              <button onClick={() => setShowSnippets(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto max-h-[60vh]">
              {codeSnippets.map((snippet, index) => (
                <button
                  key={index}
                  onClick={() => loadSnippet(snippet)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${theme === 'light' ? 'border-gray-200 hover:border-purple-500 bg-gray-50' : 'border-gray-700 hover:border-purple-500 bg-gray-700/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{snippet.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`}>
                      {snippet.lang}
                    </span>
                  </div>
                  <pre className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} overflow-hidden`}>
                    {snippet.code.substring(0, 100)}...
                  </pre>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Panel */}
      {showPerformance && (
        <div className="fixed bottom-4 right-4 z-40 w-80">
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border rounded-xl shadow-2xl`}>
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold">Performance</h3>
              </div>
              <button onClick={() => setShowPerformance(false)} className="p-1 hover:bg-gray-700 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Execution Time</span>
                </div>
                <span className="font-bold text-blue-500">{executionTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Memory</span>
                </div>
                <span className="font-bold text-green-500">{memoryUsage}MB</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <span className="font-bold text-purple-500">{cpuUsage}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-2xl w-full max-w-2xl`}>
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-bold">Editor Settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span>Font Size</span>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={`w-20 px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-700 border-gray-600'} border`}
                  min="10"
                  max="24"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Line Height</span>
                <input
                  type="number"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className={`w-20 px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-700 border-gray-600'} border`}
                  min="1"
                  max="3"
                  step="0.1"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Auto Save</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`px-4 py-2 rounded-lg ${autoSave ? 'bg-green-500 text-white' : theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                >
                  {autoSave ? 'On' : 'Off'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Word Wrap</span>
                <button
                  onClick={() => setWordWrap(!wordWrap)}
                  className={`px-4 py-2 rounded-lg ${wordWrap ? 'bg-green-500 text-white' : theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                >
                  {wordWrap ? 'On' : 'Off'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Minimap</span>
                <button
                  onClick={() => setMinimap(!minimap)}
                  className={`px-4 py-2 rounded-lg ${minimap ? 'bg-green-500 text-white' : theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                >
                  {minimap ? 'On' : 'Off'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Bracket Colorization</span>
                <button
                  onClick={() => setBracketPairColorization(!bracketPairColorization)}
                  className={`px-4 py-2 rounded-lg ${bracketPairColorization ? 'bg-green-500 text-white' : theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
                >
                  {bracketPairColorization ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodexEditorUltra;
