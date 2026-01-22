import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import UserProfile from './UserProfile';
import Settings from './Settings';
import VSCodeEditor from './VSCodeEditorClean';
import AdvancedWebEditor from './AdvancedWebEditor';
import AndroidEditor from './AndroidEditor';
import AIUniversalCreator from './AI/AIUniversalCreatorModern';
import DSA250Awesome from './DSA/DSA250Awesome';
import VisualTutorials from './DSA/VisualTutorials';
import InterviewReady from './DSA/InterviewReady';
import StriverTributePage from '../pages/StriverTributePage';
import { 
  Code, 
  Zap, 
  Users,
  Target,
  ArrowRight,
  Play,
  BookOpen,
  Trophy,
  CheckCircle,
  Rocket,
  Globe,
  Shield,
  Cpu,
  Settings as SettingsIcon,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
  UserCircle,
  Star,
  Bell,
  Moon,
  Sun,
  Monitor,
  BarChart3,
  FolderOpen,
  Lightbulb,
  Layers,
  Sparkles,
  Terminal,
  Box,
  Flame,
  TrendingUp,
  GraduationCap,
  Video,
  FileText,
  Award,
  Save,
  Download,
  Upload,
  Copy,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Trash2,
  Edit3,
  Heart,
  FileCode,
  GitBranch,
  Search,
  Command,
  Smartphone,
  Brain,
  X
} from 'lucide-react';

const WelcomeScreenModern = ({ onCreateNew, onShowAuth, onShowDashboard }) => {
  const { user, logout } = useUniversalAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVSCodeEditor, setShowVSCodeEditor] = useState(false);
  const [showAdvancedWebEditor, setShowAdvancedWebEditor] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showEditorToolbar, setShowEditorToolbar] = useState(false);
  const [editorMode, setEditorMode] = useState('standard'); // standard, fullscreen, split
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentProjects, setRecentProjects] = useState([
    { name: 'Calculator App', language: 'JavaScript', lastModified: '2 hours ago', icon: '🧮' },
    { name: 'Todo List', language: 'Python', lastModified: '1 day ago', icon: '✅' },
    { name: 'Weather API', language: 'Java', lastModified: '3 days ago', icon: '🌤️' }
  ]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAndroidEditor, setShowAndroidEditor] = useState(false);
  const [showAICreator, setShowAICreator] = useState(false);
  const [showDSA250, setShowDSA250] = useState(false);
  const [showVisualTutorials, setShowVisualTutorials] = useState(false);
  const [showInterviewReady, setShowInterviewReady] = useState(false);
  const [showStriverTribute, setShowStriverTribute] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showSnippetsLibrary, setShowSnippetsLibrary] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI coding assistant. How can I help you today?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [files, setFiles] = useState([
    { name: 'index.js', type: 'javascript', size: '2.4 KB', modified: '2 min ago' },
    { name: 'styles.css', type: 'css', size: '1.8 KB', modified: '5 min ago' },
    { name: 'App.jsx', type: 'react', size: '3.2 KB', modified: '10 min ago' }
  ]);
  const [codeSnippets, setCodeSnippets] = useState([
    { 
      id: 1, 
      title: 'React useState Hook', 
      language: 'javascript',
      code: 'const [state, setState] = useState(initialValue);',
      category: 'React',
      tags: ['hooks', 'state']
    },
    { 
      id: 2, 
      title: 'Async/Await Function', 
      language: 'javascript',
      code: 'async function fetchData() {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}',
      category: 'JavaScript',
      tags: ['async', 'fetch']
    },
    { 
      id: 3, 
      title: 'Python List Comprehension', 
      language: 'python',
      code: 'squares = [x**2 for x in range(10)]',
      category: 'Python',
      tags: ['list', 'comprehension']
    },
    { 
      id: 4, 
      title: 'Express Route Handler', 
      language: 'javascript',
      code: 'app.get(\'/api/users\', async (req, res) => {\n  try {\n    const users = await User.find();\n    res.json(users);\n  } catch (error) {\n    res.status(500).json({ error: error.message });\n  }\n});',
      category: 'Node.js',
      tags: ['express', 'api']
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
      if (!event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const notifications = [
    { id: 1, type: 'achievement', message: 'Welcome to Codex Playground!', time: '1 hour ago', unread: true },
    { id: 2, type: 'system', message: 'New features available', time: '2 hours ago', unread: true },
    { id: 3, type: 'social', message: 'Join our community', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const languages = [
    { name: 'JavaScript', code: 'console.log("Hello, World!");', color: 'from-yellow-400 to-orange-500', icon: '🟨' },
    { name: 'Python', code: 'print("Hello, World!")', color: 'from-green-400 to-blue-500', icon: '🐍' },
    { name: 'Java', code: 'System.out.println("Hello, World!");', color: 'from-red-400 to-pink-500', icon: '☕' },
    { name: 'C++', code: 'cout << "Hello, World!" << endl;', color: 'from-blue-400 to-purple-500', icon: '⚡' }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "CP-AI Code Generator",
      description: "Generate complete apps instantly with Gemini AI",
      color: "from-purple-500 to-pink-500",
      badge: "🔥 Hot",
      action: () => setShowAICreator(true),
      highlight: true
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Multi-Language IDE",
      description: "Code in 12+ languages with intelligent autocomplete",
      color: "from-blue-500 to-cyan-500",
      badge: "Popular"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant code execution with real-time output",
      color: "from-yellow-500 to-orange-500",
      badge: "Fast"
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "Web Projects",
      description: "Build full-stack apps with live preview",
      color: "from-green-500 to-emerald-500",
      badge: "New"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Practice DSA",
      description: "Solve 250+ coding problems with solutions",
      color: "from-purple-500 to-pink-500",
      badge: "Pro"
    }
  ];

  const quickStart = [
    { name: 'JavaScript', ext: 'js', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500', action: () => onCreateNew('javascript') },
    { name: 'Python', ext: 'py', color: 'bg-green-500', gradient: 'from-green-500 to-blue-500', action: () => onCreateNew('python') },
    { name: 'Java', ext: 'java', color: 'bg-red-500', gradient: 'from-red-500 to-pink-500', action: () => onCreateNew('java') },
    { name: 'C++', ext: 'cpp', color: 'bg-blue-500', gradient: 'from-blue-500 to-purple-500', action: () => onCreateNew('cpp') }
  ];

  // Editor Actions
  const handleSaveProject = () => {
    console.log('Saving project...');
    // Implement save logic
  };

  const handleDownloadProject = () => {
    console.log('Downloading project...');
    // Implement download logic
  };

  const handleShareProject = () => {
    setShowShareModal(true);
  };

  const handleCopyCode = () => {
    console.log('Copying code...');
    // Implement copy logic
  };

  const handleToggleFullscreen = () => {
    setEditorMode(editorMode === 'fullscreen' ? 'standard' : 'fullscreen');
  };

  const handleResetEditor = () => {
    if (confirm('Reset editor to default state?')) {
      console.log('Resetting editor...');
      // Implement reset logic
    }
  };

  const handleOpenCommandPalette = () => {
    setShowCommandPalette(true);
  };

  const handleSendAIMessage = () => {
    if (!aiInput.trim()) return;
    
    setAiMessages(prev => [...prev, { role: 'user', content: aiInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Here\'s a solution to your problem...',
        'I can help you with that! Try this approach...',
        'Great question! Let me explain...',
        'Here\'s an optimized version of your code...'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
    
    setAiInput('');
  };

  const handleCopySnippet = (code) => {
    navigator.clipboard.writeText(code);
    alert('Snippet copied to clipboard!');
  };

  const handleInsertSnippet = (code) => {
    console.log('Inserting snippet:', code);
    // Implement insert logic
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenCommandPalette();
      }
      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveProject();
      }
      // Ctrl/Cmd + Shift + S for share
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        handleShareProject();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editorMode]);

  // Conditional returns AFTER all hooks
  if (showVSCodeEditor) {
    return <VSCodeEditor onBack={() => setShowVSCodeEditor(false)} />;
  }

  if (showAdvancedWebEditor) {
    return <AdvancedWebEditor onBack={() => setShowAdvancedWebEditor(false)} />;
  }

  if (showAndroidEditor) {
    return <AndroidEditor onBack={() => setShowAndroidEditor(false)} />;
  }

  if (showAICreator) {
    return <AIUniversalCreator onBack={() => setShowAICreator(false)} />;
  }

  if (showDSA250) {
    return <DSA250Awesome onBack={() => setShowDSA250(false)} />;
  }

  if (showVisualTutorials) {
    return <VisualTutorials onBack={() => setShowVisualTutorials(false)} />;
  }

  if (showInterviewReady) {
    return <InterviewReady onBack={() => setShowInterviewReady(false)} />;
  }

  if (showStriverTribute) {
    return <StriverTributePage onBack={() => setShowStriverTribute(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative h-screen overflow-y-auto">
        {/* Modern Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Codex
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">Playground</p>
                </div>
              </div>
              
              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleTheme}
                  className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-slate-800"
                >
                  {getThemeIcon()}
                </button>

                <button className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-slate-800">
                  <HelpCircle size={20} />
                </button>

                {user ? (
                  <>
                    <div className="relative notifications-dropdown">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative text-slate-400 hover:text-white transition-colors p-2.5 rounded-xl hover:bg-slate-800"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
                          <div className="p-4 border-b border-slate-700">
                            <h3 className="text-white font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                              <p className="text-sm text-slate-400">{unreadCount} unread</p>
                            )}
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 transition-colors ${
                                  notification.unread ? 'bg-blue-900/20' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500' : 'bg-slate-600'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-sm text-white">{notification.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative user-dropdown">
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center space-x-3 text-white hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all"
                      >
                        <div className="w-9 h-9 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                          <div className="text-sm font-semibold">{user.username}</div>
                          <div className="text-xs text-slate-400">{user.email || 'user@example.com'}</div>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${
                          showUserDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {showUserDropdown && (
                        <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
                          <div className="p-4 border-b border-slate-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                                <User size={20} className="text-white" />
                              </div>
                              <div>
                                <div className="text-white font-semibold">{user.username}</div>
                                <div className="text-sm text-slate-400">{user.email || 'user@example.com'}</div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Star size={12} className="text-yellow-400" />
                                  <span className="text-xs text-slate-400">{user.rating || '1200'} rating</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <button 
                              onClick={() => {
                                setShowProfile(true);
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <UserCircle size={18} />
                              <span className="text-sm">Profile</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (onShowDashboard) onShowDashboard();
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <BarChart3 size={18} />
                              <span className="text-sm">Dashboard</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                setShowSettings(true);
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            >
                              <SettingsIcon size={18} />
                              <span className="text-sm">Settings</span>
                            </button>
                          </div>

                          <div className="border-t border-slate-700 py-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                            >
                              <LogOut size={18} />
                              <span className="text-sm">Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onShowAuth('login')}
                      className="text-slate-300 hover:text-white transition-colors px-5 py-2.5 rounded-xl hover:bg-slate-800 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => onShowAuth('signup')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {user ? (
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-400 border border-green-500/20 mb-6">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Welcome back, {user.name || user.username}!
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                      Let's
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Build Today
                      </span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                      Continue your coding journey. Your workspace is ready.
                    </p>

                    {/* User Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {user.solvedProblems || 0}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Solved</div>
                      </div>
                      <div className="text-center border-x border-slate-700">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {user.rating || 1200}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {user.streak || 5}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Day Streak</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => onCreateNew()}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Code className="w-6 h-6" />
                          <span>Start Coding</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                      
                      <button
                        onClick={() => navigate('/dsa')}
                        className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Trophy className="w-6 h-6" />
                          <span>Practice Now</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 mb-6">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI-Powered Code Assistant
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                      Code Like
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Never Before
                      </span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                      The most powerful online IDE. Write, run, and deploy code in seconds. 
                      No setup required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <button
                        onClick={() => onCreateNew()}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Play className="w-6 h-6" />
                          <span>Start Coding Free</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                      
                      <button className="bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700 hover:border-slate-600 px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3">
                        <BookOpen className="w-6 h-6" />
                        <span>View Examples</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Start Languages */}
                <div>
                  <p className="text-sm text-slate-400 mb-4 font-medium">Quick start with:</p>
                  <div className="flex flex-wrap gap-3">
                    {quickStart.map((lang, index) => (
                      <button
                        key={index}
                        onClick={lang.action}
                        className={`group relative overflow-hidden bg-gradient-to-r ${lang.gradient} hover:opacity-90 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{lang.name}</span>
                          <span className="text-xs opacity-75">.{lang.ext}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Modern Code Preview */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>
                  
                  {/* Code Editor */}
                  <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{languages[activeLanguage].icon}</span>
                          <span className="text-sm text-slate-400 font-mono">
                            main.{languages[activeLanguage].name.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${languages[activeLanguage].color} animate-pulse`}></div>
                        <span className="text-sm font-bold text-slate-300">{languages[activeLanguage].name}</span>
                      </div>
                      
                      <div className="bg-slate-950/50 rounded-2xl p-6 font-mono text-base border border-slate-800">
                        <div className="flex">
                          <div className="text-slate-600 mr-6 select-none">1</div>
                          <div className="text-green-400 flex-1">{languages[activeLanguage].code}</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-5 bg-slate-950/30 rounded-2xl border-l-4 border-green-500">
                        <div className="flex items-center space-x-3 text-green-400 text-sm font-mono">
                          <CheckCircle className="w-5 h-5" />
                          <span>Output: Hello, World!</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2 font-mono">Executed in 0.02s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative py-24 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <Flame className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-5xl font-black mb-6">
                Everything You Need
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  In One Place
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Professional-grade tools for developers of all levels
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group relative ${feature.action ? 'cursor-pointer' : ''}`}
                  onClick={feature.action}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur ${feature.highlight ? 'opacity-50 group-hover:opacity-75' : 'opacity-0 group-hover:opacity-30'} transition duration-500`}></div>
                  <div className={`relative bg-slate-800/50 backdrop-blur border ${feature.highlight ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-slate-700/50'} rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 h-full ${feature.highlight ? 'transform scale-105' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl text-white ${feature.highlight ? 'animate-pulse' : ''}`}>
                        {feature.icon}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    {feature.highlight && (
                      <div className="mt-4 flex items-center space-x-2 text-purple-400 text-sm font-semibold">
                        <span>Click to try →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur border border-slate-700/50 rounded-3xl p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-blue-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">50K+</div>
                  <div className="text-sm text-slate-400 font-medium">Active Developers</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-purple-400">
                    <Play className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">1M+</div>
                  <div className="text-sm text-slate-400 font-medium">Code Executions</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-pink-400">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">500K+</div>
                  <div className="text-sm text-slate-400 font-medium">Problems Solved</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-green-400">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">95%</div>
                  <div className="text-sm text-slate-400 font-medium">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DSA Tutorials Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-cyan-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20 mb-6">
                <GraduationCap className="w-4 h-4 mr-2" />
                Learn DSA
              </div>
              <h2 className="text-5xl font-black mb-6">
                Master Data Structures
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  & Algorithms
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Interactive tutorials, visual explanations, and hands-on practice
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tutorial Card 1 - Visual Learning */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Visual Tutorials</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Watch animated explanations of complex algorithms. See how data structures work in real-time.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span>3D Visualizations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span>Step-by-step Animations</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span>Interactive Examples</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dsa/tutorials')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Learning</span>
                  </button>
                </div>
              </div>

              {/* Tutorial Card 2 - Practice Problems */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">250+ Problems</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Practice with curated DSA problems. From basics to advanced, with detailed solutions.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Difficulty Levels</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Detailed Solutions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Progress Tracking</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dsa')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Code className="w-5 h-5" />
                    <span>Practice Now</span>
                  </button>
                </div>
              </div>

              {/* Tutorial Card 3 - Interview Prep */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Interview Ready</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Prepare for technical interviews with company-specific questions and patterns.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                      <span>FAANG Questions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                      <span>Common Patterns</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                      <span>Mock Interviews</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dsa/interview')}
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>Get Started</span>
                  </button>
                </div>
              </div>

              {/* Tutorial Card 4 - Striver Tribute */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Tribute to Striver</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Honoring Striver's incredible contribution to DSA education. Free resources for millions.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-pink-400" />
                      <span>YouTube Playlists</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-pink-400" />
                      <span>Learning Resources</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-pink-400" />
                      <span>Success Stories</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowStriverTribute(true)}
                    className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>View Tribute</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DSA Topics Grid */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Popular Topics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Arrays', color: 'from-blue-500 to-cyan-500' },
                  { name: 'Linked Lists', color: 'from-purple-500 to-pink-500' },
                  { name: 'Trees', color: 'from-green-500 to-emerald-500' },
                  { name: 'Graphs', color: 'from-orange-500 to-red-500' },
                  { name: 'Dynamic Programming', color: 'from-yellow-500 to-orange-500' },
                  { name: 'Sorting', color: 'from-cyan-500 to-blue-500' },
                  { name: 'Searching', color: 'from-pink-500 to-purple-500' },
                  { name: 'Recursion', color: 'from-indigo-500 to-purple-500' },
                  { name: 'Stacks', color: 'from-teal-500 to-cyan-500' },
                  { name: 'Queues', color: 'from-rose-500 to-pink-500' },
                  { name: 'Hash Tables', color: 'from-violet-500 to-purple-500' },
                  { name: 'Heaps', color: 'from-amber-500 to-orange-500' }
                ].map((topic, index) => (
                  <button
                    key={index}
                    className={`group relative overflow-hidden bg-gradient-to-r ${topic.color} p-4 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                    <span className="relative text-sm">{topic.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* GSoC Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-purple-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/20 mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                Google Summer of Code 2026
              </div>
              <h2 className="text-5xl font-black mb-6">
                Join GSoC
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Contribute & Get Paid
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Work on real open source projects, get mentored by experts, and receive a stipend from Google
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* GSoC Card 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Open Source Projects</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Contribute to Codex and other exciting projects. Build features used by thousands of developers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>AI-Powered Features</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Real-time Collaboration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Mobile Development</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GSoC Card 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Expert Mentorship</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Get guidance from experienced developers throughout your 12-week journey.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Weekly Check-ins</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Code Reviews</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Career Guidance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GSoC Card 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Stipend & Recognition</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Receive a stipend from Google and gain recognition in the open source community.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>$1,500 - $3,000 Stipend</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Certificate from Google</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Portfolio Boost</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GSoC CTA */}
            <div className="text-center">
              <button
                onClick={() => navigate('/gsoc')}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105"
              >
                <Trophy className="w-6 h-6" />
                <span>Explore GSoC 2026</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Open Source Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-blue-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <GitBranch className="w-4 h-4 mr-2" />
                Open Source Contribution
              </div>
              <h2 className="text-5xl font-black mb-6">
                Start Contributing
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  To Open Source
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Learn how to contribute to open source projects and build your developer portfolio
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {/* Step 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Learn Git & GitHub</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Master version control basics, branching, and pull requests
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Find Projects</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Discover beginner-friendly issues and choose projects you're passionate about
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Make Contributions</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Submit your first PR, get feedback, and iterate on your code
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Build Portfolio</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Showcase your contributions and grow your developer reputation
                  </p>
                </div>
              </div>
            </div>

            {/* Open Source Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">2.5K+</div>
                <div className="text-slate-400 font-medium">GitHub Stars</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2">180+</div>
                <div className="text-slate-400 font-medium">Contributors</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-green-400 mb-2">1.2K+</div>
                <div className="text-slate-400 font-medium">Pull Requests</div>
              </div>
            </div>

            {/* Open Source CTA */}
            <div className="text-center">
              <button
                onClick={() => navigate('/opensource')}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
              >
                <GitBranch className="w-6 h-6" />
                <span>Start Contributing</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mentorship CTA */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-orange-900/5 to-slate-900/0">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur border border-orange-500/20 rounded-3xl p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                      <Users className="w-4 h-4 mr-2" />
                      1-on-1 Mentorship
                    </div>
                    
                    <h2 className="text-4xl font-black mb-4 text-white">
                      Learn From an Expert
                    </h2>
                    
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      Get personalized guidance from <span className="text-orange-400 font-bold">Aditya Bakshi</span>, 
                      an experienced developer ready to accelerate your coding journey.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Code className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-slate-300 font-medium">DSA & Problem Solving</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Layers className="w-5 h-5 text-pink-400" />
                        </div>
                        <span className="text-slate-300 font-medium">Full Stack Development</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-slate-300 font-medium">Career & Interview Prep</span>
                      </div>
                    </div>

                    <a
                      href="https://topmate.io/aditya_bakshi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-105"
                    >
                      <Users className="w-5 h-5" />
                      <span>Book a Session</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: <Lightbulb className="w-6 h-6" />, title: "Personalized Learning", desc: "Tailored guidance for your goals", color: "from-orange-500 to-pink-500" },
                      { icon: <Rocket className="w-6 h-6" />, title: "Career Acceleration", desc: "Fast-track your development", color: "from-pink-500 to-purple-500" },
                      { icon: <Trophy className="w-6 h-6" />, title: "Interview Success", desc: "Ace technical interviews", color: "from-purple-500 to-blue-500" }
                    ].map((item, index) => (
                      <div key={index} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-black mb-6">Ready to Start?</h2>
            <p className="text-xl text-slate-300 mb-12">
              Join thousands of developers building amazing projects
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              <button
                onClick={() => onCreateNew()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Rocket className="w-6 h-6" />
                <span>Launch Editor</span>
              </button>
              
              <button
                onClick={() => setShowAICreator(true)}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 flex items-center justify-center space-x-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Brain className="w-6 h-6 relative z-10" />
                <span className="relative z-10">CP-AI</span>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full">🔥</span>
              </button>
              
              <button
                onClick={() => navigate('/dsa')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Trophy className="w-6 h-6" />
                <span>Practice DSA</span>
              </button>
              
              <button
                onClick={() => navigate('/web-editor')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Zap className="w-6 h-6" />
                <span>Web IDE</span>
              </button>
              
              <button
                onClick={() => navigate('/vscode')}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700 hover:border-slate-600 px-8 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <FolderOpen className="w-6 h-6" />
                <span>VS Code</span>
              </button>

              <button
                onClick={() => navigate('/android')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Smartphone className="w-6 h-6" />
                <span>Android</span>
              </button>
            </div>

            <div className="flex justify-center items-center space-x-12 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="font-medium">100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="font-medium">No Installation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="font-medium">High Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative bg-slate-900/50 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Codex
                  </span>
                  <span className="text-slate-400 text-sm ml-2">Playground</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors font-medium">Privacy</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Terms</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Support</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Docs</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
              <p>© 2026 Codex Playground. Built with ❤️ for developers worldwide.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Editor Toolbar */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowEditorToolbar(!showEditorToolbar)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 hover:rotate-90"
        >
          <Command className="w-8 h-8" />
        </button>

        {showEditorToolbar && (
          <div className="absolute bottom-20 right-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 w-80 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h3 className="text-white font-bold flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <span>Quick Actions</span>
              </h3>
              <button
                onClick={() => setShowEditorToolbar(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {/* Save Button */}
              <button
                onClick={handleSaveProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Save className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Save Project</div>
                  <div className="text-xs text-slate-400">Ctrl+S</div>
                </div>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownloadProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Download</div>
                  <div className="text-xs text-slate-400">Export files</div>
                </div>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Share2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Share</div>
                  <div className="text-xs text-slate-400">Ctrl+Shift+S</div>
                </div>
              </button>

              {/* Copy Code Button */}
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Copy className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Copy Code</div>
                  <div className="text-xs text-slate-400">To clipboard</div>
                </div>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                {editorMode === 'fullscreen' ? (
                  <Minimize2 className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                )}
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">
                    {editorMode === 'fullscreen' ? 'Exit Fullscreen' : 'Fullscreen'}
                  </div>
                  <div className="text-xs text-slate-400">F11</div>
                </div>
              </button>

              {/* Reset Button */}
              <button
                onClick={handleResetEditor}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-red-900/30 rounded-xl transition-all group"
              >
                <RotateCcw className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Reset</div>
                  <div className="text-xs text-slate-400">Clear all</div>
                </div>
              </button>

              {/* Command Palette */}
              <button
                onClick={handleOpenCommandPalette}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-xl transition-all group"
              >
                <Command className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Command Palette</div>
                  <div className="text-xs text-slate-400">Ctrl+K</div>
                </div>
              </button>
            </div>

            {/* Recent Projects */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 mb-3">Recent Projects</h4>
              <div className="space-y-2">
                {recentProjects.map((project, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-3 px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all group"
                  >
                    <span className="text-2xl">{project.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">{project.name}</div>
                      <div className="text-xs text-slate-400">{project.language} • {project.lastModified}</div>
                    </div>
                    <FileCode className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-32 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-in slide-in-from-top">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-900 rounded-xl">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
                  autoFocus
                />
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">ESC</kbd>
              </div>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { icon: <Code />, label: 'New File', shortcut: 'Ctrl+N', action: () => onCreateNew() },
                  { icon: <FolderOpen />, label: 'Open Project', shortcut: 'Ctrl+O' },
                  { icon: <Save />, label: 'Save', shortcut: 'Ctrl+S', action: handleSaveProject },
                  { icon: <Share2 />, label: 'Share Project', shortcut: 'Ctrl+Shift+S', action: handleShareProject },
                  { icon: <Download />, label: 'Download', shortcut: 'Ctrl+D', action: handleDownloadProject },
                  { icon: <Play />, label: 'Run Code', shortcut: 'Ctrl+Enter' },
                  { icon: <Terminal />, label: 'Toggle Terminal', shortcut: 'Ctrl+`' },
                  { icon: <GitBranch />, label: 'Git: Commit', shortcut: 'Ctrl+Shift+G' },
                  { icon: <SettingsIcon />, label: 'Settings', shortcut: 'Ctrl+,' },
                  { icon: <Maximize2 />, label: 'Toggle Fullscreen', shortcut: 'F11', action: handleToggleFullscreen }
                ].map((command, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (command.action) command.action();
                      setShowCommandPalette(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400 group-hover:scale-110 transition-transform">
                        {command.icon}
                      </div>
                      <span className="text-white font-medium">{command.label}</span>
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Share2 className="w-6 h-6 text-purple-400" />
                <span>Share Project</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Share Link</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://codex.dev/share/abc123"
                    readOnly
                    className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://codex.dev/share/abc123');
                      alert('Link copied!');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center space-y-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Share2 size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-slate-300">Twitter</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Share2 size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-slate-300">Discord</span>
                </button>
                <button className="flex flex-col items-center space-y-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Share2 size={20} className="text-white" />
                  </div>
                  <span className="text-xs text-slate-300">WhatsApp</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <label className="flex items-center space-x-3 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Allow others to edit</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default WelcomeScreenModern;
