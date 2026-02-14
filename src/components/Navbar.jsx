import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import { useTheme } from '../contexts/ThemeContext';
import UserProfile from './UserProfile';
import Settings from './Settings';
import ThemeCustomizer from './ThemeCustomizer';
import { 
  User,
  LogOut,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronDown,
  UserCircle,
  Trophy,
  BookOpen,
  Star,
  Bell,
  Moon,
  Sun,
  Monitor,
  PenSquare,
  LayoutDashboard,
  Code,
  Palette
} from 'lucide-react';

function Navbar({ onShowAuth, onBackToWelcome }) {
  const navigate = useNavigate();
  const { user, logout } = useUniversalAuth();
  const { theme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    onBackToWelcome();
  };

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(themeMode);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setThemeMode(nextTheme);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return <Sun size={16} />;
      case 'dark': return <Moon size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'achievement', message: 'You solved 10 problems!', time: '2 hours ago', unread: true },
    { id: 2, type: 'system', message: 'New contest starting soon', time: '1 day ago', unread: true },
    { id: 3, type: 'social', message: 'Someone liked your solution', time: '2 days ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className={`bg-gradient-to-r ${theme.card} border-b ${theme.border} px-4 py-3`}>
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onBackToWelcome}
            className={`flex items-center space-x-2 ${theme.text} hover:text-blue-400 transition-colors`}
          >
            <img 
              src="/codex-logo.svg" 
              alt="Codex Logo" 
              className="h-8 w-auto"
            />
          </button>
          
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1`}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/editor')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700`}
            >
              Editor
            </button>
            <button 
              onClick={() => navigate('/playground')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1`}
            >
              <Code size={14} />
              Playground
            </button>
            <button 
              onClick={() => navigate('/web-studio')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1`}
            >
              <Code size={14} />
              Web Studio
            </button>
            <button 
              onClick={() => navigate('/blogs')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1`}
            >
              <PenSquare size={14} />
              Blogs
            </button>
            <button 
              onClick={() => navigate('/playground')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700`}
            >
              Problems
            </button>
            <button 
              onClick={() => navigate('/articles')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700`}
            >
              Articles
            </button>
            <button 
              onClick={() => navigate('/bookmarks')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1`}
            >
              <BookOpen size={14} />
              Bookmarks
            </button>
            <button 
              onClick={() => navigate('/resume')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700`}
            >
              Resume AI
            </button>
            <button 
              onClick={() => navigate('/ai')}
              className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-2 py-1 rounded hover:bg-gray-700`}
            >
              AI Tools
            </button>
          </nav>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Customizer */}
          <button 
            onClick={() => setShowThemeCustomizer(true)}
            className={`${theme.textSecondary} hover:${theme.text} transition-colors p-2 rounded-lg hover:bg-gray-700`}
            title="Customize Theme"
          >
            <Palette size={20} />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`${theme.textSecondary} hover:${theme.text} transition-colors p-2 rounded-lg hover:bg-gray-700`}
            title={`Switch to ${themeMode === 'dark' ? 'light' : themeMode === 'light' ? 'system' : 'dark'} theme`}
          >
            {getThemeIcon()}
          </button>

          {/* Help */}
          <button className={`${theme.textSecondary} hover:${theme.text} transition-colors p-2 rounded-lg hover:bg-gray-700`}>
            <HelpCircle size={20} />
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
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
                  <div className={`absolute right-0 mt-2 w-80 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-lg shadow-xl z-50`}>
                    <div className={`p-4 border-b ${theme.border}`}>
                      <h3 className={`${theme.text} font-medium`}>Notifications</h3>
                      {unreadCount > 0 && (
                        <p className={`text-sm ${theme.textSecondary}`}>{unreadCount} unread</p>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b ${theme.border} hover:bg-gray-700 transition-colors ${
                            notification.unread ? 'bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-500' : 'bg-gray-600'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm ${theme.text}`}>{notification.message}</p>
                              <p className={`text-xs ${theme.textSecondary} mt-1`}>{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`p-3 border-t ${theme.border}`}>
                      <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center space-x-2 ${theme.text} hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors`}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center`}>
                    <User size={16} className="text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className={`text-xs ${theme.textSecondary}`}>
                      {user.email || 'user@example.com'}
                    </div>
                  </div>
                  <ChevronDown size={16} className={`${theme.textSecondary} transition-transform ${
                    showUserDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className={`absolute right-0 mt-2 w-64 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-lg shadow-xl z-50`}>
                    {/* User Info Header */}
                    <div className={`p-4 border-b ${theme.border}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center`}>
                          <User size={20} className="text-white" />
                        </div>
                        <div>
                          <div className={`${theme.text} font-medium`}>{user.username}</div>
                          <div className={`text-sm ${theme.textSecondary}`}>
                            {user.email || 'user@example.com'}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star size={12} className="text-yellow-400" />
                            <span className={`text-xs ${theme.textSecondary}`}>
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
                          navigate('/profile');
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 ${theme.textSecondary} hover:${theme.text} hover:bg-gray-700 transition-colors`}
                      >
                        <UserCircle size={16} />
                        <span className="text-sm">Profile Settings</span>
                      </button>
                      
                      <button className={`w-full flex items-center space-x-3 px-4 py-2 ${theme.textSecondary} hover:${theme.text} hover:bg-gray-700 transition-colors`}>
                        <Trophy size={16} />
                        <span className="text-sm">Achievements</span>
                      </button>
                      
                      <button className={`w-full flex items-center space-x-3 px-4 py-2 ${theme.textSecondary} hover:${theme.text} hover:bg-gray-700 transition-colors`}>
                        <BookOpen size={16} />
                        <span className="text-sm">My Solutions</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowSettings(true);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 ${theme.textSecondary} hover:${theme.text} hover:bg-gray-700 transition-colors`}
                      >
                        <SettingsIcon size={16} />
                        <span className="text-sm">Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className={`border-t ${theme.border} py-2`}>
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
                className={`${theme.textSecondary} hover:${theme.text} transition-colors text-sm px-4 py-2 rounded-lg hover:bg-gray-700`}
              >
                Sign In
              </button>
              <button
                onClick={() => onShowAuth('signup')}
                className={`bg-gradient-to-r ${theme.primary} hover:opacity-90 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm text-white`}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Theme Customizer Modal */}
      <ThemeCustomizer 
        isOpen={showThemeCustomizer} 
        onClose={() => setShowThemeCustomizer(false)} 
      />

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
}

export default Navbar;