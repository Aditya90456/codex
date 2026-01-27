import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { clerkConfig, validateClerkConfig } from './lib/clerk';
import { AuthProvider } from './contexts/AuthContext';
import AuthButton from './components/Auth/AuthButton';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingScreen from './components/Auth/LoadingScreen';

// Import your existing components
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import Dashboard from './components/Dashboard';
import ClerkSetupGuide from './components/Auth/ClerkSetupGuide';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Validate Clerk configuration on app start
const isClerkValid = validateClerkConfig();

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation with Auth */}
        <nav className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl px-4 py-3 shadow-2xl">
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              Dashboard
            </Link>
            <Link 
              to="/profile" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              Profile
            </Link>
            <Link 
              to="/editor" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              Editor
            </Link>
            <Link 
              to="/web" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              Web
            </Link>
            <Link 
              to="/dsa" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              DSA
            </Link>
            <Link 
              to="/ai" 
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
            >
              AI
            </Link>
          </div>
          
          {/* Auth Button */}
          <div className="border-l border-gray-600 pl-4">
            <AuthButton variant="compact" />
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomeScreenModern />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute>
                <CodexEditorModern />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/web" 
            element={
              <ProtectedRoute>
                <AdvancedWebEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dsa" 
            element={
              <ProtectedRoute>
                <DSA250Awesome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai" 
            element={
              <ProtectedRoute>
                <AIUniversalCreatorModern />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  // Show setup guide if Clerk is not configured
  if (!isClerkValid) {
    return <ClerkSetupGuide />;
  }

  return (
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
      signInUrl={clerkConfig.routing.signInUrl}
      signUpUrl={clerkConfig.routing.signUpUrl}
      afterSignInUrl={clerkConfig.routing.afterSignInUrl}
      afterSignUpUrl={clerkConfig.routing.afterSignUpUrl}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;