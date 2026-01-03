import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkAuthProvider } from './contexts/ClerkAuthContext';
import CodexEditor from './components/CodexEditor';
import './App.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
  throw new Error("Missing Publishable Key - Please check your .env file")
}

function App() {
  try {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ClerkAuthProvider>
          <div className="App">
            <CodexEditor />
          </div>
        </ClerkAuthProvider>
      </ClerkProvider>
    );
  } catch (error) {
    console.error('App initialization error:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <p className="text-gray-400 mb-4">Failed to initialize the application.</p>
          <p className="text-sm text-gray-500">Please check the console for more details.</p>
        </div>
      </div>
    );
  }
}

export default App;