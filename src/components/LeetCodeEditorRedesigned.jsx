import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import Editor, { loader } from '@monaco-editor/react';
import { 
  Play, Send, Home, Code2, Terminal, BookOpen, Calendar, Target,
  ChevronRight, ChevronDown, Settings, Maximize2, Minimize2,
  Clock, Trophy, Star, CheckCircle, XCircle, Zap, Brain,
  Layers, Filter, Search, Timer, Pause, RotateCcw, Volume2, VolumeX,
  Youtube, Github, Download, Share2, MessageCircle, Lightbulb,
  Award, BarChart3, Users, Pencil, Building2, Map, X, Eye, Activity,
  Palette
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import { companyWiseProblems } from '../data/companyWiseProblems';
import { lldProblems } from '../data/lldProblems';
import AICodeExplainer from './AI/AICodeExplainer';
import SolutionViewer from './SolutionViewer';
import AIPeerChat from './AIPeerChat';
import AIWhiteboardVisualizer from './AIWhiteboardVisualizer';
import RealTimeDryRun from './RealTimeDryRun';
import SmartDryRunDetector from './SmartDryRunDetector';
import SmartDebugNotification from './SmartDebugNotification';
import SessionBookingModal from './SessionBookingModal';
import CodeShareModal from './CodeShareModal';
import PracticeScheduler from './PracticeSchedulerRedesigned';
import DSARoadmapTracker from './DSARoadmapTracker';
import LeetCodeDailyTask from './LeetCodeDailyTask';
import MonthlyGoals from './MonthlyGoals';
import ThemeCustomizer from './ThemeCustomizer';
import { useClerkProgress } from '../hooks/useClerkProgress';
import useSmartDebugger from '../hooks/useSmartDebugger';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/leetcode-editor-responsive.css';

// Configure Monaco loader to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

const LeetCodeEditorRedesigned = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme, fontSize: themeFontSize, fontFamily } = useTheme();
  
  // Clerk-based progress tracking
  const { 
    progress, 
    loading: progressLoading, 
    markProblemCompleted, 
    recordSubmission 
  } = useClerkProgress();
  
  // Problem source and selection
  const [problemSource, setProblemSource] = useState('dsa');
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  
  // Code editor states
  const [code, setCode] = useState(dsaProblems[0]?.starterCode?.javascript || '');
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  
  // Smart Debugger Integration
  const {
    shouldShowDebugger,
    debuggerVisible,
    analysisResult,
    updateCode,
    showDebugger,
    hideDebugger,
    toggleDebugger,
    getConfidence,
    getRecommendations
  } = useSmartDebugger(code, {
    autoDetectEnabled: true,
    detectionThreshold: 30, // Lower threshold for redesigned editor
    debounceDelay: 600,
    enableVoiceNotifications: true,
    language: language
  });
  
  // UI states
  const [showProblemList, setShowProblemList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLeftPanelMinimized, setIsLeftPanelMinimized] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [leftPanelTab, setLeftPanelTab] = useState('description');
  
  // Smart Debug states
  const [showSmartDebugNotification, setShowSmartDebugNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [smartDebugMode, setSmartDebugMode] = useState('auto'); // auto, manual, off
  
  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customInput, setCustomInput] = useState('');
  
  // Timer states
  const [timerDuration, setTimerDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  
  // Feature modals
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSessionBooking, setShowSessionBooking] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showRoadmapTracker, setShowRoadmapTracker] = useState(false);
  const [showDailyTask, setShowDailyTask] = useState(false);
  const [showMonthlyGoals, setShowMonthlyGoals] = useState(false);
  const [showCodeShareModal, setShowCodeShareModal] = useState(false);
  const [showPracticeScheduler, setShowPracticeScheduler] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showSolutionViewer, setShowSolutionViewer] = useState(false);
  const [showAIPeerChat, setShowAIPeerChat] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  
  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // GitHub states
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState(null);
  
  // Interaction states
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  
  // Monaco loading states
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monacoError, setMonacoError] = useState(false);
  
  // Responsive states
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  const editorRef = useRef(null);
  const timerRef = useRef(null);
  
  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto-minimize left panel on mobile
  useEffect(() => {
    if (isMobile) {
      setIsLeftPanelMinimized(true);
      setIsConsoleMinimized(true);
    } else {
      setIsLeftPanelMinimized(false);
      setIsConsoleMinimized(false);
    }
  }, [isMobile]);

  // Monaco loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!monacoLoaded) {
        console.warn('Monaco loading timeout');
        setMonacoError(true);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [monacoLoaded]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft]);

  // Smart Debugger Auto-Detection Effects
  useEffect(() => {
    if (shouldShowDebugger && !debuggerVisible && !notificationDismissed) {
      setShowSmartDebugNotification(true);
      
      // Auto-switch to smart debug tab if confidence is very high
      if (getConfidence() >= 70) {
        setTimeout(() => {
          setLeftPanelTab('smart-debug');
          setShowSmartDebugNotification(false);
        }, 2000);
      }
    }
  }, [shouldShowDebugger, debuggerVisible, notificationDismissed, getConfidence]);

  // Handle notification acceptance
  const handleAcceptSmartDebug = () => {
    setLeftPanelTab('smart-debug');
    setShowSmartDebugNotification(false);
    showDebugger();
  };

  // Handle notification dismissal
  const handleDismissSmartDebug = () => {
    setShowSmartDebugNotification(false);
    setNotificationDismissed(true);
    hideDebugger();
  };

  // Reset smart debug state when problem changes
  useEffect(() => {
    setNotificationDismissed(false);
    setShowSmartDebugNotification(false);
    if (leftPanelTab === 'smart-debug' && !shouldShowDebugger) {
      setLeftPanelTab('description');
    }
  }, [selectedProblem.id, shouldShowDebugger]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / (timerDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'cpp', label: 'C++', ext: 'cpp' },
    { value: 'typescript', label: 'TypeScript', ext: 'ts' }
  ];

  // Get current problems based on source
  const getCurrentProblems = () => {
    if (problemSource === 'company') {
      return companyWiseProblems[selectedCompany]?.problems || [];
    }
    if (problemSource === 'lld') {
      return [...lldProblems.easy, ...lldProblems.medium, ...lldProblems.hard];
    }
    return dsaProblems;
  };

  // Filter problems
  const getFilteredProblems = () => {
    const problems = getCurrentProblems();
    return problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Update code when problem or language changes
  useEffect(() => {
    if (selectedProblem) {
      const starterCode = selectedProblem.starterCode;
      if (typeof starterCode === 'object') {
        setCode(starterCode[language] || starterCode.javascript || '');
      } else {
        setCode(starterCode || '');
      }
      setTestResults(null);
      setConsoleOutput([]);
    }
  }, [selectedProblem, language]);

  const runCode = async () => {
    console.log('Run Code button clicked');
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput([{ type: 'info', message: '⏳ Running code...' }]);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const testCase = {
        input: customInput || selectedProblem.examples[0].input,
        expected: selectedProblem.examples[0].output
      };

      console.log('Sending request to:', `${backendUrl}/api/leetcode/run`);
      console.log('Test case:', testCase);

      const response = await fetch(`${backendUrl}/api/leetcode/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases: [testCase],
          problemId: selectedProblem.id
        })
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (data.success) {
        const result = data.results[0];
        
        // Track run attempt
        if (user) {
          await recordSubmission(selectedProblem.id, result.passed, language, 1);
        }

        setConsoleOutput([
          { type: 'success', message: '✓ Code executed successfully' },
          { type: 'info', message: '' },
          { type: 'info', message: `Input: ${testCase.input}` },
          { type: result.passed ? 'success' : 'error', message: `Your Output: ${JSON.stringify(result.output)}` },
          { type: 'success', message: `Expected: ${testCase.expected}` },
          { type: result.passed ? 'success' : 'error', message: result.passed ? '✓ Test passed' : '✗ Test failed' },
          { type: 'info', message: '' },
          { type: 'info', message: `Runtime: ${result.runtime}ms` },
          { type: 'info', message: `Memory: ${(result.memory / 1024).toFixed(1)} MB` }
        ]);
        
        setTestResults(data.results);
      } else {
        throw new Error(data.error || 'Execution failed');
      }
    } catch (error) {
      console.error('Run code error:', error);
      setConsoleOutput([
        { type: 'error', message: `❌ ${error.message}` },
        { type: 'info', message: 'Make sure the backend server is running' }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    console.log('Submit Code button clicked');
    setIsSubmitting(true);
    setConsoleTab('result');
    
    try {
      await runCode();
      
      // Mark as completed if all tests pass
      if (testResults && testResults.every(r => r.passed)) {
        if (user) {
          // Get problem details for progress tracking
          const difficulty = selectedProblem.difficulty || 'Medium';
          const category = selectedProblem.category || 'General';
          
          await markProblemCompleted(
            selectedProblem.id, 
            difficulty, 
            category, 
            language, 
            0 // timeSpent - can be enhanced later with timer
          );
          
          console.log('✅ Problem marked as completed:', selectedProblem.id);
        }
        setConsoleOutput(prev => [
          ...prev,
          { type: 'success', message: '' },
          { type: 'success', message: '🎉 All tests passed! Problem completed!' },
          { type: 'success', message: '✅ Progress saved to your profile!' }
        ]);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download solution
  const downloadSolution = () => {
    if (!testResults) {
      setGithubSyncStatus({ type: 'error', message: '❌ Submit your code first' });
      setTimeout(() => setGithubSyncStatus(null), 3000);
      return;
    }

    const content = `// ${selectedProblem.title}\n// Difficulty: ${selectedProblem.difficulty}\n// Category: ${selectedProblem.category}\n\n${code}`;
    const fileName = `${selectedProblem.id}-${selectedProblem.title.replace(/\s+/g, '-').toLowerCase()}.${languages.find(l => l.value === language)?.ext || 'txt'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setGithubSyncStatus({ type: 'success', message: '✅ Solution downloaded!' });
    setTimeout(() => setGithubSyncStatus(null), 3000);
  };

  return (
    <div className={`leetcode-editor-responsive h-screen bg-gradient-to-br ${theme.background} ${theme.text} flex flex-col overflow-hidden`}>
      {/* Modern Header - Responsive */}
      <header className={`${isMobile ? 'h-12' : 'h-14'} bg-gradient-to-r ${theme.card} backdrop-blur-xl border-b ${theme.border} flex items-center justify-between ${isMobile ? 'px-2' : 'px-4'} shadow-2xl safe-area-top`}>
        {/* Left Section */}
        <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-4'}`}>
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} bg-gradient-to-r ${theme.primary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
          >
            <Home className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-blue-400`} />
            {!isMobile && <span className="text-sm font-medium">Home</span>}
          </button>
          
          {!isMobile && <div className={`h-6 w-px ${theme.border}`} />}
          
          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className={`flex items-center gap-1.5 ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} bg-white/5 hover:bg-white/10 rounded-lg border ${theme.border} transition-all`}
          >
            <Layers className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-purple-400`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{isMobile ? 'List' : 'Problems'}</span>
            {!isMobile && <ChevronDown className={`w-3 h-3 transition-transform ${showProblemList ? 'rotate-180' : ''}`} />}
          </button>

          {!isMobile && (
            <>
              <button
                onClick={() => navigate('/roadmap')}
                className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${theme.secondary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
              >
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-sm">Roadmap</span>
              </button>

              <button
                onClick={() => setShowPracticeScheduler(true)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${theme.accent} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm">Schedule</span>
              </button>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-3'}`}>
          {!isMobile && !isTablet && (
            <>
              {/* Theme Button */}
              <button
                onClick={() => setShowThemeCustomizer(true)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${theme.primary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
              >
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Themes</span>
              </button>

              <button
                onClick={() => setShowAIPeerChat(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 rounded-lg border border-pink-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-pink-400" />
                <span className="text-sm">AI Chat</span>
              </button>
            </>
          )}
          
          {(isMobile || isTablet) && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
          )}

          {/* Timer - Hide on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-white/10">
              <Timer className={`w-4 h-4 ${getTimerColor()}`} />
              <span className={`text-sm font-mono ${getTimerColor()}`}>{formatTime(timeLeft)}</span>
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="ml-1">
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button onClick={() => setTimeLeft(timerDuration * 60)}>
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} bg-gradient-to-r ${theme.card} rounded-lg border ${theme.border} focus:outline-none focus:border-blue-500/50`}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{isMobile ? lang.value.toUpperCase() : lang.label}</option>
            ))}
          </select>

          {!isMobile && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {(isMobile || isTablet) && showMobileMenu && (
        <div className={`absolute top-${isMobile ? '12' : '14'} right-0 left-0 z-50 bg-gradient-to-b ${theme.card} backdrop-blur-xl border-b ${theme.border} shadow-2xl animate-slideDown`}>
          <div className="p-4 space-y-2">
            {/* Problems List */}
            <button
              onClick={() => {
                setShowProblemList(true);
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${theme.primary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
            >
              <Layers className="w-5 h-5 text-purple-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Problems List</div>
                <div className="text-xs text-gray-400">Browse all coding problems</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Roadmap */}
            <button
              onClick={() => {
                navigate('/roadmap');
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${theme.secondary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
            >
              <Target className="w-5 h-5 text-purple-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Roadmap</div>
                <div className="text-xs text-gray-400">Track your learning path</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Schedule */}
            <button
              onClick={() => {
                setShowPracticeScheduler(true);
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${theme.accent} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
            >
              <Calendar className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Practice Schedule</div>
                <div className="text-xs text-gray-400">Plan your study sessions</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Themes */}
            <button
              onClick={() => {
                setShowThemeCustomizer(true);
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${theme.primary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
            >
              <Palette className="w-5 h-5 text-blue-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Themes</div>
                <div className="text-xs text-gray-400">Customize your editor</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* AI Chat */}
            <button
              onClick={() => {
                setShowAIPeerChat(true);
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 rounded-lg border border-pink-500/20 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-pink-400" />
              <div className="flex-1 text-left">
                <div className="font-semibold">AI Peer Chat</div>
                <div className="text-xs text-gray-400">Get AI assistance</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className={`border-t ${theme.border} my-2`}></div>

            {/* Additional Options */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  downloadSolution();
                  setShowMobileMenu(false);
                }}
                className={`flex flex-col items-center gap-2 px-3 py-3 bg-gradient-to-r ${theme.card} hover:opacity-80 rounded-lg border ${theme.border} transition-all`}
              >
                <Download className="w-5 h-5 text-green-400" />
                <span className="text-xs">Download</span>
              </button>
              
              <button
                onClick={() => {
                  setShowCodeShareModal(true);
                  setShowMobileMenu(false);
                }}
                className={`flex flex-col items-center gap-2 px-3 py-3 bg-gradient-to-r ${theme.card} hover:opacity-80 rounded-lg border ${theme.border} transition-all`}
              >
                <Share2 className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {(isMobile || isTablet) && showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Beautiful Progress Bar - Responsive */}
      {!isMobile && (
        <div className={`progress-section bg-gradient-to-r ${theme.card} border-b ${theme.border} ${isMobile ? 'px-2 py-2' : 'px-4 py-3'}`}>
          <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'} mb-2`}>
            <div className="flex items-center gap-3">
              <Trophy className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold ${theme.text}`}>Your Progress</span>
              <span className={`text-xs ${theme.textSecondary}`}>
                {progress.completedProblems.length} solved
              </span>
            </div>
            <div className={`flex items-center ${isMobile ? 'flex-wrap justify-center' : 'gap-4'} text-xs progress-stats`}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-400">E: {progress.difficultyStats.easy.solved}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-gray-400">M: {progress.difficultyStats.medium.solved}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-gray-400">H: {progress.difficultyStats.hard.solved}</span>
              </div>
              {!isMobile && (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-400">Streak: {progress.currentStreak} days</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800"></div>
            
            {/* Progress fill with animated gradient */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${Math.min((progress.completedProblems.length / 150) * 100, 100)}%`,
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Milestone markers - Hide on mobile */}
            {!isMobile && [25, 50, 75, 100, 150].map((milestone) => (
              <div
                key={milestone}
                className="absolute top-0 bottom-0 w-0.5 bg-white/20"
                style={{ left: `${(milestone / 150) * 100}%` }}
                title={`${milestone} problems`}
              >
                {progress.completedProblems.length >= milestone && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Progress percentage */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-500">0</span>
            <span className="text-purple-400 font-semibold">
              {Math.round((progress.completedProblems.length / 150) * 100)}% Complete
            </span>
            <span className="text-gray-500">150</span>
          </div>
        </div>
      )}

      {/* Main Content - Responsive Layout */}
      <div className={`flex-1 flex overflow-hidden ${isMobile ? 'flex-col' : ''}`}>
        {/* Left Panel - Problem Description */}
        <div className={`
          ${isLeftPanelMinimized ? (isMobile ? 'hidden' : 'w-12') : isMobile ? 'w-full h-1/3' : isTablet ? 'w-[40%]' : 'w-[45%]'} 
          bg-gradient-to-b ${theme.card} backdrop-blur-sm border-r ${theme.border} flex flex-col transition-all duration-300
          ${isMobile ? 'border-b' : ''}
        `}>
          {isLeftPanelMinimized && !isMobile ? (
            <button
              onClick={() => setIsLeftPanelMinimized(false)}
              className="p-3 hover:bg-white/5 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <div className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-4'} border-b ${theme.border}`}>
                <div className={`flex items-center ${isMobile ? 'gap-1 flex-wrap' : 'gap-3'}`}>
                  <button
                    onClick={() => setLeftPanelTab('description')}
                    className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} rounded-lg transition-all ${
                      leftPanelTab === 'description' ? `bg-gradient-to-r ${theme.primary} bg-opacity-20 text-blue-300` : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <BookOpen className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} inline mr-1`} />
                    {isMobile ? 'Desc' : 'Description'}
                  </button>
                  
                  {!isMobile && (
                    <>
                      <button
                        onClick={() => setLeftPanelTab('smart-debug')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                          leftPanelTab === 'smart-debug' ? `bg-gradient-to-r ${theme.accent} bg-opacity-20 text-emerald-300` : `${theme.textSecondary} hover:${theme.text}`
                        }`}
                      >
                        <Activity className="w-4 h-4 inline mr-1" />
                        Smart Debug
                        {/* Confidence indicator */}
                        {analysisResult && getConfidence() > 40 && (
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                            getConfidence() >= 80 ? 'bg-red-400 animate-pulse' :
                            getConfidence() >= 60 ? 'bg-yellow-400' :
                            'bg-emerald-400'
                          }`} />
                        )}
                      </button>
                  
                  <button
                    onClick={() => setLeftPanelTab('whiteboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      leftPanelTab === 'whiteboard' ? `bg-gradient-to-r ${theme.secondary} bg-opacity-20 text-purple-300` : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <Brain className="w-4 h-4 inline mr-1" />
                    Whiteboard
                  </button>
                  
                  <button
                    onClick={() => setLeftPanelTab('dryrun')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      leftPanelTab === 'dryrun' ? 'bg-green-500/20 text-green-300' : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    Dry Run
                  </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsLeftPanelMinimized(true)}
                  className="p-1 hover:bg-white/10 rounded transition-all"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {leftPanelTab === 'description' && (
                  <>
                    {/* Problem Title */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h2>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                        {selectedProblem.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs border border-purple-500/30">
                        {selectedProblem.category}
                      </span>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => setLiked(!liked)}
                          className={`p-1.5 rounded transition-all ${liked ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDisliked(!disliked)}
                          className={`p-1.5 rounded transition-all ${disliked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStarred(!starred)}
                          className={`p-1.5 rounded transition-all ${starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{selectedProblem.description}</p>
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-3">Examples</h3>
                      {selectedProblem.examples?.map((example, idx) => (
                        <div key={idx} className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                          <div className="text-sm">
                            <div className="mb-2">
                              <span className="text-gray-400">Input:</span>
                              <code className="ml-2 text-blue-300">{example.input}</code>
                            </div>
                            <div>
                              <span className="text-gray-400">Output:</span>
                              <code className="ml-2 text-green-300">{example.output}</code>
                            </div>
                            {example.explanation && (
                              <div className="mt-2 text-gray-400 text-xs">{example.explanation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    {selectedProblem.constraints && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Constraints</h3>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {selectedProblem.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{constraint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Solutions button clicked');
                          setShowSolutionViewer(true);
                        }}
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-all text-sm active:scale-95"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Solutions
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Video button clicked');
                          setShowVideoModal(true);
                        }}
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all text-sm active:scale-95"
                      >
                        <Youtube className="w-4 h-4" />
                        Video
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('1v1 Session button clicked');
                          setShowSessionModal(true);
                        }}
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/30 transition-all text-sm active:scale-95"
                      >
                        <Users className="w-4 h-4" />
                        1v1 Session
                      </button>
                    </div>
                  </>
                )}

                {leftPanelTab === 'whiteboard' && (
                  <AIWhiteboardVisualizer 
                    problem={selectedProblem}
                    code={code}
                    language={language}
                  />
                )}

                {leftPanelTab === 'smart-debug' && (
                  <SmartDryRunDetector 
                    code={code}
                    language={language}
                    onCodeChange={setCode}
                    analysisResult={analysisResult}
                    confidence={getConfidence()}
                    recommendations={getRecommendations()}
                    problem={selectedProblem}
                  />
                )}

                {leftPanelTab === 'dryrun' && (
                  <RealTimeDryRun 
                    code={code}
                    language={language}
                    problem={selectedProblem}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className={`h-12 bg-gradient-to-r ${theme.card} border-b ${theme.border} flex items-center justify-between px-4`}>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span className={`text-sm font-medium ${theme.text}`}>Code Editor</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Smart Debugger Toggle */}
              {analysisResult && getConfidence() > 30 && (
                <button
                  onClick={() => {
                    if (leftPanelTab === 'smart-debug') {
                      setLeftPanelTab('description');
                    } else {
                      setLeftPanelTab('smart-debug');
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                    leftPanelTab === 'smart-debug' 
                      ? `bg-gradient-to-r ${theme.accent} bg-opacity-20 text-emerald-300 border ${theme.border}` 
                      : `bg-gradient-to-r ${theme.card} ${theme.textSecondary} hover:text-emerald-300 border ${theme.border}`
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  Smart Debug ({getConfidence()}%)
                </button>
              )}
              <button 
                onClick={() => setShowThemeCustomizer(true)}
                className={`text-xs ${theme.textSecondary} hover:${theme.text} transition-all px-2 py-1 rounded border ${theme.border}`}
              >
                🎨 Theme
              </button>
              <button className={`text-xs ${theme.textSecondary} hover:${theme.text} transition-all`}>
                Font: {themeFontSize === 'small' ? '12' : themeFontSize === 'large' ? '16' : themeFontSize === 'xlarge' ? '18' : '14'}px
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            {monacoError ? (
              <div className="h-full flex items-center justify-center bg-slate-900/50">
                <div className="text-center p-8">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Editor Loading Error</h3>
                  <p className="text-gray-400 mb-4">Monaco Editor failed to load. Using fallback.</p>
                  <textarea
                    value={code}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      setCode(newCode);
                      updateCode(newCode);
                    }}
                    className="w-full h-96 bg-slate-800 text-white p-4 rounded-lg border border-white/10 font-mono text-sm focus:outline-none focus:border-blue-500/50"
                    placeholder="Write your code here..."
                  />
                </div>
              </div>
            ) : (
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(newCode) => {
                  setCode(newCode);
                  updateCode(newCode);
                }}
                theme={theme.editorTheme || 'vs-dark'}
                loading={
                  <div className={`h-full flex items-center justify-center bg-gradient-to-br ${theme.background}`}>
                    <div className="text-center">
                      <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
                      <p className={theme.textSecondary}>Loading editor...</p>
                    </div>
                  </div>
                }
                options={{
                  fontSize: themeFontSize === 'small' ? 12 : themeFontSize === 'large' ? 16 : themeFontSize === 'xlarge' ? 18 : 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  fontFamily: fontFamily === 'mono' ? "'Fira Code', 'Cascadia Code', Consolas, monospace" : 
                             fontFamily === 'sans' ? "'Inter', 'Segoe UI', sans-serif" : 
                             "'Times New Roman', serif",
                  fontLigatures: fontFamily === 'mono',
                  padding: { top: 16, bottom: 16 },
                  automaticLayout: true
                }}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  setMonacoLoaded(true);
                  console.log('Monaco Editor loaded successfully');
                }}
              />
            )}
          </div>

          {/* Action Buttons - Responsive */}
          <div className={`${isMobile ? 'h-12' : 'h-14'} bg-gradient-to-r ${theme.card} border-t ${theme.border} flex items-center justify-between ${isMobile ? 'px-2' : 'px-4'} safe-area-bottom`}>
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Run button clicked');
                  runCode();
                }}
                type="button"
                disabled={isRunning}
                className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
              >
                {isRunning ? <Zap className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-pulse`} /> : <Play className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
                {!isMobile && 'Run'}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Submit button clicked');
                  submitCode();
                }}
                type="button"
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} bg-gradient-to-r ${theme.primary} hover:opacity-80 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
              >
                {isSubmitting ? <Zap className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-pulse`} /> : <Send className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
                {!isMobile && 'Submit'}
              </button>
            </div>

            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
              {!isMobile && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Download button clicked');
                      downloadSolution();
                    }}
                    type="button"
                    className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${theme.card} hover:opacity-80 rounded-lg border ${theme.border} transition-all text-sm active:scale-95`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Share button clicked');
                      setShowCodeShareModal(true);
                    }}
                    type="button"
                    className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${theme.card} hover:opacity-80 rounded-lg border ${theme.border} transition-all text-sm active:scale-95`}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('AI Explain button clicked');
                  setShowAISuggestions(!showAISuggestions);
                }}
                type="button"
                className={`flex items-center gap-1.5 ${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} bg-gradient-to-r ${theme.secondary} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all ${isMobile ? 'text-xs' : 'text-sm'} active:scale-95`}
              >
                <Brain className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                {!isMobile && 'AI Explain'}
              </button>
              {isMobile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMobileMenu(true);
                  }}
                  type="button"
                  className={`p-1.5 bg-gradient-to-r ${theme.card} hover:opacity-80 rounded-lg border ${theme.border} transition-all active:scale-95`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Console */}
          <div className={`${isConsoleMinimized ? 'h-10' : 'h-64'} bg-gradient-to-r ${theme.card} border-t ${theme.border} flex flex-col transition-all duration-300`}>
            {isConsoleMinimized ? (
              <button
                onClick={() => setIsConsoleMinimized(false)}
                className="h-full flex items-center justify-between px-4 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Console</span>
                </div>
                <Maximize2 className="w-4 h-4" />
              </button>
            ) : (
              <>
                <div className="h-10 flex items-center justify-between px-4 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setConsoleTab('testcase')}
                      className={`text-sm px-3 py-1 rounded transition-all ${consoleTab === 'testcase' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Testcase
                    </button>
                    <button
                      onClick={() => setConsoleTab('result')}
                      className={`text-sm px-3 py-1 rounded transition-all ${consoleTab === 'result' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Result
                    </button>
                  </div>
                  <button
                    onClick={() => setIsConsoleMinimized(true)}
                    className="p-1 hover:bg-white/10 rounded transition-all"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                  {consoleTab === 'result' && consoleOutput.length > 0 ? (
                    consoleOutput.map((line, idx) => (
                      <div
                        key={idx}
                        className={`mb-1 ${
                          line.type === 'error' ? 'text-red-400' :
                          line.type === 'success' ? 'text-green-400' :
                          'text-gray-300'
                        }`}
                      >
                        {line.message}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Run your code to see results...</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB - Toggle Problem Description */}
      {isMobile && isLeftPanelMinimized && (
        <button
          onClick={() => setIsLeftPanelMinimized(false)}
          className={`fixed bottom-20 right-4 z-40 p-4 bg-gradient-to-r ${theme.primary} rounded-full shadow-2xl hover:scale-110 transition-all duration-300 safe-area-bottom`}
          aria-label="Show problem description"
        >
          <BookOpen className="w-6 h-6 text-white" />
        </button>
      )}
      
      {/* Mobile FAB - Hide Problem Description */}
      {isMobile && !isLeftPanelMinimized && (
        <button
          onClick={() => setIsLeftPanelMinimized(true)}
          className={`fixed bottom-20 right-4 z-40 p-4 bg-gradient-to-r ${theme.secondary} rounded-full shadow-2xl hover:scale-110 transition-all duration-300 safe-area-bottom`}
          aria-label="Hide problem description"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Problem List Modal - Responsive */}
      {showProblemList && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center ${isMobile ? 'p-0' : 'p-4'}`}>
          <div className={`bg-slate-900 ${isMobile ? 'w-full h-full rounded-none' : 'rounded-2xl max-w-4xl w-full max-h-[80vh]'} border border-white/10 overflow-hidden flex flex-col`}>
            <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-white/10 safe-area-top`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Problem List</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {progress.completedProblems.length} problems solved
                  </p>
                </div>
                <button
                  onClick={() => setShowProblemList(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {/* Problem Source Tabs - Responsive */}
              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'gap-2'} mb-4`}>
                <button
                  onClick={() => setProblemSource('dsa')}
                  className={`${isMobile ? 'w-full' : ''} px-4 py-2 rounded-lg transition-all ${
                    problemSource === 'dsa' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-gray-400'
                  }`}
                >
                  DSA Problems
                </button>
                <button
                  onClick={() => setProblemSource('company')}
                  className={`${isMobile ? 'w-full' : ''} px-4 py-2 rounded-lg transition-all ${
                    problemSource === 'company' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-gray-400'
                  }`}
                >
                  Company Wise
                </button>
                <button
                  onClick={() => setProblemSource('lld')}
                  className={`${isMobile ? 'w-full' : ''} px-4 py-2 rounded-lg transition-all ${
                    problemSource === 'lld' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-slate-800 text-gray-400'
                  }`}
                >
                  LLD Problems
                </button>
              </div>

              {/* Company Selector */}
              {problemSource === 'company' && (
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className={`w-full mb-4 ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50`}
                >
                  {Object.keys(companyWiseProblems).map(company => (
                    <option key={company} value={company}>
                      {company.charAt(0).toUpperCase() + company.slice(1)}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 ${isMobile ? 'py-2 text-sm' : 'py-2'} bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50`}
                  />
                </div>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className={`${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'} bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50`}
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-6'} safe-area-bottom`}>
              <div className="space-y-2">
                {getFilteredProblems().map((problem) => {
                  const isCompleted = progress.completedProblems.includes(problem.id);
                  
                  return (
                    <button
                      key={problem.id}
                      onClick={() => {
                        setSelectedProblem(problem);
                        const starterCode = problem.starterCode;
                        if (typeof starterCode === 'object') {
                          setCode(starterCode[language] || starterCode.javascript || '');
                        } else {
                          setCode(starterCode || '');
                        }
                        setShowProblemList(false);
                      }}
                      className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-lg border transition-all text-left ${
                        isCompleted 
                          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                          : 'bg-slate-800/30 hover:bg-slate-800/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {isCompleted && (
                            <div className="flex-shrink-0">
                              <CheckCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-400`} />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className={`${isMobile ? 'text-sm' : ''} font-semibold mb-1 flex items-center gap-2 flex-wrap`}>
                              {problem.title}
                              {isCompleted && (
                                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                  Solved
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <span className={`px-2 py-0.5 rounded ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              <span className="text-gray-400">{problem.category}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 flex-shrink-0`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Modals */}
      {showSolutionViewer && (
        <SolutionViewer 
          problem={selectedProblem}
          language={language}
          onClose={() => setShowSolutionViewer(false)}
          onUseSolution={(code) => setCode(code)}
        />
      )}

      {showAISuggestions && (
        <AICodeExplainer 
          code={code}
          language={language}
          problem={selectedProblem}
          onClose={() => setShowAISuggestions(false)}
        />
      )}

      {showAIPeerChat && (
        <AIPeerChat 
          problem={selectedProblem}
          code={code}
          onClose={() => setShowAIPeerChat(false)}
        />
      )}

      {showSessionBooking && (
        <SessionBookingModal 
          onClose={() => setShowSessionBooking(false)}
        />
      )}

      {showCodeShareModal && (
        <CodeShareModal 
          isOpen={showCodeShareModal}
          code={code}
          language={language}
          problemId={selectedProblem?.id}
          problemTitle={selectedProblem?.title}
          onClose={() => setShowCodeShareModal(false)}
        />
      )}

      {showPracticeScheduler && (
        <PracticeScheduler 
          onClose={() => setShowPracticeScheduler(false)}
        />
      )}

      {showRoadmapTracker && (
        <DSARoadmapTracker 
          onClose={() => setShowRoadmapTracker(false)}
        />
      )}

      {showDailyTask && (
        <LeetCodeDailyTask 
          onClose={() => setShowDailyTask(false)}
        />
      )}

      {showMonthlyGoals && (
        <MonthlyGoals 
          onClose={() => setShowMonthlyGoals(false)}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-400" />
                Video Solution
              </h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Youtube className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Video solution for: {selectedProblem.title}</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedProblem.title + ' leetcode solution')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
                >
                  <Youtube className="w-5 h-5" />
                  Search on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Booking Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Book 1v1 Session
              </h2>
              <button
                onClick={() => setShowSessionModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-2">Get Expert Help</h3>
                <p className="text-gray-300 mb-4">
                  Book a 1-on-1 session with an experienced mentor to solve: <span className="text-purple-400 font-semibold">{selectedProblem.title}</span>
                </p>
                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Live code review and debugging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Optimal solution explanation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Interview tips and best practices
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    30-60 minute sessions
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">$29</div>
                  <div className="text-sm text-gray-400">30 minutes</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">$49</div>
                  <div className="text-sm text-gray-400">60 minutes</div>
                </div>
              </div>
              <button
                onClick={() => {
                  alert('Session booking feature coming soon! This will integrate with Topmate/Calendly.');
                  setShowSessionModal(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-semibold transition-all"
              >
                Book Session Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Debug Notification */}
      <SmartDebugNotification
        show={showSmartDebugNotification}
        confidence={getConfidence()}
        reasons={getRecommendations()}
        onAccept={handleAcceptSmartDebug}
        onDismiss={handleDismissSmartDebug}
        onViewDetails={() => {
          setLeftPanelTab('smart-debug');
          setShowSmartDebugNotification(false);
        }}
      />

      {/* Theme Customizer */}
      <ThemeCustomizer
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </div>
  );
};

export default LeetCodeEditorRedesigned;