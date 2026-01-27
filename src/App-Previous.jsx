import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import WelcomeScreenModern from './components/WelcomeScreenModern';
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
import { Code, Home, Rocket, Trophy, Brain, FolderOpen, Smartphone, Users, GitBranch } from 'lucide-react';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Simple Navigation
function SimpleNav() {
  return (
    <nav className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-lg border border-slate-700/50 rounded-xl p-2 shadow-2xl">
      <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all">
        <Home className="w-5 h-5" />
      </Link>
      <Link to="/editor" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all">
        <Code className="w-5 h-5" />
      </Link>
      <Link to="/web-editor" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all">
        <Rocket className="w-5 h-5" />
      </Link>
      <Link to="/dsa" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all">
        <Trophy className="w-5 h-5" />
      </Link>
      <Link to="/ai" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all">
        <Brain className="w-5 h-5" />
      </Link>
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}

// Auth Modal with optimized Clerk settings
function AuthModal({ mode, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-full transition-colors"
        >
          ✕
        </button>
        
        {mode === 'sign-in' ? (
          <SignIn 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all",
                formFieldInput: "bg-gray-800 border-gray-700 text-white focus:border-blue-500 transition-colors",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                headerTitle: "text-white text-2xl",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400"
              }
            }}
          />
        ) : (
          <SignUp 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all",
                formFieldInput: "bg-gray-800 border-gray-700 text-white focus:border-blue-500 transition-colors",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                headerTitle: "text-white text-2xl",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
                formFieldLabel: "text-gray-300"
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in');

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md bg-gray-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-4">Clerk Setup Required</h1>
          <p className="text-gray-300 mb-4">
            Add your Clerk publishable key to <code className="bg-gray-700 px-2 py-1 rounded">.env</code>
          </p>
          <code className="block bg-gray-700 p-3 rounded text-sm">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </code>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#1f2937',
          colorInputBackground: '#374151',
          colorInputText: '#ffffff'
        }
      }}
    >
      <Router>
        <div className="App">
          {/* Signed Out - Show Landing */}
          <SignedOut>
            <WelcomeScreenModern 
              onCreateNew={() => {
                setAuthMode('sign-up');
                setShowAuth(true);
              }}
              onShowAuth={(mode) => {
                setAuthMode(mode === 'signup' ? 'sign-up' : 'sign-in');
                setShowAuth(true);
              }}
              onShowDashboard={() => {
                setAuthMode('sign-in');
                setShowAuth(true);
              }}
            />
            
            {showAuth && (
              <AuthModal 
                mode={authMode} 
                onClose={() => setShowAuth(false)} 
              />
            )}
          </SignedOut>

          {/* Signed In - Show App */}
          <SignedIn>
            <SimpleNav />
            
            <Routes>
              <Route path="/" element={<WelcomeScreenModern />} />
              <Route path="/editor" element={<CodexEditorModern />} />
              <Route path="/editor-ultra" element={<CodexEditorUltra />} />
              <Route path="/web-editor" element={<AdvancedWebEditor />} />
              <Route path="/vscode" element={<VSCodeEditor />} />
              <Route path="/android" element={<AndroidEditor />} />
              <Route path="/dsa" element={<DSA250Awesome />} />
              <Route path="/dsa/tutorials" element={<VisualTutorials />} />
              <Route path="/dsa/interview" element={<InterviewReady />} />
              <Route path="/dsa/tribute" element={<StriverTributePage />} />
              <Route path="/ai" element={<AIUniversalCreatorModern />} />
              <Route path="/react-ai" element={<ReactCodeAI />} />
              <Route path="/gsoc" element={<GSoCPage />} />
              <Route path="/opensource" element={<OpenSourcePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SignedIn>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
