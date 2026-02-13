import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Code, 
  Trophy, 
  Target, 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Award,
  TrendingUp,
  BookOpen,
  Rocket,
  Filter,
  Search,
  Flame,
  Crown,
  Medal,
  Sparkles,
  ArrowRight,
  Play,
  Lock,
  Unlock,
  ChevronRight,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';
import { webAssignments, industryProjects, evaluationCriteria } from '../data/webAssignments';
import WebDevStudio from './WebDevStudio';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WebPlayground = () => {
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

  useEffect(() => {
    if (user) {
      loadUserProgress();
      loadLeaderboard();
    }
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
          assignmentId: activeAssignment.id,
          code,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Assignment submitted! Score: ${data.score}/100`);
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

  if (showEditor && activeAssignment) {
    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{activeAssignment.title}</h2>
              <p className="text-sm text-gray-400">{activeAssignment.description}</p>
            </div>
            <button
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
            >
              Back to Assignments
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Web Development Playground
            </h1>
            <p className="text-gray-400">
              Master web development with industry-standard projects
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold">{user.firstName || user.username}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.completed}</span>
            </div>
            <p className="text-sm opacity-90">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.percentage}%</span>
            </div>
            <p className="text-sm opacity-90">Progress</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.totalPoints}</span>
            </div>
            <p className="text-sm opacity-90">Total Points</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-3xl font-bold">#{leaderboard.findIndex(l => l.userId === user?.id) + 1 || '-'}</span>
            </div>
            <p className="text-sm opacity-90">Rank</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Difficulty Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assignments..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAssignments.map((assignment) => {
            const isCompleted = completedAssignments.includes(assignment.id);
            const progress = userProgress[assignment.id];

            return (
              <div
                key={assignment.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                <div className={`h-2 bg-gradient-to-r ${getDifficultyColor(assignment.difficulty)}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLevelIcon(assignment.difficulty)}</span>
                      <div>
                        <h3 className="font-bold text-lg">{assignment.title}</h3>
                        <p className="text-sm text-gray-400">{assignment.category}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
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
                      <Star className="w-4 h-4" />
                      {assignment.testCases?.reduce((sum, t) => sum + t.points, 0) || 0} pts
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Requirements</span>
                      <span className="text-gray-400">{assignment.requirements?.length || 0}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getDifficultyColor(assignment.difficulty)}`}
                        style={{ width: progress ? `${progress}%` : '0%' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => startAssignment(assignment)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isCompleted ? 'Review Solution' : 'Start Assignment'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Industry Projects Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-400" />
            Industry Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryProjects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.industry}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-700 rounded-full text-xs"
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
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all">
                    Start Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Leaderboard
          </h2>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.userId === user?.id
                    ? 'bg-blue-600/20 border border-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    index === 2 ? 'text-orange-400' :
                    'text-gray-500'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{entry.username}</p>
                    <p className="text-sm text-gray-400">{entry.completedCount} completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-400">{entry.totalPoints}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebPlayground;
