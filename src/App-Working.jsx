import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import './App.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Clerk theme
const clerkAppearance = {
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#1f2937',
    colorInputBackground: '#374151',
    colorInputText: '#ffffff',
    borderRadius: '0.75rem',
  },
  elements: {
    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
    card: 'bg-gray-800 shadow-2xl',
    headerTitle: 'text-white',
    headerSubtitle: 'text-gray-400',
    socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600',
    formFieldInput: 'bg-gray-700 border-gray-600 text-white',
    footerActionLink: 'text-blue-400 hover:text-blue-300',
  },
};

function App() {
  // No auth mode - allow access to everything
  const NO_AUTH_MODE = !CLERK_KEY || CLERK_KEY === 'your_key_here';

  if (NO_AUTH_MODE) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-900">
          {/* Simple Navigation */}
          <nav className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl px-3 py-2 shadow-2xl">
            <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              Home
            </Link>
            <Link to="/editor" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              Editor
            </Link>
            <Link to="/web" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              Web
            </Link>
            <Link to="/dsa" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              DSA
            </Link>
            <Link to="/ai" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              AI
            </Link>
            <div className="ml-2 pl-2 border-l border-gray-700">
              <div className="px-4 py-2 bg-yellow-600/20 text-yellow-300 text-xs rounded-lg">
                No Auth Mode
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<WelcomeScreenModern />} />
            <Route path="/editor" element={<CodexEditorModern />} />
            <Route path="/web" element={<AdvancedWebEditor />} />
            <Route path="/dsa" element={<DSA250Awesome />} />
            <Route path="/ai" element={<AIUniversalCreatorModern />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // With Clerk authentication
  return (
    <ClerkProvider publishableKey={CLERK_KEY} appearance={clerkAppearance}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          
          {/* Navigation */}
          <nav className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl px-3 py-2 shadow-2xl">
            <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
              Home
            </Link>
            
            <SignedIn>
              <Link to="/editor" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
                Editor
              </Link>
              <Link to="/web" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
                Web
              </Link>
              <Link to="/dsa" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
                DSA
              </Link>
              <Link to="/ai" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all">
                AI
              </Link>
            </SignedIn>

            <div className="ml-2 pl-2 border-l border-gray-700">
              <SignedOut>
                <div className="flex gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white text-sm font-medium transition-all">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<WelcomeScreenModern />} />
            
            {/* Protected Routes */}
            <Route 
              path="/editor" 
              element={
                <SignedIn>
                  <CodexEditorModern />
                </SignedIn>
              } 
            />
            <Route 
              path="/web" 
              element={
                <SignedIn>
                  <AdvancedWebEditor />
                </SignedIn>
              } 
            />
            <Route 
              path="/dsa" 
              element={
                <SignedIn>
                  <DSA250Awesome />
                </SignedIn>
              } 
            />
            <Route 
              path="/ai" 
              element={
                <SignedIn>
                  <AIUniversalCreatorModern />
                </SignedIn>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
