import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ModernWelcomeScreen from './ModernWelcomeScreen';
import AIUniversalCreator from './AI/AIUniversalCreatorModern';
import BusinessGrowthFeatures from './BusinessGrowthFeatures';
import IDEOutput from './IDEOutput';
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
  TrendingUp
} from 'lucide-react';

const SimpleCodexEditor = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAICreator, setShowAICreator] = useState(false);
  const [showBusinessGrowth, setShowBusinessGrowth] = useState(false);
  const [code, setCode] = useState(`// Welcome to Codex Playground - No Auth Version
// Fast-loading Code Editor for Everyone
// 🚀 No sign-up required!

function solveProblem() {
    // Your solution here
    console.log("Ready to code in Codex Playground!");
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
  const [theme, setTheme] = useState('bright-modern');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);

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

  if (showBusinessGrowth) {
    return <BusinessGrowthFeatures />;
  }

  if (showAICreator) {
    return <AIUniversalCreator onBack={() => setShowAICreator(false)} />;
  }

  if (showWelcome) {
    return (
      <ModernWelcomeScreen 
        onCreateNew={handleCreateNew}
        onShowWebEditor={() => {}} // No auth needed
        onShowAdvancedWebEditor={() => {}}
        onShowAndroidEditor={() => {}}
        onShowAICreator={() => setShowAICreator(true)}
      />
    );
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Custom Bright Modern theme
    monaco.editor.defineTheme('bright-modern', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7C3AED' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'DC2626' },
        { token: 'function', foreground: '2563EB' },
        { token: 'variable', foreground: '1F2937' },
        { token: 'type', foreground: 'EA580C' },
        { token: 'operator', foreground: '7C2D12' },
        { token: 'delimiter', foreground: '374151' },
      ],
      colors: {
        'editor.background': '#FEFEFE',
        'editor.foreground': '#1F2937',
        'editorLineNumber.foreground': '#9CA3AF',
        'editorLineNumber.activeForeground': '#4B5563',
        'editor.selectionBackground': '#DBEAFE',
        'editor.lineHighlightBackground': '#F8FAFC',
        'editorCursor.foreground': '#7C3AED',
        'editor.findMatchBackground': '#FEF3C7',
        'editor.findMatchHighlightBackground': '#FDE68A',
        'editorWidget.background': '#FFFFFF',
        'editorWidget.border': '#E5E7EB',
        'editorSuggestWidget.background': '#FFFFFF',
        'editorSuggestWidget.border': '#E5E7EB',
        'editorSuggestWidget.selectedBackground': '#F3F4F6',
        'scrollbarSlider.background': '#D1D5DB',
        'scrollbarSlider.hoverBackground': '#9CA3AF',
        'scrollbarSlider.activeBackground': '#6B7280',
      }
    });

    monaco.editor.setTheme('bright-modern');

    // Key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
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
        const originalLog = console.log;
        const originalError = console.error;
        const outputs = [];
        
        outputs.push({ 
          type: 'info', 
          message: '🚀 Executing JavaScript code...', 
          timestamp 
        });
        
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

        const func = new Function(code);
        const result = func();
        
        if (result !== undefined) {
          outputs.push({ 
            type: 'log', 
            message: `Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`, 
            timestamp: Date.now() 
          });
        }
        
        console.log = originalLog;
        console.error = originalError;
        
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
            message: `❌ Runtime Error: ${error.message}`, 
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
    <div className={`h-screen ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowWelcome(true)}
            className={`flex items-center space-x-3 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'} transition-colors`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Codex Playground
              </h1>
              <p className={`text-xs ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No Auth Version</p>
            </div>
          </button>
          
          <button
            onClick={() => setShowBusinessGrowth(true)}
            className={`flex items-center space-x-2 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Business Growth</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText size={16} className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900 border-gray-300 focus:border-blue-500' : 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'} px-3 py-1 rounded text-sm border focus:outline-none min-w-0`}
              />
            </div>
            
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900 border-gray-300 focus:border-blue-500' : 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'} px-3 py-1 rounded text-sm border focus:outline-none`}
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
              className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900 border-gray-300 focus:border-blue-500' : 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'} px-3 py-1 rounded text-sm border focus:outline-none`}
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme="bright-modern"
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
            }}
          />
        </div>

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
    </div>
  );
};

export default SimpleCodexEditor;