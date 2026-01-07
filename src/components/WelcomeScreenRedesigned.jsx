import { useState, useEffect } from 'react';
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
  Workflow, Boxes, Gauge, Lock, Zap as Lightning
} from 'lucide-react';

const WelcomeScreenRedesigned = ({ 
  onCreateNew, 
  onShowAuth, 
  onShowDashboard, 
  onShowWebEditor, 
  onShowAdvancedWebEditor, 
  onShowAndroidEditor 
}) => {
  const { user, logout, login } = useUniversalAuth();
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    setIsVisible(true);
    
    // Animate feature showcase
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % advancedFeatures.length);
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
  }, []);

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

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'achievement', message: 'New Advanced Web IDE features available!', time: '5 min ago', unread: true },
    { id: 2, type: 'system', message: 'Terminal with npm support is now live', time: '1 hour ago', unread: true },
    { id: 3, type: 'social', message: '1B user milestone reached!', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Advanced features showcase
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
    }
  ];

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
      name: 'Quick Start', 
      icon: <Zap size={20} />, 
      color: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
      description: 'Start coding immediately',
      action: () => onCreateNew()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-x-hidden scroll-smooth">
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
                      onClick={() => window.location.href = '/sign-in'}
                      className="text-gray-300 hover:text-white transition-colors px-6 py-3 rounded-xl hover:bg-gray-800/50 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => window.location.href = '/sign-up'}
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
        <div className="relative overflow-hidden">
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
                        onClick={() => window.location.href = '/sign-up'}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20 border-y border-gray-800/50 backdrop-blur-sm">
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
              <p>© 2024 Codex Playground Pro. Built with ❤️ for developers worldwide. Supporting 1B+ users with enterprise-grade infrastructure.</p>
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