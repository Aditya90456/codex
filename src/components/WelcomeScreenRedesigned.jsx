import { useState, useEffect, useRef } from 'react';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import UserProfile from './UserProfile';
import Settings from './Settings';
import ScrollToTop from './ScrollToTop';
import { 
  Code, Zap, Users, ArrowRight, Play, Trophy, CheckCircle,
  Rocket, Globe, Shield, Cpu, Settings as SettingsIcon, User, LogOut,
  ChevronDown, UserCircle, Star, Bell, Moon, Sun, Monitor,
  BarChart3, FolderOpen, Terminal, Smartphone,
  Sparkles, TrendingUp, Activity, Wifi, Brain,
  Workflow, Boxes, Gauge, Lock, Zap as Lightning, Map, Database,
  BookOpen, Target, FileText, ChevronUp, Gamepad2
} from 'lucide-react';

const WelcomeScreenRedesigned = ({ 
  onCreateNew, 
  onShowAuth, 
  onShowDashboard, 
  onShowWebEditor, 
  onShowAdvancedWebEditor, 
  onShowAndroidEditor,
  onShowRoadmap,
  onShowDSAComic,
  onShowArticles,
  onShowCodexRedesigned,
  onShowGame
}) => {
  const { user, logout, login } = useUniversalAuth();
  const [isVisible, setIsVisible] = useState(false);
  
  // Debug: Log all props to see what's being passed - Remove in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 WelcomeScreenRedesigned Props Debug:');
      console.log('- onShowGame:', typeof onShowGame, onShowGame);
      console.log('- user:', user);
    }
  }, [onShowGame, user]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFastAuth, setShowFastAuth] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [currentStats, setCurrentStats] = useState({
    users: 847392,
    projects: 2847392,
    executions: 15847392
  });

  // Ref for roadmap section
  const roadmapSectionRef = useRef(null);
  const heroSectionRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const dsaSectionRef = useRef(null);

  // Advanced features showcase - moved before useEffect to prevent reference errors
  const advancedFeatures = [
    {
      title: 'Advanced Web IDE',
      description: 'Professional web development with integrated terminal and npm support',
      icon: <Rocket className="w-12 h-12" />,
      color: 'from-purple-500 to-pink-500',
      stats: '1B+ Users Supported',
      action: () => onShowAdvancedWebEditor()
    },
    {
      title: 'Terminal Integration',
      description: 'Full terminal with npm install, package management, and real-time feedback',
      icon: <Terminal className="w-12 h-12" />,
      color: 'from-green-500 to-teal-500',
      stats: 'Real-time Package Management',
      action: () => onShowAdvancedWebEditor()
    },
    {
      title: 'Android Studio Web',
      description: 'Complete Android development environment with preview management',
      icon: <Smartphone className="w-12 h-12" />,
      color: 'from-orange-500 to-red-500',
      stats: 'Multi-device Preview',
      action: () => onShowAndroidEditor()
    },
    {
      title: 'VS Code Experience',
      description: 'Full VS Code editor experience with advanced debugging capabilities',
      icon: <Code className="w-12 h-12" />,
      color: 'from-blue-500 to-indigo-500',
      stats: 'Professional IDE Features',
      action: () => onShowWebEditor()
    },
    {
      title: 'Programming Articles',
      description: 'Interactive tutorials with scrolling navigation and progress tracking',
      icon: <BookOpen className="w-12 h-12" />,
      color: 'from-orange-500 to-red-500',
      stats: 'In-depth Learning Content',
      action: () => onShowArticles()
    },
    {
      title: 'Codex Editor',
      description: 'Advanced code editor with real-time runtime analysis and performance insights',
      icon: <Brain className="w-12 h-12" />,
      color: 'from-indigo-500 to-purple-500',
      stats: 'Real-time Analysis',
      action: () => onShowCodexRedesigned()
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Animate feature showcase
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6); // Updated to 6 features
    }, 4000);

    // Animate stats
    const statsInterval = setInterval(() => {
      setCurrentStats(prev => ({
        users: prev.users + Math.floor(Math.random() * 10),
        projects: prev.projects + Math.floor(Math.random() * 50),
        executions: prev.executions + Math.floor(Math.random() * 100)
      }));
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, []); // Remove dependency to prevent re-runs

  // Close dropdowns when clicking outside
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
    try {
      await logout();
      setShowUserDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
      setShowUserDropdown(false);
    }
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const scrollToRoadmap = () => {
    if (roadmapSectionRef.current) {
      roadmapSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Scroll to any section function
  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  // Full screen scrolling functions
  const scrollPageUp = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollPageDown = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Full screen scrolling with Page Up/Down and Space
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        scrollPageDown();
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        scrollPageUp();
      } 
      // Quick navigation
      else if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'achievement', message: 'New Advanced Web IDE features available!', time: '5 min ago', unread: true },
    { id: 2, type: 'system', message: 'Terminal with npm support is now live', time: '1 hour ago', unread: true },
    { id: 3, type: 'social', message: '1B user milestone reached!', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const platformFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Development",
      description: "Intelligent code completion and error detection",
      color: "text-purple-400"
    },
    {
      icon: <Lightning className="w-8 h-8" />,
      title: "Lightning Fast Execution",
      description: "Instant code execution with optimized performance",
      color: "text-yellow-400"
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Advanced Workflows",
      description: "Git integration, CI/CD, and deployment automation",
      color: "text-green-400"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with user authorization for 1B+ users",
      color: "text-red-400"
    },
    {
      icon: <Gauge className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Real-time monitoring and performance insights",
      color: "text-blue-400"
    },
    {
      icon: <Boxes className="w-8 h-8" />,
      title: "Modular Architecture",
      description: "Scalable, maintainable, and extensible codebase",
      color: "text-indigo-400"
    }
  ];

  const quickActions = [
    { 
      name: 'Advanced Web IDE', 
      icon: <Rocket size={20} />, 
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      description: 'Professional web development environment',
      action: () => onShowAdvancedWebEditor()
    },
    { 
      name: 'DSA Master Game', 
      icon: <Gamepad2 size={20} />, 
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      description: 'Interactive DSA learning game',
      action: () => {
        if (window.navigateToGame) {
          window.navigateToGame();
        } else if (typeof onShowGame === 'function') {
          onShowGame();
        } else {
          alert('Please sign in to access the DSA Game!');
        }
      }
    },
    { 
      name: 'Android Studio', 
      icon: <Smartphone size={20} />, 
      color: 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700',
      description: 'Mobile app development platform',
      action: () => onShowAndroidEditor()
    },
    { 
      name: 'VS Code Editor', 
      icon: <Code size={20} />, 
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      description: 'Full-featured code editor',
      action: () => onShowWebEditor()
    },
    { 
      name: 'DSA Comics', 
      icon: <BookOpen size={20} />, 
      color: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
      description: 'Learn algorithms like reading comics',
      action: () => onShowDSAComic()
    },
    { 
      name: 'Programming Articles', 
      icon: <FileText size={20} />, 
      color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
      description: 'In-depth tutorials and guides',
      action: () => onShowArticles()
    },
    { 
      name: 'Codex Editor', 
      icon: <Brain size={20} />, 
      color: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      description: 'Real-time code analysis and performance insights',
      action: () => onShowCodexRedesigned()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-x-hidden scroll-smooth">
      {/* Welcome Page Scrolling Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-col space-y-3">
          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to top (Ctrl+Home)"
          >
            <ChevronUp size={20} />
          </button>

          {/* Page Up - Full screen scroll */}
          <button
            onClick={scrollPageUp}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Up (Page Up / Shift+Space)"
          >
            <ChevronUp size={16} className="opacity-75" />
          </button>

          {/* Section indicators */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection(heroSectionRef)}
              className="group relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
              title="Hero Section"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium">1</span>
              </div>
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                <div className="font-medium">Hero Section</div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection(featuresSectionRef)}
              className="group relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
              title="Features"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium">2</span>
              </div>
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                <div className="font-medium">Platform Features</div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection(roadmapSectionRef)}
              className="group relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
              title="Learning Roadmaps"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium">3</span>
              </div>
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                <div className="font-medium">Learning Roadmaps</div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection(dsaSectionRef)}
              className="group relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
              title="DSA Comics"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium">4</span>
              </div>
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                <div className="font-medium">DSA Comic Book</div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection(ctaSectionRef)}
              className="group relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
              title="Get Started"
            >
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium">5</span>
              </div>
              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                <div className="font-medium">Get Started</div>
                <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
              </div>
            </button>
          </div>

          {/* Page Down - Full screen scroll */}
          <button
            onClick={scrollPageDown}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Down (Page Down / Space)"
          >
            <ChevronDown size={16} className="opacity-75" />
          </button>
          
          {/* Scroll to bottom */}
          <button
            onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to bottom (Ctrl+End)"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Shortcuts info */}
        <div className="mt-4 pt-3 border-t border-gray-700 text-center">
          <div className="text-xs text-gray-600">
            Space/PgDn: Page scroll
          </div>
        </div>
      </div>

      <div className="h-screen overflow-y-auto scroll-smooth">
        {/* Modern Navigation */}
        <nav className="border-b border-gray-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20 animate-fade-in-up">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    Codex Playground Pro
                  </h1>
                  <p className="text-sm text-gray-400">Next-Generation Development Platform</p>
                </div>
              </div>
              
              {/* Debug Info - Remove in production */}
              <div className="hidden">
                <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                  {user ? `Authenticated: ${user.name}` : 'Not Authenticated'} | onShowGame: {typeof onShowGame}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Live Stats */}
                <div className="hidden md:flex items-center space-x-6 px-4 py-2 bg-gray-800/30 rounded-full border border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <Activity size={16} className="text-green-400" />
                    <span className="text-sm font-medium">{currentStats.users.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">users</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <Wifi size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">{currentStats.executions.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">executions</span>
                  </div>
                </div>

                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="text-gray-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-gray-800/50"
                  title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'} theme`}
                >
                  {getThemeIcon()}
                </button>

                {user ? (
                  <>
                    {/* Notifications */}
                    <div className="relative notifications-dropdown">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative text-gray-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-gray-800/50"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Enhanced Notifications Dropdown */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
                          <div className="p-6 border-b border-gray-700/50">
                            <h3 className="text-white font-semibold text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                              <p className="text-sm text-gray-400">{unreadCount} new updates</p>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-6 border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                                  notification.unread ? 'bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`w-3 h-3 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 border-t border-gray-700/50">
                            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                              Mark all as read
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced User Dropdown */}
                    <div className="relative user-dropdown">
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center space-x-3 text-white hover:bg-gray-800/50 px-4 py-3 rounded-xl transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                          <div className="text-sm font-semibold">{user.username}</div>
                          <div className="text-xs text-gray-400">Pro Developer</div>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${
                          showUserDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Enhanced User Dropdown Menu */}
                      {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
                          {/* User Info Header */}
                          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <User size={24} className="text-white" />
                              </div>
                              <div>
                                <div className="text-white font-semibold text-lg">{user.username}</div>
                                <div className="text-sm text-gray-400">{user.email || 'pro@codex.dev'}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Star size={14} className="text-yellow-400" />
                                  <span className="text-sm text-gray-300">Pro Developer</span>
                                  <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">Premium</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button 
                              onClick={() => {
                                setShowProfile(true);
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-4 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                            >
                              <UserCircle size={18} />
                              <span>Profile Settings</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (onShowDashboard) onShowDashboard();
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-4 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                            >
                              <BarChart3 size={18} />
                              <span>Analytics Dashboard</span>
                            </button>
                            
                            <button className="w-full flex items-center space-x-4 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors">
                              <Trophy size={18} />
                              <span>Achievements</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                setShowSettings(true);
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-4 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                            >
                              <SettingsIcon size={18} />
                              <span>Preferences</span>
                            </button>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-700/50 py-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-4 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-gray-800/50 transition-colors"
                            >
                              <LogOut size={18} />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onShowAuth('login')}
                      className="text-gray-300 hover:text-white transition-colors px-6 py-3 rounded-xl hover:bg-gray-800/50 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => onShowAuth('register')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Started Free
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        {/* Hero Section with Advanced Features Showcase */}
        <div className="relative overflow-hidden" ref={heroSectionRef}>
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`transition-all duration-1000 animate-slide-in-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {user ? (
                  // Personalized content for logged-in users
                  <div>
                    <div className="mb-8">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-400 border border-green-500/20 backdrop-blur-sm">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Welcome back, {user.username}! 🚀
                      </span>
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                      Ready to
                      <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                        Build Amazing?
                      </span>
                    </h1>
                    
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                      Continue your development journey with our enterprise-grade IDE. 
                      Access advanced terminal, npm integration, and preview management for 1B+ users.
                    </p>

                    {/* Enhanced User Stats */}
                    <div className="grid grid-cols-3 gap-6 mb-10 p-6 bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                          {user.solvedProblems || 127}
                        </div>
                        <div className="text-sm text-gray-400">Projects Built</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                          {user.rating || 2847}
                        </div>
                        <div className="text-sm text-gray-400">Developer Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
                          {Math.floor((Date.now() - new Date(user.joinDate || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) || 42}
                        </div>
                        <div className="text-sm text-gray-400">Days Coding</div>
                      </div>
                    </div>

                    {/* Enhanced CTA Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`group ${action.color} px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105`}
                        >
                          {action.icon}
                          <div className="text-left">
                            <div className="font-semibold">{action.name}</div>
                            <div className="text-xs opacity-90">{action.description}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-auto" />
                        </button>
                      ))}
                    </div>

                    {/* DSA Game CTA Button */}
                    <div className="mb-8">
                      <button
                        onClick={() => {
                          if (window.navigateToGame) {
                            window.navigateToGame();
                          } else {
                            alert('Please ensure you are signed in to play the DSA Game!');
                          }
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-4 transition-all duration-300"
                      >
                        <Gamepad2 className="w-8 h-8" />
                        <span>🎮 PLAY DSA GAME</span>
                        <ArrowRight className="w-8 h-8" />
                      </button>
                      <p className="text-center text-sm text-gray-400 mt-2">
                        Interactive Data Structures & Algorithms Learning
                      </p>
                    </div>
                  </div>
                ) : (
                  // Enhanced content for non-logged-in users
                  <div>
                    <div className="mb-8">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/20 backdrop-blur-sm">
                        <Sparkles className="w-5 h-5 mr-2" />
                        New: Enterprise-Grade Development Platform
                      </span>
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                      Code Like a
                      <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        Pro Developer
                      </span>
                    </h1>
                    
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                      Experience the future of web development with our advanced IDE. 
                      Terminal integration, npm support, and scalable architecture for 1 billion users.
                    </p>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-12">
                      <button
                        onClick={() => onShowAdvancedWebEditor()}
                        className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 shadow-lg hover:shadow-2xl transform hover:scale-105"
                      >
                        <Rocket className="w-6 h-6" />
                        <span>Launch Advanced IDE</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button
                        onClick={() => onShowAuth('register')}
                        className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 backdrop-blur-sm"
                      >
                        <Users className="w-6 h-6" />
                        <span>Join 1B+ Developers</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Enhanced Quick Start Languages */}
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-4 font-medium">Start coding instantly with:</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'React + TypeScript', ext: 'tsx', color: 'bg-blue-600 hover:bg-blue-700' },
                      { name: 'Node.js + Express', ext: 'js', color: 'bg-green-600 hover:bg-green-700' },
                      { name: 'Android Kotlin', ext: 'kt', color: 'bg-orange-600 hover:bg-orange-700' },
                      { name: 'Python Flask', ext: 'py', color: 'bg-yellow-600 hover:bg-yellow-700' }
                    ].map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => onCreateNew(lang.name.toLowerCase())}
                        className={`${lang.color} px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded">.{lang.ext}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Advanced Features Showcase */}
              <div className={`transition-all duration-1000 delay-300 animate-slide-in-right ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  {/* Main Feature Card */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Feature Header */}
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">
                          {advancedFeatures[activeFeature].title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Live</span>
                      </div>
                    </div>

                    {/* Feature Content */}
                    <div className="p-8">
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${advancedFeatures[activeFeature].color} mb-4 shadow-lg`}>
                          {advancedFeatures[activeFeature].icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {advancedFeatures[activeFeature].title}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {advancedFeatures[activeFeature].description}
                        </p>
                        <div className="inline-flex items-center px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 border border-gray-700/50">
                          <TrendingUp size={12} className="mr-2" />
                          {advancedFeatures[activeFeature].stats}
                        </div>
                      </div>

                      {/* Interactive Demo */}
                      <div className="bg-gray-950/50 rounded-2xl p-6 border border-gray-800/50">
                        <div className="flex items-center space-x-2 mb-4">
                          <Terminal size={16} className="text-green-400" />
                          <span className="text-sm font-mono text-gray-300">$ npm install lodash</span>
                        </div>
                        <div className="space-y-2 text-sm font-mono">
                          <div className="text-green-400">✓ Package installed successfully</div>
                          <div className="text-blue-400">→ Added to package.json</div>
                          <div className="text-purple-400">⚡ Ready for import</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={advancedFeatures[activeFeature].action}
                        className={`w-full mt-6 bg-gradient-to-r ${advancedFeatures[activeFeature].color} hover:opacity-90 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl`}
                      >
                        <span>Try {advancedFeatures[activeFeature].title}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Feature Navigation Dots */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {advancedFeatures.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeFeature 
                            ? 'bg-purple-500 scale-125' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Section */}
        <div className="bg-gradient-to-r from-gray-900/30 to-black/30 backdrop-blur-sm border-y border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Active Developers", value: currentStats.users.toLocaleString(), icon: <Users className="w-6 h-6" />, color: "text-blue-400" },
                { label: "Code Executions", value: currentStats.executions.toLocaleString(), icon: <Play className="w-6 h-6" />, color: "text-green-400" },
                { label: "Projects Created", value: currentStats.projects.toLocaleString(), icon: <FolderOpen className="w-6 h-6" />, color: "text-purple-400" },
                { label: "Success Rate", value: "99.9%", icon: <Trophy className="w-6 h-6" />, color: "text-yellow-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`flex justify-center mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" ref={featuresSectionRef}>
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Enterprise-Grade
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Development Platform
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Built for scale, designed for developers. Experience the most advanced web development 
              environment with terminal integration, npm support, and infrastructure for 1 billion users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-gray-700/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship Section */}
        <div className="bg-gradient-to-r from-orange-600/10 via-pink-600/10 to-purple-600/10 border-y border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                    <Users className="w-4 h-4 mr-2" />
                    1-on-1 Mentorship Available
                  </div>
                  
                  <h2 className="text-5xl font-bold mb-6 text-white">
                    Get Expert Mentorship
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Learn directly from <span className="text-orange-400 font-semibold">Aditya Bakshi</span>, 
                    an experienced developer who can guide you through your coding journey with personalized 
                    mentorship sessions.
                  </p>

                  {/* Topics */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4 text-gray-300">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-orange-400" />
                      </div>
                      <span className="text-lg">DSA & Problem Solving</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-pink-400" />
                      </div>
                      <span className="text-lg">Full Stack Development</span>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="text-lg">Career Guidance & Interview Prep</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href="https://topmate.io/aditya_bakshi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                  >
                    <Users className="w-6 h-6" />
                    <span>Book a Session</span>
                    <ArrowRight className="w-6 h-6" />
                  </a>
                </div>

                {/* Right Content - Stats/Benefits */}
                <div className="space-y-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Personalized Learning</h3>
                        <p className="text-sm text-gray-400">Tailored guidance based on your goals</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-pink-500/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Career Acceleration</h3>
                        <p className="text-sm text-gray-400">Fast-track your development career</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Interview Success</h3>
                        <p className="text-sm text-gray-400">Ace your technical interviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20 border-y border-gray-800/50 backdrop-blur-sm" ref={ctaSectionRef}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Development?</h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join millions of developers building the future with our advanced IDE platform
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <button
                onClick={() => onShowAdvancedWebEditor()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Rocket className="w-6 h-6" />
                <span>Launch Advanced IDE</span>
              </button>
              
              <button
                onClick={() => onShowWebEditor()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Code className="w-6 h-6" />
                <span>Try VS Code Editor</span>
              </button>
              
              <button
                onClick={() => onShowAndroidEditor()}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Smartphone className="w-6 h-6" />
                <span>Android Studio</span>
              </button>
              <button
                onClick={() => onShowCodexRedesigned()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Brain className="w-6 h-6" />
                <span>Codex Editor</span>
              </button>
            </div>

            <div className="flex justify-center items-center space-x-12 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>1B+ User Scale</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>High Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Learning Roadmap Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8" ref={roadmapSectionRef}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Learning Roadmaps
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Follow structured learning paths designed by industry experts. Track your progress and master new skills step by step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Web Development Roadmap */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Web Development</h3>
                <p className="text-gray-400 mb-6">Master modern web development from HTML/CSS basics to advanced React and Node.js</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Foundation</span>
                    <span className="text-gray-500">⏳ Not Started</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Frontend Frameworks</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Backend Development</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <button 
                  onClick={() => onShowRoadmap && onShowRoadmap()}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Start Learning
                </button>
              </div>

              {/* Android Development Roadmap */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Android Development</h3>
                <p className="text-gray-400 mb-6">Build native Android apps with Kotlin, Jetpack Compose, and modern architecture</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Android Basics</span>
                    <span className="text-gray-500">⏳ Not Started</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">UI/UX Development</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Advanced Features</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <button 
                  onClick={() => onShowRoadmap && onShowRoadmap()}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Start Learning
                </button>
              </div>

              {/* DSA Roadmap */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Data Structures & Algorithms</h3>
                <p className="text-gray-400 mb-6">Master problem-solving skills and ace coding interviews with comprehensive DSA training</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Fundamentals</span>
                    <span className="text-gray-500">⏳ Not Started</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Algorithms</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Advanced Topics</span>
                    <span className="text-gray-500">⏳ Locked</span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>

                <button 
                  onClick={() => onShowRoadmap && onShowRoadmap()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Start Learning
                </button>
              </div>

              {/* Programming Articles */}
              <div className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Programming Articles</h3>
                <p className="text-gray-400 mb-6">In-depth tutorials and guides on modern programming concepts with interactive examples</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">React Hooks Guide</span>
                    <span className="text-green-400">✓ Available</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Async JavaScript</span>
                    <span className="text-green-400">✓ Available</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">CSS Grid vs Flexbox</span>
                    <span className="text-green-400">✓ Available</span>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>

                <button 
                  onClick={() => onShowArticles && onShowArticles()}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Read Articles
                </button>
              </div>
            </div>

            {/* Roadmap CTA */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
                <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-white">Interactive Learning Experience</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Our roadmaps feature interactive progress tracking, hands-on projects, and personalized learning paths. 
                  Join thousands of developers who have successfully advanced their careers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => onShowRoadmap && onShowRoadmap()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>View Full Roadmap</span>
                  </button>
                  <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                    Track Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DSA Comic Book Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-blue-900/20" ref={dsaSectionRef}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                📚 DSA Comic Book
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Learn Data Structures & Algorithms like reading comic books! Interactive animations, engaging stories, and visual diagrams make complex concepts easy to understand.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Features */}
              <div className="space-y-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Comic-Style Learning</h3>
                  </div>
                  <p className="text-gray-300">
                    Each DSA topic is presented as an engaging comic story with characters, narratives, and visual metaphors that make learning memorable and fun.
                  </p>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Interactive Animations</h3>
                  </div>
                  <p className="text-gray-300">
                    Watch data structures come to life with step-by-step animations. Control the speed, pause, and replay to understand every operation.
                  </p>
                </div>

                <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Visual Metaphors</h3>
                  </div>
                  <p className="text-gray-300">
                    Arrays become neighborhoods, linked lists become trains, stacks become pancakes - making abstract concepts concrete and relatable.
                  </p>
                </div>
              </div>

              {/* Right side - Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">
                  {/* Comic preview header */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-300 font-medium">DSA Comic Viewer</span>
                    </div>
                  </div>

                  {/* Comic preview content */}
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">🏠 Arrays: The Neighborhood</h3>
                      <p className="text-gray-300">Meet the Array family - houses in a row!</p>
                    </div>

                    {/* Animated array preview */}
                    <div className="flex items-center justify-center space-x-2 mb-6">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="w-12 h-12 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold bg-blue-500/20 animate-pulse"
                          style={{
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                          {index}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="text-blue-400" size={20} />
                        <p className="text-gray-200 italic text-sm">
                          "Arrays are like houses on a street - each house has an address (index) and stores one family (element)!"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">📖</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-xl">✨</span>
                </div>
              </div>
            </div>

            {/* Topics preview */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-white mb-8">Available Comic Topics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Arrays', emoji: '🏠', color: 'from-blue-500 to-cyan-500' },
                  { name: 'Linked Lists', emoji: '🚂', color: 'from-green-500 to-emerald-500' },
                  { name: 'Stacks', emoji: '🥞', color: 'from-yellow-500 to-orange-500' },
                  { name: 'Queues', emoji: '🎢', color: 'from-purple-500 to-pink-500' },
                  { name: 'Trees', emoji: '🌳', color: 'from-green-600 to-teal-500' },
                  { name: 'Graphs', emoji: '🗺️', color: 'from-indigo-500 to-purple-500' }
                ].map((topic, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${topic.color} p-4 rounded-xl text-center text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="text-2xl mb-2">{topic.emoji}</div>
                    <div className="text-sm">{topic.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <button
                onClick={() => onShowDSAComic && onShowDSAComic()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105 mx-auto"
              >
                <BookOpen className="w-6 h-6" />
                <span>Start Reading DSA Comics</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-gray-400 text-sm mt-4">
                Free interactive learning • No signup required • Visual & engaging
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-black/50 border-t border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Codex Playground Pro
                  </span>
                  <p className="text-xs text-gray-400">Next-Gen Development Platform</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">API Documentation</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-sm text-gray-500">
              <p>© 2025 Codex Playground Pro. Built with ❤️ for developers worldwide. Supporting 1B+ users with enterprise-grade infrastructure.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      <ScrollToTop />
    </div>
  );
};

export default WelcomeScreenRedesigned;