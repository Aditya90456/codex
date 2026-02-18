import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveNav from './components/Navigation/ResponsiveNav';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import useMemoryOptimization from './hooks/useMemoryOptimization';
import './App.css';

// Lazy load components for better performance
const WelcomeScreenModern = lazy(() => import('./components/WelcomeScreenModern'));
const CodexEditorModern = lazy(() => import('./components/CodexEditorModern'));
const AIUniversalCreatorModern = lazy(() => import('./components/AI/AIUniversalCreatorModern'));
const ReactCodeAI = lazy(() => import('./components/AI/ReactCodeAI'));
const AdvancedWebEditor = lazy(() => import('./components/AdvancedWebEditor'));
const LeetCodePage = lazy(() => import('./pages/LeetCodePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MLResumeCreator = lazy(() => import('./components/MLResumeCreator'));
const DSAArticlesViewer = lazy(() => import('./components/DSAArticlesViewer'));

function App() {
  // Enable memory optimization for low-end devices
  const { isLowEndDevice } = useMemoryOptimization({
    cleanupInterval: 60000, // Cleanup every minute
    memoryThreshold: 75 // Trigger cleanup at 75% memory usage
  });

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen bg-gray-900 no-overflow-x ${isLowEndDevice ? 'low-end-device' : ''}`}>
          <ResponsiveNav />
          
          {/* Main Content with proper spacing for fixed navigation */}
          <div className="pt-20 md:pt-24 pb-20 md:pb-0">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<WelcomeScreenModern />} />
                <Route path="/editor" element={<CodexEditorModern />} />
                <Route path="/learn" element={<LearnPage />} />
                <Route path="/learn/practice" element={<LeetCodePage />} />
                <Route path="/learn/articles" element={<DSAArticlesViewer />} />
                <Route path="/articles" element={<DSAArticlesViewer />} />
                <Route path="/playground" element={<LeetCodePage />} />
                <Route path="/leetcode" element={<LeetCodePage />} />
                <Route path="/web" element={<AdvancedWebEditor />} />
                <Route path="/ai" element={<AIUniversalCreatorModern />} />
                <Route path="/react-ai" element={<ReactCodeAI />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/resume" element={<MLResumeCreator />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
