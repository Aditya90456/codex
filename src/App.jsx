import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreenModern from './components/WelcomeScreenModern';
import CodexEditorModern from './components/CodexEditorModern';
import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern';
import ReactCodeAI from './components/AI/ReactCodeAI';
import AdvancedWebEditor from './components/AdvancedWebEditor';
import LeetCodePage from './pages/LeetCodePage';
import LearnPage from './pages/LearnPage';
import ProfilePage from './pages/ProfilePage';
import MLResumeCreator from './components/MLResumeCreator';
import DSAArticlesViewer from './components/DSAArticlesViewer';
import LeaderboardFullPage from './pages/LeaderboardFullPage';
import ResponsiveNav from './components/Navigation/ResponsiveNav';
import { TranslationProvider } from './contexts/TranslationContext';
import { LeaderboardProvider } from './contexts/LeaderboardContext';
import './App.css';

function App() {
  return (
    <TranslationProvider>
      <LeaderboardProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 no-overflow-x">
            <ResponsiveNav />
            
            {/* Main Content with proper spacing for fixed navigation */}
            <div className="pt-20 md:pt-24 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<WelcomeScreenModern />} />
                <Route path="/editor" element={<CodexEditorModern />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/learn/practice" element={<LeetCodePage />} />
                <Route path="/learn/articles" element={<DSAArticlesViewer />} />
                <Route path="/articles" element={<DSAArticlesViewer />} />
                <Route path="/playground" element={<LeetCodePage />} />
                <Route path="/leetcode" element={<LeetCodePage />} />
                <Route path="/leaderboard" element={<LeaderboardFullPage />} />
                <Route path="/web" element={<AdvancedWebEditor />} />
                <Route path="/ai" element={<AIUniversalCreatorModern />} />
                <Route path="/react-ai" element={<ReactCodeAI />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/resume" element={<MLResumeCreator />} />
              </Routes>
            </div>
          </div>
        </Router>
      </LeaderboardProvider>
    </TranslationProvider>
  );
}

export default App;
