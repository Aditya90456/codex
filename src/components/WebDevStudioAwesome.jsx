import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import Editor from '@monaco-editor/react';
import { 
  Play, Download, Save, Sparkles, Code, Eye, EyeOff, Maximize2, Minimize2,
  RefreshCw, Zap, Wand2, FileCode, Palette, Layout, Terminal, Settings,
  Moon, Sun, Copy, Check, Lightbulb, Bug, Rocket, Share2, FolderOpen,
  Plus, X, ChevronDown, ChevronRight, Layers, Box, Grid, Smartphone,
  Monitor, Tablet, Command, Cpu, Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WebDevStudioAwesome = () => {
  const { user } = useUser();
  const [framework, setFramework] = useState('vanilla');
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Project</title>
</head>
<body>
  <div class="container">
    <h1>🚀 Welcome to Web Dev Studio</h1>
    <p>Start building something amazing!</p>
    <button id="myButton">Click Me</button>
  </div>
</body>
</html>`);

  const [css, setCss] = useState(`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 600px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h1 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 2.5em;
}

p {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.2em;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1em;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

button:active {
  transform: translateY(0);
}`);

  const [js, setJs] = useState(`// Your JavaScript code here
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  
  button.addEventListener('click', () => {
    alert('Hello from Web Dev Studio! 🚀');
    button.textContent = 'Clicked!';
    button.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  });
  
  console.log('Web Dev Studio initialized! ✨');
});`);

  const [activeTab, setActiveTab] = useState('html');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [aiPanel, setAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [editorLayout, setEditorLayout] = useState('horizontal');
  
  const iframeRef = useRef(null);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'log', message: args }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'error', message: args }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'warn', message: args }, '*');
              originalWarn.apply(console, args);
            };
            
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({ 
                type: 'console', 
                level: 'error', 
                message: ['Error: ' + msg + ' at line ' + line] 
              }, '*');
            };
          })();
        </script>
        <script>${js}</script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        setConsoleOutput(prev => [...prev, {
          level: event.data.level,
          message: event.data.message.join(' '),
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAIAssist = async (type) => {
    if (!user) {
      alert('Please sign in to use AI assistance');
      return;
    }

    setAiLoading(true);
    setAiPanel(true);

    const prompts = {
      improve: `Improve this ${activeTab.toUpperCase()} code:\n\n${getCurrentCode()}\n\nProvide better practices, optimization, and modern techniques.`,
      explain: `Explain this ${activeTab.toUpperCase()} code in detail:\n\n${getCurrentCode()}\n\nBreak down what each part does.`,
      debug: `Debug this ${activeTab.toUpperCase()} code and find potential issues:\n\n${getCurrentCode()}\n\nSuggest fixes.`,
      generate: aiPrompt || `Generate ${activeTab.toUpperCase()} code for: ${aiPrompt}`,
      responsive: `Make this CSS responsive and mobile-friendly:\n\n${css}`,
      accessibility: `Improve accessibility of this HTML:\n\n${html}\n\nAdd ARIA labels, semantic HTML, and best practices.`
    };

    try {
      const response = await fetch(`${API_URL}/api/ai/web-assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompts[type],
          code: getCurrentCode(),
          language: activeTab,
          userId: user.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResponse(data.response);
      } else {
        setAiResponse('AI assistance temporarily unavailable. Please try again.');
      }
    } catch (error) {
      console.error('AI assist error:', error);
      setAiResponse('Error connecting to AI. Please check your connection.');
    } finally {
      setAiLoading(false);
    }
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return html;
      case 'css': return css;
      case 'js': return js;
      default: return '';
    }
  };

  const setCurrentCode = (code) => {
    switch (activeTab) {
      case 'html': setHtml(code); break;
      case 'css': setCss(code); break;
      case 'js': setJs(code); break;
    }
  };

  const downloadProject = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshPreview = () => {
    setConsoleOutput([]);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const saveProject = async () => {
    if (!user) {
      alert('Please sign in to save projects');
      return;
    }

    const name = prompt('Project name:', projectName);
    if (!name) return;

    try {
      const response = await fetch(`${API_URL}/api/web-projects/project/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          framework,
          html,
          css,
          js,
          description: ''
        })
      });

      const data = await response.json();
      if (data.success) {
        setProjectName(data.project.name);
        alert('✅ Project saved successfully!');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const frameworks = [
    { id: 'vanilla', name: 'Vanilla JS', icon: '🍦', color: 'from-yellow-600 to-orange-600' },
    { id: 'react', name: 'React', icon: '⚛️', color: 'from-blue-600 to-cyan-600' },
    { id: 'vue', name: 'Vue.js', icon: '💚', color: 'from-green-600 to-emerald-600' },
    { id: 'tailwind', name: 'Tailwind', icon: '🎨', color: 'from-cyan-600 to-blue-600' }
  ];

  const tabs = [
    { id: 'html', label: 'HTML', icon: FileCode, color: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
    { id: 'css', label: 'CSS', icon: Palette, color: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'js', label: 'JavaScript', icon: Zap, color: 'text-yellow-400', gradient: 'from-yellow-500 to-orange-500' }
  ];

  const aiFeatures = [
    { id: 'improve', label: 'Improve Code', icon: Rocket, color: 'from-blue-600 to-cyan-600' },
    { id: 'explain', label: 'Explain Code', icon: Lightbulb, color: 'from-yellow-600 to-orange-600' },
    { id: 'debug', label: 'Debug', icon: Bug, color: 'from-red-600 to-pink-600' },
    { id: 'responsive', label: 'Make Responsive', icon: Layout, color: 'from-green-600 to-emerald-600' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, color: 'from-purple-600 to-pink-600' }
  ];

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-gray-800/80 via-gray-900/80 to-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                Web Dev Studio
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </h1>
              <p className="text-xs text-gray-400">
                {user ? `Welcome, ${user.firstName || user.username}` : 'Build amazing websites'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Framework Selector */}
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            >
              {frameworks.map(fw => (
                <option key={fw.id} value={fw.id}>
                  {fw.icon} {fw.name}
                </option>
              ))}
            </select>

            <button
              onClick={saveProject}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all shadow-lg transform hover:scale-105"
              title="Save project"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">Save</span>
            </button>
            
            <button
              onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
              title="Toggle theme"
            >
              {theme === 'vs-dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`p-2 rounded-lg transition-all ${showConsole ? 'bg-blue-600' : 'hover:bg-gray-700/50'}`}
              title="Toggle console"
            >
              <Terminal className="w-5 h-5" />
            </button>

            <button
              onClick={refreshPreview}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={copyCode}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
              title="Copy code"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>

            <button
              onClick={downloadProject}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all shadow-lg transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">Export</span>
            </button>

            <button
              onClick={() => setAiPanel(!aiPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all shadow-lg transform hover:scale-105"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">AI Assist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-700/50`}>
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm px-4 py-3 border-b border-gray-700/50">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  {tab.label}
                </button>
              );
            })}
            
            <div className="flex-1"></div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity className="w-4 h-4" />
              <span>{getCurrentCode().split('\n').length} lines</span>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={activeTab === 'js' ? 'javascript' : activeTab}
              theme={theme}
              value={getCurrentCode()}
              onChange={(value) => setCurrentCode(value || '')}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'always',
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>

          {/* Console */}
          {showConsole && (
            <div className="h-48 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 overflow-auto">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold">Console</span>
                  <span className="text-xs text-gray-400">({consoleOutput.length} messages)</span>
                </div>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1 hover:bg-gray-700/50 rounded transition-all"
                >
                  Clear
                </button>
              </div>
              <div className="p-4 font-mono text-sm space-y-1">
                {consoleOutput.length === 0 ? (
                  <div className="text-gray-500 italic">Console output will appear here...</div>
                ) : (
                  consoleOutput.map((log, i) => (
                    <div key={i} className={`flex items-start gap-2 ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      <span className="text-gray-500 text-xs">{log.timestamp}</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 flex flex-col bg-gray-900/50">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Live Preview</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Device Selector */}
                <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded transition-all ${previewDevice === 'mobile' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    title="Mobile view"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-2 rounded transition-all ${previewDevice === 'tablet' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    title="Tablet view"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded transition-all ${previewDevice === 'desktop' ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
                    title="Desktop view"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
                  title="Hide preview"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-gray-800/20">
              <div 
                className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
                style={{ width: getDeviceWidth(), height: '100%' }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={srcDoc}
                  title="preview"
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {!showPreview && (
          <button
            onClick={() => setShowPreview(true)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-2xl transition-all"
            title="Show preview"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {/* AI Panel */}
        {aiPanel && (
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg">AI Assistant</h3>
              </div>
              <button
                onClick={() => setAiPanel(false)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {aiFeatures.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleAIAssist(feature.id)}
                      disabled={aiLoading}
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all bg-gradient-to-r ${feature.color} hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{feature.label}</span>
                    </button>
                  );
                })}
              </div>

              {aiLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              )}

              {aiResponse && !aiLoading && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    AI Response
                  </h4>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebDevStudioAwesome;
