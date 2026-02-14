import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { companyWiseProblems, timerPresets, companyStats } from '../data/companyWiseProblems';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Building2, 
  Filter,
  Search,
  Timer,
  AlertCircle,
  CheckCircle,
  Trophy,
  Target,
  Zap,
  BookOpen,
  Code,
  Settings,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  Brain,
  Coffee
} from 'lucide-react';
import Editor from '@monaco-editor/react';

const LeetCodeCompanyEditor = () => {
  const { theme } = useTheme();
  
  // Company and problem selection
  const [selectedCompany, setSelectedCompany] = useState('google');
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  
  // Timer states
  const [timerDuration, setTimerDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState('medium');
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Code editor states
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // UI states
  const [showCompanyStats, setShowCompanyStats] = useState(false);
  const [showProblemList, setShowProblemList] = useState(true);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);

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

  // Get current company data
  const currentCompany = companyWiseProblems[selectedCompany];
  const currentProblem = currentCompany.problems[selectedProblem];
  const currentStats = companyStats[selectedCompany];

  // Filter problems
  const filteredProblems = currentCompany.problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Load problem template
  useEffect(() => {
    if (currentProblem && currentProblem.template[language]) {
      setCode(currentProblem.template[language]);
    }
  }, [selectedProblem, language, selectedCompany]);

  // Timer warning colors
  const getTimerColor = () => {
    const percentage = (timeLeft / (timerDuration * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} ${theme.text}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.card} border-b-2 ${theme.border} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">LeetCode Company Practice</h1>
            </div>
            
            {/* Company Selector */}
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setSelectedProblem(0);
                }}
                className={`bg-gradient-to-r ${theme.card} border-2 ${theme.border} rounded-lg px-4 py-2 ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {Object.entries(companyWiseProblems).map(([key, company]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {company.logo} {company.name} ({company.totalProblems})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${theme.card} border-2 ${theme.border} rounded-lg`}>
              <Clock className={`w-5 h-5 ${getTimerColor()}`} />
              <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </span>
              
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} hover:opacity-80 transition-all`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={resetTimer}
                  className={`p-2 rounded-lg bg-gradient-to-r ${theme.secondary} hover:opacity-80 transition-all`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowTimerSettings(!showTimerSettings)}
                  className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-all`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timer Presets */}
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
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Problems List */}
        <div className={`w-1/3 bg-gradient-to-br ${theme.card} border-r-2 ${theme.border} flex flex-col`}>
          {/* Company Info */}
          <div className={`p-4 border-b-2 ${theme.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`text-3xl`}>{currentCompany.logo}</div>
                <div>
                  <h2 className="text-xl font-bold">{currentCompany.name}</h2>
                  <p className={`text-sm ${theme.textSecondary}`}>{currentCompany.totalProblems} Problems</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowCompanyStats(!showCompanyStats)}
                className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-all`}
              >
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>

            {/* Company Stats */}
            {showCompanyStats && currentStats && (
              <div className={`bg-gradient-to-r ${theme.background} rounded-lg p-3 mb-3`}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className={theme.textSecondary}>Interview Rounds</div>
                    <div className="font-bold">{currentStats.avgInterviewRounds}</div>
                  </div>
                  <div>
                    <div className={theme.textSecondary}>Technical Rounds</div>
                    <div className="font-bold">{currentStats.technicalRounds}</div>
                  </div>
                  <div>
                    <div className={theme.textSecondary}>Avg Difficulty</div>
                    <div className="font-bold">{currentStats.avgDifficulty}</div>
                  </div>
                  <div>
                    <div className={theme.textSecondary}>Focus Areas</div>
                    <div className="font-bold">{currentStats.focusAreas.length}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className={`text-sm ${theme.textSecondary} mb-1`}>Interview Tips:</div>
                  {currentStats.tips.slice(0, 1).map((tip, index) => (
                    <div key={index} className="text-xs bg-blue-500/20 rounded px-2 py-1">
                      💡 {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-gradient-to-r ${theme.background} border-2 ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              
              <div className="flex gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setDifficultyFilter(difficulty)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
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

          {/* Problems List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProblems.map((problem, index) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(currentCompany.problems.indexOf(problem))}
                className={`p-4 border-b ${theme.border} cursor-pointer transition-all hover:bg-gray-700/50 ${
                  selectedProblem === currentCompany.problems.indexOf(problem) ? 'bg-blue-500/20 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-400">#{problem.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{problem.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center gap-1 text-xs ${
                        problem.frequency === 'Very High' ? 'text-red-400' :
                        problem.frequency === 'High' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`}>
                        <Zap className="w-3 h-3" />
                        {problem.frequency}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Problem and Editor */}
        <div className="flex-1 flex flex-col">
          {/* Problem Description */}
          <div className={`h-1/2 bg-gradient-to-br ${theme.card} border-b-2 ${theme.border} overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{currentProblem.title}</h1>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    currentProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    currentProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {currentProblem.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-sm ${
                    currentProblem.frequency === 'Very High' ? 'text-red-400' :
                    currentProblem.frequency === 'High' ? 'text-orange-400' :
                    'text-yellow-400'
                  }`}>
                    <Target className="w-4 h-4" />
                    {currentProblem.frequency} Frequency
                  </div>
                </div>
              </div>

              <div className={`${theme.textSecondary} mb-6 leading-relaxed`}>
                {currentProblem.description}
              </div>

              {/* Examples */}
              {currentProblem.examples && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Examples
                  </h3>
                  {currentProblem.examples.map((example, index) => (
                    <div key={index} className={`bg-gradient-to-r ${theme.background} rounded-lg p-4 mb-3`}>
                      <div className="mb-2">
                        <strong>Input:</strong> <code className="bg-gray-700 px-2 py-1 rounded">{example.input}</code>
                      </div>
                      <div className="mb-2">
                        <strong>Output:</strong> <code className="bg-gray-700 px-2 py-1 rounded">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {currentProblem.constraints && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                  <ul className={`list-disc list-inside ${theme.textSecondary} space-y-1`}>
                    {currentProblem.constraints.map((constraint, index) => (
                      <li key={index}><code className="bg-gray-700 px-2 py-1 rounded text-sm">{constraint}</code></li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProblem.tags.map(tag => (
                    <span key={tag} className={`px-3 py-1 rounded-lg text-sm bg-gradient-to-r ${theme.secondary} text-white`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="h-1/2 flex flex-col">
            <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${theme.card} border-b ${theme.border}`}>
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`bg-gradient-to-r ${theme.background} border-2 ${theme.border} rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`p-2 rounded-lg ${theme.textSecondary} hover:${theme.text} transition-all`}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className={`px-4 py-2 bg-gradient-to-r ${theme.secondary} rounded-lg hover:opacity-80 transition-all flex items-center gap-2`}>
                  <Play className="w-4 h-4" />
                  Run Code
                </button>
                
                <button className={`px-4 py-2 bg-gradient-to-r ${theme.primary} rounded-lg hover:opacity-80 transition-all flex items-center gap-2`}>
                  <CheckCircle className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={setCode}
                theme={theme.editorTheme}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  bracketMatching: 'always',
                  autoIndent: 'full'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timer Alert Audio */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
};

export default LeetCodeCompanyEditor;