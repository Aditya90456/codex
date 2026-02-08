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
import DSAWithAIPage from './pages/DSAWithAIPage';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import ReactCodeAI from './components/AI/ReactCodeAI';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import Dashboard from './components/Dashboard';
import ClerkSetupGuide from './components/Auth/ClerkSetupGuide';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import LeetCodeEditor from './components/LeetCodeEditor';
import LearnPage from './pages/LearnPage';
import MLResumeCreator from './components/MLResumeCreator';
import DSAArticlesViewer from './components/DSAArticlesViewer';
import DSAArticlesViewerWithBookmarks from './components/DSAArticlesViewerWithBookmarks';
import BookmarksDashboard from './components/BookmarksDashboard';
import './App.css';

// Validate Clerk configuration on app start
const isClerkValid = validateClerkConfig();

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
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
          <Route 
            path="/leetcode" 
            element={
              <ProtectedRoute>
                <LeetCodeEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn" 
            element={
              <ProtectedRoute>
                <LearnPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn/practice" 
            element={
              <ProtectedRoute>
                <LeetCodeEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn/articles" 
            element={
              <ProtectedRoute>
                <DSAArticlesViewerWithBookmarks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/articles" 
            element={
              <ProtectedRoute>
                <DSAArticlesViewerWithBookmarks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookmarks" 
            element={
              <ProtectedRoute>
                <BookmarksDashboard />
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
            path="/resume" 
            element={
              <ProtectedRoute>
                <MLResumeCreator />
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