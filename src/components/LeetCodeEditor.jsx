import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
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
  Copy
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import AICodeExplainer from './AI/AICodeExplainer';
import { useCodeCompletion } from '../hooks/useCodeCompletion';
import CodeCompletionPanel from './CodeCompletionPanel';
import VideoPlayer from './VideoPlayer';
import { useDryRunAnimation } from '../hooks/useDryRunAnimation';
import DryRunAnimationPanel from './DryRunAnimationPanel';
import SolutionViewer from './SolutionViewer';

const LeetCodeEditor = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [code, setCode] = useState(dsaProblems[0].starterCode || '');
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
  const editorRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

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

  // Helper function to get user stats from localStorage
  const getUserStats = () => {
    if (!user?.id) return {
      totalSubmissions: 0,
      solvedProblems: 0,
      solvedProblemsSet: [],
      acceptedSubmissions: 0,
      currentStreak: 0,
      maxStreak: 0,
      rating: 1200,
      totalRuns: 0
    };
    
    const stats = localStorage.getItem(`userStats_${user.id}`);
    return stats ? JSON.parse(stats) : {
      totalSubmissions: 0,
      solvedProblems: 0,
      solvedProblemsSet: [],
      acceptedSubmissions: 0,
      currentStreak: 0,
      maxStreak: 0,
      rating: 1200,
      totalRuns: 0
    };
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
    setCode(value || '');
    
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
    if (!problem.starterCode) return '';
    
    // Handle new multi-language format
    if (typeof problem.starterCode === 'object') {
      return problem.starterCode[lang] || problem.starterCode.javascript || '';
    }
    
    // Handle old single-language format (fallback)
    return problem.starterCode;
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

      // Track run attempt in Clerk metadata (if signed in)
      if (isSignedIn && user) {
        try {
          await user.update({
            publicMetadata: {
              ...user.publicMetadata,
              totalRuns: (user.publicMetadata?.totalRuns || 0) + 1,
              lastActivity: new Date().toISOString(),
              currentProblem: selectedProblem.id
            }
          });
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

      // Update user stats (store in localStorage for now, as Clerk publicMetadata has restrictions)
      if (isSignedIn && user) {
        try {
          const userId = user.id;
          const currentStats = JSON.parse(localStorage.getItem(`userStats_${userId}`)) || {
            totalSubmissions: 0,
            solvedProblems: 0,
            solvedProblemsSet: [],
            acceptedSubmissions: 0,
            currentStreak: 0,
            maxStreak: 0,
            rating: 1200,
            totalRuns: 0
          };
          
          const isAccepted = data.accepted;
          const alreadySolved = currentStats.solvedProblemsSet.includes(selectedProblem.id);
          
          const updatedStats = {
            ...currentStats,
            totalSubmissions: currentStats.totalSubmissions + 1,
            solvedProblems: isAccepted && !alreadySolved ? 
              currentStats.solvedProblems + 1 : 
              currentStats.solvedProblems,
            solvedProblemsSet: isAccepted ? 
              [...new Set([...currentStats.solvedProblemsSet, selectedProblem.id])] :
              currentStats.solvedProblemsSet,
            acceptedSubmissions: isAccepted ? 
              currentStats.acceptedSubmissions + 1 :
              currentStats.acceptedSubmissions,
            lastSubmission: new Date().toISOString(),
            currentStreak: isAccepted ? 
              currentStats.currentStreak + 1 : 0,
            maxStreak: isAccepted ? 
              Math.max(currentStats.maxStreak, currentStats.currentStreak + 1) :
              currentStats.maxStreak,
            rating: Math.min(3000, currentStats.rating + (isAccepted ? 25 : -10)),
            lastActivity: new Date().toISOString()
          };
          
          // Save to localStorage
          localStorage.setItem(`userStats_${userId}`, JSON.stringify(updatedStats));
          
          console.log('✅ User stats updated:', updatedStats);
        } catch (error) {
          console.log('Failed to update submission stats:', error);
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
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold">Playground</span>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium">Problem List</span>
            {showProblemList ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            Premium
          </button>
          
          {isSignedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
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
        <div className="absolute top-14 left-4 w-96 max-h-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-700">
            <h3 className="font-semibold">Problems</h3>
          </div>
          <div className="overflow-y-auto max-h-80">
            {dsaProblems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => {
                  setSelectedProblem(problem);
                  setShowProblemList(false);
                }}
                className={`text-left p-3 rounded-lg transition-colors w-full ${
                  selectedProblem.id === problem.id
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">{problem.id}.</span>
                    <span className="font-medium">{problem.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyBg(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-slate-700 flex flex-col">
          {/* Problem Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">{selectedProblem.id}. {selectedProblem.title}</h1>
              <div className="flex items-center gap-2">
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
                  className={`p-2 rounded-lg transition-colors ${liked ? 'text-green-500 bg-green-500/10' : 'hover:bg-slate-700'}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDisliked(!disliked)}
                  className={`p-2 rounded-lg transition-colors ${disliked ? 'text-red-500 bg-red-500/10' : 'hover:bg-slate-700'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStarred(!starred)}
                  className={`p-2 rounded-lg transition-colors ${starred ? 'text-yellow-500 bg-yellow-500/10' : 'hover:bg-slate-700'}`}
                >
                  <Star className="w-4 h-4" fill={starred ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 rounded ${getDifficultyBg(selectedProblem.difficulty)} ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
              <span className="text-gray-400">{selectedProblem.category}</span>
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsUp className="w-3 h-3" />
                <span>1.2k</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsDown className="w-3 h-3" />
                <span>89</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <div className="px-4 py-2 text-sm font-medium text-white border-b-2 border-white">
              Description
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 leading-relaxed">{selectedProblem.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Examples:</h3>
                {selectedProblem.examples.map((example, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm mb-2">
                      <span className="font-semibold text-gray-400">Example {idx + 1}:</span>
                    </p>
                    <div className="space-y-1 text-sm font-mono">
                      <p><span className="text-gray-400">Input:</span> <span className="text-white">{example.input}</span></p>
                      <p><span className="text-gray-400">Output:</span> <span className="text-white">{example.output}</span></p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>1 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>-10⁹ ≤ target ≤ 10⁹</li>
                  <li>Only one valid answer exists</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Follow-up:</h3>
                <p className="text-gray-300 text-sm">Can you come up with an algorithm that is less than O(n²) time complexity?</p>
              </div>

              {/* Solution Viewer */}
              <div className="mt-6">
                <SolutionViewer 
                  problemId={selectedProblem.id}
                  language={language}
                  onUseSolution={(solutionCode) => {
                    setCode(solutionCode);
                    if (editorRef.current) {
                      editorRef.current.setValue(solutionCode);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 bg-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsoleTab('explain')}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                title="AI Code Explainer"
              >
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Explain</span>
              </button>
              
              {/* GitHub Button - More Visible */}
              {githubConnected ? (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg text-sm font-medium transition-colors"
                  title="GitHub Connected - Click to manage"
                >
                  <Github className="w-4 h-4 text-green-400" />
                  <span className="hidden sm:inline text-green-400">Connected</span>
                </button>
              ) : (
                <button
                  onClick={connectGithub}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                  title="Connect GitHub to auto-save solutions"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              )}
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-slate-800 border-b border-slate-700 p-4 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400">Font Size:</label>
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm">{fontSize}px</span>
              </div>
              
              {/* GitHub Integration Settings */}
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium">GitHub Integration</span>
                  </div>
                  {githubConnected && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                </div>
                
                {githubConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Account:</span>
                      <span className="text-white font-mono">Token Owner</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Auto-sync on submit</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSyncGithub}
                          onChange={(e) => {
                            setAutoSyncGithub(e.target.checked);
                            localStorage.setItem('autoSyncGithub', e.target.checked);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <button
                      onClick={() => {
                        setGithubConnected(false);
                        setGithubUsername('');
                        localStorage.removeItem('githubUsername');
                        localStorage.removeItem('githubConnected');
                      }}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Disconnect GitHub
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectGithub}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    Connect GitHub
                  </button>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Automatically save your accepted solutions to a GitHub repository
                </p>
              </div>
            </div>
          )}

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden" style={{ position: 'relative' }}>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                folding: true,
                bracketPairColorization: { enabled: true },
                readOnly: false,
                domReadOnly: false,
                contextmenu: true,
                selectOnLineNumbers: true
              }}
            />
            
            {/* AI Code Completion Panel */}
            <CodeCompletionPanel
              suggestions={suggestions}
              isLoading={isLoadingCompletions}
              onSelect={handleSuggestionSelect}
              position={completionPanelPosition}
              visible={showCompletions && suggestions.length > 0}
            />
          </div>

          {/* Bottom Console/Test Results */}
          <div className="h-64 border-t border-slate-700 flex flex-col bg-slate-800">
            {/* Console Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setConsoleTab('testcase')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  consoleTab === 'testcase'
                    ? 'text-white bg-slate-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setConsoleTab('result')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  consoleTab === 'result'
                    ? 'text-white bg-slate-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Test Result
              </button>
              <button
                onClick={() => setConsoleTab('explain')}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  consoleTab === 'explain'
                    ? 'text-white bg-slate-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4" />
                AI Explain
              </button>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
              {consoleTab === 'testcase' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">nums =</label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="[2,7,11,15]"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">target =</label>
                    <input
                      type="text"
                      placeholder="9"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {consoleTab === 'explain' && (
                <AICodeExplainer 
                  code={code}
                  problemTitle={selectedProblem.title}
                  language={language}
                />
              )}

              {consoleTab === 'result' && (
                <div className="space-y-2">
                  {/* Compiler Errors - LeetCode Style */}
                  {compilerErrors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-500 font-semibold text-lg">
                        <XCircle className="w-5 h-5" />
                        <span>Compile Error</span>
                      </div>
                      {compilerErrors.map((error, idx) => (
                        <div key={idx} className="p-4 bg-slate-800 rounded-lg border-l-4 border-red-500">
                          <div className="text-red-400 font-bold text-base mb-2">
                            SyntaxError
                          </div>
                          <div className="text-gray-300 text-sm font-mono mb-3">
                            {error.message}
                          </div>
                          <div className="text-gray-500 text-xs">
                            Line {error.line}:{error.column}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Runtime Errors - LeetCode Style */}
                  {runtimeErrors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-500 font-semibold text-lg">
                        <XCircle className="w-5 h-5" />
                        <span>Runtime Error</span>
                      </div>
                      {runtimeErrors.map((error, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-red-500">
                            <div className="text-red-400 font-bold text-base mb-2">
                              {error.type || 'Runtime Error'}
                            </div>
                            <div className="text-gray-300 text-sm font-mono mb-3">
                              {error.message}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Line {error.line}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="text-gray-400 text-xs mb-1">Last executed input:</div>
                            <div className="text-gray-300 text-sm font-mono">
                              {customInput || selectedProblem.examples[0].input}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Output Comparison */}
                  {outputComparison && !testResults && (
                    <div className="space-y-3">
                      <div className={`flex items-center gap-2 font-semibold ${
                        outputComparison.passed ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {outputComparison.passed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span>{outputComparison.passed ? 'Test Passed' : 'Test Failed'}</span>
                      </div>

                      <div className="p-4 bg-slate-800 rounded-lg space-y-3">
                        <div>
                          <div className="text-gray-400 text-xs mb-1">Input:</div>
                          <div className="text-white text-sm font-mono">{outputComparison.input}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-xs mb-1">Your Output:</div>
                            <div className={`text-sm font-mono p-2 rounded ${
                              outputComparison.passed 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}>
                              {outputComparison.userOutput}
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-400 text-xs mb-1">Expected Output:</div>
                            <div className="text-sm font-mono p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              {outputComparison.expectedOutput}
                            </div>
                          </div>
                        </div>

                        {outputComparison.runtime && (
                          <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-slate-700">
                            <span>Runtime: {outputComparison.runtime}</span>
                            <span>Memory: {outputComparison.memory}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Test Results */}
                  {testResults ? (
                    <div className="space-y-4">
                      {testResults.accepted ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold text-lg">Accepted</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-red-500">
                            <XCircle className="w-5 h-5" />
                            <span className="font-semibold text-lg">Wrong Answer</span>
                          </div>
                          
                          {outputComparison && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-3">
                              <div className="text-red-400 text-sm font-semibold">
                                Failed on test case {outputComparison.testCase}
                              </div>
                              
                              <div>
                                <div className="text-gray-400 text-xs mb-1">Input:</div>
                                <div className="text-white text-sm font-mono">{outputComparison.input}</div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-gray-400 text-xs mb-1">Your Output:</div>
                                  <div className="text-sm font-mono p-2 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                                    {outputComparison.userOutput}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-gray-400 text-xs mb-1">Expected:</div>
                                  <div className="text-sm font-mono p-2 rounded bg-green-500/20 text-green-300 border border-green-500/40">
                                    {outputComparison.expectedOutput}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {testResults.accepted && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                              <div className="text-gray-400 text-xs mb-1">Runtime</div>
                              <div className="text-white font-semibold">{testResults.runtime}</div>
                              <div className="text-green-500 text-xs mt-1">
                                Beats {testResults.runtimePercentile}%
                              </div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg">
                              <div className="text-gray-400 text-xs mb-1">Memory</div>
                              <div className="text-white font-semibold">{testResults.memory}</div>
                              <div className="text-green-500 text-xs mt-1">
                                Beats {testResults.memoryPercentile}%
                              </div>
                            </div>
                          </div>
                          
                          {/* Download Solution Button */}
                          <button
                            onClick={downloadSolution}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Download className="w-4 h-4" />
                            Download Solution for GitHub
                          </button>
                        </>
                      )}

                      <div className="p-3 bg-slate-800 rounded-lg">
                        <div className="text-sm">
                          <span className="text-gray-400">Test Cases Passed: </span>
                          <span className={`font-semibold ${
                            testResults.accepted ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {testResults.passedTestCases} / {testResults.totalTestCases}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : consoleOutput.length > 0 ? (
                    <div className="space-y-1 font-mono text-sm">
                      {consoleOutput.map((output, idx) => (
                        <div
                          key={idx}
                          className={`${
                            output.type === 'success' ? 'text-green-400' :
                            output.type === 'error' ? 'text-red-400' :
                            'text-gray-400'
                          }`}
                        >
                          {output.message}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm text-center py-8">
                      You must run your code first
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="h-14 bg-slate-800 border-t border-slate-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last executed: Never</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={triggerDryRun}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
                title="Visualize code execution step-by-step"
              >
                <Zap className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Dry Run'}
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={submitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600 disabled:opacity-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && selectedProblem.videoUrl && (
        <VideoPlayer
          videoUrl={selectedProblem.videoUrl}
          title={selectedProblem.title}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}

      {/* Dry Run Animation Panel */}
      {showAnimation && (
        <DryRunAnimationPanel
          dryRunData={dryRunData}
          isAnalyzing={isAnalyzing}
          onClose={closeDryRun}
        />
      )}

      {/* GitHub Connection Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Github className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">Connect GitHub</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Enable automatic syncing of your accepted solutions to GitHub.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300 mb-2">
                  <strong>How it works:</strong>
                </p>
                <ul className="text-xs text-blue-300 space-y-1 list-disc list-inside">
                  <li>Solutions sync to YOUR GitHub account (token owner)</li>
                  <li>Creates "leetcode-solutions" repository automatically</li>
                  <li>Organizes by difficulty and category</li>
                  <li>Includes problem description and stats</li>
                </ul>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-300">
                  <strong>Required:</strong> GitHub Personal Access Token must be configured in backend/.env
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={connectGithub}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  Enable Auto-Sync
                </button>
                <button
                  onClick={() => setShowGithubModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Sync Status Toast */}
      {githubSyncStatus && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom">
          <div className={`px-6 py-3 rounded-lg shadow-2xl border flex items-center gap-3 ${
            githubSyncStatus.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-300' :
            githubSyncStatus.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-300' :
            'bg-blue-500/20 border-blue-500/50 text-blue-300'
          }`}>
            {githubSyncStatus.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {githubSyncStatus.type === 'error' && <XCircle className="w-5 h-5" />}
            {githubSyncStatus.type === 'info' && <Upload className="w-5 h-5 animate-pulse" />}
            <div>
              <p className="font-medium">{githubSyncStatus.message}</p>
              {githubSyncStatus.url && (
                <a 
                  href={githubSyncStatus.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs underline hover:no-underline"
                >
                  View on GitHub →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetCodeEditor;
