import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import './App.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!CLERK_KEY) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">⚠️ Clerk Key Missing</h1>
          <p className="mb-4">Add your key to <code className="bg-gray-800 px-2 py-1 rounded">.env</code></p>
          <code className="block bg-gray-800 p-3 rounded text-sm">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </code>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          
          {/* Signed Out State */}
          <SignedOut>
            <WelcomeScreenModern 
              onCreateNew={() => {}}
              onShowAuth={() => {}}
              onShowDashboard={() => {}}
            />
            
            {/* Floating Auth Buttons */}
            <div className="fixed top-4 right-4 z-50 flex gap-3">
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Signed In State */}
          <SignedIn>
            {/* Simple Navigation */}
            <nav className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-lg border border-slate-700 rounded-xl p-2">
              <Link to="/" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm">
                Home
              </Link>
              <Link to="/editor" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm">
                Editor
              </Link>
              <Link to="/web" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm">
                Web
              </Link>
              <Link to="/dsa" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm">
                DSA
              </Link>
              <Link to="/ai" className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm">
                AI
              </Link>
              <UserButton afterSignOutUrl="/" />
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<WelcomeScreenModern />} />
              <Route path="/editor" element={<CodexEditorModern />} />
              <Route path="/web" element={<AdvancedWebEditor />} />
              <Route path="/dsa" element={<DSA250Awesome />} />
              <Route path="/ai" element={<AIUniversalCreatorModern />} />
            </Routes>
          </SignedIn>
          
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
