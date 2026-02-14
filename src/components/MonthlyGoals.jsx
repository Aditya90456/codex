import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Target, Plus, X, CheckCircle, Circle, Edit, Trash2, Calendar,
  TrendingUp, Award, Star, Flame, Code, BookOpen, Trophy, Crown,
  ChevronLeft, ChevronRight, Sparkles, Zap, Brain, Clock, Flag,
  BarChart3, PieChart, Activity, Gift, Medal, Rocket, Users,
  Coffee, Heart, Shield, Gem, Gamepad2, Timer, Lightbulb
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const MonthlyGoals = ({ onClose }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'problems', // problems, streak, category, difficulty
    target: 10,
    category: 'Arrays',
    difficulty: 'Easy',
    description: ''
  });
  const [monthlyStats, setMonthlyStats] = useState({
    totalProblems: 0,
    easyProblems: 0,
    mediumProblems: 0,
    hardProblems: 0,
    currentStreak: 0,
    longestStreak: 0,
    categoriesCompleted: {},
    daysActive: 0
  });
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const goalTypes = [
    { id: 'problems', label: 'Total Problems', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'streak', label: 'Maintain Streak', icon: Flame, color: 'from-orange-500 to-red-500' },
    { id: 'category', label: 'Category Focus', icon: Target, color: 'from-purple-500 to-pink-500' },
    { id: 'difficulty', label: 'Difficulty Level', icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
  ];

  const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching', 'Stack', 'Heap'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    loadGoals();
    loadMonthlyStats();
    loadMonthlyRewards();
  }, [user, currentMonth]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
      const saved = localStorage.getItem(`monthly_goals_${user.id}_${monthKey}`);
      
      if (saved) {
        setGoals(JSON.parse(saved));
      } else {
        // Set default goals for new month
        const defaultGoals = [
          {
            id: Date.now() + 1,
            title: 'Solve 30 Problems',
            type: 'problems',
            target: 30,
            progress: 0,
            description: 'Complete 30 coding problems this month',
            createdAt: new Date().toISOString()
          },
          {
            id: Date.now() + 2,
            title: 'Maintain 15-Day Streak',
            type: 'streak',
            target: 15,
            progress: 0,
            description: 'Code for at least 15 days this month',
            createdAt: new Date().toISOString()
          }
        ];
        setGoals(defaultGoals);
        saveGoals(defaultGoals);
      }
    } catch (error) {
      console.error('Load goals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyStats = async () => {
    if (!user) return;

    try {
      // Load from roadmap API
      const response = await fetch(`${API_URL}/api/roadmap/user/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Calculate monthly stats from calendar data
        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
        const monthlyData = Object.entries(data.calendar)
          .filter(([date]) => date.startsWith(monthKey))
          .reduce((acc, [, count]) => acc + count, 0);

        setMonthlyStats({
          totalProblems: monthlyData,
          easyProblems: data.stats.easy || 0,
          mediumProblems: data.stats.medium || 0,
          hardProblems: data.stats.hard || 0,
          currentStreak: data.streak.current,
          longestStreak: data.streak.longest,
          categoriesCompleted: data.stats.byCategory || {},
          daysActive: Object.keys(data.calendar).filter(date => date.startsWith(monthKey)).length
        });

        // Update goal progress based on stats
        updateGoalProgress(data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const updateGoalProgress = (data) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      let progress = 0;
      
      switch (goal.type) {
        case 'problems':
          progress = data.stats.totalProblems || 0;
          break;
        case 'streak':
          progress = data.streak.current || 0;
          break;
        case 'category':
          progress = data.stats.byCategory[goal.category] || 0;
          break;
        case 'difficulty':
          progress = data.stats[goal.difficulty.toLowerCase()] || 0;
          break;
      }
      
      return { ...goal, progress: Math.min(progress, goal.target) };
    }));
  };

  const loadMonthlyRewards = () => {
    const rewards = [
      {
        id: 1,
        title: 'Monthly Champion',
        description: 'Complete all monthly goals',
        requirement: 'Complete 100% of goals',
        reward: '1000 XP + Exclusive Badge',
        icon: Crown,
        color: 'from-yellow-500 to-orange-500',
        unlocked: calculateMonthProgress() === 100
      },
      {
        id: 2,
        title: 'Consistency Master',
        description: 'Code for 20+ days this month',
        requirement: '20 active days',
        reward: '500 XP + Streak Multiplier',
        icon: Calendar,
        color: 'from-blue-500 to-purple-500',
        unlocked: monthlyStats.daysActive >= 20
      },
      {
        id: 3,
        title: 'Problem Crusher',
        description: 'Solve 50+ problems this month',
        requirement: '50 problems solved',
        reward: '750 XP + Special Title',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
        unlocked: monthlyStats.totalProblems >= 50
      },
      {
        id: 4,
        title: 'Streak Legend',
        description: 'Maintain 15+ day streak',
        requirement: '15 day streak',
        reward: '300 XP + Flame Badge',
        icon: Flame,
        color: 'from-orange-500 to-red-500',
        unlocked: monthlyStats.currentStreak >= 15
      }
    ];
    setMonthlyRewards(rewards);
  };

  const saveGoals = (goalsToSave) => {
    if (!user) return;
    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
    localStorage.setItem(`monthly_goals_${user.id}_${monthKey}`, JSON.stringify(goalsToSave));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      type: newGoal.type,
      target: parseInt(newGoal.target),
      progress: 0,
      category: newGoal.category,
      difficulty: newGoal.difficulty,
      description: newGoal.description,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    
    setShowAddGoal(false);
    setNewGoal({
      title: '',
      type: 'problems',
      target: 10,
      category: 'Arrays',
      difficulty: 'Easy',
      description: ''
    });
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const toggleGoalComplete = (goalId) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const getGoalIcon = (type) => {
    const goalType = goalTypes.find(t => t.id === type);
    return goalType ? goalType.icon : Target;
  };

  const getGoalColor = (type) => {
    const goalType = goalTypes.find(t => t.id === type);
    return goalType ? goalType.color : 'from-gray-500 to-gray-600';
  };

  const calculateMonthProgress = () => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter(g => g.progress >= g.target || g.completed).length;
    return Math.round((completedGoals / goals.length) * 100);
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const GoalCard = ({ goal }) => {
    const Icon = getGoalIcon(goal.type);
    const progress = (goal.progress / goal.target) * 100;
    const isCompleted = goal.progress >= goal.target || goal.completed;

    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 transition-all ${
        isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-gray-700/50 hover:border-gray-600'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-12 h-12 bg-gradient-to-r ${getGoalColor(goal.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">{goal.title}</h4>
              {goal.description && (
                <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {goal.type === 'category' && (
                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-purple-400">
                    {goal.category}
                  </span>
                )}
                {goal.type === 'difficulty' && (
                  <span className={`px-2 py-1 rounded ${
                    goal.difficulty === 'Easy' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                    goal.difficulty === 'Medium' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
                    'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}>
                    {goal.difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleGoalComplete(goal.id)}
              className={`p-2 rounded-lg transition-colors ${
                isCompleted ? 'bg-green-500/20 text-green-400' : 'hover:bg-gray-700 text-gray-400'
              }`}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            </button>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold text-white">
              {goal.progress} / {goal.target}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getGoalColor(goal.type)} transition-all duration-500 rounded-full`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-right">
            <span className={`text-sm font-semibold ${
              isCompleted ? 'text-green-400' : progress >= 75 ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-gray-700/50 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Monthly Goals</h2>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <Sparkles className="w-4 h-4" />
                    Track your coding journey
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-sm text-blue-100 mt-1">
                  {calculateMonthProgress()}% of goals completed
                </p>
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-700/50">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-blue-400">{monthlyStats.totalProblems}</div>
              <div className="text-sm text-gray-400 mt-1">Problems Solved</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-orange-400">{monthlyStats.currentStreak}</div>
              <div className="text-sm text-gray-400 mt-1">Current Streak</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-purple-400">{monthlyStats.daysActive}</div>
              <div className="text-sm text-gray-400 mt-1">Days Active</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-yellow-400">{goals.filter(g => g.progress >= g.target).length}</div>
              <div className="text-sm text-gray-400 mt-1">Goals Achieved</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Add Goal Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Your Goals</h3>
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Goal
              </button>
            </div>

            {/* Goals List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading goals...</p>
              </div>
            ) : goals.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No goals set for this month</p>
                <button
                  onClick={() => setShowAddGoal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all"
                >
                  Create Your First Goal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            )}

            {/* Monthly Rewards */}
            {goals.filter(g => g.progress >= g.target).length >= 3 && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Achievement Unlocked!
                    </h4>
                    <p className="text-sm text-gray-300">You've completed 3+ goals this month! Keep up the amazing work! 🎉</p>
                  </div>
                  <Medal className="w-12 h-12 text-yellow-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Create New Goal</h3>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Solve 50 problems"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {goalTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {newGoal.type === 'category' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newGoal.type === 'difficulty' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={newGoal.difficulty}
                      onChange={(e) => setNewGoal({ ...newGoal, difficulty: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description (Optional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add a description..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={addGoal}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all"
                  >
                    Create Goal
                  </button>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGoals;
