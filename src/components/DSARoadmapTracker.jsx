import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Calendar, Flame, Target, CheckCircle, Circle, Clock,
  TrendingUp, Award, Star, Zap, BookOpen, Code, Brain,
  ChevronLeft, ChevronRight, Plus, Edit, Trash2, Check,
  X, Filter, Search, BarChart3, PieChart, Activity,
  MapPin, Flag, ArrowRight, Sparkles, Trophy, Heart,
  GitBranch, Layers, Box, Database, Network, Cpu
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DSARoadmapTracker = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('calendar'); // calendar, roadmap, tasks, stats
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streakData, setStreakData] = useState({ current: 0, longest: 0, total: 0 });
  const [calendarData, setCalendarData] = useState({});
  const [roadmap, setRoadmap] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'arrays', difficulty: 'medium', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProblems: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    byCategory: {}
  });

  // DSA Categories with icons and colors
  const categories = [
    { id: 'arrays', name: 'Arrays', icon: Box, color: 'from-blue-500 to-cyan-500', problems: 50 },
    { id: 'strings', name: 'Strings', icon: Code, color: 'from-green-500 to-emerald-500', problems: 40 },
    { id: 'linkedlist', name: 'Linked List', icon: GitBranch, color: 'from-purple-500 to-pink-500', problems: 30 },
    { id: 'trees', name: 'Trees', icon: Network, color: 'from-orange-500 to-red-500', problems: 45 },
    { id: 'graphs', name: 'Graphs', icon: Layers, color: 'from-indigo-500 to-purple-500', problems: 35 },
    { id: 'dp', name: 'Dynamic Programming', icon: Brain, color: 'from-pink-500 to-rose-500', problems: 40 },
    { id: 'sorting', name: 'Sorting', icon: BarChart3, color: 'from-yellow-500 to-orange-500', problems: 25 },
    { id: 'searching', name: 'Searching', icon: Search, color: 'from-teal-500 to-cyan-500', problems: 20 },
    { id: 'stack', name: 'Stack & Queue', icon: Database, color: 'from-red-500 to-pink-500', problems: 30 },
    { id: 'heap', name: 'Heap', icon: Cpu, color: 'from-violet-500 to-purple-500', problems: 25 }
  ];

  // Load user data
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/roadmap/user/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStreakData(data.streak);
        setCalendarData(data.calendar);
        setRoadmap(data.roadmap);
        setTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/roadmap/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newTask
        })
      });

      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
        setShowAddTask(false);
        setNewTask({ title: '', category: 'arrays', difficulty: 'medium', deadline: '' });
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/roadmap/tasks/${taskId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
        loadUserData(); // Refresh streak and stats
      }
    } catch (error) {
      console.error('Toggle task error:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/roadmap/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getActivityLevel = (count) => {
    if (count === 0) return 'bg-gray-800';
    if (count <= 2) return 'bg-green-900';
    if (count <= 4) return 'bg-green-700';
    if (count <= 6) return 'bg-green-500';
    return 'bg-green-400';
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${monthKey}-${day}`;
      const activity = calendarData[dateKey] || 0;
      const isToday = day === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
            getActivityLevel(activity)
          } ${isToday ? 'ring-2 ring-blue-500' : ''} hover:scale-110 hover:shadow-lg`}
          title={`${day}: ${activity} problems solved`}
        >
          <span className="text-xs font-semibold text-white">{day}</span>
          {activity > 0 && (
            <span className="text-xs text-green-200 font-bold">{activity}</span>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                DSA Learning Roadmap
              </h1>
              <p className="text-gray-400">Track your progress, maintain streaks, and achieve your goals</p>
            </div>
            
            {/* Streak Display */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                <Flame className="w-8 h-8 text-white" />
                <div>
                  <div className="text-2xl font-black text-white">{streakData.current}</div>
                  <div className="text-xs text-orange-100">Day Streak</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                <Trophy className="w-8 h-8 text-white" />
                <div>
                  <div className="text-2xl font-black text-white">{streakData.longest}</div>
                  <div className="text-xs text-purple-100">Best Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-800/50 p-2 rounded-2xl backdrop-blur-sm">
            {[
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'roadmap', label: 'Roadmap', icon: MapPin },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle },
              { id: 'stats', label: 'Statistics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-700/50">
                <span className="text-sm text-gray-400">Less</span>
                {[0, 2, 4, 6, 8].map(count => (
                  <div
                    key={count}
                    className={`w-4 h-4 rounded ${getActivityLevel(count)}`}
                  ></div>
                ))}
                <span className="text-sm text-gray-400">More</span>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h3 className="font-semibold text-white">Today's Goal</h3>
                </div>
                <div className="text-3xl font-black text-blue-400">3</div>
                <div className="text-sm text-gray-400">Problems to solve</div>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="font-semibold text-white">Completed</h3>
                </div>
                <div className="text-3xl font-black text-green-400">{calendarData[`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`] || 0}</div>
                <div className="text-sm text-gray-400">Problems today</div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <h3 className="font-semibold text-white">Total</h3>
                </div>
                <div className="text-3xl font-black text-purple-400">{streakData.total}</div>
                <div className="text-sm text-gray-400">All time</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                Your Learning Path
              </h2>

              <div className="space-y-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  const completed = stats.byCategory[category.id] || 0;
                  const progress = (completed / category.problems) * 100;

                  return (
                    <div key={category.id} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">{category.name}</h3>
                            <p className="text-sm text-gray-400">{completed} / {category.problems} problems</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {Math.round(progress)}%
                          </div>
                          <div className="text-xs text-gray-400">Complete</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500 rounded-full`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Your Tasks
                </h2>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>

              {/* Task list */}
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No tasks yet. Add your first task!</p>
                  </div>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-gray-900/50 rounded-xl p-4 border transition-all ${
                        task.completed
                          ? 'border-green-500/30 bg-green-900/10'
                          : 'border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-blue-500'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>

                        <div className="flex-1">
                          <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                              task.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {task.difficulty}
                            </span>
                            <span className="text-xs text-gray-400">{task.category}</span>
                            {task.deadline && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Difficulty breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-purple-400" />
                By Difficulty
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Easy', count: stats.easy, color: 'from-green-500 to-emerald-500', total: 100 },
                  { label: 'Medium', count: stats.medium, color: 'from-yellow-500 to-orange-500', total: 150 },
                  { label: 'Hard', count: stats.hard, color: 'from-red-500 to-pink-500', total: 80 }
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">{item.label}</span>
                      <span className="text-white font-bold">{item.count} / {item.total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`}
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                By Category
              </h3>
              <div className="space-y-3">
                {categories.slice(0, 5).map(category => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span className="text-gray-300">{category.name}</span>
                    <span className="font-bold text-white">{stats.byCategory[category.id] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Add New Task</h3>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Task Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Solve Two Sum problem"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={newTask.difficulty}
                      onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Deadline (Optional)</label>
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={addTask}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => setShowAddTask(false)}
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
    </div>
  );
};

export default DSARoadmapTracker;
