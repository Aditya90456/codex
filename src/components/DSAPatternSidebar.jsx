import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  ExternalLink,
  Youtube,
  BookOpen,
  Code,
  Trophy,
  Target,
  Zap,
  Brain,
  Filter,
  Search,
  BarChart3,
  GitBranch,
  Languages,
  Flame,
  Award,
  TrendingUp,
  Sparkles,
  Rocket,
  Crown,
  Diamond,
  Gem,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Layers,
  TreePine,
  Shuffle,
  ArrowUpDown,
  RotateCcw,
  Maximize2,
  Eye,
  Timer,
  Activity,
  PieChart,
  BarChart,
  Gauge,
  Zap as Lightning
} from 'lucide-react';
import { dsaPatternProblems } from '../data/dsaPatternProblems';
import PlaylistIntegration from './PlaylistIntegration';
import DualCreatorIntegration from './DualCreatorIntegration';

const DSAPatternSidebar = ({ onProblemSelect, currentProblem }) => {
  const [expandedPatterns, setExpandedPatterns] = useState(new Set(['arrays']));
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [viewMode, setViewMode] = useState('patterns'); // 'patterns', 'progress', 'stats'
  const [animatingPattern, setAnimatingPattern] = useState(null);
  const [hoveredProblem, setHoveredProblem] = useState(null);
  
  // Striver's A2Z DSA Course Playlist
  const striverPlaylistUrl = "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=OnJg3ViS7VU_TZ3x";

  // Load completed problems from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dsa_completed_problems');
    if (saved) {
      setCompletedProblems(new Set(JSON.parse(saved)));
    }
  }, []);

  // DSA 150 Problems organized by patterns
  const dsaPatterns = dsaPatternProblems;

  // Enhanced pattern styles with gradients and animations
  const patternStyles = {
    arrays: { 
      gradient: 'from-blue-500 via-blue-600 to-cyan-500', 
      bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5', 
      border: 'border-blue-500/30',
      icon: <Code className="w-5 h-5" />,
      emoji: '🔢',
      glow: 'shadow-blue-500/20'
    },
    'two-pointers': { 
      gradient: 'from-green-500 via-emerald-500 to-teal-500', 
      bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/5', 
      border: 'border-green-500/30',
      icon: <Target className="w-5 h-5" />,
      emoji: '👆',
      glow: 'shadow-green-500/20'
    },
    'sliding-window': { 
      gradient: 'from-purple-500 via-violet-500 to-pink-500', 
      bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/5', 
      border: 'border-purple-500/30',
      icon: <Maximize2 className="w-5 h-5" />,
      emoji: '🪟',
      glow: 'shadow-purple-500/20'
    },
    stack: { 
      gradient: 'from-orange-500 via-red-500 to-pink-500', 
      bg: 'bg-gradient-to-br from-orange-500/10 to-red-500/5', 
      border: 'border-orange-500/30',
      icon: <Layers className="w-5 h-5" />,
      emoji: '📚',
      glow: 'shadow-orange-500/20'
    },
    'binary-search': { 
      gradient: 'from-indigo-500 via-purple-500 to-violet-500', 
      bg: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5', 
      border: 'border-indigo-500/30',
      icon: <Search className="w-5 h-5" />,
      emoji: '🔍',
      glow: 'shadow-indigo-500/20'
    },
    'linked-list': { 
      gradient: 'from-teal-500 via-cyan-500 to-blue-500', 
      bg: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/5', 
      border: 'border-teal-500/30',
      icon: <GitBranch className="w-5 h-5" />,
      emoji: '🔗',
      glow: 'shadow-teal-500/20'
    },
    trees: { 
      gradient: 'from-green-600 via-lime-500 to-emerald-500', 
      bg: 'bg-gradient-to-br from-green-600/10 to-lime-500/5', 
      border: 'border-green-600/30',
      icon: <TreePine className="w-5 h-5" />,
      emoji: '🌳',
      glow: 'shadow-green-600/20'
    },
    'dynamic-programming': { 
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500', 
      bg: 'bg-gradient-to-br from-rose-500/10 to-pink-500/5', 
      border: 'border-rose-500/30',
      icon: <Brain className="w-5 h-5" />,
      emoji: '🧠',
      glow: 'shadow-rose-500/20'
    },
    graphs: { 
      gradient: 'from-violet-500 via-purple-600 to-indigo-600', 
      bg: 'bg-gradient-to-br from-violet-500/10 to-purple-600/5', 
      border: 'border-violet-500/30',
      icon: <Network className="w-5 h-5" />,
      emoji: '🕸️',
      glow: 'shadow-violet-500/20'
    },
    backtracking: { 
      gradient: 'from-amber-500 via-orange-500 to-red-500', 
      bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/5', 
      border: 'border-amber-500/30',
      icon: <RotateCcw className="w-5 h-5" />,
      emoji: '🔄',
      glow: 'shadow-amber-500/20'
    }
  };

  // Enhanced toggle pattern with animation
  const togglePattern = (patternKey) => {
    setAnimatingPattern(patternKey);
    setTimeout(() => setAnimatingPattern(null), 300);
    
    const newExpanded = new Set(expandedPatterns);
    if (newExpanded.has(patternKey)) {
      newExpanded.delete(patternKey);
    } else {
      newExpanded.add(patternKey);
    }
    setExpandedPatterns(newExpanded);
  };

  // Enhanced problem completion with celebration
  const toggleProblemCompletion = (problemId) => {
    const newCompleted = new Set(completedProblems);
    if (newCompleted.has(problemId)) {
      newCompleted.delete(problemId);
    } else {
      newCompleted.add(problemId);
    }
    setCompletedProblems(newCompleted);
    localStorage.setItem('dsa_completed_problems', JSON.stringify([...newCompleted]));
  };

  // Calculate progress statistics
  const calculateStats = () => {
    const totalProblems = Object.values(dsaPatterns).reduce((sum, pattern) => sum + pattern.problems.length, 0);
    const completedCount = completedProblems.size;
    const progressPercentage = Math.round((completedCount / totalProblems) * 100);
    
    const difficultyStats = {
      Easy: { completed: 0, total: 0 },
      Medium: { completed: 0, total: 0 },
      Hard: { completed: 0, total: 0 }
    };

    const patternStats = {};
    Object.entries(dsaPatterns).forEach(([key, pattern]) => {
      patternStats[key] = { completed: 0, total: pattern.problems.length };
      pattern.problems.forEach(problem => {
        difficultyStats[problem.difficulty].total++;
        if (completedProblems.has(problem.id)) {
          difficultyStats[problem.difficulty].completed++;
          patternStats[key].completed++;
        }
      });
    });

    return { totalProblems, completedCount, progressPercentage, difficultyStats, patternStats };
  };

  const stats = calculateStats();

  // Filter problems based on search and filters
  const getFilteredPatterns = () => {
    const filtered = {};
    
    Object.entries(dsaPatterns).forEach(([key, pattern]) => {
      const filteredProblems = pattern.problems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            problem.pattern.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
        const matchesPlatform = selectedPlatform === 'all' || 
                              (selectedPlatform === 'leetcode' && problem.leetcodeUrl) ||
                              (selectedPlatform === 'gfg' && problem.gfgUrl) ||
                              (selectedPlatform === 'codeforces' && problem.codeforcesUrl);
        
        return matchesSearch && matchesDifficulty && matchesPlatform;
      });

      if (filteredProblems.length > 0) {
        filtered[key] = { ...pattern, problems: filteredProblems };
      }
    });

    return filtered;
  };

  const filteredPatterns = getFilteredPatterns();

  // Render progress view
  const renderProgressView = () => (
    <div className="space-y-6 p-4">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Overall Progress
          </h3>
          <div className="text-2xl font-bold text-indigo-400">
            {stats.progressPercentage}%
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>{stats.completedCount} completed</span>
          <span>{stats.totalProblems} total</span>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(stats.difficultyStats).map(([difficulty, data]) => {
          const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const colors = {
            Easy: 'from-green-500 to-emerald-500',
            Medium: 'from-yellow-500 to-orange-500',
            Hard: 'from-red-500 to-pink-500'
          };
          
          return (
            <div key={difficulty} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-center">
                <div className={`text-2xl font-bold bg-gradient-to-r ${colors[difficulty]} bg-clip-text text-transparent`}>
                  {percentage}%
                </div>
                <div className="text-xs text-gray-400 mt-1">{difficulty}</div>
                <div className="text-xs text-gray-500">{data.completed}/{data.total}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern Progress */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Pattern Progress
        </h4>
        {Object.entries(stats.patternStats).map(([key, data]) => {
          const pattern = dsaPatterns[key];
          const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const style = patternStyles[key];
          
          return (
            <div key={key} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{style?.emoji}</span>
                  <span className="text-sm font-medium text-white">{pattern.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-300">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${style?.gradient} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{data.completed} solved</span>
                <span>{data.total} total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render stats view
  const renderStatsView = () => (
    <div className="space-y-6 p-4">
      {/* Achievement Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">7</div>
          <div className="text-xs text-gray-400">days</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Rank</span>
          </div>
          <div className="text-2xl font-bold text-white">A+</div>
          <div className="text-xs text-gray-400">level</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Quick Stats
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Problems Solved</span>
            <span className="text-sm font-bold text-green-400">{stats.completedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Success Rate</span>
            <span className="text-sm font-bold text-blue-400">{stats.progressPercentage}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Favorite Pattern</span>
            <span className="text-sm font-bold text-purple-400">Arrays</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Time Spent</span>
            <span className="text-sm font-bold text-orange-400">24h</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Achievements
        </h4>
        
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '🎯', name: 'First Solve', unlocked: true },
            { icon: '🔥', name: '10 Streak', unlocked: true },
            { icon: '💎', name: 'Hard Master', unlocked: false },
            { icon: '🚀', name: 'Speed Demon', unlocked: false },
            { icon: '🧠', name: 'DP Expert', unlocked: false },
            { icon: '🌟', name: 'All Patterns', unlocked: false }
          ].map((achievement, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border text-center ${
                achievement.unlocked 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-gray-700/30 border-gray-600/30'
              }`}
            >
              <div className={`text-lg mb-1 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className={`text-xs ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                {achievement.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-full flex flex-col border-r border-gray-700/50 backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            DSA Mastery
          </h2>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex bg-gray-800/50 rounded-lg p-1 mb-4">
          {[
            { key: 'patterns', label: 'Problems', icon: <Code className="w-4 h-4" /> },
            { key: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'stats', label: 'Stats', icon: <Trophy className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
                viewMode === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(75, 85, 99, 0.3)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray={`${stats.progressPercentage}, 100`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{stats.progressPercentage}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Only show in patterns view */}
        {viewMode === 'patterns' && (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="all">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="gfg">GeeksforGeeks</option>
                <option value="codeforces">Codeforces</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {viewMode === 'progress' && renderProgressView()}
        {viewMode === 'stats' && renderStatsView()}
        
        {viewMode === 'patterns' && (
          <div className="p-4 space-y-4">
            {/* Dual Creator Integration */}
            <DualCreatorIntegration />
            
            {/* Striver's Playlist Integration */}
            <PlaylistIntegration 
              playlistUrl={striverPlaylistUrl}
              title="Striver's A2Z DSA Course"
            />
            
            {Object.entries(filteredPatterns).map(([patternKey, pattern]) => {
              const isExpanded = expandedPatterns.has(patternKey);
              const isAnimating = animatingPattern === patternKey;
              const style = patternStyles[patternKey] || patternStyles.arrays;
              const completedInPattern = pattern.problems.filter(p => completedProblems.has(p.id)).length;
              const progressPercent = Math.round((completedInPattern / pattern.problems.length) * 100);

              return (
                <div 
                  key={patternKey} 
                  className={`rounded-xl border transition-all duration-300 hover:shadow-lg ${style.bg} ${style.border} ${
                    isAnimating ? 'scale-105' : ''
                  } ${style.glow} hover:shadow-xl`}
                >
                  {/* Pattern Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer group"
                    onClick={() => togglePattern(patternKey)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${style.gradient} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        {style.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{style.emoji}</span>
                          <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors">
                            {pattern.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{completedInPattern}/{pattern.problems.length} solved</span>
                          <span>•</span>
                          <span>{progressPercent}% complete</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{pattern.problems.length}</span>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-4 pb-2">
                    <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                      <div 
                        className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Problems List */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                      {pattern.problems.map((problem, index) => {
                        const isCompleted = completedProblems.has(problem.id);
                        const isCurrent = currentProblem?.id === problem.id;
                        const isHovered = hoveredProblem === problem.id;

                        return (
                          <div
                            key={problem.id}
                            className={`group relative rounded-lg border transition-all duration-200 hover:shadow-md ${
                              isCurrent 
                                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-indigo-500/20' 
                                : isCompleted
                                ? 'bg-green-600/10 border-green-500/30'
                                : 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50'
                            } ${isHovered ? 'scale-[1.02]' : ''}`}
                            onMouseEnter={() => setHoveredProblem(problem.id)}
                            onMouseLeave={() => setHoveredProblem(null)}
                          >
                            <div className="p-3">
                              {/* Problem Header */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <button
                                      onClick={() => toggleProblemCompletion(problem.id)}
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                        isCompleted
                                          ? 'bg-green-500 border-green-500 text-white'
                                          : 'border-gray-500 hover:border-green-400'
                                      }`}
                                    >
                                      {isCompleted && <CheckCircle className="w-3 h-3" />}
                                    </button>
                                    
                                    <h4 
                                      className={`font-medium cursor-pointer transition-colors ${
                                        isCompleted ? 'text-green-400' : 'text-white hover:text-gray-200'
                                      }`}
                                      onClick={() => onProblemSelect && onProblemSelect(problem)}
                                    >
                                      {problem.title}
                                    </h4>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className={`px-2 py-1 rounded-full font-medium ${
                                      problem.difficulty === 'Easy' ? 'bg-green-600/20 text-green-400' :
                                      problem.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-400' :
                                      'bg-red-600/20 text-red-400'
                                    }`}>
                                      {problem.difficulty}
                                    </span>
                                    <span className="text-gray-400">{problem.timeComplexity}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {problem.companies.slice(0, 2).map((company, i) => (
                                    <span key={i} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                                      {company}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 flex-wrap">
                                {problem.leetcodeUrl && (
                                  <a
                                    href={problem.leetcodeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-orange-600/20 text-orange-400 rounded text-xs hover:bg-orange-600/30 transition-colors"
                                    title="Solve on LeetCode"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    LC
                                  </a>
                                )}
                                
                                {problem.gfgUrl && (
                                  <a
                                    href={problem.gfgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs hover:bg-green-600/30 transition-colors"
                                    title="Solve on GeeksforGeeks"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    GFG
                                  </a>
                                )}
                                
                                {problem.codeforcesUrl && (
                                  <a
                                    href={problem.codeforcesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30 transition-colors"
                                    title="Solve on Codeforces"
                                  >
                                    <Code className="w-3 h-3" />
                                    CF
                                  </a>
                                )}
                                
                                {problem.videoUrl && (
                                  <a
                                    href={problem.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs hover:bg-red-600/30 transition-colors"
                                    title="Watch Solution Video"
                                  >
                                    <Youtube className="w-3 h-3" />
                                    Video
                                  </a>
                                )}
                                
                                {problem.hindiVideoUrl && (
                                  <a
                                    href={problem.hindiVideoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-orange-600/20 text-orange-400 rounded text-xs hover:bg-orange-600/30 transition-colors"
                                    title="Aditya Bakshi Hindi Solution"
                                  >
                                    <Languages className="w-3 h-3" />
                                    हिंदी
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            {isHovered && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-lg pointer-events-none" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lightning className="w-3 h-3 text-yellow-400" />
            <span>Keep going!</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{stats.completedCount}/{stats.totalProblems}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAPatternSidebar;