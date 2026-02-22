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
  Palette, Sparkles, Globe, Volume
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import { companyWiseProblems } from '../data/companyWiseProblems';
import { lldProblems } from '../data/lldProblems';
import { tufProblems, getAllTUFProblems } from '../data/tufProblems';
import AICodeExplainer from './AI/AICodeExplainer';
import AICodeCompletionWidget from './AI/AICodeCompletionWidget';
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
import PointsAnimation from './Leaderboard/PointsAnimation';
import VideoStreamPlayer from './VideoStreamPlayer';
import { useClerkProgress } from '../hooks/useClerkProgress';
import useSmartDebugger from '../hooks/useSmartDebugger';
import useAICodeCompletion from '../hooks/useAICodeCompletion';
import useResponsive from '../hooks/useResponsive';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/TranslationContext';
import { useLeaderboard } from '../contexts/LeaderboardContext';
import { executeCode, runTestCases, validateCode } from '../services/codeExecutionService';
import '../styles/leetcode-editor-responsive.css';
import '../styles/z-index-fix.css';
import '../styles/problem-list-animations.css';

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
  const { 
    t, 
    language: translationLanguage, 
    changeLanguage: handleTranslationChange,
    speak,
    stopSpeaking,
    isSpeaking,
    isTranslating,
    supportedLanguages: translationLanguages,
    translateText
  } = useTranslation();
  
  // Aliases for UI language (same as translation language)
  const uiLanguage = translationLanguage;
  const changeUILanguage = handleTranslationChange;
  
  const responsive = useResponsive();
  
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
  const [selectedTUFCategory, setSelectedTUFCategory] = useState('arrays');
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

  // AI Code Completion Integration
  const {
    completion: aiCompletion,
    isLoading: isCompletionLoading,
    isInitialized: isCompletionInitialized,
    requestCompletion,
    acceptCompletion,
    dismissCompletion,
  } = useAICodeCompletion({
    enabled: true,
    language: language,
    problemContext: selectedProblem,
    debounceDelay: 800,
    autoAcceptDelay: 5000,
  });
  
  // AI Completion states
  const [aiCompletionEnabled, setAiCompletionEnabled] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(null);
  
  // UI states
  const [showProblemList, setShowProblemList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [isLeftPanelMinimized, setIsLeftPanelMinimized] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [leftPanelTab, setLeftPanelTab] = useState('description');
  
  // Smart Debug states
  const [showSmartDebugNotification, setShowSmartDebugNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [smartDebugMode, setSmartDebugMode] = useState('auto'); // auto, manual, off
  
  // Translation state
  const [translatedDescription, setTranslatedDescription] = useState('');
  
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
  const [showVideoStream, setShowVideoStream] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [showSessionBooking, setShowSessionBooking] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showRoadmapTracker, setShowRoadmapTracker] = useState(false);
  const [showDailyTask, setShowDailyTask] = useState(false);
  const [showMonthlyGoals, setShowMonthlyGoals] = useState(false);
  const [showCodeShareModal, setShowCodeShareModal] = useState(false);
  const [showPracticeScheduler, setShowPracticeScheduler] = useState(false);

  // Leaderboard integration
  const { addProblemSolved, userStats } = useLeaderboard();
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsData, setPointsData] = useState(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showSolutionViewer, setShowSolutionViewer] = useState(false);
  const [showAIPeerChat, setShowAIPeerChat] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  
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
  
  // Translate problem description when language changes (with debouncing)
  useEffect(() => {
    // Clear previous translation immediately when language changes
    setTranslatedDescription('');
    
    const translateDescription = async () => {
      if (translationLanguage === 'en' || !selectedProblem?.description) {
        return;
      }
      
      try {
        console.log(`🌐 Translating to ${translationLanguage}...`);
        const translated = await translateText(selectedProblem.description, translationLanguage);
        setTranslatedDescription(translated);
        console.log('✅ Translation complete');
      } catch (error) {
        console.error('❌ Translation failed:', error);
        setTranslatedDescription('');
      }
    };
    
    // Debounce translation to avoid rapid API calls
    const timeoutId = setTimeout(translateDescription, 300);
    
    return () => clearTimeout(timeoutId);
  }, [translationLanguage, selectedProblem, translateText]);
  
  // Auto-minimize left panel on mobile
  useEffect(() => {
    if (isMobile) {
      setIsLeftPanelMinimized(true);
      setIsConsoleMinimized(true);
    } else {
      // Desktop and tablet show panels normally
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
    if (problemSource === 'tuf') {
      return tufProblems[selectedTUFCategory] || [];
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
      // Validate code first
      const validation = validateCode(code, language);
      if (!validation.valid) {
        throw new Error(`Syntax Error: ${validation.error}`);
      }

      // Prepare test case
      const testCase = {
        input: customInput || selectedProblem.examples[0].input,
        expected: selectedProblem.examples[0].output
      };

      console.log('Executing code with real API...');
      console.log('Test case:', testCase);

      // Execute code using real API (Piston - completely free!)
      const startTime = Date.now();
      const results = await runTestCases(code, language, [testCase]);
      const endTime = Date.now();
      
      const result = results[0];
      
      // Track run attempt
      if (user) {
        await recordSubmission(selectedProblem.id, result.passed, language, 1);
      }

      // Display results
      const outputMessages = [
        { type: 'success', message: '✓ Code executed successfully' },
        { type: 'info', message: '' },
        { type: 'info', message: `Input: ${testCase.input}` },
        { type: result.passed ? 'success' : 'error', message: `Your Output: ${result.output || '(empty)'}` },
        { type: 'info', message: `Expected: ${testCase.expected}` },
        { type: result.passed ? 'success' : 'error', message: result.passed ? '✓ Test passed' : '✗ Test failed' },
        { type: 'info', message: '' },
        { type: 'info', message: `Runtime: ${result.runtime}ms` },
      ];

      if (result.memory > 0) {
        outputMessages.push({ type: 'info', message: `Memory: ${(result.memory / 1024).toFixed(1)} MB` });
      }

      if (result.error) {
        outputMessages.push({ type: 'error', message: '' });
        outputMessages.push({ type: 'error', message: `Error: ${result.error}` });
      }

      setConsoleOutput(outputMessages);
      setTestResults(results);
      
    } catch (error) {
      console.error('Run code error:', error);
      setConsoleOutput([
        { type: 'error', message: `❌ ${error.message}` },
        { type: 'info', message: '' },
        { type: 'info', message: '🔧 Troubleshooting:' },
        { type: 'info', message: '1. Check your code syntax' },
        { type: 'info', message: '2. Make sure your code handles the input correctly' },
        { type: 'info', message: '3. Verify the output format matches expected' }
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
      
      // Wait a bit for runCode to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
          
          // Award leaderboard points!
          const averageTime = 120; // Mock average time in seconds
          const timeSpent = testResults[0]?.runtime ? testResults[0].runtime / 1000 : 60;
          
          const pointsResult = addProblemSolved(
            difficulty.toLowerCase(),
            timeSpent,
            averageTime
          );
          
          console.log('✅ Problem marked as completed:', selectedProblem.id);
          console.log('🏆 Points awarded:', pointsResult);
          
          // Show points animation
          setPointsData(pointsResult);
          setShowPointsAnimation(true);
        }
        setConsoleOutput(prev => [
          ...prev,
          { type: 'success', message: '' },
          { type: 'success', message: '🎉 All tests passed! Problem completed!' },
          { type: 'success', message: '✅ Progress saved to your profile!' },
          { type: 'success', message: `🏆 Points earned: +${pointsData?.pointsEarned || 0}` }
        ]);
      } else {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'warning', message: '' },
          { type: 'warning', message: '⚠️ Some tests failed. Fix the issues and try again.' }
        ]);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setConsoleOutput(prev => [
        ...prev,
        { type: 'error', message: '' },
        { type: 'error', message: `❌ Submit failed: ${error.message}` }
      ]);
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
      {/* Redesigned Modern Header */}
      <header className={`${isMobile ? 'h-14' : 'h-16'} bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-b border-white/10 flex items-center ${isMobile ? 'px-3' : 'px-6'} shadow-2xl safe-area-top relative z-10`}>
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient-x pointer-events-none -z-10"></div>
        
        <div className="flex items-center justify-between w-full gap-2 overflow-x-auto scrollbar-hide">
        {/* Left Section */}
        <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'} relative z-10 flex-shrink-0`}>
          {/* Logo/Brand */}
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${isMobile ? 'px-2.5 py-1.5' : 'px-4 py-2'} bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0`}
          >
            <Code2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            {!isMobile && <span className="text-sm font-bold text-white">CodeX</span>}
          </button>
          
          {!isMobile && <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />}
          
          {/* Problem Selector */}
          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className={`group flex items-center gap-2 ${isMobile ? 'px-2.5 py-1.5' : 'px-4 py-2'} bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm whitespace-nowrap flex-shrink-0`}
          >
            <Layers className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-purple-400 group-hover:text-purple-300 transition-colors`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-300 group-hover:text-white transition-colors`}>
              {isMobile ? 'Prob' : 'Problems'}
            </span>
            {!isMobile && (
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${showProblemList ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Desktop Navigation */}
          {!isMobile && !isTablet && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate('/roadmap')}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                <Target className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Roadmap</span>
              </button>

              <button
                onClick={() => setShowPracticeScheduler(true)}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                <Calendar className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Schedule</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className={`flex items-center ${isMobile ? 'gap-2' : isTablet ? 'gap-2' : 'gap-3'} relative z-10 flex-shrink-0 ml-auto`}>
          {/* Desktop & Tablet: Show key features */}
          {!isMobile && (
            <>
              {/* Timer Widget - Redesigned */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg flex-shrink-0">
                <Timer className={`w-4 h-4 ${getTimerColor()} transition-colors`} />
                <span className={`text-sm font-mono font-bold ${getTimerColor()} transition-colors min-w-[45px]`}>
                  {formatTime(timeLeft)}
                </span>
                <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)} 
                    className="hover:bg-white/10 rounded-lg p-1 transition-all duration-200 hover:scale-110 active:scale-95"
                    title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => setTimeLeft(timerDuration * 60)} 
                    className="hover:bg-white/10 rounded-lg p-1 transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setShowTimerSettings(!showTimerSettings)} 
                    className="hover:bg-white/10 rounded-lg p-1 transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Timer Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Language Selectors Group */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Code Language Selector */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-0.5 px-1">Code</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg border border-white/10 hover:border-blue-500/30 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer backdrop-blur-sm shadow-lg whitespace-nowrap"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value} className="bg-slate-800">
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Translation Language Selector */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 mb-0.5 px-1">Translate</label>
                  <select
                    value={translationLanguage}
                    onChange={(e) => handleTranslationChange(e.target.value)}
                    className="px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg border border-emerald-400/30 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all cursor-pointer backdrop-blur-sm shadow-lg whitespace-nowrap"
                    title="Translate problem description"
                  >
                    {translationLanguages.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-slate-800">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Action Buttons Group */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Theme Button */}
                <button
                  onClick={() => setShowThemeCustomizer(true)}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 whitespace-nowrap flex-shrink-0"
                  title="Customize Theme"
                >
                  <Palette className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{t('themes')}</span>
                </button>

                {/* AI Chat Button */}
                <button
                  onClick={() => setShowAIPeerChat(true)}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 rounded-xl border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 shadow-lg shadow-pink-500/5 whitespace-nowrap flex-shrink-0"
                  title="AI Peer Chat"
                >
                  <MessageCircle className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{t('aiChat')}</span>
                </button>

                {/* Leaderboard Button */}
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 shadow-lg shadow-yellow-500/5 whitespace-nowrap flex-shrink-0"
                  title="Leaderboard"
                >
                  <Trophy className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Leaderboard</span>
                  {userStats.totalPoints > 0 && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-bold">
                      {userStats.totalPoints}
                    </span>
                  )}
                </button>
              </div>

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Settings & User */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-transparent hover:border-white/10"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                </button>

                {/* User Button with custom styling */}
                <div className="relative">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </>
          )}

          {/* Tablet: Compact version - REMOVED, now uses desktop version */}

          {/* Mobile: Minimal version */}
          {isMobile && (
            <>
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl border border-white/10 focus:outline-none backdrop-blur-sm"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value} className="bg-slate-800">
                    {lang.value.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20 active:scale-95"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
              </button>

              {/* User Button */}
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {(isMobile || isTablet) && showMobileMenu && (
        <div className={`absolute top-${isMobile ? '14' : '16'} right-0 left-0 z-20 bg-gradient-to-b ${theme.card} backdrop-blur-xl border-b ${theme.border} shadow-2xl animate-slideDown`}>
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

            {/* Timer Settings */}
            <button
              onClick={() => {
                setShowTimerSettings(true);
                setShowMobileMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${theme.accent} bg-opacity-10 hover:bg-opacity-20 rounded-lg border ${theme.border} transition-all`}
            >
              <Timer className={`w-5 h-5 ${getTimerColor()}`} />
              <div className="flex-1 text-left">
                <div className="font-semibold">Timer Settings</div>
                <div className="text-xs text-gray-400">{formatTime(timeLeft)} remaining</div>
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
          className="fixed inset-0 bg-black/50 z-[15]"
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
                    {isMobile ? t('description').substring(0, 4) : t('description')}
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
                        {t('smartDebug')}
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
                    {t('whiteboard')}
                  </button>
                  
                  <button
                    onClick={() => setLeftPanelTab('dryrun')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      leftPanelTab === 'dryrun' ? 'bg-green-500/20 text-green-300' : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    {t('dryRun')}
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
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-400">{t('description')}</h3>
                        <div className="flex items-center gap-2">
                          {/* Speak Button */}
                          <button
                            onClick={() => {
                              const textToSpeak = translatedDescription || selectedProblem.description;
                              isSpeaking ? stopSpeaking() : speak(textToSpeak, translationLanguage);
                            }}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                            title={isSpeaking ? "Stop speaking" : "Read aloud"}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-4 h-4 text-blue-400 animate-pulse" />
                            ) : (
                              <Volume className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      {isTranslating ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          <span className="text-sm">Translating...</span>
                        </div>
                      ) : (
                        <p className="text-gray-300 leading-relaxed">
                          {translatedDescription || selectedProblem.description}
                        </p>
                      )}
                      {translatedDescription && (
                        <div className="mt-2 text-xs text-gray-500 italic">
                          Translated from English
                        </div>
                      )}
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-3">{t('examples')}</h3>
                      {selectedProblem.examples?.map((example, idx) => (
                        <div key={idx} className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-white/5">
                          <div className="text-sm">
                            <div className="mb-2">
                              <span className="text-gray-400">{t('input')}:</span>
                              <code className="ml-2 text-blue-300">{example.input}</code>
                            </div>
                            <div>
                              <span className="text-gray-400">{t('output')}:</span>
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
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">{t('constraints')}</h3>
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
                        {t('solutions')}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Video button clicked');
                          if (selectedProblem.videoUrl) {
                            setCurrentVideoUrl(selectedProblem.videoUrl);
                            setShowVideoStream(true);
                          } else {
                            setShowVideoModal(true);
                          }
                        }}
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all text-sm active:scale-95"
                      >
                        <Youtube className="w-4 h-4" />
                        {t('video')}
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
                        {t('session')}
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
              <span className={`text-sm font-medium ${theme.text}`}>{t('codeEditor')}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* AI Completion Toggle */}
              {isCompletionInitialized && (
                <button
                  onClick={() => setAiCompletionEnabled(!aiCompletionEnabled)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                    aiCompletionEnabled 
                      ? `bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30` 
                      : `bg-white/5 ${theme.textSecondary} hover:text-purple-300 border ${theme.border}`
                  }`}
                  title={aiCompletionEnabled ? 'AI Completion: ON' : 'AI Completion: OFF'}
                >
                  <Sparkles className={`w-3 h-3 ${aiCompletionEnabled ? 'animate-pulse' : ''}`} />
                  AI Complete
                </button>
              )}
              
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
              <>
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
                    automaticLayout: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    wordBasedSuggestions: true,
                  }}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    setMonacoLoaded(true);
                    console.log('Monaco Editor loaded successfully');

                    // Track cursor position for AI completion
                    editor.onDidChangeCursorPosition((e) => {
                      setCursorPosition(e.position);
                    });

                    // Trigger AI completion on content change
                    editor.onDidChangeModelContent((e) => {
                      if (aiCompletionEnabled && isCompletionInitialized) {
                        const position = editor.getPosition();
                        const model = editor.getModel();
                        if (model && position) {
                          const offset = model.getOffsetAt(position);
                          const currentCode = model.getValue();
                          
                          // Request completion after typing
                          if (e.changes.length > 0 && e.changes[0].text) {
                            requestCompletion(currentCode, offset);
                          }
                        }
                      }
                    });

                    // Keyboard shortcuts for AI completion
                    editor.addCommand(monaco.KeyCode.Tab, () => {
                      if (aiCompletion) {
                        const accepted = acceptCompletion();
                        if (accepted) {
                          const position = editor.getPosition();
                          const range = new monaco.Range(
                            position.lineNumber,
                            position.column,
                            position.lineNumber,
                            position.column
                          );
                          editor.executeEdits('ai-completion', [{
                            range: range,
                            text: accepted,
                            forceMoveMarkers: true
                          }]);
                        }
                      }
                    });

                    editor.addCommand(monaco.KeyCode.Escape, () => {
                      if (aiCompletion) {
                        dismissCompletion();
                      }
                    });
                  }}
                />

                {/* AI Code Completion Widget */}
                {aiCompletionEnabled && (
                  <AICodeCompletionWidget
                    completion={aiCompletion}
                    isLoading={isCompletionLoading}
                    position={cursorPosition}
                    onAccept={() => {
                      const accepted = acceptCompletion();
                      if (accepted && editorRef.current) {
                        const editor = editorRef.current;
                        const position = editor.getPosition();
                        const monaco = window.monaco;
                        if (monaco && position) {
                          const range = new monaco.Range(
                            position.lineNumber,
                            position.column,
                            position.lineNumber,
                            position.column
                          );
                          editor.executeEdits('ai-completion', [{
                            range: range,
                            text: accepted,
                            forceMoveMarkers: true
                          }]);
                          editor.focus();
                        }
                      }
                    }}
                    onDismiss={dismissCompletion}
                    editorRef={editorRef}
                  />
                )}
              </>
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
                className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg`}
              >
                {isRunning ? <Zap className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-pulse`} /> : <Play className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
                {!isMobile && t('run')}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Submit button clicked');
                  submitCode();
                }}
                type="button"
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} bg-gradient-to-r ${theme.primary} hover:opacity-80 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg`}
              >
                {isSubmitting ? <Zap className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-pulse`} /> : <Send className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />}
                {!isMobile && t('submit')}
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
                    {t('download')}
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
                    {t('share')}
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

      {/* Problem List Modal - Redesigned with Better Spacing */}
      {showProblemList && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br from-slate-900 to-slate-850 ${isMobile ? 'w-full h-full rounded-none' : 'rounded-3xl max-w-6xl w-full h-[85vh]'} border border-slate-600/40 overflow-hidden flex flex-col shadow-[0_25px_50px_rgba(0,0,0,0.6)]`}>
            
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-slate-800/70 to-slate-750/70 border-b border-slate-600/40 flex-shrink-0">
              <div className={`${isMobile ? 'p-6' : 'p-8'}`}>
                {/* Title */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                      <Layers className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Problem Library</h2>
                      <p className="text-sm text-gray-400 mt-1">Choose a problem to solve</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProblemList(false)}
                    className="p-3 hover:bg-slate-700/50 rounded-2xl transition-all group"
                  >
                    <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
                  </button>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-700/40 rounded-xl">
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">
                      <span className="text-white font-bold">{getFilteredProblems().length}</span> problems
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-green-500/15 rounded-xl border border-green-500/25">
                    <CheckCircle className="w-4.5 h-4.5 text-green-400" />
                    <span className="text-green-400 font-bold">
                      {progress.completedProblems.length} solved
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mb-6`}>
                  <button
                    onClick={() => setProblemSource('dsa')}
                    className={`relative px-5 py-4 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                      problemSource === 'dsa' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-slate-800/60 text-gray-400 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {problemSource === 'dsa' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20"></div>
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      <Code2 className="w-4 h-4" />
                      <span>DSA</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setProblemSource('tuf')}
                    className={`relative px-5 py-4 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                      problemSource === 'tuf' 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-800/60 text-gray-400 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {problemSource === 'tuf' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20"></div>
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>TUF</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setProblemSource('company')}
                    className={`relative px-5 py-4 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                      problemSource === 'company' 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-slate-800/60 text-gray-400 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {problemSource === 'company' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20"></div>
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Company</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setProblemSource('lld')}
                    className={`relative px-5 py-4 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                      problemSource === 'lld' 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'bg-slate-800/60 text-gray-400 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {problemSource === 'lld' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20"></div>
                    )}
                    <div className="relative flex items-center justify-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>LLD</span>
                    </div>
                  </button>
                </div>

                {/* Category Selectors */}
                {problemSource === 'tuf' && (
                  <select
                    value={selectedTUFCategory}
                    onChange={(e) => setSelectedTUFCategory(e.target.value)}
                    className="w-full mb-5 px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  >
                    <option value="basics">Step 1: Basics</option>
                    <option value="arrays">Step 3: Arrays</option>
                    <option value="binarySearch">Step 4: Binary Search</option>
                    <option value="linkedList">Step 6: Linked List</option>
                    <option value="recursion">Step 7: Recursion</option>
                  </select>
                )}

                {problemSource === 'company' && (
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full mb-5 px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  >
                    {Object.keys(companyWiseProblems).map(company => (
                      <option key={company} value={company}>
                        {company.charAt(0).toUpperCase() + company.slice(1)}
                      </option>
                    ))}
                  </select>
                )}

                {/* Search and Filter */}
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/60 text-white placeholder-gray-500 rounded-xl border border-slate-600/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className={`${isMobile ? 'w-full' : 'w-44'} px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-slate-600/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold`}
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problem List - Scrollable */}
            <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8'}`}>
              <div className="space-y-3 pb-4">
                {getFilteredProblems().map((problem) => {
                  const isCompleted = progress.completedProblems.includes(problem.id);
                  const hasTUFVideo = problem.videoUrl && problemSource === 'tuf';
                  
                  return (
                    <div
                      key={problem.id}
                      className={`group relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-500/8 to-emerald-500/5 border-green-500/40 hover:border-green-400/60 hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)]' 
                          : 'bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-600/50 hover:border-blue-500/60 hover:shadow-[0_10px_40px_rgba(59,130,246,0.12)]'
                      }`}
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
                    >
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                                {problem.title}
                              </h3>
                              {isCompleted && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full border border-green-500/40">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              <span className="px-3 py-1.5 bg-purple-500/15 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/30">
                                {problem.category}
                              </span>
                              {problemSource === 'tuf' && (
                                <span className="px-3 py-1.5 bg-orange-500/15 text-orange-300 rounded-lg text-xs font-bold border border-orange-500/30">
                                  TUF
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 p-2.5 bg-slate-700/30 rounded-xl group-hover:bg-blue-500/20 transition-all border border-slate-600/30 group-hover:border-blue-500/50">
                            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>

                        {/* Tags */}
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap mb-4">
                            {problem.tags.slice(0, 4).map((tag, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-700/40 text-gray-400 rounded-md text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                            {problem.tags.length > 4 && (
                              <span className="px-2.5 py-1 bg-slate-700/30 text-gray-500 rounded-md text-xs">
                                +{problem.tags.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* TUF Actions */}
                        {hasTUFVideo && (
                          <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-700/50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentVideoUrl(problem.videoUrl);
                                setShowVideoStream(true);
                                setShowProblemList(false);
                              }}
                              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 rounded-xl border border-red-500/40 hover:border-red-500/60 transition-all text-sm font-bold text-red-300 hover:scale-105"
                            >
                              <Youtube className="w-4 h-4" />
                              Watch Video
                            </button>
                            {problem.articleUrl && (
                              <a
                                href={problem.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-xl border border-blue-500/40 hover:border-blue-500/60 transition-all text-sm font-bold text-blue-300 hover:scale-105"
                              >
                                <BookOpen className="w-4 h-4" />
                                Read Article
                              </a>
                            )}
                          </div>
                        )}

                        {/* Completion indicator */}
                        {isCompleted && (
                          <div className="mt-4 pt-4 border-t-2 border-green-500/30">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-xl border border-green-500/40">
                                <Trophy className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-bold text-green-300">Completed</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 rounded-xl border border-yellow-500/40">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-bold text-yellow-300">Great job!</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {getFilteredProblems().length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <div className="relative p-6 bg-slate-800/50 rounded-3xl border-2 border-slate-700/50">
                      <Filter className="w-16 h-16 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No problems found</h3>
                  <p className="text-gray-400 text-base mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setDifficultyFilter('All');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
      )}

      {/* Timer Settings Modal */}
      {showTimerSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[40] flex items-center justify-center p-4">
          <div className={`bg-gradient-to-br ${theme.card} rounded-2xl border-2 ${theme.border} max-w-md w-full p-6 shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Timer className="w-6 h-6 text-blue-400" />
                Timer Settings
              </h2>
              <button
                onClick={() => setShowTimerSettings(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timer Presets */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-3 block">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setTimerDuration(15);
                      setTimeLeft(15 * 60);
                    }}
                    className={`px-4 py-3 rounded-lg border ${theme.border} transition-all hover:bg-white/10 ${
                      timerDuration === 15 ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5'
                    }`}
                  >
                    <div className="text-lg font-bold">15</div>
                    <div className="text-xs text-gray-400">Easy</div>
                  </button>
                  <button
                    onClick={() => {
                      setTimerDuration(25);
                      setTimeLeft(25 * 60);
                    }}
                    className={`px-4 py-3 rounded-lg border ${theme.border} transition-all hover:bg-white/10 ${
                      timerDuration === 25 ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-white/5'
                    }`}
                  >
                    <div className="text-lg font-bold">25</div>
                    <div className="text-xs text-gray-400">Medium</div>
                  </button>
                  <button
                    onClick={() => {
                      setTimerDuration(45);
                      setTimeLeft(45 * 60);
                    }}
                    className={`px-4 py-3 rounded-lg border ${theme.border} transition-all hover:bg-white/10 ${
                      timerDuration === 45 ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5'
                    }`}
                  >
                    <div className="text-lg font-bold">45</div>
                    <div className="text-xs text-gray-400">Hard</div>
                  </button>
                </div>
              </div>

              {/* Custom Duration */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-2 block">
                  Custom Duration: {timerDuration} minutes
                </label>
                <input
                  type="range"
                  min="1"
                  max="180"
                  value={timerDuration}
                  onChange={(e) => {
                    const duration = parseInt(e.target.value);
                    setTimerDuration(duration);
                    setTimeLeft(duration * 60);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 min</span>
                  <span>180 min</span>
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="text-sm">Sound Notifications</span>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    soundEnabled ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      soundEnabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowTimerSettings(false)}
                className={`w-full px-4 py-3 bg-gradient-to-r ${theme.primary} rounded-lg hover:opacity-80 transition-all font-semibold`}
              >
                Done
              </button>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
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

      {/* Video Stream Player */}
      <VideoStreamPlayer
        videoUrl={currentVideoUrl}
        problemTitle={selectedProblem?.title || 'Problem Solution'}
        isOpen={showVideoStream}
        onClose={() => {
          setShowVideoStream(false);
          setCurrentVideoUrl('');
        }}
      />

      {/* Points Animation */}
      {showPointsAnimation && pointsData && (
        <PointsAnimation
          points={pointsData.pointsEarned}
          bonusPoints={pointsData.bonusPoints}
          newBadges={pointsData.newBadges}
          onComplete={() => {
            setShowPointsAnimation(false);
            setPointsData(null);
          }}
        />
      )}
    </div>
  );
};

export default LeetCodeEditorRedesigned;