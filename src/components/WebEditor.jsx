import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Save, Download, Upload, Copy, Maximize2, Minimize2, Terminal,
  Code, FileText, Folder, Plus, X, RefreshCw, Settings, Smartphone,
  Globe, Server, Package, Eye, EyeOff, Layout, Palette, Zap
} from 'lucide-react';

const WebEditor = ({ onBack }) => {
  // Core editor state
  const [files, setFiles] = useState({
    'index.html': {
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodePen Clone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="hero">
            <h1 class="title">🚀 Welcome to CodePen</h1>
            <p class="subtitle">Build, test, and discover front-end code</p>
        </header>
        
        <main class="content">
            <div class="card">
                <h2>✨ Interactive Demo</h2>
                <p id="demo-text">Click the button below!</p>
                <button id="demo-btn" class="btn">Click Me!</button>
                <div id="counter">Clicks: <span id="count">0</span></div>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🎨</div>
                    <h3>CSS Magic</h3>
                    <p>Beautiful animations and styles</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>JavaScript Power</h3>
                    <p>Interactive functionality</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📱</div>
                    <h3>Responsive Design</h3>
                    <p>Works on all devices</p>
                </div>
            </div>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      language: 'html',
      type: 'html'
    },
    'style.css': {
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
}

.title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    animation: fadeInUp 1s ease-out;
}

.subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 0.2s both;
}

.content {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
}

.card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.card h2 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 2rem;
}

.btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn:active {
    transform: translateY(0);
}

#counter {
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #667eea;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.feature {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    animation: fadeInUp 1s ease-out 0.6s both;
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature h3 {
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .title {
        font-size: 2rem;
    }
    
    .container {
        padding: 1rem;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
}`,
      language: 'css',
      type: 'css'
    },
    'script.js': {
      content: `// Interactive demo functionality
let clickCount = 0;
const demoBtn = document.getElementById('demo-btn');
const demoText = document.getElementById('demo-text');
const countSpan = document.getElementById('count');

const messages = [
    "Great job! 🎉",
    "Keep clicking! ⚡",
    "You're awesome! ✨",
    "Amazing! 🚀",
    "Fantastic! 🌟",
    "Incredible! 💫",
    "Outstanding! 🎊",
    "Brilliant! 💎"
];

demoBtn.addEventListener('click', () => {
    clickCount++;
    countSpan.textContent = clickCount;
    
    // Change message based on click count
    const messageIndex = (clickCount - 1) % messages.length;
    demoText.textContent = messages[messageIndex];
    
    // Add click animation
    demoBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        demoBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Add celebration effect for milestones
    if (clickCount % 10 === 0) {
        createConfetti();
    }
});

// Confetti effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = \`fall \${Math.random() * 2 + 1}s linear forwards\`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = \`
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
\`;
document.head.appendChild(style);

// Add some interactive hover effects
document.querySelectorAll('.feature').forEach(feature => {
    feature.addEventListener('mouseenter', () => {
        feature.style.transform = 'translateY(-5px)';
        feature.style.transition = 'transform 0.3s ease';
    });
    
    feature.addEventListener('mouseleave', () => {
        feature.style.transform = 'translateY(0)';
    });
});

console.log('🚀 CodePen Clone loaded successfully!');
console.log('Try clicking the demo button and watch the magic happen!');`,
      language: 'javascript',
      type: 'javascript'
    }
  });

  const [activeFile, setActiveFile] = useState('index.html');
  const [theme, setTheme] = useState('vs-dark');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [layout, setLayout] = useState('horizontal'); // horizontal, vertical, preview-only
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);

  // Theme configurations
  const themes = [
    { value: 'vs-dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'hc-black', label: 'High Contrast', icon: '🔲' }
  ];

  // Layout configurations
  const layouts = [
    { value: 'horizontal', label: 'Horizontal Split', icon: '⬌' },
    { value: 'vertical', label: 'Vertical Split', icon: '⬍' },
    { value: 'preview-only', label: 'Preview Only', icon: '👁️' }
  ];

  // Monaco editor setup
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRun();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      openPreviewInNewTab();
    });
  };

  // Generate live preview
  const generatePreview = () => {
    const htmlFile = files['index.html'];
    const cssFile = files['style.css'];
    const jsFile = files['script.js'];
    
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
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssFile.content}</style>`
      );
    }
    
    // Inject JavaScript
    if (jsFile) {
      htmlContent = htmlContent.replace(
        '<script src="script.js"></script>',
        `<script>${jsFile.content}</script>`
      );
    }
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    
    setConsoleOutput(prev => [...prev, { 
      type: 'success', 
      message: '✅ Preview updated successfully!', 
      timestamp: Date.now() 
    }]);
  };

  // Auto-generate preview when files change
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [files]);

  // Initial preview generation
  useEffect(() => {
    generatePreview();
  }, []);

  const handleRun = () => {
    setIsExecuting(true);
    generatePreview();
    
    setConsoleOutput(prev => [...prev, { 
      type: 'info', 
      message: `🚀 Running ${activeFile}...`, 
      timestamp: Date.now() 
    }]);
    
    setTimeout(() => setIsExecuting(false), 1000);
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
    const fileName = prompt('Enter file name (e.g., newfile.js):');
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
          content = '/* Add your styles here */\nbody {\n    font-family: Arial, sans-serif;\n}';
          break;
        case 'js':
          language = 'javascript';
          content = '// Add your JavaScript here\nconsole.log("Hello World!");';
          break;
        case 'jsx':
          language = 'javascriptreact';
          content = 'import React from "react";\n\nconst Component = () => {\n    return <div>Hello World!</div>;\n};\n\nexport default Component;';
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
      default: return '📄';
    }
  };

  const toggleLayout = () => {
    const layoutOrder = ['horizontal', 'vertical', 'preview-only'];
    const currentIndex = layoutOrder.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layoutOrder.length;
    setLayout(layoutOrder[nextIndex]);
  };

  return (
    <div className={`h-screen bg-gray-900 text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Modern Header */}
      <div className="bg-gray-800 border-gray-700 border-b px-6 py-4">
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CodePen Pro
                </h1>
                <p className="text-xs text-gray-400">Build, test, and discover front-end code</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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

            {/* Layout Toggle */}
            <button
              onClick={toggleLayout}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              title={`Current: ${layout}`}
            >
              <Layout size={16} />
              <span className="hidden sm:inline">{layouts.find(l => l.value === layout)?.icon}</span>
            </button>

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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {showFileExplorer && layout !== 'preview-only' && (
          <div className="w-64 bg-gray-800 border-gray-700 border-r flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-200">Files</h3>
                <button
                  onClick={addNewFile}
                  className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                  title="Add new file"
                >
                  <Plus size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {Object.keys(files).map(fileName => (
                <div
                  key={fileName}
                  className={`group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                    activeFile === fileName ? 'bg-gray-700 border-r-2 border-purple-500' : ''
                  }`}
                  onClick={() => setActiveFile(fileName)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getFileIcon(fileName)}</span>
                    <span className="text-sm text-gray-200">{fileName}</span>
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
        )}

        {/* Editor and Preview Container */}
        <div className="flex-1 flex flex-col">
          {layout === 'preview-only' ? (
            /* Preview Only Mode */
            <div className="flex-1 bg-white">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-none"
                  title="Live Preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <Eye size={40} className="text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">No Preview Available</p>
                    <p className="text-sm">Edit your code to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Editor + Preview Mode */
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
                  
                  <div className="flex-1">
                    {previewUrl ? (
                      <iframe
                        src={previewUrl}
                        className="w-full h-full border-none"
                        title="Live Preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <Zap size={32} className="text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-700">Building Preview...</p>
                          <p className="text-sm text-gray-500">Your code will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Console */}
          {showConsole && layout !== 'preview-only' && (
            <div className="h-48 bg-gray-900 border-gray-700 border-t flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Terminal size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-200">Console</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setConsoleOutput([])}
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
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {consoleOutput.map((output, index) => (
                  <div key={index} className={`mb-2 ${
                    output.type === 'error' ? 'text-red-400' :
                    output.type === 'success' ? 'text-green-400' :
                    output.type === 'warning' ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}>
                    <span className="text-gray-500 text-xs mr-2">
                      {new Date(output.timestamp).toLocaleTimeString()}
                    </span>
                    {output.message}
                  </div>
                ))}
                {consoleOutput.length === 0 && (
                  <div className="text-gray-500">Console output will appear here...</div>
                )}
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
    </div>
  );
};

export default WebEditor;