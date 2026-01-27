import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CodexEditorModern from './components/CodexEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!PUBLISHABLE_KEY) {
    return <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Add Clerk Key to .env</h1>
        <code className="bg-gray-800 px-4 py-2 rounded">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
      </div>
    </div>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          {/* Navigation */}
          <nav className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-lg border border-slate-700 rounded-xl p-3 flex items-center gap-3">
            <SignedIn>
              <Link to="/" className="text-white hover:text-blue-400">Home</Link>
              <Link to="/editor" className="text-white hover:text-blue-400">Editor</Link>
              <Link to="/dsa" className="text-white hover:text-blue-400">DSA</Link>
              <Link to="/ai" className="text-white hover:text-blue-400">AI</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </nav>

          {/* Content */}
          <SignedOut>
            <div className="h-screen flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Welcome to Codex</h1>
                <p className="text-xl text-gray-400 mb-8">Sign in to start coding</p>
                <div className="flex gap-4 justify-center">
                  <SignInButton mode="modal">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-lg">
                      Sign Up Free
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <Routes>
              <Route path="/" element={
                <div className="h-screen flex items-center justify-center text-white">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-gray-400 mb-8">Choose where to start</p>
                    <div className="flex gap-4 justify-center">
                      <Link to="/editor" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl">
                        Code Editor
                      </Link>
                      <Link to="/dsa" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl">
                        DSA Practice
                      </Link>
                      <Link to="/ai" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl">
                        AI Creator
                      </Link>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/editor" element={<CodexEditorModern />} />
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
