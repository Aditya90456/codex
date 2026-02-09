import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import Editor from '@monaco-editor/react';
import WebProjectManager from './WebProjectManager';
import { 
  Play, 
  Download, 
  Upload, 
  Save, 
  Sparkles, 
  Code, 
  Eye, 
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  Wand2,
  FileCode,
  Palette,
  Layout,
  Terminal,
  Settings,
  Moon,
  Sun,
  Copy,
  Check,
  MessageSquare,
  Lightbulb,
  Bug,
  Rocket,
  GitBranch,
  Share2,
  FolderOpen,
  Plus
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WebDevStudio = () => {
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
    <h1>Welcome to Web Dev Studio</h1>
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
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [showSnippets, setShowSnippets] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const iframeRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          // Capture console logs
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
    const zip = `
<!-- index.html -->
${html}

<!-- styles.css -->
<style>
${css}
</style>

<!-- script.js -->
<script>
${js}
</script>
    `;
    
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
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
          projectId: currentProject?.id,
          name,
          folderId: currentProject?.folderId || 'default',
          framework,
          html,
          css,
          js,
          description: ''
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentProject(data.project);
        setProjectName(data.project.name);
        alert('Project saved successfully!');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const loadProject = (project) => {
    setHtml(project.html);
    setCss(project.css);
    setJs(project.js);
    setFramework(project.framework);
    setCurrentProject(project);
    setProjectName(project.name);
  };

  const frameworks = [
    { id: 'vanilla', name: 'Vanilla JS', icon: '🍦', color: 'from-yellow-600 to-orange-600' },
    { id: 'react', name: 'React', icon: '⚛️', color: 'from-blue-600 to-cyan-600' },
    { id: 'vue', name: 'Vue.js', icon: '💚', color: 'from-green-600 to-emerald-600' },
    { id: 'angular', name: 'Angular', icon: '🅰️', color: 'from-red-600 to-pink-600' },
    { id: 'svelte', name: 'Svelte', icon: '🔥', color: 'from-orange-600 to-red-600' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', color: 'from-gray-600 to-gray-800' },
    { id: 'tailwind', name: 'Tailwind', icon: '🎨', color: 'from-cyan-600 to-blue-600' },
    { id: 'bootstrap', name: 'Bootstrap', icon: '🅱️', color: 'from-purple-600 to-indigo-600' }
  ];

  const codeSnippets = {
    html: [
      {
        name: 'Responsive Card',
        code: `<div class="card">
  <img src="https://via.placeholder.com/400x200" alt="Card image">
  <div class="card-body">
    <h3>Card Title</h3>
    <p>Card description goes here</p>
    <button>Learn More</button>
  </div>
</div>`
      },
      {
        name: 'Navigation Bar',
        code: `<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <ul class="nav-menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button class="nav-toggle">☰</button>
</nav>`
      },
      {
        name: 'Hero Section',
        code: `<section class="hero">
  <div class="hero-content">
    <h1>Welcome to Our Website</h1>
    <p>Build amazing things with modern web technologies</p>
    <div class="hero-buttons">
      <button class="btn-primary">Get Started</button>
      <button class="btn-secondary">Learn More</button>
    </div>
  </div>
</section>`
      },
      {
        name: 'Contact Form',
        code: `<form class="contact-form">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Your name" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="your@email.com" required>
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" rows="5" placeholder="Your message" required></textarea>
  </div>
  <button type="submit">Send Message</button>
</form>`
      }
    ],
    css: [
      {
        name: 'Glassmorphism Card',
        code: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}`
      },
      {
        name: 'Gradient Button',
        code: `.gradient-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}`
      },
      {
        name: 'Animated Loading',
        code: `.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
      },
      {
        name: 'Flexbox Grid',
        code: `.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.grid-item {
  flex: 1 1 calc(33.333% - 20px);
  min-width: 250px;
}

@media (max-width: 768px) {
  .grid-item {
    flex: 1 1 100%;
  }
}`
      }
    ],
    js: [
      {
        name: 'Smooth Scroll',
        code: `document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});`
      },
      {
        name: 'Dark Mode Toggle',
        code: `const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
  darkModeToggle.textContent = '☀️';
}`
      },
      {
        name: 'Form Validation',
        code: `const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Validate
  if (!data.email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }
  
  console.log('Form submitted:', data);
  alert('Form submitted successfully!');
  form.reset();
});`
      },
      {
        name: 'Fetch API Example',
        code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();`
      }
    ]
  };

  const tabs = [
    { id: 'html', label: 'HTML', icon: FileCode, color: 'text-orange-400' },
    { id: 'css', label: 'CSS', icon: Palette, color: 'text-blue-400' },
    { id: 'js', label: 'JavaScript', icon: Zap, color: 'text-yellow-400' }
  ];

  const aiFeatures = [
    { id: 'improve', label: 'Improve Code', icon: Rocket, color: 'from-blue-600 to-cyan-600' },
    { id: 'explain', label: 'Explain Code', icon: Lightbulb, color: 'from-yellow-600 to-orange-600' },
    { id: 'debug', label: 'Debug', icon: Bug, color: 'from-red-600 to-pink-600' },
    { id: 'responsive', label: 'Make Responsive', icon: Layout, color: 'from-green-600 to-emerald-600' },
    { id: 'accessibility', label: 'Accessibility', icon: Eye, color: 'from-purple-600 to-pink-600' },
    { id: 'convert', label: `Convert to ${frameworks.find(f => f.id === framework)?.name}`, icon: RefreshCw, color: 'from-indigo-600 to-purple-600' }
  ];

  const loadFrameworkTemplate = (frameworkId) => {
    const templates = {
      react: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
        css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 600px;
}

.title {
  color: #61dafb;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.button {
  background: #61dafb;
  color: #282c34;
  border: none;
  padding: 15px 40px;
  font-size: 1.1em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(97, 218, 251, 0.4);
}`,
        js: `const { useState } = React;

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome to React! ⚛️');

  const handleClick = () => {
    setCount(count + 1);
    setMessage(\`Clicked \${count + 1} times!\`);
  };

  return (
    <div className="app">
      <h1 className="title">React App</h1>
      <p>{message}</p>
      <button className="button" onClick={handleClick}>
        Click Me ({count})
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`
      },
      vue: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue App</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <div class="container">
      <h1 class="title">{{ title }}</h1>
      <p>{{ message }}</p>
      <button class="button" @click="handleClick">
        Click Me ({{ count }})
      </button>
    </div>
  </div>
</body>
</html>`,
        css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
  max-width: 600px;
}

.title {
  color: #42b883;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.button {
  background: #42b883;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(66, 184, 131, 0.4);
}`,
        js: `const { createApp } = Vue;

createApp({
  data() {
    return {
      title: 'Vue.js App 💚',
      message: 'Welcome to Vue!',
      count: 0
    }
  },
  methods: {
    handleClick() {
      this.count++;
      this.message = \`Clicked \${this.count} times!\`;
    }
  }
}).mount('#app');`
      },
      tailwind: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-purple-600 to-blue-600 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
    <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
      Tailwind CSS 🎨
    </h1>
    <p class="text-gray-600 mb-6 text-lg">
      Build modern websites with utility-first CSS
    </p>
    <button id="btn" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
      Click Me
    </button>
    <div id="output" class="mt-6 text-gray-700"></div>
  </div>
</body>
</html>`,
        css: `/* Tailwind handles most styling via classes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}`,
        js: `document.getElementById('btn').addEventListener('click', function() {
  const output = document.getElementById('output');
  output.innerHTML = '<div class="animate-fade-in bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">✨ Tailwind makes styling easy!</div>';
});`
      }
    };

    const template = templates[frameworkId];
    if (template) {
      setHtml(template.html);
      setCss(template.css);
      setJs(template.js);
      setFramework(frameworkId);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Web Dev Studio
                </h1>
                {user && (
                  <p className="text-xs text-gray-400">
                    Welcome back, {user.firstName || user.username || 'Developer'}! 👋
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>AI-Powered</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Framework Selector */}
            <select
              value={framework}
              onChange={(e) => loadFrameworkTemplate(e.target.value)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {frameworks.map(fw => (
                <option key={fw.id} value={fw.id}>
                  {fw.icon} {fw.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowProjectManager(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              title="Open projects"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden md:inline">Projects</span>
            </button>

            <button
              onClick={saveProject}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
              title="Save project"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline">Save</span>
            </button>
            
            <button
              onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              title="Toggle theme"
            >
              {theme === 'vs-dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              title="Toggle console"
            >
              <Terminal className="w-5 h-5" />
            </button>

            <button
              onClick={refreshPreview}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              title="Refresh preview"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={copyCode}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              title="Copy code"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>

            <button
              onClick={downloadProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={() => setAiPanel(!aiPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
            >
              <Wand2 className="w-4 h-4" />
              AI Assist
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-700`}>
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-gray-800/30 px-4 py-2 border-b border-gray-700">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                </button>
              );
            })}
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
                showFoldingControls: 'always'
              }}
            />
          </div>

          {/* Console */}
          {showConsole && (
            <div className="h-48 bg-gray-900 border-t border-gray-700 overflow-auto">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold">Console</span>
                </div>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="p-4 font-mono text-sm space-y-1">
                {consoleOutput.length === 0 ? (
                  <div className="text-gray-500">Console output will appear here...</div>
                ) : (
                  consoleOutput.map((log, i) => (
                    <div key={i} className={`flex items-start gap-2 ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      <span className="text-gray-500 text-xs">{log.timestamp}</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 flex flex-col bg-white">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center gap-2 text-white">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Live Preview</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={srcDoc}
              title="preview"
              sandbox="allow-scripts allow-same-origin"
              className="flex-1 w-full border-0"
            />
          </div>
        )}

        {!showPreview && (
          <button
            onClick={() => setShowPreview(true)}
            className="absolute right-4 top-24 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {/* AI Panel */}
        {aiPanel && (
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gray-800 border-l border-gray-700 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <button
                onClick={() => setAiPanel(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* AI Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Quick Actions</h4>
                {aiFeatures.map(feature => {
                  const Icon = feature.icon;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleAIAssist(feature.id)}
                      disabled={aiLoading}
                      className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r ${feature.color} rounded-lg hover:opacity-90 transition-all disabled:opacity-50`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{feature.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400">Custom Request</h4>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI anything about your code..."
                  className="w-full p-3 bg-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
                <button
                  onClick={() => handleAIAssist('generate')}
                  disabled={aiLoading || !aiPrompt}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  {aiLoading ? 'Processing...' : 'Ask AI'}
                </button>
              </div>

              {/* AI Response */}
              {aiResponse && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-400">AI Response</h4>
                  <div className="p-4 bg-gray-700 rounded-lg text-sm whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}

              {aiLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Manager Modal */}
      {showProjectManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-6xl h-[80vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <WebProjectManager
              onLoadProject={loadProject}
              onClose={() => setShowProjectManager(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebDevStudio;
