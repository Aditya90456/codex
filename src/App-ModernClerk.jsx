import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { clerkConfig, validateClerkConfig } from './lib/clerk';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './components/Auth/LoadingScreen';

// Import modern components
import ModernWelcomeScreen from './components/ModernWelcomeScreen';
import CodexEditorModern from './components/CodexEditorModern';
import LeetCodeEditor from './components/LeetCodeEditor';
import DSAWithAIPage from './pages/DSAWithAIPage';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import ReactCodeAI from './components/AI/ReactCodeAI';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import Dashboard from './components/Dashboard';
import ClerkSetupGuide from './components/Auth/ClerkSetupGuide';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Validate Clerk configuration
const isClerkValid = validateClerkConfig();

// Modern App Layout Component
function ModernAppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        <ModernAppLayout>
          {children}
        </ModernAppLayout>
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

// Public Route Component
function PublicRoute({ children }) {
  return (
    <ModernAppLayout>
      {children}
    </ModernAppLayout>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <ModernWelcomeScreen />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/sign-in" 
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/sign-up" 
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          } 
        />
        
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
          path="/leetcode" 
          element={
            <ProtectedRoute>
              <LeetCodeEditor />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/playground" 
          element={
            <ProtectedRoute>
              <LeetCodeEditor />
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
          path="/dsa-ai" 
          element={
            <ProtectedRoute>
              <DSAWithAIPage />
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
        
        <Route 
          path="/react-ai" 
          element={
            <ProtectedRoute>
              <ReactCodeAI />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  // Show setup guide if Clerk is not configured
  if (!isClerkValid) {
    return (
      <ModernAppLayout>
        <ClerkSetupGuide />
      </ModernAppLayout>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={{
        ...clerkConfig.appearance,
        elements: {
          ...clerkConfig.appearance?.elements,
          // Modern styling for Clerk components
          card: "bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl",
          headerTitle: "text-white font-bold text-2xl",
          headerSubtitle: "text-gray-300",
          socialButtonsBlockButton: "bg-white/10 border border-white/20 hover:bg-white/20 text-white",
          formFieldInput: "bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500/50",
          formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl",
          footerActionLink: "text-blue-400 hover:text-blue-300",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-blue-400 hover:text-blue-300"
        },
        layout: {
          ...clerkConfig.appearance?.layout,
          socialButtonsPlacement: "bottom"
        }
      }}
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