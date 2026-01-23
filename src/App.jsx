import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/SimpleClerkAuth';
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
import { useState, useEffect } from 'react';
import { Code, LogOut, User, Home, Rocket, FolderOpen, Smartphone, Trophy, Users, GitBranch, Brain, ChevronDown, MoreHorizontal } from 'lucide-react';
import './App.css';
import './styles/responsive.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Desktop Navigation Component with responsive overflow handling
function DesktopNavigation({ user, currentPath, navigate, onLogout, isLoggingOut }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Primary navigation items (always visible)
  const primaryNavItems = [
    { path: '/', label: 'Home', icon: Home, color: 'bg-slate-600' },
    { path: '/editor-modern', label: 'Editor', icon: Code, color: 'bg-blue-600', match: '/editor' },
    { path: '/web-editor', label: 'Web IDE', icon: Rocket, color: 'bg-green-600' },
    { path: '/ai', label: 'AI Creator', icon: Brain, color: 'bg-orange-600' },
    { path: '/dsa', label: 'DSA', icon: Trophy, color: 'bg-indigo-600', match: '/dsa' },
  ];

  // Secondary navigation items (overflow menu)
  const secondaryNavItems = [
    { path: '/vscode', label: 'VS Code', icon: FolderOpen, color: 'bg-cyan-600' },
    { path: '/android', label: 'Android', icon: Smartphone, color: 'bg-pink-600' },
    { path: '/react-ai', label: 'React AI', icon: Code, color: 'bg-blue-600' },
    { path: '/gsoc', label: 'GSoC', icon: Users, color: 'bg-purple-600' },
    { path: '/opensource', label: 'Open Source', icon: GitBranch, color: 'bg-blue-600' },
  ];

  const isActive = (item) => {
    if (item.match) {
      return currentPath.startsWith(item.match);
    }
    return currentPath === item.path;
  };

  const getButtonClass = (item) => {
    return `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
      isActive(item)
        ? `${item.color} text-white shadow-lg`
        : 'bg-white/10 text-white hover:bg-white/20'
    }`;
  };

  // Close menus when clicking outside
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
        {/* Primary Navigation Items */}
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={getButtonClass(item)}
              title={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:inline text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* More Menu */}
        <div className="relative nav-dropdown">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all bg-white/10 text-white hover:bg-white/20"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
            <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
          </button>

          {showMoreMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isActive(item)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative nav-dropdown">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
            title="User menu"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline text-sm font-semibold max-w-20 truncate">
              {user?.name || user?.firstName || 'User'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700">
                <div className="text-sm font-semibold text-white">
                  {user?.name || user?.firstName || 'User'}
                </div>
                <div className="text-xs text-slate-400">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              
              <button
                onClick={() => {
                  onLogout();
                  setShowUserMenu(false);
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');
  const [showPublicLanding, setShowPublicLanding] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log authentication state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 App Authentication State:');
      console.log('- isAuthenticated:', isAuthenticated);
      console.log('- loading:', loading);
      console.log('- showPublicLanding:', showPublicLanding);
      console.log('- showAuthModal:', showAuthModal);
      console.log('- user:', user);
      console.log('- current path:', location.pathname);
    }
  }, [isAuthenticated, loading, showPublicLanding, showAuthModal, user, location.pathname]);

  // Handle logout
  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoggingOut) {
      setShowPublicLanding(true);
      setShowAuthModal(false);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, isLoggingOut, navigate, location.pathname]);

  // Show auth modal
  useEffect(() => {
    if (!loading && !isAuthenticated && !showPublicLanding) {
      setShowAuthModal(true);
    } else if (isAuthenticated) {
      setShowAuthModal(false);
      setShowPublicLanding(false);
    }
  }, [loading, isAuthenticated, showPublicLanding]);

  if (loading || isLoggingOut) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>{isLoggingOut ? 'Logging out...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Public Landing Page - Shows first for non-authenticated users */}
      {!isAuthenticated && showPublicLanding && location.pathname === '/' && (
        <WelcomeScreenModern 
          onCreateNew={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-up');
          }}
          onShowAuth={(mode) => {
            setShowPublicLanding(false);
            setAuthMode(mode === 'signup' ? 'sign-up' : 'sign-in');
          }}
          onShowDashboard={() => {
            setShowPublicLanding(false);
            setAuthMode('sign-in');
          }}
        />
      )}

      {/* Auth Modal - Shows after user clicks sign up/sign in */}
      {showAuthModal && !showPublicLanding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Codex
              </h1>
              <p className="text-gray-600">
                {authMode === 'sign-in' 
                  ? 'Sign in to continue' 
                  : 'Create your account to get started'}
              </p>
            </div>

            {authMode === 'sign-in' ? (
              <div>
                <SignIn 
                  routing="virtual"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none"
                    }
                  }}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setAuthMode('sign-up')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <SignUp 
                  routing="virtual"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none"
                    }
                  }}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setAuthMode('sign-in')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main App - Only visible when authenticated */}
      {isAuthenticated && (
        <>
          {/* Mobile Navigation */}
          <MobileNav user={user} onLogout={async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              navigate('/');
              setShowPublicLanding(true);
              setShowAuthModal(false);
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setIsLoggingOut(false);
            }
          }} />

          {/* Desktop Navigation Bar - Only show on non-home routes */}
          {location.pathname !== '/' && (
            <DesktopNavigation 
              user={user}
              currentPath={location.pathname}
              navigate={navigate}
              onLogout={async () => {
                setIsLoggingOut(true);
                try {
                  await logout();
                  navigate('/');
                  setShowPublicLanding(true);
                  setShowAuthModal(false);
                } catch (error) {
                  console.error('Logout error:', error);
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              isLoggingOut={isLoggingOut}
            />
          )}

          {/* Routes */}
          <Routes>
            <Route 
              path="/" 
              element={
                <WelcomeScreenModern 
                  onCreateNew={() => navigate('/editor-modern')}
                  onShowAuth={() => {}}
                  onShowDashboard={() => {}}
                />
              } 
            />
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

      {/* Redirect non-authenticated users trying to access protected routes */}
      {!isAuthenticated && location.pathname !== '/' && (
        <Navigate to="/" replace />
      )}
    </div>
  );
} 

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Missing Clerk Key</div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;