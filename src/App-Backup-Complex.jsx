import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/SimpleClerkAuth';
import AuthGuard from './components/Auth/AuthGuard';
import SignUpShowcaseModal from './components/Auth/SignUpShowcaseModal';
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

  // Debug: Log authentication state changes (only in development)
  useEffect(() => {
    // Removed verbose logging for faster performance
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
        <div className="text-white text-xl flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span>{isLoggingOut ? 'Signing out...' : 'Loading your workspace...'}</span>
          <div className="text-sm text-gray-300">
            {isLoggingOut ? 'Please wait while we sign you out' : 'Setting up your coding environment'}
          </div>
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

      {/* Beautiful Sign-Up Showcase Modal - Shows first for non-authenticated users */}
      {showAuthModal && !showPublicLanding && (
        <SignUpShowcaseModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setShowPublicLanding(true);
          }}
          initialMode={authMode === 'sign-in' ? 'sign-in' : 'showcase'}
        />
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

          {/* Routes - All protected by AuthGuard */}
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
            <Route 
              path="/editor" 
              element={
                <AuthGuard>
                  <CodexEditor />
                </AuthGuard>
              } 
            />
            <Route 
              path="/editor-modern" 
              element={
                <AuthGuard>
                  <CodexEditorModern />
                </AuthGuard>
              } 
            />
            <Route 
              path="/editor-ultra" 
              element={
                <AuthGuard>
                  <CodexEditorUltra onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/web-editor" 
              element={
                <AuthGuard>
                  <AdvancedWebEditor onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/vscode" 
              element={
                <AuthGuard>
                  <VSCodeEditor onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/android" 
              element={
                <AuthGuard>
                  <AndroidEditor onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/dsa" 
              element={
                <AuthGuard>
                  <DSA250Awesome onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/dsa/tutorials" 
              element={
                <AuthGuard>
                  <VisualTutorials onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/dsa/interview" 
              element={
                <AuthGuard>
                  <InterviewReady onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/dsa/tribute" 
              element={
                <AuthGuard>
                  <StriverTributePage onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/ai" 
              element={
                <AuthGuard>
                  <AIUniversalCreatorModern onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/react-ai" 
              element={
                <AuthGuard>
                  <ReactCodeAI onBack={() => navigate('/')} />
                </AuthGuard>
              } 
            />
            <Route 
              path="/gsoc" 
              element={
                <AuthGuard>
                  <GSoCPage />
                </AuthGuard>
              } 
            />
            <Route 
              path="/opensource" 
              element={
                <AuthGuard>
                  <OpenSourcePage />
                </AuthGuard>
              } 
            />
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

  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes('INVALID') || PUBLISHABLE_KEY.includes('PLEASE_REPLACE')) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Clerk Setup Required</h1>
            <p className="text-gray-400">Your Clerk publishable key is missing or invalid</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Setup Steps:</h2>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                <span>Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">dashboard.clerk.com</a></span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                <span>Sign in or create a free account</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                <span>Create a new application or select an existing one</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">4</span>
                <span>Go to "API Keys" in the sidebar</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">5</span>
                <span>Copy the <strong className="text-white">Publishable key</strong> (starts with <code className="bg-gray-800 px-2 py-1 rounded text-green-400">pk_test_</code>)</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">6</span>
                <span>Open your <code className="bg-gray-800 px-2 py-1 rounded text-yellow-400">.env</code> file</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">7</span>
                <span>Replace <code className="bg-gray-800 px-2 py-1 rounded text-red-400">VITE_CLERK_PUBLISHABLE_KEY</code> with your real key</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">8</span>
                <span>Restart your development server</span>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Note:</strong> Clerk is free for development and includes authentication, user management, and social logins out of the box.
            </p>
          </div>
        </div>
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