import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import DSAWithAIPage from './pages/DSAWithAIPage';
import LeetCodePage from './pages/LeetCodePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {/* Routes - All pages accessible */}
        <Routes>
          <Route path="/" element={<WelcomeScreenModern />} />
          <Route path="/editor" element={<CodexEditorModern />} />
          <Route path="/playground" element={<LeetCodePage />} />
          <Route path="/web" element={<AdvancedWebEditor />} />
          <Route path="/dsa-ai" element={<DSAWithAIPage />} /> 
          <Route path="/ai" element={<AIUniversalCreatorModern />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
