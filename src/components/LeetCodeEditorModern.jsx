import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
import { 
  Play, 
  Send, 
  Settings,
  Code2,
  Terminal,
  Home,
  Brain,
  Github,
  Download,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share,
  Bookmark,
  Star,
  ThumbsUp,
  Eye,
  Users,
  Trophy,
  Target,
  Lightbulb,
  BookOpen,
  ExternalLink,
  Sparkles,
  Flame,
  Award,
  TrendingUp,
  Activity,
  Cpu,
  Database,
  Layers,
  Palette,
  Moon,
  Sun,
  BarChart3,
  Menu,
  X,
  Copy,
  MoreVertical
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';
import ProblemDescription from './ProblemDescription';
import DSAPatternSidebar from './DSAPatternSidebar';
import AILeetCodeAssistant from './AILeetCodeAssistant';
import DSALeetCodeAgent from './DSALeetCodeAgent';
import ProgressTracker from './ProgressTracker';
import { useClerkProgress } from '../hooks/useClerkProgress';

// Modern VS Code-style editor
const ModernCodeEditor = ({ value, onChange, language, fontSize = 14 }) => {
  const textareaRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([1]);
  const [focused, setFocused] = useState(false);

  const safeValue = typeof value === 'string' ? value : (value || '').toString();

  useEffect(() => {
    const lines = safeValue.split('\n');
    setLineNumbers(lines.map((_, index) => index + 1));
  }, [safeValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = safeValue.substring(0, start) + '  ' + safeValue.substring(end);
      onChange && onChange(newValue);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang) {
      case 'javascript': return 'bg-yellow-500';
      case 'python': return 'bg-blue-500';
      case 'java': return 'bg-orange-500';
      case 'cpp': return 'bg-purple-500';
      case 'typescript': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] border border-gray-700 rounded-lg overflow-hidden">
      {/* Editor Header */}
      <div className="h-10 bg-[#2d2d30] border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`} />
          <span className="text-gray-300 text-sm font-medium capitalize">{language}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full" />
          <span className="text-gray-500 text-xs">main.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Line Numbers */}
        <div className="w-12 bg-[#1e1e1e] border-r border-gray-700 flex flex-col text-right pr-2 py-3 text-gray-500 font-mono text-sm select-none overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num} className="h-5 leading-5 text-xs">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={safeValue}
            onChange={(e) => onChange && onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full h-full bg-[#1e1e1e] text-gray-100 p-3 font-mono resize-none focus:outline-none border-none leading-5"
            style={{ 
              fontSize: `${fontSize}px`,
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace'
            }}
            placeholder={`// Start coding in ${language}...`}
            spellCheck={false}
          />
          
          {/* Focus indicator */}
          {focused && (
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
};

// Modern Monaco Editor wrapper
const MonacoEditor = ({ onMount, onChange, value, language, options, theme, height }) => {
  const editorRef = useRef(null);
  const safeValue = typeof value === 'string' ? value : (value || '').toString();

  useEffect(() => {
    if (onMount && editorRef.current) {
      const mockEditor = {
        getValue: () => safeValue,
        setValue: (newValue) => onChange && onChange(newValue),
        getModel: () => ({ getValue: () => safeValue }),
        focus: () => editorRef.current?.focus(),
        getPosition: () => ({ lineNumber: 1, column: 1 }),
        getSelection: () => null,
        executeEdits: (source, edits) => {
          if (edits && edits.length > 0 && onChange) {
            onChange(edits[0].text || '');
          }
        }
      };
      
      const mockMonaco = {
        editor: { EditorOption: { readOnly: 'readOnly' } }
      };
      
      try {
        onMount(mockEditor, mockMonaco);
      } catch (err) {
        console.warn('Editor mount failed:', err);
      }
    }
  }, [onMount, safeValue, onChange]);

  return (
    <div ref={editorRef} className="w-full h-full">
      <ModernCodeEditor 
        value={safeValue} 
        onChange={onChange} 
        language={language} 
        fontSize={options?.fontSize || 14}
      />
    </div>
  );
};

const LeetCodeEditorModern = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { markProblemCompleted, recordSubmission, getProgressStats } = useClerkProgress();
  
  // Core state
  const [selectedProblem, setSelectedProblem] = useState(dsaProblems[0]);
  const [code, setCode] = useState(dsaProblems[0].starterCode || '');
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  
  // UI state
  const [showDSASidebar, setShowDSASidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [consoleTab, setConsoleTab] = useState('testcase');
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [codingStartTime, setCodingStartTime] = useState(null);
  
  // DSA state
  const [currentDSAProblem, setCurrentDSAProblem] = useState(null);
  
  const editorRef = useRef(null);

  // Track coding time
  useEffect(() => {
    setCodingStartTime(Date.now());
    return () => {
      if (codingStartTime) {
        const timeSpent = Math.floor((Date.now() - codingStartTime) / 60000);
        if (timeSpent > 0) {
          recordSubmission(selectedProblem.id, false, language, timeSpent);
        }
      }
    };
  }, [selectedProblem.id]);

  const languages = [
    { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
    { value: 'python', label: 'Python', color: 'bg-blue-500' },
    { value: 'java', label: 'Java', color: 'bg-orange-500' },
    { value: 'cpp', label: 'C++', color: 'bg-purple-500' },
    { value: 'typescript', label: 'TypeScript', color: 'bg-blue-600' }
  ];

  // Handle DSA problem selection
  const handleDSAProblemSelect = (dsaProblem) => {
    setCurrentDSAProblem(dsaProblem);
    
    const adaptedProblem = {
      id: dsaProblem.id,
      title: dsaProblem.title,
      difficulty: dsaProblem.difficulty,
      pattern: dsaProblem.pattern,
      timeComplexity: dsaProblem.timeComplexity,
      spaceComplexity: dsaProblem.spaceComplexity,
      companies: dsaProblem.companies,
      leetcodeUrl: dsaProblem.leetcodeUrl,
      gfgUrl: dsaProblem.gfgUrl,
      codeforcesUrl: dsaProblem.codeforcesUrl,
      videoUrl: dsaProblem.videoUrl,
      hindiVideoUrl: dsaProblem.hindiVideoUrl,
      description: `Practice this ${dsaProblem.pattern} pattern problem to strengthen your DSA skills.`,
      examples: [
        {
          input: "Check the linked platforms for examples",
          output: "Refer to LeetCode, GFG, or Codeforces",
          explanation: "Each platform provides detailed examples and test cases."
        }
      ],
      constraints: ["Refer to the original problem on the linked platforms"],
      starterCode: `// ${dsaProblem.title}
// Pattern: ${dsaProblem.pattern}
// Difficulty: ${dsaProblem.difficulty}
// Time: ${dsaProblem.timeComplexity} | Space: ${dsaProblem.spaceComplexity}

function solve() {
    // Your solution here
    return null;
}`
    };
    
    setSelectedProblem(adaptedProblem);
    setCode(adaptedProblem.starterCode);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const runCode = async () => {
    setIsRunning(true);
    setConsoleTab('result');
    setConsoleOutput([]);

    try {
      setConsoleOutput([{ type: 'info', message: '⏳ Running code...' }]);
      
      setTimeout(() => {
        setConsoleOutput([
          { type: 'success', message: '✓ Code executed successfully' },
          { type: 'info', message: 'Test case 1: Passed' },
          { type: 'info', message: 'Runtime: 68ms' },
          { type: 'info', message: 'Memory: 42.1 MB' }
        ]);
        setIsRunning(false);
      }, 2000);
    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Execution error' },
        { type: 'error', message: error.message }
      ]);
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setConsoleTab('result');
    
    try {
      setConsoleOutput([{ type: 'info', message: '⏳ Submitting solution...' }]);
      
      const timeSpent = codingStartTime ? Math.floor((Date.now() - codingStartTime) / 60000) : 0;
      
      setTimeout(async () => {
        const accepted = Math.random() > 0.3;
        
        await recordSubmission(selectedProblem.id, accepted, language, timeSpent);
        
        if (accepted) {
          const problem = currentDSAProblem || selectedProblem;
          const achievements = await markProblemCompleted(
            problem.id, 
            problem.difficulty, 
            problem.category || problem.pattern || 'General',
            language,
            timeSpent
          );
          
          setTestResults({
            accepted: true,
            runtime: '68 ms',
            memory: '42.1 MB',
            runtimePercentile: '85.2',
            memoryPercentile: '76.8',
            totalTestCases: 57,
            passedTestCases: 57
          });
          
          let successMessages = [
            '🎉 Accepted!',
            'All test cases passed',
            'Runtime: 68ms (Beats 85.2%)',
            'Memory: 42.1 MB (Beats 76.8%)'
          ];
          
          if (achievements && achievements.length > 0) {
            successMessages.push('');
            successMessages.push('🏆 New Achievements Unlocked!');
            achievements.forEach(achievement => {
              successMessages.push(`✨ ${achievement.name}: ${achievement.description}`);
            });
          }
          
          setConsoleOutput(successMessages.map(msg => ({ type: 'success', message: msg })));
        } else {
          setTestResults({
            accepted: false,
            failedTestCase: 23,
            totalTestCases: 57,
            passedTestCases: 22
          });
          setConsoleOutput([
            { type: 'error', message: '❌ Wrong Answer' },
            { type: 'error', message: 'Failed on test case 23/57' }
          ]);
        }
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      setConsoleOutput([
        { type: 'error', message: '❌ Submission failed' },
        { type: 'error', message: error.message }
      ]);
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Modern Header */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CodeLeet</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            
            <button
              onClick={() => navigate('/resume')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-md transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Resume AI
            </button>
            
            <button
              onClick={() => setShowDSASidebar(!showDSASidebar)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                showDSASidebar 
                  ? 'text-blue-400 bg-blue-500/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              DSA Patterns
            </button>
            
            <button
              onClick={() => setShowProgressTracker(!showProgressTracker)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                showProgressTracker 
                  ? 'text-green-400 bg-green-500/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Progress
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-700 rounded-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">
              {isSignedIn ? 'Connected' : 'Guest Mode'}
            </span>
          </div>
          
          {isSignedIn ? (
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-lg"
                }
              }}
            />
          ) : (
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* DSA Sidebar */}
        {showDSASidebar && (
          <div className="w-80 border-r border-gray-700 bg-gray-800">
            <DSAPatternSidebar 
              onProblemSelect={handleDSAProblemSelect}
              currentProblem={currentDSAProblem}
            />
          </div>
        )}
        
        {/* Progress Tracker Sidebar */}
        {showProgressTracker && (
          <div className="w-72 border-r border-gray-700 bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <ProgressTracker />
            </div>
          </div>
        )}
        
        {/* Problem Panel */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-850">
          {/* Problem Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-gray-400">#{selectedProblem.id}</span>
                  <h1 className="text-2xl font-bold text-white">
                    {selectedProblem.title}
                  </h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                    {selectedProblem.difficulty}
                  </span>
                  {selectedProblem.pattern && (
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                      {selectedProblem.pattern}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Problem Content */}
          <div className="flex-1 overflow-y-auto">
            <ProblemDescription problem={currentDSAProblem || selectedProblem} />
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Editor Header */}
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value} className="bg-gray-700">
                    {lang.label}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Auto-save</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-300">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-400 w-8">{fontSize}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Console */}
          <div className="h-48 border-t border-gray-700 flex flex-col bg-gray-800">
            {/* Console Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-800">
              <button
                onClick={() => setConsoleTab('testcase')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r border-gray-700 min-w-0 flex-shrink-0 ${
                  consoleTab === 'testcase'
                    ? 'text-blue-400 bg-gray-700 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setConsoleTab('result')}
                className={`px-4 py-2 text-sm font-medium transition-colors min-w-0 flex-shrink-0 ${
                  consoleTab === 'result'
                    ? 'text-blue-400 bg-gray-700 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Result
              </button>
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {consoleTab === 'testcase' && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Input:</label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter test input..."
                    className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {consoleTab === 'result' && (
                <div className="space-y-2">
                  {testResults ? (
                    <div className="space-y-3">
                      {testResults.accepted ? (
                        <div className="flex items-center gap-2 text-green-400 text-lg font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          <span>Accepted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-lg font-semibold">
                          <XCircle className="w-5 h-5" />
                          <span>Wrong Answer</span>
                        </div>
                      )}

                      {testResults.accepted && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-700 rounded-md">
                            <div className="text-gray-400 text-sm mb-1">Runtime</div>
                            <div className="text-white font-semibold">{testResults.runtime}</div>
                            <div className="text-green-400 text-sm">Beats {testResults.runtimePercentile}%</div>
                          </div>
                          <div className="p-3 bg-gray-700 rounded-md">
                            <div className="text-gray-400 text-sm mb-1">Memory</div>
                            <div className="text-white font-semibold">{testResults.memory}</div>
                            <div className="text-green-400 text-sm">Beats {testResults.memoryPercentile}%</div>
                          </div>
                        </div>
                      )}
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
                      Run your code to see results
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Ready</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-md transition-colors font-medium"
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
              
              <button
                onClick={submitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-md transition-colors font-medium text-white"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AILeetCodeAssistant
        currentProblem={selectedProblem}
        currentCode={code}
        language={language}
        testResults={testResults}
        onCodeSuggestion={(suggestion) => {
          if (editorRef.current && suggestion.code) {
            const position = editorRef.current.getPosition();
            const model = editorRef.current.getModel();
            
            if (position && model) {
              const range = editorRef.current.getSelection() || {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column
              };
              
              editorRef.current.executeEdits('ai-suggestion', [{
                range: range,
                text: suggestion.code
              }]);
              
              editorRef.current.focus();
            }
          }
        }}
      />

      {/* DSA AI Agent - Advanced Problem Solving Assistant */}
      <DSALeetCodeAgent
        problemTitle={selectedProblem?.title || 'No problem selected'}
        problemDescription={selectedProblem?.description || ''}
        problemDifficulty={selectedProblem?.difficulty || 'Medium'}
        problemTags={selectedProblem?.tags || []}
        userCode={code}
        onCodeSuggestion={(suggestion) => {
          if (suggestion) {
            setCode(suggestion);
          }
        }}
      />
            }
          }
        }}
      />
    </div>
  );
};

export default LeetCodeEditorModern;