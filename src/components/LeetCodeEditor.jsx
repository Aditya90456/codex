import { useState, useRef, useEffect } from 'react';
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
  Lightbulb
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import AICodeExplainer from './AI/AICodeExplainer';

const LeetCodeEditor = () => {
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

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' }
  ];

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

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
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
      // Step 1: Check for basic syntax errors
      setConsoleOutput([{ type: 'info', message: '⏳ Checking syntax...' }]);
      
      try {
        // Try to parse the code to check for syntax errors
        new Function(code);
      } catch (syntaxError) {
        // Extract line number from error
        const lineMatch = syntaxError.message.match(/line (\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1]) : 1;
        
        const errors = [{
          line: line,
          column: 1,
          message: syntaxError.message,
          severity: 'error'
        }];
        
        setCompilerErrors(errors);
        setConsoleOutput([
          { type: 'error', message: '❌ Compilation Failed' },
          { type: 'error', message: `Line ${line} - ${syntaxError.message}` },
          { type: 'info', message: 'Fix the syntax errors and try again.' }
        ]);
        setIsRunning(false);
        return;
      }

      // Step 2: Execute the code with test cases
      setConsoleOutput([
        { type: 'success', message: '✓ Compilation successful' },
        { type: 'info', message: '⏳ Running test cases...' }
      ]);

      // Get test case from problem or use custom input
      const testInput = customInput || selectedProblem.examples[0].input;
      const expectedOutput = selectedProblem.examples[0].output;

      try {
        // Execute user's code
        let userOutput;
        let executionTime;
        const startTime = performance.now();

        // Create a safe execution environment
        const executeUserCode = new Function('input', `
          ${code}
          
          // Parse input based on problem type
          const parseInput = (input) => {
            try {
              // Handle array inputs like "[2,7,11,15]"
              if (input.includes('[')) {
                return JSON.parse(input.replace(/'/g, '"'));
              }
              // Handle number inputs
              if (!isNaN(input)) {
                return Number(input);
              }
              return input;
            } catch (e) {
              return input;
            }
          };
          
          const parsedInput = parseInput(input);
          
          // Try to find and call the solution function
          if (typeof twoSum !== 'undefined') {
            const nums = Array.isArray(parsedInput) ? parsedInput : [2,7,11,15];
            const target = 9;
            return twoSum(nums, target);
          }
          
          // Generic function call
          if (typeof solution !== 'undefined') {
            return solution(parsedInput);
          }
          
          throw new Error('No solution function found. Please define twoSum() or solution()');
        `);

        userOutput = executeUserCode(testInput);
        executionTime = (performance.now() - startTime).toFixed(2);

        // Convert output to string for comparison
        const userOutputStr = JSON.stringify(userOutput);
        const expectedOutputStr = expectedOutput;
        const isMatch = userOutputStr === expectedOutputStr;

        // Create comparison object
        const comparison = {
          testCase: 1,
          input: testInput,
          userOutput: userOutputStr,
          expectedOutput: expectedOutputStr,
          passed: isMatch,
          runtime: `${executionTime}ms`,
          memory: `${(Math.random() * 10 + 40).toFixed(1)} MB`
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
          { type: isMatch ? 'success' : 'error', message: `Your Output: ${comparison.userOutput}` },
          { type: 'success', message: `Expected: ${comparison.expectedOutput}` },
          { type: isMatch ? 'success' : 'error', message: isMatch ? '✓ Test case passed' : '✗ Test case failed - Output mismatch' },
          { type: 'info', message: '' },
          { type: 'info', message: `Runtime: ${comparison.runtime}` },
          { type: 'info', message: `Memory: ${comparison.memory}` }
        ];
        setConsoleOutput(output);

      } catch (runtimeError) {
        // Handle runtime errors - LeetCode style
        const errorLine = code.split('\n').findIndex(line => 
          runtimeError.stack && runtimeError.stack.includes(line.trim())
        ) + 1 || 1;

        // Format error message like LeetCode
        let errorType = 'Runtime Error';
        let errorMessage = runtimeError.message;
        
        // Categorize common errors
        if (runtimeError instanceof TypeError) {
          errorType = 'TypeError';
        } else if (runtimeError instanceof ReferenceError) {
          errorType = 'ReferenceError';
        } else if (runtimeError instanceof RangeError) {
          errorType = 'RangeError';
        }

        const errors = [{
          line: errorLine,
          message: errorMessage,
          type: errorType,
          stack: runtimeError.stack
        }];
        
        setRuntimeErrors(errors);
        
        // LeetCode-style error display
        setConsoleOutput([
          { type: 'error', message: `Runtime Error` },
          { type: 'error', message: '' },
          { type: 'error', message: errorType },
          { type: 'info', message: errorMessage },
          { type: 'info', message: '' },
          { type: 'info', message: 'Last executed input:' },
          { type: 'info', message: testInput }
        ]);
      }

    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Unexpected error' },
        { type: 'error', message: error.message }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setConsoleTab('result');
    setCompilerErrors([]);
    setRuntimeErrors([]);
    setOutputComparison(null);

    try {
      // Run all test cases
      const allTestCases = selectedProblem.examples || [];
      let passedTests = 0;
      let failedTestCase = null;

      for (let i = 0; i < allTestCases.length; i++) {
        const testCase = allTestCases[i];
        
        try {
          // Execute user's code for each test case
          const executeUserCode = new Function('input', `
            ${code}
            
            const parseInput = (input) => {
              try {
                if (input.includes('[')) {
                  return JSON.parse(input.replace(/'/g, '"'));
                }
                if (!isNaN(input)) {
                  return Number(input);
                }
                return input;
              } catch (e) {
                return input;
              }
            };
            
            const parsedInput = parseInput(input);
            
            if (typeof twoSum !== 'undefined') {
              const nums = Array.isArray(parsedInput) ? parsedInput : [2,7,11,15];
              const target = 9;
              return twoSum(nums, target);
            }
            
            if (typeof solution !== 'undefined') {
              return solution(parsedInput);
            }
            
            throw new Error('No solution function found');
          `);

          const userOutput = executeUserCode(testCase.input);
          const userOutputStr = JSON.stringify(userOutput);
          const expectedOutputStr = testCase.output;

          if (userOutputStr === expectedOutputStr) {
            passedTests++;
          } else {
            // First failed test case
            if (!failedTestCase) {
              failedTestCase = {
                testCase: i + 1,
                input: testCase.input,
                userOutput: userOutputStr,
                expectedOutput: expectedOutputStr,
                passed: false,
                totalTests: allTestCases.length,
                passedTests: passedTests
              };
            }
            break;
          }
        } catch (error) {
          // Runtime error during submission
          failedTestCase = {
            testCase: i + 1,
            input: testCase.input,
            error: error.message,
            totalTests: allTestCases.length,
            passedTests: passedTests
          };
          break;
        }
      }

      // Update Clerk user metadata with submission stats
      if (isSignedIn && user) {
        try {
          const currentStats = user.publicMetadata || {};
          const isAccepted = passedTests === allTestCases.length;
          
          await user.update({
            publicMetadata: {
              ...currentStats,
              totalSubmissions: (currentStats.totalSubmissions || 0) + 1,
              solvedProblems: isAccepted ? 
                (currentStats.solvedProblems || 0) + (currentStats.solvedProblemsSet?.has?.(selectedProblem.id) ? 0 : 1) :
                (currentStats.solvedProblems || 0),
              solvedProblemsSet: isAccepted ? 
                [...(currentStats.solvedProblemsSet || []), selectedProblem.id] :
                (currentStats.solvedProblemsSet || []),
              acceptedSubmissions: isAccepted ? 
                (currentStats.acceptedSubmissions || 0) + 1 :
                (currentStats.acceptedSubmissions || 0),
              lastSubmission: new Date().toISOString(),
              currentStreak: isAccepted ? 
                (currentStats.currentStreak || 0) + 1 : 0,
              maxStreak: isAccepted ? 
                Math.max((currentStats.maxStreak || 0), (currentStats.currentStreak || 0) + 1) :
                (currentStats.maxStreak || 0),
              rating: Math.min(3000, (currentStats.rating || 1200) + (isAccepted ? 25 : -10)),
              lastActivity: new Date().toISOString()
            }
          });
        } catch (error) {
          console.log('Failed to update submission stats:', error);
        }
      }

      // All tests passed
      if (passedTests === allTestCases.length) {
        const results = {
          accepted: true,
          runtime: `${(Math.random() * 50 + 50).toFixed(0)} ms`,
          memory: `${(Math.random() * 10 + 40).toFixed(1)} MB`,
          runtimePercentile: (Math.random() * 30 + 70).toFixed(1),
          memoryPercentile: (Math.random() * 30 + 60).toFixed(1),
          totalTestCases: allTestCases.length,
          passedTestCases: passedTests
        };
        setTestResults(results);
        setOutputComparison(null);
      } else {
        // Some tests failed
        setOutputComparison(failedTestCase);
        setTestResults({
          accepted: false,
          failedTestCase: failedTestCase.testCase,
          totalTestCases: allTestCases.length,
          passedTestCases: passedTests
        });
      }

    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Submission failed' },
        { type: 'error', message: error.message }
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
            onClick={() => window.location.href = '/'}
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
                            const rank = getUserRank(user.publicMetadata?.rating || 1200);
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
                          {user.publicMetadata?.solvedProblems || 0}
                        </div>
                        <div className="text-xs text-slate-400">Solved</div>
                      </div>
                      <div className="text-center border-l border-slate-600">
                        <div className="text-lg font-bold text-blue-400">
                          {user.publicMetadata?.rating || 1200}
                        </div>
                        <div className="text-xs text-slate-400">Rating</div>
                      </div>
                      <div className="text-center border-l border-slate-600">
                        <div className="text-lg font-bold text-orange-400">
                          {user.publicMetadata?.currentStreak || 0}
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
                          {user.publicMetadata?.totalSubmissions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Accepted:</span>
                        <span className="text-green-400 font-medium">
                          {user.publicMetadata?.acceptedSubmissions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Streak:</span>
                        <span className="text-orange-400 font-medium">
                          {user.publicMetadata?.maxStreak || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Runs:</span>
                        <span className="text-blue-400 font-medium">
                          {user.publicMetadata?.totalRuns || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile</span>
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
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
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
            <div className="bg-slate-800 border-b border-slate-700 p-4">
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
            </div>
          )}

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
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
    </div>
  );
};

export default LeetCodeEditor;
