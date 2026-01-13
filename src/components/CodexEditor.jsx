import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import WelcomeScreenRedesigned from './WelcomeScreenRedesigned';
import DefaultClerkAuth from './Auth/DefaultClerkAuth';
import TestCaseDemo from './TestCaseDemo';
import IDEDemo from './IDEDemo';
import IDEOutput from './IDEOutput';
import Dashboard from './Dashboard';
import WebEditor from './WebEditor';
import AdvancedWebEditor from './AdvancedWebEditor';
import AndroidStudioFixed from './AndroidStudioFixed';
import InteractiveRoadmap from './Roadmap/InteractiveRoadmap';
import DSAComicViewer from './DSA/DSAComicViewer';
import ArticleViewer from './Articles/ArticleViewer';
import ScrollToTop from './ScrollToTop';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { 
  Play, 
  Save, 
  Copy,
  Maximize2,
  Minimize2,
  Terminal,
  Code,
  FileText,
  RotateCcw,
  BarChart3,
  Globe,
  Smartphone,
  Rocket
} from 'lucide-react';

const CodexEditor = () => {
  const { user, logout, isAuthenticated, loading } = useUniversalAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showWebEditor, setShowWebEditor] = useState(false);
  const [showAdvancedWebEditor, setShowAdvancedWebEditor] = useState(false);
  const [showAndroidEditor, setShowAndroidEditor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTestDemo, setShowTestDemo] = useState(false);
  const [showIDEDemo, setShowIDEDemo] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showDSAComic, setShowDSAComic] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Reset states when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setShowWelcome(true);
      setShowWebEditor(false);
      setShowAdvancedWebEditor(false);
      setShowAndroidEditor(false);
      setShowDashboard(false);
      setShowTestDemo(false);
      setShowIDEDemo(false);
      setShowRoadmap(false);
      setShowDSAComic(false);
      setShowArticles(false);
      console.log('🔄 Reset - User logged out, all states cleared');
    }
  }, [isAuthenticated]);

  const [code, setCode] = useState(`// Welcome to Codex Playground - Professional Code Editor
// Fast-loading TUF+ Inspired Design for Competitive Programming
// 🚀 Loaded in under 2 seconds!

function solveProblem() {
    // Your solution here
    console.log("Ready to code in Codex Playground!");
}

// Fast authentication with Clerk
// Auto-redirect to playground when signed in

// Example: Two Sum Problem
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}

// Test the solution
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log("Happy coding! 🚀");
`);
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('bright-modern');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);
  const consoleRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍' },
    { value: 'java', label: 'Java', ext: '.java', icon: '☕' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐' },
    { value: 'css', label: 'CSS', ext: '.css', icon: '🎨' },
    { value: 'json', label: 'JSON', ext: '.json', icon: '📋' },
  ];

  const themes = [
    { value: 'bright-modern', label: 'Bright Modern', icon: '✨' },
    { value: 'vs-dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'light', label: 'Light Theme', icon: '☀️' },
    { value: 'github-light', label: 'GitHub Light', icon: '🐙' },
    { value: 'hc-black', label: 'High Contrast', icon: '⚫' },
  ];

  const handleShowAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleCreateNew = (selectedLanguage = 'javascript') => {
    console.log('🚀 Creating new project with language:', selectedLanguage);
    setShowWelcome(false);
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
      const langObj = languages.find(l => l.value === selectedLanguage);
      if (langObj) {
        setFileName(`solution${langObj.ext}`);
      }
    }
  };

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Codex</h2>
          <p className="text-gray-400">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <DefaultClerkAuth mode={authMode} />;
  }

  if (showAndroidEditor) {
    return (
      <AndroidStudioFixed onBack={() => {
        setShowAndroidEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showWebEditor) {
    return (
      <WebEditor onBack={() => {
        setShowWebEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showAdvancedWebEditor) {
    return (
      <AdvancedWebEditor onBack={() => {
        setShowAdvancedWebEditor(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showDashboard) {
    return (
      <Dashboard 
        onBack={() => {
          setShowDashboard(false);
          setShowWelcome(true);
        }}
        onCreateProject={(project) => {
          setShowDashboard(false);
          if (project) {
            console.log('Creating project:', project);
            const templates = {
              javascript: `// ${project.name || 'New Project'}
console.log("Welcome to ${project.name || 'your new project'}!");`,
              python: `# ${project.name || 'New Project'}
print("Welcome to ${project.name || 'your new project'}!")`,
              java: `// ${project.name || 'New Project'}
public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to ${project.name || 'your new project'}!");
    }
}`,
              cpp: `// ${project.name || 'New Project'}
#include <iostream>
using namespace std;

int main() {
    cout << "Welcome to ${project.name || 'your new project'}!" << endl;
    return 0;
}`
            };
            
            const projectLanguage = project.language || 'javascript';
            setLanguage(projectLanguage);
            setCode(templates[projectLanguage] || templates.javascript);
            setFileName(`${project.name || 'project'}.${languages.find(l => l.value === projectLanguage)?.ext.slice(1) || 'js'}`);
          }
        }}
      />
    );
  }

  if (showIDEDemo) {
    return (
      <IDEDemo onBack={() => {
        setShowIDEDemo(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showTestDemo) {
    return (
      <TestCaseDemo onBack={() => {
        setShowTestDemo(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showArticles) {
    return (
      <ArticleViewer onBack={() => {
        setShowArticles(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showDSAComic) {
    return (
      <DSAComicViewer onBack={() => {
        setShowDSAComic(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showRoadmap) {
    return (
      <InteractiveRoadmap onBack={() => {
        setShowRoadmap(false);
        setShowWelcome(true);
      }} />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreenRedesigned 
        onCreateNew={handleCreateNew}
        onShowAuth={handleShowAuth}
        onShowDashboard={() => setShowDashboard(true)}
        onShowWebEditor={() => setShowWebEditor(true)}
        onShowAdvancedWebEditor={() => setShowAdvancedWebEditor(true)}
        onShowAndroidEditor={() => setShowAndroidEditor(true)}
        onShowRoadmap={() => setShowRoadmap(true)}
        onShowDSAComic={() => setShowDSAComic(true)}
        onShowArticles={() => setShowArticles(true)}
      />
    );
  }

  return (
    <div className={`h-screen ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-800'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          {/* Left - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowWelcome(true)}
              className={`flex items-center space-x-3 ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'} transition-colors`}
            >
              <img 
                src="/codex-icon.svg" 
                alt="Codex Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Codex Playground
                </h1>
                <p className={`text-xs ${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Professional IDE</p>
              </div>
            </button>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium`}>
                    {user?.firstName || user?.username || 'User'}
                  </span>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleShowAuth('login')}
                  className={`${theme === 'bright-modern' || theme === 'github-light' || theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'} transition-colors text-sm`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleShowAuth('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm text-white"
                >
                  Get Started
                </button>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="flex-1 flex flex-col">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Codex Editor</h2>
          <p className="text-gray-600 mb-6">Professional code editor with Clerk authentication</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowWelcome(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Welcome
            </button>
            <SignedOut>
              <button
                onClick={() => handleShowAuth('signup')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Sign Up to Continue
              </button>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default CodexEditor;