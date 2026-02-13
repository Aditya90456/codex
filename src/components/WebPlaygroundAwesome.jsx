import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Code, Trophy, Target, CheckCircle, Clock, Star, Zap, Award, TrendingUp,
  BookOpen, Rocket, Filter, Search, Flame, Crown, Medal, Sparkles, ArrowRight,
  Play, Lock, Unlock, ChevronRight, Users, Activity, BarChart3, X
} from 'lucide-react';
import { webAssignments, industryProjects } from '../data/webAssignments';
import WebDevStudio from './WebDevStudio';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WebPlaygroundAwesome = () => {
  const { user } = useUser();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments');
  const [showWelcome, setShowWelcome] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProgress();
      loadLeaderboard();
    }
    // Animate stats on mount
    setTimeout(() => setAnimateStats(true), 300);
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [user]);

  const loadUserProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/web-playground/progress/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setUserProgress(data.progress);
        setCompletedAssignments(data.completed || []);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/web-playground/leaderboard`);
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const startAssignment = (assignment) => {
    setActiveAssignment(assignment);
    setShowEditor(true);
  };

  const submitAssignment = async (code) => {
    if (!user || !activeAssignment) return;
    try {
      const response = await fetch(`${API_URL}/api/web-playground/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.firstName || user.username || 'Anonymous',
          assignmentId: activeAssignment.id,
          code,
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`🎉 Assignment submitted! Score: ${data.score}/100\n${data.message}`);
        loadUserProgress();
        loadLeaderboard();
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  const allAssignments = [
    ...webAssignments.beginner.map(a => ({ ...a, level: 'beginner' })),
    ...webAssignments.intermediate.map(a => ({ ...a, level: 'intermediate' })),
    ...webAssignments.advanced.map(a => ({ ...a, level: 'advanced' })),
    ...webAssignments.expert.map(a => ({ ...a, level: 'expert' }))
  ];

  const filteredAssignments = allAssignments.filter(assignment => {
    const matchesLevel = selectedLevel === 'all' || assignment.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || assignment.category.includes(selectedCategory);
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'from-green-500 to-emerald-500',
      'Intermediate': 'from-yellow-500 to-orange-500',
      'Advanced': 'from-orange-500 to-red-500',
      'Expert': 'from-red-500 to-purple-500'
    };
    return colors[difficulty] || 'from-gray-500 to-gray-600';
  };

  const getLevelIcon = (difficulty) => {
    const icons = {
      'Beginner': '🌱',
      'Intermediate': '🔥',
      'Advanced': '⚡',
      'Expert': '🚀'
    };
    return icons[difficulty] || '📝';
  };

  const calculateUserStats = () => {
    const total = allAssignments.length;
    const completed = completedAssignments.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalPoints = completedAssignments.reduce((sum, id) => {
      const assignment = allAssignments.find(a => a.id === id);
      return sum + (assignment?.testCases?.reduce((s, t) => s + t.points, 0) || 0);
    }, 0);
    return { total, completed, percentage, totalPoints };
  };

  const stats = calculateUserStats();
  const userRank = leaderboard.findIndex(l => l.userId === user?.id) + 1;

  if (showEditor && activeAssignment) {
    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{getLevelIcon(activeAssignment.difficulty)}</span>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {activeAssignment.title}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(activeAssignment.difficulty)}`}>
                    {activeAssignment.difficulty}
                  </span>
                </h2>
                <p className="text-sm text-gray-400">{activeAssignment.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditor(false)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              ← Back to Playground
            </button>
          </div>
        </div>
        <div className="flex-1">
          <WebDevStudio 
            initialCode={activeAssignment.starterCode}
            onSubmit={submitAssignment}
            assignment={activeAssignment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                    Web Playground
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Master web development with real-world projects & instant feedback
                  </p>
                </div>
              </div>
              {user && (
                <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-700">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <p className="font-bold text-lg">{user.firstName || user.username}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                    {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Awesome Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Trophy className="w-10 h-10 text-yellow-300" />
                    <span className="text-5xl font-black">{stats.completed}</span>
                  </div>
                  <p className="text-sm font-semibold opacity-90">Assignments Completed</p>
                  <div className="mt-2 h-1 bg-blue-400/30 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-300 rounded-full" style={{ width: `${stats.percentage}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Target className="w-10 h-10" />
                    <span className="text-5xl font-black">{stats.percentage}%</span>
                  </div>
                  <p className="text-sm font-semibold opacity-90">Overall Progress</p>
                  <div className="mt-2 flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < Math.floor(stats.percentage / 10) ? 'bg-white' : 'bg-purple-400/30'}`}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Star className="w-10 h-10 text-yellow-300" />
                    <span className="text-5xl font-black">{stats.totalPoints}</span>
                  </div>
                  <p className="text-sm font-semibold opacity-90">Total Points Earned</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <Flame className="w-4 h-4 text-orange-300" />
                    <span className="opacity-75">Keep the streak going!</span>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    {userRank <= 3 ? <Crown className="w-10 h-10 text-yellow-300" /> : <TrendingUp className="w-10 h-10" />}
                    <span className="text-5xl font-black">#{userRank || '-'}</span>
                  </div>
                  <p className="text-sm font-semibold opacity-90">Global Rank</p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <Users className="w-4 h-4" />
                    <span className="opacity-75">{leaderboard.length} competitors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'assignments'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('industry')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'industry'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Rocket className="w-5 h-5 inline mr-2" />
              Industry Projects
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Leaderboard
            </button>
          </div>

          {/* Filters - Only show for assignments */}
          {activeTab === 'assignments' && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-400" />
                  Filter Assignments
                </h3>
                <button
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-semibold">Difficulty Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">🌱 Beginner</option>
                    <option value="intermediate">🔥 Intermediate</option>
                    <option value="advanced">⚡ Advanced</option>
                    <option value="expert">🚀 Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-semibold">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="HTML/CSS">HTML/CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="React">React</option>
                    <option value="API">API Integration</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-semibold">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assignments..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Activity className="w-4 h-4" />
                <span>Showing {filteredAssignments.length} of {allAssignments.length} assignments</span>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'assignments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => {
                const isCompleted = completedAssignments.includes(assignment.id);
                const progress = userProgress[assignment.id] || 0;

                return (
                  <div
                    key={assignment.id}
                    onMouseEnter={() => setHoveredCard(assignment.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      hoveredCard === assignment.id
                        ? 'border-blue-500 transform scale-105 shadow-2xl shadow-blue-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* Gradient Top Bar */}
                    <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(assignment.difficulty)}`} />
                    
                    {/* Completion Badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-green-500 rounded-full p-2 shadow-lg animate-bounce">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{getLevelIcon(assignment.difficulty)}</span>
                          <div>
                            <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-400">{assignment.category}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {assignment.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {assignment.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {assignment.testCases?.reduce((sum, t) => sum + t.points, 0) || 0} pts
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress</span>
                          <span className="font-bold text-white">{progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getDifficultyColor(assignment.difficulty)} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Requirements Preview */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.requirements?.slice(0, 3).map((req, idx) => (
                            <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              {req.length > 20 ? req.substring(0, 20) + '...' : req}
                            </span>
                          ))}
                          {assignment.requirements?.length > 3 && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                              +{assignment.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => startAssignment(assignment)}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        } shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Review Solution
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Challenge
                          </>
                        )}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'industry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industryProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.industry}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${getDifficultyColor(project.difficulty)} shadow-lg`}>
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {project.estimatedTime}
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-sm font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Start Project
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  Global Leaderboard
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{leaderboard.length} Developers</span>
                </div>
              </div>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => {
                  const isCurrentUser = entry.userId === user?.id;
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

                  return (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-2 border-blue-500 shadow-lg'
                          : 'bg-gray-700/50 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-3xl font-black ${
                          index < 3 ? 'text-yellow-400' : 'text-gray-500'
                        }`}>
                          {medal || `#${index + 1}`}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                          {entry.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{entry.username}</p>
                          <p className="text-sm text-gray-400">{entry.completedCount} completed</p>
                        </div>
                        {isCurrentUser && (
                          <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold">YOU</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-yellow-400">{entry.totalPoints}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebPlaygroundAwesome;
