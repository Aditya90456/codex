import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Editor, { loader } from '@monaco-editor/react';
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
  Flame,
  Award,
  Gamepad2,
  Rocket,
  Coffee,
  Heart,
  Gem,
  Sword,
  Activity,
  Layers,
  Grid3X3,
  Menu,
  Minimize2,
  MoreVertical,
  Eye,
  EyeOff,
  Shuffle,
  SkipForward,
  SkipBack,
  RefreshCw,
  Save,
  FileText,
  Folder,
  FolderOpen,
  ChevronUp,
  Plus,
  Minus,
  Equal,
  Hash,
  AtSign,
  Percent,
  DollarSign
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import { companyWiseProblems, timerPresets } from '../data/companyWiseProblems';

// Configure Monaco loader to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

const LeetCodePlaygroundRed = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  
  // Core states
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [code, setCode] = useState(`// Welcome to CodeArena - Red-Black Themed Playground
// Solve DSA problems with style!

function twoSum(nums, target) {
    // Your solution here
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

// Test case
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
`);
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  
  // UI states
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // percentage
  const [showProblemList, setShowProblemList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleHeight, setConsoleHeight] = useState(30); // percentage
  const [editorLoading, setEditorLoading] = useState(false);
  const [editorError, setEditorError] = useState(null);
  
  // Problem filtering
  const [problemSource, setProblemSource] = useState('dsa');
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Timer states
  const [timerDuration, setTimerDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState('medium');
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Console states
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([]);
  
  // Interaction states
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const editorRef = useRef(null);

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

  // Get current problems list
  const getCurrentProblems = () => {
    if (problemSource === 'company') {
      return companyWiseProblems[selectedCompany]?.problems || [];
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
      const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  };

  // Timer warning colors
  const getTimerColor = () => {
    const percentage = (timeLeft / (timerDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Difficulty colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
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

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setTestResults({
        passed: true,
        runtime: '42ms',
        memory: '14.2MB',
        testCases: [
          { input: '[2,7,11,15], 9', output: '[0,1]', expected: '[0,1]', passed: true },
          { input: '[3,2,4], 6', output: '[1,2]', expected: '[1,2]', passed: true }
        ]
      });
      setIsRunning(false);
    }, 2000);
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setTestResults({
        passed: true,
        runtime: '38ms',
        memory: '13.8MB',
        testCases: [
          { input: 'Test Case 1', output: 'Correct', expected: 'Correct', passed: true },
          { input: 'Test Case 2', output: 'Correct', expected: 'Correct', passed: true },
          { input: 'Test Case 3', output: 'Correct', expected: 'Correct', passed: true }
        ]
      });
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-red-950/20 to-black text-white flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="h-16 bg-gradient-to-r from-red-900/50 via-black to-red-900/50 border-b border-red-800/30 flex items-center justify-between px-6 backdrop-blur-sm">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                CodeArena
              </h1>
              <p className="text-xs text-gray-400">Practice Playground</p>
            </div>
          </div>

          {/* Problem Source Toggle */}
          <div className="flex items-center bg-black/50 rounded-xl p-1 border border-red-800/30">
            <button
              onClick={() => {
                setProblemSource('dsa');
                setSelectedProblem(dsaProblems[0]);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                problemSource === 'dsa' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 inline mr-2" />
              DSA Problems
            </button>
            <button
              onClick={() => {
                setProblemSource('company');
                const companyProblems = companyWiseProblems[selectedCompany]?.problems || [];
                if (companyProblems.length > 0) {
                  setSelectedProblem(companyProblems[0]);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                problemSource === 'company' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Companies
            </button>
          </div>

          {/* Company Selector */}
          {problemSource === 'company' && (
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                const companyProblems = companyWiseProblems[e.target.value]?.problems || [];
                if (companyProblems.length > 0) {
                  setSelectedProblem(companyProblems[0]);
                }
              }}
              className="bg-black/50 border border-red-800/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {Object.entries(companyWiseProblems).map(([key, company]) => (
                <option key={key} value={key} className="bg-black">
                  {company.logo} {company.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Center Section - Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-black/50 border border-red-800/30 rounded-xl px-4 py-2">
            <Clock className={`w-5 h-5 ${getTimerColor()}`} />
            <span className={`text-xl font-mono font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </span>
            
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={isTimerRunning ? pauseTimer : startTimer}
                className="p-1.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                onClick={resetTimer}
                className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setShowTimerSettings(!showTimerSettings)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timer Settings Dropdown */}
          {showTimerSettings && (
            <div className="absolute top-20 right-6 bg-black/90 border border-red-800/30 rounded-xl p-4 shadow-2xl z-50 w-80 backdrop-blur-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-red-400">
                <Timer className="w-5 h-5" />
                Timer Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(timerPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      timerPreset === key
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-red-800/30 hover:border-red-600/50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-400">{preset.duration}m</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg ${soundEnabled ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <span className="text-sm">Sound alerts</span>
                </div>
                
                <button
                  onClick={() => setShowTimerSettings(false)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowProblemList(!showProblemList)}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-red-800/30 rounded-lg hover:bg-red-900/20 transition-all"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-medium">Problems</span>
            {showProblemList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all"
          >
            <Target className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-300">Roadmap</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-red-800/30 rounded-lg hover:bg-red-900/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>

          {isSignedIn && (
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-red-500/25">
              {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || '?'}
            </div>
          )}
        </div>
      </div>

      {/* Problem List Dropdown */}
      {showProblemList && (
        <div className="absolute top-16 right-6 w-96 max-h-96 bg-black/95 border border-red-800/30 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-red-800/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-red-400">
                {problemSource === 'company' 
                  ? `${companyWiseProblems[selectedCompany]?.name} Problems` 
                  : 'DSA Problems'
                }
              </h3>
              {problemSource === 'company' && (
                <span className="text-2xl">{companyWiseProblems[selectedCompany]?.logo}</span>
              )}
            </div>
            
            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-red-800/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      difficultyFilter === difficulty
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                        : 'text-gray-400 hover:text-white border border-red-800/30'
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
                className={`text-left p-4 transition-all w-full border-b border-red-800/10 ${
                  selectedProblem.id === problem.id
                    ? 'bg-red-500/20 border-l-4 border-l-red-500'
                    : 'hover:bg-red-900/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">#{problem.id}</span>
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
                    <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
                
                {problemSource === 'company' && problem.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {problem.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded text-xs text-gray-400 bg-gray-800/50">
                        {tag}
                      </span>
                    ))}
                    {problem.tags.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs text-gray-400">
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div 
          className="bg-gradient-to-b from-black via-red-950/10 to-black border-r border-red-800/30 flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Problem Header */}
          <div className="p-6 border-b border-red-800/30">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">
                {problemSource === 'company' ? '' : `${selectedProblem.id}. `}
                {selectedProblem.title}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-lg transition-colors ${liked ? 'text-green-400 bg-green-500/10' : 'hover:bg-red-900/20'}`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDisliked(!disliked)}
                  className={`p-2 rounded-lg transition-colors ${disliked ? 'text-red-400 bg-red-500/10' : 'hover:bg-red-900/20'}`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setStarred(!starred)}
                  className={`p-2 rounded-lg transition-colors ${starred ? 'text-yellow-400 bg-yellow-500/10' : 'hover:bg-red-900/20'}`}
                >
                  <Star className="w-5 h-5" fill={starred ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-3 py-1 rounded-lg border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
              
              {problemSource === 'company' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{companyWiseProblems[selectedCompany]?.logo}</span>
                    <span className="text-gray-400">{companyWiseProblems[selectedCompany]?.name}</span>
                  </div>
                  {selectedProblem.frequency && (
                    <span className={`px-3 py-1 rounded-lg text-xs ${
                      selectedProblem.frequency === 'Very High' ? 'bg-red-500/20 text-red-400' :
                      selectedProblem.frequency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedProblem.frequency} Frequency
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400">{selectedProblem.category}</span>
              )}
              
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsUp className="w-4 h-4" />
                <span>1.2k</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsDown className="w-4 h-4" />
                <span>89</span>
              </div>
            </div>
            
            {/* Tags for company problems */}
            {problemSource === 'company' && selectedProblem.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProblem.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg text-xs bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-300 border border-red-600/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Problem Description */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                {selectedProblem.description || "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order."}
              </p>

              {/* Examples */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-red-400 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Examples
                </h3>
                <div className="bg-black/50 border border-red-800/30 rounded-xl p-4 mb-4">
                  <div className="mb-3">
                    <strong className="text-red-400">Input:</strong> 
                    <code className="ml-2 bg-red-900/20 px-2 py-1 rounded text-red-300">nums = [2,7,11,15], target = 9</code>
                  </div>
                  <div className="mb-3">
                    <strong className="text-red-400">Output:</strong> 
                    <code className="ml-2 bg-red-900/20 px-2 py-1 rounded text-red-300">[0,1]</code>
                  </div>
                  <div>
                    <strong className="text-red-400">Explanation:</strong> 
                    <span className="ml-2 text-gray-300">Because nums[0] + nums[1] == 9, we return [0, 1].</span>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-red-400">Constraints</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><code className="bg-red-900/20 px-2 py-1 rounded text-red-300 text-sm">2 ≤ nums.length ≤ 10⁴</code></li>
                  <li><code className="bg-red-900/20 px-2 py-1 rounded text-red-300 text-sm">-10⁹ ≤ nums[i] ≤ 10⁹</code></li>
                  <li><code className="bg-red-900/20 px-2 py-1 rounded text-red-300 text-sm">-10⁹ ≤ target ≤ 10⁹</code></li>
                  <li>Only one valid answer exists.</li>
                </ul>
              </div>

              {/* Follow-up */}
              <div className="bg-gradient-to-r from-red-900/20 to-black/50 border border-red-800/30 rounded-xl p-4">
                <h4 className="font-semibold text-red-400 mb-2">Follow-up:</h4>
                <p className="text-gray-300 text-sm">Can you come up with an algorithm that is less than O(n²) time complexity?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="w-1 bg-red-800/30 hover:bg-red-600/50 cursor-col-resize transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = leftPanelWidth;
            
            const handleMouseMove = (e) => {
              const deltaX = e.clientX - startX;
              const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
              setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-black via-red-950/5 to-black">
          {/* Editor Header */}
          <div className="h-14 bg-black/50 border-b border-red-800/30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/50 border border-red-800/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                  className="p-2 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-2 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run
              </button>
              
              <button
                onClick={submitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className={`flex-1 ${showConsole ? '' : 'h-full'} relative`}>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                bracketMatching: 'always',
                autoIndent: 'full',
                fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                fontLigatures: true,
                cursorBlinking: 'smooth',
                renderWhitespace: 'selection',
                smoothScrolling: true,
                contextmenu: false,
                automaticLayout: true
              }}
              onMount={(editor) => {
                editorRef.current = editor;
                editor.focus();
              }}
            />
          </div>

          {/* Console Section */}
          {showConsole && (
            <>
              {/* Console Resize Handle */}
              <div 
                className="h-1 bg-red-800/30 hover:bg-red-600/50 cursor-row-resize transition-colors"
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = consoleHeight;
                  
                  const handleMouseMove = (e) => {
                    const deltaY = startY - e.clientY;
                    const newHeight = startHeight + (deltaY / window.innerHeight) * 100;
                    setConsoleHeight(Math.max(20, Math.min(60, newHeight)));
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />

              {/* Console */}
              <div 
                className="bg-black/80 border-t border-red-800/30"
                style={{ height: `${consoleHeight}%` }}
              >
                {/* Console Header */}
                <div className="h-12 bg-black/50 border-b border-red-800/30 flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setConsoleTab('testcase')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        consoleTab === 'testcase'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Testcase
                    </button>
                    <button
                      onClick={() => setConsoleTab('result')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        consoleTab === 'result'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Result
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowConsole(false)}
                    className="p-1 rounded text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Console Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {consoleTab === 'testcase' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Input:</label>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder="nums = [2,7,11,15]&#10;target = 9"
                          className="w-full h-24 bg-black/50 border border-red-800/30 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {consoleTab === 'result' && testResults && (
                    <div className="space-y-4">
                      <div className={`flex items-center gap-2 text-lg font-semibold ${
                        testResults.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {testResults.passed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                        {testResults.passed ? 'Accepted' : 'Wrong Answer'}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/50 border border-red-800/30 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Runtime</div>
                          <div className="font-mono text-green-400">{testResults.runtime}</div>
                        </div>
                        <div className="bg-black/50 border border-red-800/30 rounded-lg p-3">
                          <div className="text-gray-400 mb-1">Memory</div>
                          <div className="font-mono text-blue-400">{testResults.memory}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Test Cases:</h4>
                        <div className="space-y-2">
                          {testResults.testCases.map((testCase, index) => (
                            <div key={index} className={`bg-black/50 border rounded-lg p-3 ${
                              testCase.passed ? 'border-green-500/30' : 'border-red-500/30'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Test Case {index + 1}</span>
                                {testCase.passed ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              <div className="text-xs font-mono space-y-1">
                                <div><span className="text-gray-400">Input:</span> <span className="text-blue-300">{testCase.input}</span></div>
                                <div><span className="text-gray-400">Output:</span> <span className="text-green-300">{testCase.output}</span></div>
                                <div><span className="text-gray-400">Expected:</span> <span className="text-yellow-300">{testCase.expected}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Show Console Button (when hidden) */}
          {!showConsole && (
            <button
              onClick={() => setShowConsole(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold transition-all hover:from-red-700 hover:to-red-800 shadow-lg"
            >
              <Terminal className="w-4 h-4" />
              Show Console
            </button>
          )}
        </div>
      </div>

      {/* Timer Alert Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
};

export default LeetCodePlaygroundRed;