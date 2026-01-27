import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import DSA250Awesome from './components/DSA/DSA250Awesome';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Simple Navigation */}
        <nav className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl px-3 py-2 shadow-2xl">
          <Link 
            to="/" 
            className="px-3 py-2 rounded-lg hover:bg-white/10 text-white text-sm transition-all"
          >
            Home
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
        </nav>

        {/* Routes - All pages accessible */}
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

export default App;
