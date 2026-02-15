import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Settings,
  Maximize2,
  Minimize2,
  Code2,
  Terminal,
  User,
  LogOut,
  Trophy,
  BarChart3,
  Crown,
  Shield,
  Home,
  Brain,
  Lightbulb,
  Youtube,
  Zap,
  Github,
  GitBranch,
  Upload,
  Download,
  Copy,
  BookOpen,
  Users,
  X,
  Pencil,
  Calendar,
  Target,
  Share2,
  Building2,
  Filter,
  Search,
  Timer,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertCircle,
  Layers,
  Loader2,
  MessageCircle
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import { companyWiseProblems, timerPresets } from '../data/companyWiseProblems';
import { lldProblems } from '../data/lldProblems';
import AICodeExplainer from './AI/AICodeExplainer';
import { useCodeCompletion } from '../hooks/useCodeCompletion';
import CodeCompletionPanel from './CodeCompletionPanel';
import VideoPlayer from './VideoPlayer';
import { useDryRunAnimation } from '../hooks/useDryRunAnimation';
import DryRunAnimationPanel from './DryRunAnimationPanel';
import { triggerDashboardUpdate } from '../utils/dashboardUpdater';
import SolutionViewer from './SolutionViewer';
import NetworkMonitor from './NetworkMonitor';
import AIPeerChat from './AIPeerChat';
import AIWhiteboardVisualizer from './AIWhiteboardVisualizer';
import DSACertificateSystem from './DSACertificateSystem';
import DSARoadmapTracker from './DSARoadmapTracker';
import LeetCodeDailyTask from './LeetCodeDailyTask';
import MonthlyGoals from './MonthlyGoals';
import ProblemDescription from './ProblemDescription';
import { useClerkProgress } from '../hooks/useClerkProgress';
import SessionBookingModal from './SessionBookingModal';
import CodeShareModal from './CodeShareModal';

const LeetCodeEditor = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { theme } = useTheme();
  
  // Clerk-based progress tracking
  const { 
    progress, 
    loading: progressLoading, 
    markProblemCompleted, 
    recordSubmission, 
    getProgressStats 
  } = useClerkProgress();
  
  // Company and problem selection
  const [problemSource, setProblemSource] = useState('dsa'); // 'dsa', 'company', or 'lld'
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  
  // Timer states
  const [timerDuration, setTimerDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState('medium');
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [code, setCode] = useState(() => {
    const initialCode = dsaProblems[0]?.starterCode;
    if (typeof initialCode === 'object') {
      return initialCode.javascript || '';
    }
    return initialCode || '';
  });
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [compilerErrors, setCompilerErrors] = useState([]);
  const [runtimeErrors, setRuntimeErrors] = useState([]);
  const [outputComparison, setOutputComparison] = useState(null);
  const [leftPanelTab, setLeftPanelTab] = useState('description'); // 'description' or 'whiteboard'
  const editorRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monacoError, setMonacoError] = useState(false);
  const [showSessionBooking, setShowSessionBooking] = useState(false);
  const [showRoadmapTracker, setShowRoadmapTracker] = useState(false);
  const [showDailyTask, setShowDailyTask] = useState(false);
  const [showMonthlyGoals, setShowMonthlyGoals] = useState(false);
  const [showCodeShareModal, setShowCodeShareModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showSolutionViewer, setShowSolutionViewer] = useState(false);
  const [isLeftPanelMinimized, setIsLeftPanelMinimized] = useState(false);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Certificate system state
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [newCertificate, setNewCertificate] = useState(null);

  // Load completed problems from localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`dsa_progress_${user.id}`);
      if (saved) {
        setCompletedProblems(new Set(JSON.parse(saved)));
      }
    }
  }, [user?.id]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (soundEnabled && audioRef.current) {
              audioRef.current.play();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timeLeft, soundEnabled]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer controls
  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerDuration * 60);
  };

  // Set timer preset
  const setPreset = (preset) => {
    const duration = timerPresets[preset].duration;
    setTimerDuration(duration);
    setTimeLeft(duration * 60);
    setTimerPreset(preset);
    setIsTimerRunning(false);
  };

  // Get current problems list based on source
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

  // Timer warning colors
  const getTimerColor = () => {
    const percentage = (timeLeft / (timerDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Update code when problem changes
  useEffect(() => {
    if (selectedProblem) {
      if (problemSource === 'company' && selectedProblem.template && selectedProblem.template[language]) {
        setCode(selectedProblem.template[language]);
      } else if (selectedProblem.starterCode) {
        setCode(selectedProblem.starterCode);
      }
    }
  }, [selectedProblem, language, problemSource]);

  // Check certificate eligibility
  const checkCertificateEligibility = async (problemId, language) => {
    if (!user?.id) return;

    // Mark problem as completed
    const newCompleted = new Set(completedProblems);
    if (newCompleted.has(problemId)) return; // Already completed

    newCompleted.add(problemId);
    setCompletedProblems(newCompleted);
    
    // Save to localStorage
    localStorage.setItem(`dsa_progress_${user.id}`, JSON.stringify([...newCompleted]));

    const completedCount = newCompleted.size;
    console.log(`🎯 Problems completed: ${completedCount}/150`);

    // Check for milestone certificates
    const milestones = [
      { count: 10, name: 'DSA Beginner', description: 'Completed first 10 problems' },
      { count: 25, name: 'Problem Solver', description: 'Solved 25 DSA problems' },
      { count: 50, name: 'Algorithm Expert', description: 'Mastered 50 algorithms' },
      { count: 100, name: 'DSA Master', description: 'Conquered 100 challenges' },
      { count: 150, name: 'DSA Grandmaster', description: 'Completed all 150 problems! 🎉' }
    ];

    // Check if user hit a milestone
    const milestone = milestones.find(m => m.count === completedCount);
    if (milestone) {
      console.log(`🏆 Milestone reached: ${milestone.name}`);
      await generateCertificate(milestone, language, completedCount);
    }

    // Check category completion
    await checkCategoryCompletion(newCompleted, language);
  };

  // Check if user completed an entire category
  const checkCategoryCompletion = async (completed, language) => {
    const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs', 'Stack'];
    
    for (const category of categories) {
      const categoryProblems = dsaProblems.filter(p => p.category === category);
      const completedInCategory = categoryProblems.filter(p => completed.has(p.id));
      
      if (completedInCategory.length === categoryProblems.length) {
        // Check if we already have this category certificate
        const existingCerts = JSON.parse(localStorage.getItem(`dsa_certificates_${user.id}`) || '[]');
        const hasCategory = existingCerts.some(cert => cert.challengeName === `${category} Master`);
        
        if (!hasCategory) {
          console.log(`🎯 Category completed: ${category}`);
          await generateCertificate({
            name: `${category} Master`,
            description: `Completed all ${categoryProblems.length} ${category} problems`,
            type: 'category'
          }, language, categoryProblems.length);
        }
      }
    }
  };

  // Generate certificate
  const generateCertificate = async (achievement, language, problemsCompleted) => {
    try {
      const userName = user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user?.emailAddresses?.[0]?.emailAddress || 'Coding Enthusiast';

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';
      
      console.log(`🎖️ Generating certificate: ${achievement.name}`);
      
      const response = await fetch(`${backendUrl}/api/certificates/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail: user?.emailAddresses?.[0]?.emailAddress,
          challengeType: 'dsa',
          challengeName: achievement.name,
          completionTime: new Date().toISOString(),
          score: 100,
          language: language,
          difficulty: achievement.count >= 100 ? 'Grandmaster' : achievement.count >= 50 ? 'Expert' : 'Advanced'
        })
      });

      const data = await response.json();

      if (data.success) {
        const certificate = {
          ...data.certificate,
          achievement,
          problemsCompleted,
          generatedAt: new Date().toISOString()
        };

        // Save certificate to localStorage
        const existingCerts = JSON.parse(localStorage.getItem(`dsa_certificates_${user.id}`) || '[]');
        const updatedCerts = [...existingCerts, certificate];
        localStorage.setItem(`dsa_certificates_${user.id}`, JSON.stringify(updatedCerts));

        // Show certificate modal
        setNewCertificate(certificate);
        setShowCertificateModal(true);

        console.log(`✅ Certificate generated: ${certificate.verificationCode}`);
      }
    } catch (error) {
      console.error('Certificate generation error:', error);
    }
  };

  // Download certificate
  const downloadCertificate = (certificate) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';
    window.open(`${backendUrl}/api/certificates/download/${certificate.id}`, '_blank');
  };

  // Share certificate
  const shareCertificate = (certificate) => {
    const shareText = `🎉 I just earned the "${certificate.challengeName}" certificate for completing DSA challenges! 💪 #DSA #Coding #Achievement`;
    const shareUrl = `${window.location.origin}/verify/${certificate.verificationCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'DSA Certificate Achievement',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nVerify: ${shareUrl}`);
      alert('Certificate link copied to clipboard!');
    }
  };

  // Monaco loading timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!monacoLoaded) {
        console.warn('Monaco failed to load, using fallback editor');
        setMonacoError(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [monacoLoaded]);

  // AI Code Completion
  const {
    suggestions,
    isLoading: isLoadingCompletions,
    requestCompletions,
    clearSuggestions
  } = useCodeCompletion(language, true);
  
  const [completionPanelPosition, setCompletionPanelPosition] = useState({ top: 0, left: 0 });
  const [showCompletions, setShowCompletions] = useState(false);

  // GitHub Integration
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [autoSyncGithub, setAutoSyncGithub] = useState(true);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState(null);

  // Auto Dry Run Animation
  const {
    dryRunData,
    isAnalyzing,
    showAnimation,
    closeDryRun,
    triggerDryRun
  } = useDryRunAnimation(code, language, selectedProblem);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  // Helper function to get user stats from Clerk progress
  const getUserStats = () => {
    if (progressLoading) {
      return {
        totalSubmissions: 0,
        solvedProblems: 0,
        acceptedSubmissions: 0,
        currentStreak: 0,
        maxStreak: 0,
        rating: 1200,
        totalRuns: 0
      };
    }

    const stats = getProgressStats();
    return {
      totalSubmissions: stats.totalSubmissions,
      solvedProblems: stats.totalProblems,
      acceptedSubmissions: progress.acceptedSubmissions,
      currentStreak: stats.currentStreak,
      maxStreak: stats.maxStreak,
      rating: calculateRating(stats.totalProblems, stats.currentStreak),
      totalRuns: progress.totalSubmissions // Using total submissions as runs for now
    };
  };

  // Calculate user rating based on problems solved and streak
  const calculateRating = (problemsSolved, streak) => {
    const baseRating = 1200;
    const problemBonus = problemsSolved * 10;
    const streakBonus = streak * 25;
    return Math.min(3000, baseRating + problemBonus + streakBonus);
  };

  useEffect(() => {
    if (selectedProblem) {
      const newCode = getStarterCodeForLanguage(selectedProblem, language);
      setCode(newCode);
      setTestResults(null);
      setConsoleOutput([]);
    }
  }, [selectedProblem, language]); // Added language dependency

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    setMonacoLoaded(true);
    console.log('Monaco Editor loaded successfully');
    
    // Add keyboard shortcut for AI completions
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      const position = editor.getPosition();
      const model = editor.getModel();
      
      if (position && model) {
        const offset = model.getOffsetAt(position);
        const value = model.getValue();
        
        // Force request completions
        requestCompletions(
          value,
          offset,
          `Solving: ${selectedProblem.title} - ${selectedProblem.difficulty}`,
          0
        );
        setShowCompletions(true);
      }
    });
    
    // Escape to close completions
    editor.addCommand(monaco.KeyCode.Escape, () => {
      clearSuggestions();
      setShowCompletions(false);
    });
  };

  const handleEditorChange = (value) => {
    // Ensure value is always a string
    const newCode = typeof value === 'string' ? value : '';
    setCode(newCode);
    
    // Get cursor position from Monaco editor for AI completions
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const model = editorRef.current.getModel();
      
      if (position && model) {
        const offset = model.getOffsetAt(position);
        
        console.log('[AI Completion] Requesting completions:', {
          codeLength: (value || '').length,
          offset,
          language,
          problem: selectedProblem.title
        });
        
        // Request AI completions with debouncing
        requestCompletions(
          value || '',
          offset,
          `Solving: ${selectedProblem.title} - ${selectedProblem.difficulty} - ${selectedProblem.category}`,
          600 // 600ms debounce
        );
        
        // Calculate panel position
        const coords = editorRef.current.getScrolledVisiblePosition(position);
        if (coords) {
          setCompletionPanelPosition({
            top: coords.top + coords.height + 100, // Adjust for editor offset
            left: coords.left + 50
          });
        }
        
        setShowCompletions(true);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const model = editorRef.current.getModel();
      
      if (position && model) {
        // Insert suggestion at cursor
        const range = {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        };
        
        editorRef.current.executeEdits('', [{
          range: range,
          text: suggestion.text
        }]);
        
        // Move cursor to end of inserted text
        const lines = suggestion.text.split('\n');
        const lastLine = lines[lines.length - 1];
        const newPosition = {
          lineNumber: position.lineNumber + lines.length - 1,
          column: lines.length > 1 ? lastLine.length + 1 : position.column + suggestion.text.length
        };
        editorRef.current.setPosition(newPosition);
        editorRef.current.focus();
      }
    }
    
    clearSuggestions();
    setShowCompletions(false);
  };

  // Helper function to get starter code for current language
  const getStarterCodeForLanguage = (problem, lang) => {
    if (!problem || !problem.starterCode) return '';
    
    // Handle new multi-language format
    if (typeof problem.starterCode === 'object') {
      const code = problem.starterCode[lang] || problem.starterCode.javascript || '';
      return typeof code === 'string' ? code : '';
    }
    
    // Handle old single-language format (fallback)
    const code = problem.starterCode;
    return typeof code === 'string' ? code : '';
  };

  const runCode = async () => {
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput([]);
    setCompilerErrors([]);
    setRuntimeErrors([]);
    setOutputComparison(null);

    try {
      setConsoleOutput([{ type: 'info', message: '⏳ Compiling and running...' }]);

      // Prepare test case
      const testCase = {
        input: customInput || selectedProblem.examples[0].input,
        expected: selectedProblem.examples[0].output
      };

      // Call backend API for multi-language execution
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/leetcode/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          testCases: [testCase],
          problemId: selectedProblem.id
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Execution failed');
      }

      const result = data.results[0];

      // Handle compilation/runtime errors
      if (result.error) {
        const errorType = result.error.includes('Syntax') ? 'Compilation Error' : 'Runtime Error';
        
        setConsoleOutput([
          { type: 'error', message: `❌ ${errorType}` },
          { type: 'error', message: '' },
          { type: 'error', message: result.error },
          { type: 'info', message: '' },
          { type: 'info', message: 'Last executed input:' },
          { type: 'info', message: testCase.input }
        ]);
        
        setRuntimeErrors([{
          line: 1,
          message: result.error,
          type: errorType
        }]);
        
        setIsRunning(false);
        return;
      }

      // Create comparison object
      const comparison = {
        testCase: 1,
        input: testCase.input,
        userOutput: JSON.stringify(result.output),
        expectedOutput: testCase.expected,
        passed: result.passed,
        runtime: `${result.runtime}ms`,
        memory: `${(result.memory / 1024).toFixed(1)} MB`
      };

      setOutputComparison(comparison);

      // Track run attempt using Clerk progress (if signed in)
      if (isSignedIn && user) {
        try {
          // Record the run as a submission attempt
          await recordSubmission(selectedProblem.id, result.passed, language, 1);
          console.log('✅ Run tracked via Clerk progress');
        } catch (error) {
          console.log('Failed to update run stats:', error);
        }
      }

      // Update console output
      const output = [
        { type: 'success', message: '✓ Compilation successful' },
        { type: 'info', message: '✓ Code executed successfully' },
        { type: 'success', message: '' },
        { type: 'success', message: 'Test Case 1:' },
        { type: 'info', message: `Input: ${comparison.input}` },
        { type: result.passed ? 'success' : 'error', message: `Your Output: ${comparison.userOutput}` },
        { type: 'success', message: `Expected: ${comparison.expectedOutput}` },
        { type: result.passed ? 'success' : 'error', message: result.passed ? '✓ Test case passed' : '✗ Test case failed - Output mismatch' },
        { type: 'info', message: '' },
        { type: 'info', message: `Runtime: ${comparison.runtime}` },
        { type: 'info', message: `Memory: ${comparison.memory}` }
      ];
      setConsoleOutput(output);

    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Execution error' },
        { type: 'error', message: error.message },
        { type: 'info', message: '' },
        { type: 'info', message: 'Make sure the backend server is running on port 3001' }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // GitHub Integration Functions
  
  // Simple download solution (no backend required)
  const downloadSolution = () => {
    console.log('📥 Download button clicked!');
    console.log('Test Results:', testResults);
    console.log('Selected Problem:', selectedProblem?.title);
    console.log('Language:', language);
    
    try {
      // Ensure we have test results
      if (!testResults) {
        console.error('❌ No test results available');
        setGithubSyncStatus({
          type: 'error',
          message: '❌ No test results available. Submit your code first.'
        });
        setTimeout(() => setGithubSyncStatus(null), 3000);
        return;
      }

      console.log('✅ Generating file content...');
      const content = generateGithubFileContent(selectedProblem, code, testResults);
      const fileName = `${selectedProblem.id}-${selectedProblem.title.replace(/\s+/g, '-').toLowerCase()}.${getFileExtension(language)}`;
      
      console.log('✅ Creating download:', fileName);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ Download triggered successfully!');
      setGithubSyncStatus({
        type: 'success',
        message: '✅ Solution downloaded! Upload to your GitHub repo.'
      });
      
      setTimeout(() => setGithubSyncStatus(null), 5000);
    } catch (error) {
      console.error('❌ Download error:', error);
      setGithubSyncStatus({
        type: 'error',
        message: `❌ Download failed: ${error.message}`
      });
      setTimeout(() => setGithubSyncStatus(null), 5000);
    }
  };
  
  const syncToGithub = async (problemData, submittedCode, submissionResult) => {
    if (!githubConnected || !autoSyncGithub) return;

    setIsSyncingGithub(true);
    setGithubSyncStatus({ type: 'info', message: 'Syncing to GitHub...' });

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      
      // Prepare file content
      const fileContent = generateGithubFileContent(problemData, submittedCode, submissionResult);
      const fileName = `${problemData.id}-${problemData.title.replace(/\s+/g, '-').toLowerCase()}.${getFileExtension(language)}`;
      const folderPath = `${problemData.difficulty}/${problemData.category}`;

      const response = await fetch(`${backendUrl}/api/github/sync-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          username: githubUsername,
          fileName,
          folderPath,
          content: fileContent,
          problemTitle: problemData.title,
          difficulty: problemData.difficulty,
          category: problemData.category,
          language
        })
      });

      const data = await response.json();

      if (data.success) {
        setGithubSyncStatus({ 
          type: 'success', 
          message: `✅ Synced to GitHub!`,
          url: data.fileUrl 
        });
      } else {
        throw new Error(data.error || 'GitHub sync failed');
      }
    } catch (error) {
      console.error('GitHub sync error:', error);
      setGithubSyncStatus({ 
        type: 'error', 
        message: `❌ GitHub sync failed: ${error.message}` 
      });
    } finally {
      setIsSyncingGithub(false);
      // Clear status after 5 seconds
      setTimeout(() => setGithubSyncStatus(null), 5000);
    }
  };

  const generateGithubFileContent = (problem, code, result) => {
    const timestamp = new Date().toISOString();
    const languageComments = {
      javascript: { start: '//', block: '/*', blockEnd: '*/' },
      python: { start: '#', block: '"""', blockEnd: '"""' },
      java: { start: '//', block: '/*', blockEnd: '*/' },
      cpp: { start: '//', block: '/*', blockEnd: '*/' },
      typescript: { start: '//', block: '/*', blockEnd: '*/' }
    };

    const comment = languageComments[language] || languageComments.javascript;

    return `${comment.block}
 * Problem: ${problem.title}
 * Difficulty: ${problem.difficulty}
 * Category: ${problem.category}
 * 
 * Description:
 * ${problem.description}
 * 
 * Submission Result:
 * - Status: ${result.accepted ? 'Accepted ✅' : 'Failed ❌'}
 * - Test Cases Passed: ${result.passedTestCases}/${result.totalTestCases}
 * ${result.accepted ? `- Runtime: ${result.runtime}\n * - Memory: ${result.memory}` : ''}
 * 
 * Submitted: ${timestamp}
 * Language: ${language}
 ${comment.blockEnd}

${code}
`;
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      typescript: 'ts'
    };
    return extensions[lang] || 'txt';
  };

  const connectGithub = () => {
    // Simply enable GitHub sync - uses token owner's account
    setGithubConnected(true);
    setGithubUsername('token-owner'); // Placeholder, actual username from token
    setShowGithubModal(false);
    
    // Save to localStorage
    localStorage.setItem('githubConnected', 'true');
    localStorage.setItem('autoSyncGithub', 'true');
    
    setGithubSyncStatus({
      type: 'success',
      message: '✅ GitHub connected! Solutions will sync to your account.'
    });
    
    setTimeout(() => setGithubSyncStatus(null), 3000);
  };

  const handleGithubConnect = (username) => {
    // Legacy function - now just calls connectGithub
    connectGithub();
  };

  // Load GitHub settings from localStorage
  useEffect(() => {
    const savedConnected = localStorage.getItem('githubConnected') === 'true';
    const savedAutoSync = localStorage.getItem('autoSyncGithub') !== 'false';

    if (savedConnected) {
      setGithubConnected(true);
      setGithubUsername('token-owner');
      setAutoSyncGithub(savedAutoSync);
    }
  }, []);

  const submitCode = async () => {
    setIsSubmitting(true);
    setConsoleTab('result');
    setCompilerErrors([]);
    setRuntimeErrors([]);
    setOutputComparison(null);

    try {
      setConsoleOutput([{ type: 'info', message: '⏳ Running all test cases...' }]);

      // Prepare all test cases
      const allTestCases = selectedProblem.examples.map(example => ({
        input: example.input,
        expected: example.output
      }));

      // Call backend API for submission
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/leetcode/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          problemId: selectedProblem.id,
          userId: user?.id
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      // Update user stats using Clerk progress tracking
      if (isSignedIn && user) {
        try {
          const isAccepted = data.accepted;
          const timeSpent = 5; // Estimate 5 minutes per submission
          
          // Record the submission
          await recordSubmission(selectedProblem.id, isAccepted, language, timeSpent);
          
          // If accepted and not already completed, mark as completed
          if (isAccepted && !progress.completedProblems.includes(selectedProblem.id)) {
            const achievements = await markProblemCompleted(
              selectedProblem.id, 
              selectedProblem.difficulty, 
              selectedProblem.category || 'General',
              language,
              timeSpent
            );
            
            // Show achievement notifications if any
            if (achievements && achievements.length > 0) {
              console.log('🏆 New achievements unlocked:', achievements);
              // You can add UI notifications here
            }
          }
          
          console.log('✅ Progress updated via Clerk');
        } catch (error) {
          console.log('Failed to update Clerk progress:', error);
        }
      }

      // All tests passed
      if (data.accepted) {
        const results = {
          accepted: true,
          runtime: `${data.runtime || data.stats?.avgRuntime || 50} ms`,
          memory: `${((data.memory || data.stats?.avgMemory || 40000) / 1024).toFixed(1)} MB`,
          runtimePercentile: (Math.random() * 30 + 70).toFixed(1),
          memoryPercentile: (Math.random() * 30 + 60).toFixed(1),
          totalTestCases: data.totalTestCases,
          passedTestCases: data.passedTestCases
        };
        setTestResults(results);
        setOutputComparison(null);
        
        // Check for certificate eligibility when problem is solved
        await checkCertificateEligibility(selectedProblem.id, language);
        
        // Check if this was today's daily challenge and mark it complete
        if (user?.id) {
          try {
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            
            // Get today's daily challenge ID
            const dailyChallenges = [1, 13, 45, 24, 31, 26, 16, 3, 5, 11, 21, 29, 34, 38, 42, 2, 12, 17, 23, 30, 36, 40, 43, 4, 8, 18, 25, 32, 9, 33];
            const todaysChallengeId = dailyChallenges[dayOfYear % dailyChallenges.length];
            
            // If user solved today's challenge, mark it complete
            if (selectedProblem.id === todaysChallengeId) {
              const saved = localStorage.getItem(`daily_progress_${user.id}`);
              const currentProgress = saved ? JSON.parse(saved) : {};
              const todayStr = today.toDateString();
              
              // Only update if not already completed today
              if (currentProgress.lastCompleted !== todayStr) {
                const newProgress = {
                  lastCompleted: todayStr,
                  weekStreak: (currentProgress.weekStreak || 0) + 1,
                  totalCompleted: (currentProgress.totalCompleted || 0) + 1,
                  points: (currentProgress.points || 0) + (selectedProblem.difficulty === 'Easy' ? 10 : selectedProblem.difficulty === 'Medium' ? 20 : 25)
                };
                
                localStorage.setItem(`daily_progress_${user.id}`, JSON.stringify(newProgress));
                console.log('🎯 Daily challenge completed!', newProgress);
              }
            }
          } catch (error) {
            console.error('Failed to update daily challenge progress:', error);
          }
        }
        
        // Record completion in roadmap tracker
        if (user?.id) {
          try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
            await fetch(`${backendUrl}/api/roadmap/record-completion`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                problemId: selectedProblem.id,
                difficulty: selectedProblem.difficulty,
                category: selectedProblem.category
              })
            });
            console.log('✅ Roadmap progress updated');
            
            // Trigger dashboard update
            triggerDashboardUpdate();
          } catch (error) {
            console.log('Failed to update roadmap:', error);
          }
        }
        
        // Sync to GitHub if connected and auto-sync is enabled
        if (githubConnected && autoSyncGithub) {
          await syncToGithub(selectedProblem, code, results);
        }
      } else {
        // Find first failed test case
        const failedResult = data.results?.find(r => !r.passed);
        if (failedResult) {
          setOutputComparison({
            testCase: data.results.indexOf(failedResult) + 1,
            input: failedResult.input,
            userOutput: JSON.stringify(failedResult.output),
            expectedOutput: failedResult.expected,
            passed: false,
            totalTests: data.totalTestCases,
            passedTests: data.passedTestCases,
            error: failedResult.error
          });
        }
        
        setTestResults({
          accepted: false,
          failedTestCase: data.results?.findIndex(r => !r.passed) + 1 || 1,
          totalTestCases: data.totalTestCases,
          passedTestCases: data.passedTestCases
        });
      }

    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Submission failed' },
        { type: 'error', message: error.message },
        { type: 'info', message: '' },
        { type: 'info', message: 'Make sure the backend server is running on port 3001' }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserRank = (rating) => {
    if (rating >= 2500) return { name: 'Grandmaster', color: 'text-red-400', icon: Crown };
    if (rating >= 2200) return { name: 'Master', color: 'text-purple-400', icon: Trophy };
    if (rating >= 1900) return { name: 'Expert', color: 'text-blue-400', icon: Shield };
    if (rating >= 1600) return { name: 'Specialist', color: 'text-green-400', icon: BarChart3 };
    if (rating >= 1200) return { name: 'Pupil', color: 'text-yellow-400', icon: User };
    return { name: 'Newbie', color: 'text-gray-400', icon: User };
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserDropdown(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Code2 className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Playground Sheet
            </h1>
            
            <div className="space-y-2 mb-8">
              <p className="text-xl text-gray-300 font-semibold animate-fade-in">
                Loading your coding arena...
              </p>
              <p className="text-sm text-gray-400 animate-fade-in-delay">
                Preparing DSA problems, LLD challenges, and AI tools
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`h-screen bg-gradient-to-br ${theme.background} ${theme.text} flex flex-col overflow-hidden`}>
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Modern Top Navigation Bar */}
      <div className={`h-16 bg-gradient-to-r ${theme.card} border-b ${theme.border} backdrop-blur-xl flex items-center justify-between px-6 relative z-10 shadow-lg`}>
        <div className="flex items-center gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Playground Sheet
              </h1>
              <p className="text-xs text-gray-400 font-medium">DSA • LLD • Practice</p>
            </div>
          </div>
          
          {/* Problem Source Toggle - Modern Pills with LLD */}
          <div className={`flex items-center ${theme.card} rounded-xl p-1 ${theme.border} border shadow-inner`}>
            <button
              onClick={() => {
                setProblemSource('dsa');
                setSelectedProblem(dsaProblems[0]);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                problemSource === 'dsa' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : `${theme.textSecondary} hover:${theme.text} hover:bg-gray-700/30`
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>DSA</span>
              </div>
            </button>
            <button
              onClick={() => {
                setProblemSource('company');
                const companyProblems = companyWiseProblems[selectedCompany]?.problems || [];
                if (companyProblems.length > 0) {
                  setSelectedProblem(companyProblems[0]);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                problemSource === 'company' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : `${theme.textSecondary} hover:${theme.text} hover:bg-gray-700/30`
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Companies</span>
              </div>
            </button>
            <button
              onClick={() => {
                setProblemSource('lld');
                // Load first LLD problem when switching
                const allLldProblems = [...lldProblems.easy, ...lldProblems.medium, ...lldProblems.hard];
                const firstLLDProblem = allLldProblems[0];
                if (firstLLDProblem) {
                  setSelectedProblem(firstLLDProblem);
                  setCode(firstLLDProblem.starterCode || '');
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                problemSource === 'lld' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : `${theme.textSecondary} hover:${theme.text} hover:bg-gray-700/30`
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>LLD</span>
              </div>
            </button>
          </div>

          {/* Company Selector - Modern Dropdown */}
          {problemSource === 'company' && (
            <div className="flex items-center gap-2">
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  const companyProblems = companyWiseProblems[e.target.value]?.problems || [];
                  if (companyProblems.length > 0) {
                    setSelectedProblem(companyProblems[0]);
                  }
                }}
                className={`bg-gradient-to-r ${theme.card} border ${theme.border} rounded-xl px-4 py-2 ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer`}
              >
                {Object.entries(companyWiseProblems).map(([key, company]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {company.logo} {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 ${theme.card} ${theme.border} border rounded-xl ${theme.textSecondary} hover:${theme.text} hover:shadow-md transition-all duration-200`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className={`flex items-center gap-2 px-4 py-2 ${theme.card} ${theme.border} border rounded-xl ${theme.textSecondary} hover:${theme.text} hover:shadow-md transition-all duration-200`}
          >
            <span className="text-sm font-medium">Problems</span>
            {showProblemList ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.card} border-2 ${theme.border} rounded-lg`}>
            <Clock className={`w-4 h-4 ${getTimerColor()}`} />
            <span className={`text-lg font-mono font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </span>
            
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={isTimerRunning ? pauseTimer : startTimer}
                className={`p-1.5 rounded-lg bg-gradient-to-r ${theme.primary} hover:opacity-80 transition-all`}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              
              <button
                onClick={resetTimer}
                className={`p-1.5 rounded-lg bg-gradient-to-r ${theme.secondary} hover:opacity-80 transition-all`}
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setShowTimerSettings(!showTimerSettings)}
                className={`p-1.5 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-all`}
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Timer Settings Dropdown */}
          {showTimerSettings && (
            <div className={`absolute top-16 right-4 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-xl p-4 shadow-2xl z-50 w-80`}>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Timer Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(timerPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      timerPreset === key
                        ? `border-blue-500 bg-blue-500/20`
                        : `${theme.border} hover:border-gray-600`
                    }`}
                  >
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-sm opacity-70">{preset.duration}m</div>
                  </button>
                ))}
              </div>

              {timerPreset === 'custom' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Custom Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={timerDuration}
                    onChange={(e) => {
                      const duration = parseInt(e.target.value);
                      setTimerDuration(duration);
                      setTimeLeft(duration * 60);
                    }}
                    className={`w-full px-3 py-2 bg-gradient-to-r ${theme.card} border-2 ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg ${soundEnabled ? 'text-green-400' : theme.textSecondary}`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <span className="text-sm">Sound alerts</span>
                </div>
                
                <button
                  onClick={() => setShowTimerSettings(false)}
                  className={`px-4 py-2 bg-gradient-to-r ${theme.primary} rounded-lg hover:opacity-80 transition-all`}
                >
                  Done
                </button>
              </div>
            </div>
          )}
          
          {isSignedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg transition-colors`}
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${theme.primary} rounded-full flex items-center justify-center font-bold text-sm`}>
                  {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className={`absolute right-0 top-full mt-2 w-80 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-lg shadow-xl z-50 overflow-hidden`}>
                  {/* User Info Header */}
                  <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user?.emailAddresses?.[0]?.emailAddress || 'User'
                          }
                        </div>
                        <div className="text-sm text-slate-400">
                          {user?.emailAddresses?.[0]?.emailAddress}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {(() => {
                            const userStats = getUserStats();
                            const rank = getUserRank(userStats.rating);
                            const RankIcon = rank.icon;
                            return (
                              <>
                                <RankIcon className={`w-3 h-3 ${rank.color}`} />
                                <span className={`text-xs font-medium ${rank.color}`}>
                                  {rank.name}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          {getUserStats().solvedProblems}
                        </div>
                        <div className="text-xs text-slate-400">Solved</div>
                      </div>
                      <div className="text-center border-l border-slate-600">
                        <div className="text-lg font-bold text-blue-400">
                          {getUserStats().rating}
                        </div>
                        <div className="text-xs text-slate-400">Rating</div>
                      </div>
                      <div className="text-center border-l border-slate-600">
                        <div className="text-lg font-bold text-orange-400">
                          {getUserStats().currentStreak}
                        </div>
                        <div className="text-xs text-slate-400">Streak</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Submissions:</span>
                        <span className="text-white font-medium">
                          {getUserStats().totalSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Accepted:</span>
                        <span className="text-green-400 font-medium">
                          {getUserStats().acceptedSubmissions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Streak:</span>
                        <span className="text-orange-400 font-medium">
                          {getUserStats().maxStreak}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Runs:</span>
                        <span className="text-blue-400 font-medium">
                          {getUserStats().totalRuns}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Progress */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-white font-medium text-sm">Certificate Progress</span>
                    </div>
                    <div className="space-y-2">
                      {[10, 25, 50, 100, 150].map(milestone => {
                        const completed = completedProblems.size;
                        const isCompleted = completed >= milestone;
                        const isNext = completed < milestone;
                        const progress = Math.min((completed / milestone) * 100, 100);
                        
                        if (!isNext && !isCompleted) return null;
                        if (isCompleted && milestone !== 150 && completed >= milestone + 25) return null;
                        
                        return (
                          <div key={milestone} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={isCompleted ? 'text-green-400' : 'text-gray-400'}>
                                {milestone} Problems {isCompleted ? '✅' : ''}
                              </span>
                              <span className="text-gray-400">
                                {isCompleted ? 'Completed' : `${milestone - completed} to go`}
                              </span>
                            </div>
                            {isNext && (
                              <div className="w-full bg-slate-600 rounded-full h-1">
                                <div 
                                  className="bg-yellow-500 h-1 rounded-full transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm">
                      <Trophy className="w-4 h-4 text-slate-400" />
                      <span>Achievements</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span>Progress</span>
                    </button>
                    <div className="border-t border-slate-700 mt-2 pt-2">
                      <button 
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold cursor-pointer">
              ?
            </div>
          )}
        </div>
      </div>

      {/* Problem List Dropdown */}
      {showProblemList && (
        <div className={`absolute top-14 left-4 w-96 max-h-96 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-lg shadow-xl z-50 overflow-hidden`}>
          <div className={`p-3 border-b ${theme.border}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                {problemSource === 'company' 
                  ? `${companyWiseProblems[selectedCompany]?.name} Problems` 
                  : problemSource === 'lld'
                  ? 'LLD Problems'
                  : 'DSA Problems'
                }
              </h3>
              {problemSource === 'company' && (
                <span className="text-2xl">{companyWiseProblems[selectedCompany]?.logo}</span>
              )}
              {problemSource === 'lld' && (
                <Layers className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            
            {/* Search and Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-gradient-to-r ${theme.background} border-2 ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                />
              </div>
              
              <div className="flex gap-1">
                {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      difficultyFilter === difficulty
                        ? `bg-gradient-to-r ${theme.primary} text-white`
                        : `${theme.textSecondary} hover:${theme.text}`
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {getFilteredProblems().map((problem, index) => (
              <button
                key={problem.id}
                onClick={() => {
                  setSelectedProblem(problem);
                  setShowProblemList(false);
                }}
                className={`text-left p-3 transition-colors w-full ${
                  selectedProblem.id === problem.id
                    ? 'bg-blue-500/20 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`${theme.textSecondary} text-sm`}>#{problem.id}</span>
                    <span className="font-medium">{problem.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {problemSource === 'company' && problem.frequency && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        problem.frequency === 'Very High' ? 'bg-red-500/20 text-red-400' :
                        problem.frequency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {problem.frequency}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyBg(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                
                {problemSource === 'company' && problem.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {problem.tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`px-2 py-1 rounded text-xs ${theme.textSecondary} bg-gray-700/50`}>
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className={`px-2 py-1 rounded text-xs ${theme.textSecondary}`}>
                        +{problem.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">        
        {/* Left Panel - Problem Description */}
        <div className={`${isLeftPanelMinimized ? 'w-12' : 'w-1/2'} border-r border-slate-700 flex flex-col transition-all duration-300`}>
          {isLeftPanelMinimized ? (
            /* Minimized State */
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30">
              <button
                onClick={() => setIsLeftPanelMinimized(false)}
                className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all transform hover:scale-110 mb-4"
                title="Expand Problem Panel"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="writing-mode-vertical text-gray-400 text-sm font-medium">
                Problem
              </div>
            </div>
          ) : (
            <>
              {/* Problem Header */}
              <div className={`p-4 border-b ${theme.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl font-bold">
                    {problemSource === 'company' ? '' : `${selectedProblem.id}. `}
                    {selectedProblem.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    {/* Minimize Button */}
                    <button
                      onClick={() => setIsLeftPanelMinimized(true)}
                      className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
                      title="Minimize Panel"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    
                    {selectedProblem.videoUrl && (
                      <button
                        onClick={() => setShowVideoPlayer(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        title="Watch Striver's Solution"
                      >
                        <Youtube className="w-4 h-4" />
                        <span>Watch Solution</span>
                      </button>
                    )}
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-lg transition-colors ${liked ? 'text-green-500 bg-green-500/10' : 'hover:bg-gray-700'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDisliked(!disliked)}
                      className={`p-2 rounded-lg transition-colors ${disliked ? 'text-red-500 bg-red-500/10' : 'hover:bg-gray-700'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStarred(!starred)}
                      className={`p-2 rounded-lg transition-colors ${starred ? 'text-yellow-500 bg-yellow-500/10' : 'hover:bg-gray-700'}`}
                    >
                      <Star className="w-4 h-4" fill={starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 rounded ${getDifficultyBg(selectedProblem.difficulty)} ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
              
              {problemSource === 'company' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{companyWiseProblems[selectedCompany]?.logo}</span>
                    <span className={theme.textSecondary}>{companyWiseProblems[selectedCompany]?.name}</span>
                  </div>
                  {selectedProblem.frequency && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedProblem.frequency === 'Very High' ? 'bg-red-500/20 text-red-400' :
                      selectedProblem.frequency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedProblem.frequency} Frequency
                    </span>
                  )}
                </>
              ) : (
                <span className={theme.textSecondary}>{selectedProblem.category}</span>
              )}
              
              <div className={`flex items-center gap-1 ${theme.textSecondary}`}>
                <ThumbsUp className="w-3 h-3" />
                <span>1.2k</span>
              </div>
              <div className={`flex items-center gap-1 ${theme.textSecondary}`}>
                <ThumbsDown className="w-3 h-3" />
                <span>89</span>
              </div>
            </div>
            
            {/* Tags for company problems */}
            {problemSource === 'company' && selectedProblem.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProblem.tags.map(tag => (
                  <span key={tag} className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${theme.secondary} text-white`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tabs - Description and Whiteboard - Modern Design */}
          <div className="flex border-b border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800/30">
            <button
              onClick={() => setLeftPanelTab('description')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                leftPanelTab === 'description'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Description</span>
              </div>
              {leftPanelTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}
            </button>
            <button
              onClick={() => setLeftPanelTab('whiteboard')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                leftPanelTab === 'whiteboard'
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                <span>Whiteboard</span>
              </div>
              {leftPanelTab === 'whiteboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-600"></div>
              )}
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
            {leftPanelTab === 'description' ? (
              <ProblemDescription problem={selectedProblem} />
            ) : (
              <AIWhiteboardVisualizer 
                code={code}
                language={language}
                problemTitle={selectedProblem.title}
              />
            )}
          </div>
        </>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`${isLeftPanelMinimized ? 'flex-1' : 'w-1/2'} flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 transition-all duration-300`}>
          {/* Editor Header - Modern Toolbar */}
          <div className={`h-14 bg-gradient-to-r ${theme.card} border-b ${theme.border} flex items-center justify-between px-4 shadow-md`}>
            <div className="flex items-center gap-3">
              {/* Language Selector - Modern Dropdown */}
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`bg-gradient-to-r ${theme.card} border-2 ${theme.border} rounded-xl px-4 py-2 ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer`}
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value} className="bg-gray-800">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Control */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-xs text-gray-400">Font:</span>
                <button
                  onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 transition-colors text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-sm font-mono text-white w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 transition-colors text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Editor Actions */}
            <div className="flex items-center gap-2">
              {/* AI Suggestions Button */}
              <button
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  showAISuggestions
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-purple-400 hover:bg-slate-700 border border-purple-500/30'
                }`}
                title="AI Code Suggestions"
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm">AI Hints</span>
              </button>

              {/* View Solution Button */}
              <button
                onClick={() => setShowSolutionViewer(!showSolutionViewer)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  showSolutionViewer
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-slate-800/50 text-green-400 hover:bg-slate-700 border border-green-500/30'
                }`}
                title="View Solutions"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Solutions</span>
              </button>
              
              <div className="w-px h-6 bg-slate-700"></div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
                title="Editor Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setCode(getStarterCodeForLanguage(selectedProblem, language))}
                className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert('Code copied to clipboard!');
                }}
                className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowCodeShareModal(true)}
                className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
                title="Share Code"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            {monacoError ? (
              <div className="h-full flex items-center justify-center bg-slate-900">
                <div className="text-center p-8">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Editor Failed to Load</h3>
                  <p className="text-gray-400 mb-4">Using fallback text editor</p>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-96 bg-slate-800 text-white p-4 rounded-lg border border-slate-700 font-mono"
                    style={{ fontSize: `${fontSize}px` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Editor
                  height="100%"
                  language={language}
                  value={code || ''}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
                
                {/* AI Code Completion Panel */}
                {showCompletions && suggestions.length > 0 && (
                  <CodeCompletionPanel
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                    onClose={() => {
                      clearSuggestions();
                      setShowCompletions(false);
                    }}
                    position={completionPanelPosition}
                    isLoading={isLoadingCompletions}
                  />
                )}
              </>
            )}
          </div>

          {/* Action Buttons - Modern Design */}
          <div className={`h-16 bg-gradient-to-r ${theme.card} border-t ${theme.border} flex items-center justify-between px-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              {/* GitHub Integration */}
              <button
                onClick={downloadSolution}
                disabled={!testResults}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  testResults
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                title="Download solution file"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>

              {githubSyncStatus && (
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  githubSyncStatus.type === 'success' ? 'bg-green-500/20 text-green-400' :
                  githubSyncStatus.type === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {githubSyncStatus.message}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Run Code Button */}
              <button
                onClick={runCode}
                disabled={isRunning}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isRunning
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                  </>
                )}
              </button>

              {/* Submit Button */}
              <button
                onClick={submitCode}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Console Panel - Modern Design */}
      <div className={`${isConsoleMinimized ? 'h-12' : 'h-80'} bg-gradient-to-br ${theme.card} border-t-2 ${theme.border} flex flex-col shadow-2xl transition-all duration-300`}>
        {/* Console Tabs */}
        <div className="flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800/30">
          <div className="flex">
            <button
              onClick={() => setConsoleTab('testcase')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                consoleTab === 'testcase'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>Test Cases</span>
              </div>
              {consoleTab === 'testcase' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
              )}
            </button>
            <button
              onClick={() => setConsoleTab('result')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                consoleTab === 'result'
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Results</span>
              </div>
              {consoleTab === 'result' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              )}
            </button>
          </div>

          {/* Console Minimize Button */}
          <button
            onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
            className={`mr-4 p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} hover:bg-slate-700 transition-all`}
            title={isConsoleMinimized ? "Expand Console" : "Minimize Console"}
          >
            {isConsoleMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 rotate-180" />}
          </button>
        </div>

        {/* Console Content */}
        {!isConsoleMinimized && (
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
          {consoleTab === 'testcase' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Custom Input:</label>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom test input..."
                  className="w-full h-32 bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Example Test Cases:</h3>
                <div className="space-y-3">
                  {selectedProblem.examples?.map((example, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-400">Test Case {index + 1}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Input:</span>
                          <code className="ml-2 text-white font-mono">{example.input}</code>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected:</span>
                          <code className="ml-2 text-green-400 font-mono">{example.output}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Test Results */}
              {testResults && (
                <div className={`p-6 rounded-xl border-2 ${
                  testResults.accepted
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {testResults.accepted ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                          <h3 className="text-xl font-bold text-green-400">Accepted!</h3>
                          <p className="text-sm text-gray-300">All test cases passed</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-400" />
                        <div>
                          <h3 className="text-xl font-bold text-red-400">Wrong Answer</h3>
                          <p className="text-sm text-gray-300">
                            {testResults.passedTestCases}/{testResults.totalTestCases} test cases passed
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {testResults.accepted && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Runtime</div>
                        <div className="text-lg font-bold text-white">{testResults.runtime}</div>
                        <div className="text-xs text-green-400 mt-1">
                          Beats {testResults.runtimePercentile}%
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="text-sm text-gray-400 mb-1">Memory</div>
                        <div className="text-lg font-bold text-white">{testResults.memory}</div>
                        <div className="text-xs text-green-400 mt-1">
                          Beats {testResults.memoryPercentile}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Output Comparison */}
              {outputComparison && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3">Test Case {outputComparison.testCase}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Input:</span>
                      <code className="ml-2 text-white font-mono">{outputComparison.input}</code>
                    </div>
                    <div>
                      <span className="text-gray-400">Your Output:</span>
                      <code className={`ml-2 font-mono ${outputComparison.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {outputComparison.userOutput}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-400">Expected:</span>
                      <code className="ml-2 text-green-400 font-mono">{outputComparison.expectedOutput}</code>
                    </div>
                    {outputComparison.runtime && (
                      <div className="flex gap-4 mt-2 pt-2 border-t border-slate-700">
                        <span className="text-gray-400">Runtime: <span className="text-white">{outputComparison.runtime}</span></span>
                        <span className="text-gray-400">Memory: <span className="text-white">{outputComparison.memory}</span></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Console Output */}
              {consoleOutput.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 font-mono text-sm">
                  {consoleOutput.map((line, index) => (
                    <div
                      key={index}
                      className={`py-1 ${
                        line.type === 'error' ? 'text-red-400' :
                        line.type === 'success' ? 'text-green-400' :
                        line.type === 'info' ? 'text-blue-400' :
                        'text-gray-300'
                      }`}
                    >
                      {line.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        )}
      </div>
    </div>

    {/* Modals and Additional Components */}
    {showVideoPlayer && selectedProblem.videoUrl && (
      <VideoPlayer
        videoUrl={selectedProblem.videoUrl}
        onClose={() => setShowVideoPlayer(false)}
      />
    )}

    {showCodeShareModal && (
      <CodeShareModal
        code={code}
        language={language}
        problemTitle={selectedProblem.title}
        onClose={() => setShowCodeShareModal(false)}
      />
    )}

    {showSessionBooking && (
      <SessionBookingModal
        onClose={() => setShowSessionBooking(false)}
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

    {/* AI Suggestions Panel */}
    {showAISuggestions && (
      <div className="fixed right-4 top-20 w-96 max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-900/30 to-pink-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white">AI Hints & Suggestions</h3>
          </div>
          <button
            onClick={() => setShowAISuggestions(false)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <AICodeExplainer 
            code={code}
            language={language}
            problemTitle={selectedProblem.title}
            problemDescription={selectedProblem.description}
          />
        </div>
      </div>
    )}

    {/* Solution Viewer Panel */}
    {showSolutionViewer && (
      <div className="fixed right-4 top-20 w-[600px] max-h-[80vh] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-green-900/30 to-emerald-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">Code Solutions</h3>
          </div>
          <button
            onClick={() => setShowSolutionViewer(false)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <SolutionViewer 
            problemId={selectedProblem.id}
            problemTitle={selectedProblem.title}
          />
        </div>
      </div>
    )}

    {showCertificateModal && newCertificate && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
          <div className="text-center">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-2">🎉 Congratulations!</h2>
            <p className="text-xl text-gray-300 mb-6">
              You've earned the <span className="text-yellow-400 font-bold">{newCertificate.challengeName}</span> certificate!
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
              <p className="text-gray-400 mb-2">Problems Completed</p>
              <p className="text-4xl font-bold text-green-400">{newCertificate.problemsCompleted}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => downloadCertificate(newCertificate)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
              
              <button
                onClick={() => shareCertificate(newCertificate)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              
              <button
                onClick={() => setShowCertificateModal(false)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <audio ref={audioRef} src="/timer-alert.mp3" preload="auto" />
  </div>
  </>
  );
}; 
export default LeetCodeEditor;
