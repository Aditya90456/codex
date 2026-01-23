import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditor from './components/CodexEditor';
import CodexEditorModern from './components/CodexEditorModern';
import CodexEditorUltra from './components/CodexEditorUltra';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import VSCodeEditor from './components/VSCodeEditorClean';
import AndroidEditor from './components/AndroidEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import VisualTutorials from './components/DSA/VisualTutorials';
import InterviewReady from './components/DSA/InterviewReady';
import StriverTributePage from './pages/StriverTributePage';
import GSoCPage from './pages/GSoCPage';
import OpenSourcePage from './pages/OpenSourcePage';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import ReactCodeAI from './components/AI/ReactCodeAI';
import MobileNav from './components/MobileNav';
import ModeSwitcher from './components/ModeSwitcher';
import { Code, LogOut, User, Home, Rocket, FolderOpen, Smartphone, Trophy, Users, GitBranch, Brain, ChevronDown, MoreHorizontal } from 'lucide-react';
import './App.css';
import './styles/responsive.css';

// Offline Authentication Context
const OfflineAuthContext = {
  user: null,
  isAuthenticated: false,
  login: (username, password) => {
    const users = JSON.parse(localStorage.getItem('offline_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('offline_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  },
  signup: (username, email, password) => {
    const users = JSON.parse(localStorage.getItem('offline_users') || '[]');
    if (users.find(u => u.username === username || u.email === email)) {
      return false;
    }
    const newUser = { username, email, password, name: username, createdAt: Date.now() };
    users.push(newUser);
    localStorage.setItem('offline_users', JSON.stringify(users));
    localStorage.setItem('offline_current_user', JSON.stringify(newUser));
    return true;
  },
  logout: () => {
    localStorage.removeItem('offline_current_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('offline_current_user');
    return user ? JSON.parse(user) : null;
  }
};

// Desktop Navigation Component
function DesktopNavigation({ user, currentPath, navigate, onLogout, isLoggingOut }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const primaryNavItems = [
    { path: '/', label: 'Home', icon: Home, color: 'bg-slate-600' },
    { path: '/editor-modern', label: 'Editor', icon: Code, color: 'bg-blue-600', match: '/editor' },
    { path: '/web-editor', label: 'Web IDE', icon: Rocket, color: 'bg-green-600' },
    { path: '/ai', label: 'AI Creator', icon: Brain, color: 'bg-orange-600' },
    { path: '/dsa', label: 'DSA', icon: Trophy, color: 'bg-indigo-600', match: '/dsa' },
  ];

  const secondaryNavItems = [
    { path: '/vscode', label: 'VS Code', icon: FolderOpen, color: 'bg-cyan-600' },
    { path: '/android', label: 'Android', icon: Smartphone, color: 'bg-pink-600' },
    { path: '/react-ai', label: 'React AI', icon: Code, color: 'bg-blue-600' },
    { path: '/gsoc', label: 'GSoC', icon: Users, color: 'bg-purple-600' },
    { path: '/opensource', label: 'Open Source', icon: GitBranch, color: 'bg-blue-600' },
  ];

  const isActive = (item) => {
    if (item.match) return currentPath.startsWith(item.match);
    return currentPath === item.path;
  };

  const getButtonClass = (item) => {
    return `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
      isActive(item)
        ? `${item.color} text-white shadow-lg`
        : 'bg-white/10 text-white hover:bg-white/20'
    }`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setShowMoreMenu(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden md:flex fixed top-4 right-4 z-50 desktop-nav">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-xl p-2 shadow-2xl">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} className={getButtonClass(item)} title={item.label}>
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline text-sm">{item.label}</span>
            </button>
          );
        })}

        <div className="relative nav-dropdown">
          <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all bg-white/10 text-white hover:bg-white/20" title="More options">
            <MoreHorizontal className="w-4 h-4" />
            <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
          </button>

          {showMoreMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.path} onClick={() => { navigate(item.path); setShowMoreMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${isActive(item) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative nav-dropdown">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all" title="User menu">
            <User className="w-4 h-4" />
            <span className="hidden lg:inline text-sm font-semibold max-w-20 truncate">
              {user?.name || user?.username || 'User'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700">
                <div className="text-sm font-semibold text-white">{user?.name || user?.username || 'User'}</div>
                <div className="text-xs text-slate-400">{user?.email || 'user@example.com'}</div>
              </div>
              <button onClick={() => { onLogout(); setShowUserMenu(false); }} disabled={isLoggingOut} className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-slate-700 transition-all disabled:opacity-50">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Offline Auth Modal
function OfflineAuthModal({ mode, onClose, onSuccess }) {
  const [authMode, setAuthMode] = useState(mode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'sign-in') {
      if (OfflineAuthContext.login(username, password)) {
        onSuccess();
      } else {
        setError('Invalid username or password');
      }
    } else {
      if (!email || !username || !password) {
        setError('All fields are required');
        return;
      }
      if (OfflineAuthContext.signup(username, email, password)) {
        onSuccess();
      } else {
        setError('Username or email already exists');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Codex</h1>
          <p className="text-gray-600">
            {authMode === 'sign-in' ? 'Sign in to continue' : 'Create your account to get started'}
          </p>
          <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">🔒 Offline Mode - Data stored locally</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter username" required />
          </div>

          {authMode === 'sign-up' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter email" required />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter password" required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
            {authMode === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in')} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            {authMode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');
  const [showPublicLanding, setShowPublicLanding] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = OfflineAuthContext.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setShowPublicLanding(false);
    }
    // Mark initialization as complete
    setIsInitializing(false);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    OfflineAuthContext.logout();
    setUser(null);
    setIsAuthenticated(false);
    setShowPublicLanding(true);
    setShowAuthModal(false);
    navigate('/');
    setTimeout(() => setIsLoggingOut(false), 500);
  };

  const handleAuthSuccess = () => {
    const currentUser = OfflineAuthContext.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowPublicLanding(false);
  };

  // Show loading only during initialization
  if (isInitializing) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Loading Offline Mode...</span>
        </div>
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Logging out...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ModeSwitcher />
      {!isAuthenticated && showPublicLanding && location.pathname === '/' && (
        <WelcomeScreenModern 
          onCreateNew={() => { setShowPublicLanding(false); setAuthMode('sign-up'); setShowAuthModal(true); }}
          onShowAuth={(mode) => { setShowPublicLanding(false); setAuthMode(mode === 'signup' ? 'sign-up' : 'sign-in'); setShowAuthModal(true); }}
          onShowDashboard={() => { setShowPublicLanding(false); setAuthMode('sign-in'); setShowAuthModal(true); }}
        />
      )}

      {showAuthModal && !showPublicLanding && (
        <OfflineAuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}

      {isAuthenticated && (
        <>
          <MobileNav user={user} onLogout={handleLogout} />

          {/* Desktop Navigation - Always show when authenticated */}
          <DesktopNavigation 
            user={user} 
            currentPath={location.pathname} 
            navigate={navigate} 
            onLogout={handleLogout} 
            isLoggingOut={isLoggingOut} 
          />

          <Routes>
            <Route path="/" element={<WelcomeScreenModern onCreateNew={() => navigate('/editor-modern')} onShowAuth={() => {}} onShowDashboard={() => {}} />} />
            <Route path="/editor" element={<CodexEditor />} />
            <Route path="/editor-modern" element={<CodexEditorModern />} />
            <Route path="/editor-ultra" element={<CodexEditorUltra onBack={() => navigate('/')} />} />
            <Route path="/web-editor" element={<AdvancedWebEditor onBack={() => navigate('/')} />} />
            <Route path="/vscode" element={<VSCodeEditor onBack={() => navigate('/')} />} />
            <Route path="/android" element={<AndroidEditor onBack={() => navigate('/')} />} />
            <Route path="/dsa" element={<DSA250Awesome onBack={() => navigate('/')} />} />
            <Route path="/dsa/tutorials" element={<VisualTutorials onBack={() => navigate('/')} />} />
            <Route path="/dsa/interview" element={<InterviewReady onBack={() => navigate('/')} />} />
            <Route path="/dsa/tribute" element={<StriverTributePage onBack={() => navigate('/')} />} />
            <Route path="/ai" element={<AIUniversalCreatorModern onBack={() => navigate('/')} />} />
            <Route path="/react-ai" element={<ReactCodeAI onBack={() => navigate('/')} />} />
            <Route path="/gsoc" element={<GSoCPage />} />
            <Route path="/opensource" element={<OpenSourcePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}

      {!isAuthenticated && location.pathname !== '/' && <Navigate to="/" replace />}
    </div>
  );
}

function AppOffline() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default AppOffline;
