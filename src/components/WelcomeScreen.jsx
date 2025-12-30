import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import Settings from './Settings';
import VSCodeEditor from './VSCodeEditorClean';
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
  Database
} from 'lucide-react';

const WelcomeScreen = ({ onCreateNew, onShowAuth, onShowDashboard }) => {
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVSCodeEditor, setShowVSCodeEditor] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
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
    { id: 1, type: 'achievement', message: 'Welcome to Codex!', time: '1 hour ago', unread: true },
    { id: 2, type: 'system', message: 'New features available', time: '2 hours ago', unread: true },
    { id: 3, type: 'social', message: 'Join our community', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const languages = [
    { name: 'JavaScript', code: 'console.log("Hello, World!");', color: 'from-yellow-400 to-orange-500' },
    { name: 'Python', code: 'print("Hello, World!")', color: 'from-green-400 to-blue-500' },
    { name: 'Java', code: 'System.out.println("Hello, World!");', color: 'from-red-400 to-pink-500' },
    { name: 'C++', code: 'cout << "Hello, World!" << endl;', color: 'from-blue-400 to-purple-500' }
  ];

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Code in 12+ programming languages with full syntax highlighting",
      color: "text-blue-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Execution",
      description: "Run your code instantly with our powerful execution engine",
      color: "text-yellow-400"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Resources",
      description: "Access tutorials, examples, and coding challenges",
      color: "text-green-400"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Practice Problems",
      description: "Solve coding problems and improve your skills",
      color: "text-purple-400"
    }
  ];

  const stats = [
    { label: "Active Coders", value: "50K+", icon: <Users className="w-5 h-5" /> },
    { label: "Code Executions", value: "1M+", icon: <Play className="w-5 h-5" /> },
    { label: "Problems Solved", value: "500K+", icon: <Target className="w-5 h-5" /> },
    { label: "Success Rate", value: "95%", icon: <Trophy className="w-5 h-5" /> }
  ];

  const quickStart = [
    { name: 'JavaScript', ext: 'js', color: 'bg-yellow-500', action: () => onCreateNew('javascript') },
    { name: 'Python', ext: 'py', color: 'bg-green-500', action: () => onCreateNew('python') },
    { name: 'Java', ext: 'java', color: 'bg-red-500', action: () => onCreateNew('java') },
    { name: 'C++', ext: 'cpp', color: 'bg-blue-500', action: () => onCreateNew('cpp') }
  ];

  // Show VS Code Editor if requested
  if (showVSCodeEditor) {
    return <VSCodeEditor onBack={() => setShowVSCodeEditor(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white overflow-x-hidden">
      <div className="h-screen overflow-y-auto">
        {/* Navigation */}
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Codex
                  </h1>
                  <p className="text-xs text-gray-400">Code. Learn. Excel.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                  title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'} theme`}
                >
                  {getThemeIcon()}
                </button>

                {/* Help */}
                <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
                  <HelpCircle size={20} />
                </button>

                {user ? (
                  <>
                    {/* Notifications */}
                    <div className="relative notifications-dropdown">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Notifications Dropdown */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                          <div className="p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium">Notifications</h3>
                            {unreadCount > 0 && (
                              <p className="text-sm text-gray-400">{unreadCount} unread</p>
                            )}
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                                  notification.unread ? 'bg-blue-900/20' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500' : 'bg-gray-600'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-sm text-white">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 border-t border-gray-700">
                            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                              Mark all as read
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative user-dropdown">
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center space-x-2 text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                          <div className="text-sm font-medium">{user.username}</div>
                          <div className="text-xs text-gray-400">
                            {user.email || 'user@example.com'}
                          </div>
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${
                          showUserDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* User Dropdown Menu */}
                      {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                          {/* User Info Header */}
                          <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                              </div>
                              <div>
                                <div className="text-white font-medium">{user.username}</div>
                                <div className="text-sm text-gray-400">
                                  {user.email || 'user@example.com'}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Star size={12} className="text-yellow-400" />
                                  <span className="text-xs text-gray-400">
                                    {user.rating || '1200'} rating
                                  </span>
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
                              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                              <UserCircle size={16} />
                              <span className="text-sm">Profile</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (onShowDashboard) onShowDashboard();
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                              <BarChart3 size={16} />
                              <span className="text-sm">Dashboard</span>
                            </button>
                            
                            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                              <Trophy size={16} />
                              <span className="text-sm">Achievements</span>
                            </button>
                            
                            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                              <BookOpen size={16} />
                              <span className="text-sm">My Solutions</span>
                            </button>
                            
                            <button 
                              onClick={() => {
                                setShowSettings(true);
                                setShowUserDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                              <SettingsIcon size={16} />
                              <span className="text-sm">Settings</span>
                            </button>
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-700 py-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                            >
                              <LogOut size={16} />
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
                      className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => onShowAuth('signup')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-300"
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
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {user ? (
                // Personalized content for logged-in users
                <div>
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Welcome back, {user.username}!
                    </span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Ready to
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Code Today?
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Continue your coding journey with our advanced IDE. Pick up where you left off 
                    or start a new challenge to improve your skills.
                  </p>

                  {/* User Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{user.solvedProblems || 0}</div>
                      <div className="text-sm text-gray-400">Problems Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{user.rating || 1200}</div>
                      <div className="text-sm text-gray-400">Current Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-gray-400">Days Active</div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button
                      onClick={() => onCreateNew()}
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Code className="w-5 h-5" />
                      <span>Open Editor</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => setShowVSCodeEditor(true)}
                      className="group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FolderOpen className="w-5 h-5" />
                      <span>VS Code Editor</span>
                      <Database className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => onShowDashboard && onShowDashboard()}
                      className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>View Dashboard</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Default content for non-logged-in users
                <div>
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Rocket className="w-4 h-4 mr-2" />
                      New: AI-Powered Code Assistance
                    </span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Code Like a
                    <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Pro Developer
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Master programming with our advanced online IDE. Practice coding problems, 
                    learn new languages, and build amazing projects - all in your browser.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button
                      onClick={() => onCreateNew()}
                      className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Coding Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span>View Examples</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Start Languages */}
              <div className="mb-8">
                <p className="text-sm text-gray-400 mb-4">Quick start with:</p>
                <div className="flex flex-wrap gap-3">
                  {quickStart.map((lang, index) => (
                    <button
                      key={index}
                      onClick={lang.action}
                      className={`${lang.color} hover:opacity-80 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 flex items-center space-x-2`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-xs opacity-75">.{lang.ext}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Code Preview */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Code Editor Header */}
                <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-400">main.{languages[activeLanguage].name.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${languages[activeLanguage].color}`}></div>
                    <span className="text-sm font-medium text-gray-300">{languages[activeLanguage].name}</span>
                  </div>
                  
                  <div className="bg-gray-950/50 rounded-lg p-4 font-mono text-sm">
                    <div className="text-gray-500 mb-2">1</div>
                    <div className="text-green-400">{languages[activeLanguage].code}</div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-950/30 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Output: Hello, World!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/30 backdrop-blur-sm border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Master Coding
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our platform provides all the tools and resources you need to become a better programmer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 group">
              <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who are already coding with Codex
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onCreateNew()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Rocket className="w-5 h-5" />
              <span>Launch Editor</span>
            </button>
            
            <button
              onClick={() => setShowVSCodeEditor(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <FolderOpen className="w-5 h-5" />
              <span>VS Code Editor</span>
            </button>
            
            <button
              onClick={() => onShowAuth('signup')}
              className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Users className="w-5 h-5" />
              <span>Join Community</span>
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>No Installation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>High Performance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Codex</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© 2024 Codex. Made with ❤️ for developers worldwide.</p>
          </div>
        </div>
      </footer>
      </div>

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />

      {/* Settings Modal */}
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default WelcomeScreen;