import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Calendar, Clock, Target, CheckCircle, Plus, X, 
  Bell, Repeat, Edit2, Trash2, Save, Zap, Sparkles,
  TrendingUp, Award, BookOpen, Brain, Flame, Star, Code
} from 'lucide-react';
import { dsaProblems } from '../data/dsaProblems';

const PracticeSchedulerRedesigned = ({ onClose }) => {
  const { user } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'smart', 'stats'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState(null); // Track which schedule is expanded to show problems
  
  const [newSchedule, setNewSchedule] = useState({
    day: 'monday',
    time: '09:00',
    duration: 60,
    problemCount: 3,
    difficulty: 'medium',
    category: 'arrays',
    repeat: true,
    reminder: true,
    problems: [] // Specific problems to solve
  });

  // Smart schedule preferences - user-specific
  const [userPreferences, setUserPreferences] = useState({
    targetCompany: 'google',
    currentLevel: 'beginner',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    dailyHours: 2,
    focusAreas: ['arrays', 'strings', 'trees'],
    weeklyGoal: 15
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const difficulties = ['easy', 'medium', 'hard', 'mixed'];
  const categories = [
    'arrays', 'strings', 'linked-lists', 'trees', 'graphs', 
    'dynamic-programming', 'backtracking', 'greedy', 'sorting', 'searching'
  ];

  const companies = ['google', 'amazon', 'microsoft', 'meta', 'apple', 'netflix'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  // Load user-specific schedules and preferences from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    
    const loadSchedules = () => {
      try {
        const saved = localStorage.getItem(`practice_schedules_${user.id}`);
        console.log('Loading schedules for user:', user.id, saved);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('Parsed schedules:', parsed);
          setSchedules(parsed);
        }
      } catch (error) {
        console.error('Error loading schedules:', error);
      }
    };

    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem(`user_preferences_${user.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserPreferences(parsed);
          console.log('Loaded user preferences:', parsed);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    
    loadSchedules();
    loadPreferences();
  }, [user?.id]); // Only run when user changes

  // Save schedules to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (user?.id && schedules.length > 0) {
      console.log('Saving schedules for user:', user.id, schedules);
      localStorage.setItem(`practice_schedules_${user.id}`, JSON.stringify(schedules));
    }
  }, [schedules, user?.id]);

  // Save preferences whenever they change (user-specific)
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(userPreferences));
      console.log('Saved user preferences:', userPreferences);
    }
  }, [userPreferences, user?.id]);

  const addSchedule = () => {
    // Validate inputs
    if (!newSchedule.day || !newSchedule.time || !newSchedule.duration || !newSchedule.problemCount) {
      alert('Please fill in all required fields');
      return;
    }

    if (newSchedule.duration < 15 || newSchedule.duration > 300) {
      alert('Duration must be between 15 and 300 minutes');
      return;
    }

    if (newSchedule.problemCount < 1 || newSchedule.problemCount > 20) {
      alert('Problem count must be between 1 and 20');
      return;
    }

    // Get recommended problems for this schedule
    const recommendedProblems = getRecommendedProblems(
      newSchedule.category,
      newSchedule.difficulty,
      newSchedule.problemCount
    );

    const schedule = {
      ...newSchedule,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      problems: recommendedProblems
    };
    
    setSchedules([...schedules, schedule]);
    setShowAddForm(false);
    resetForm();
    
    // Show success message
    console.log('Schedule added successfully:', schedule);
    alert(`✅ Schedule created with ${recommendedProblems.length} recommended problems!`);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const toggleComplete = (id) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const resetForm = () => {
    setNewSchedule({
      day: 'monday',
      time: '09:00',
      duration: 60,
      problemCount: 3,
      difficulty: 'medium',
      category: 'arrays',
      repeat: true,
      reminder: true
    });
  };

  const getDaySchedules = (day) => {
    return schedules.filter(s => s.day === day);
  };

  const getStats = () => {
    const total = schedules.length;
    const completed = schedules.filter(s => s.completed).length;
    const pending = total - completed;
    const totalProblems = schedules.reduce((sum, s) => sum + s.problemCount, 0);
    const completedProblems = schedules.filter(s => s.completed).reduce((sum, s) => sum + s.problemCount, 0);
    
    return { total, completed, pending, totalProblems, completedProblems };
  };

  // Get recommended problems based on category and difficulty
  const getRecommendedProblems = (category, difficulty, count) => {
    const categoryProblems = dsaProblems.filter(p => 
      p.category?.toLowerCase().includes(category.toLowerCase()) ||
      p.tags?.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );

    let filteredProblems = categoryProblems;
    if (difficulty !== 'mixed') {
      filteredProblems = categoryProblems.filter(p => 
        p.difficulty?.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Shuffle and take requested count
    const shuffled = filteredProblems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty
    }));
  };

  const stats = getStats();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const generateSmartSchedule = () => {
    const { targetCompany, currentLevel, availableDays, dailyHours, focusAreas, weeklyGoal } = userPreferences;
    
    // Validate preferences
    if (availableDays.length === 0) {
      alert('Please select at least one available day');
      return;
    }

    if (focusAreas.length === 0) {
      alert('Please select at least one focus area');
      return;
    }

    const templates = {
      beginner: { problemsPerDay: 2, duration: 90, times: ['09:00', '19:00'] },
      intermediate: { problemsPerDay: 3, duration: 120, times: ['08:00', '18:00'] },
      advanced: { problemsPerDay: 4, duration: 150, times: ['07:00', '20:00'] }
    };

    const template = templates[currentLevel];
    const newSchedules = [];

    availableDays.forEach((day, index) => {
      const timeSlot = template.times[index % 2];
      focusAreas.forEach((category, catIndex) => {
        if (catIndex < 2) { // Limit to 2 categories per day
          // Get recommended problems for this session
          const recommendedProblems = getRecommendedProblems(
            category,
            currentLevel === 'beginner' ? 'easy' : currentLevel === 'intermediate' ? 'medium' : 'mixed',
            template.problemsPerDay
          );

          newSchedules.push({
            id: Date.now() + index * 1000 + catIndex,
            day,
            time: timeSlot,
            duration: template.duration,
            problemCount: template.problemsPerDay,
            difficulty: currentLevel === 'beginner' ? 'easy' : currentLevel === 'intermediate' ? 'medium' : 'mixed',
            category,
            repeat: true,
            reminder: true,
            completed: false,
            createdAt: new Date().toISOString(),
            problems: recommendedProblems
          });
        }
      });
    });

    setSchedules([...schedules, ...newSchedules]);
    setActiveTab('calendar');
    
    // Show success message
    alert(`✅ Generated ${newSchedules.length} practice sessions with specific problem recommendations! Check the Calendar tab.`);
    console.log('Smart schedule generated:', newSchedules);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          console.log('Backdrop clicked');
          onClose();
        }
      }}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => {
          // Prevent clicks inside modal from closing it
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                Practice Scheduler
              </h2>
              <p className="text-white/80 mt-1">Plan your coding journey with AI-powered scheduling</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Calendar tab clicked');
                setActiveTab('calendar');
              }}
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'calendar' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendar
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('AI Schedule tab clicked');
                setActiveTab('smart');
              }}
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'smart' 
                  ? 'bg-white text-purple-600' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Schedule
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Stats tab clicked');
                setActiveTab('stats');
              }}
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'stats' 
                  ? 'bg-white text-pink-600' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Stats
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                  <div className="text-sm text-gray-300">Total Sessions</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                  <div className="text-sm text-gray-300">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                  <div className="text-sm text-gray-300">Pending</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{stats.completedProblems}/{stats.totalProblems}</div>
                  <div className="text-sm text-gray-300">Problems</div>
                </div>
              </div>

              {/* Add Schedule Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Add New Schedule button clicked, current state:', showAddForm);
                  setShowAddForm(!showAddForm);
                }}
                type="button"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                {showAddForm ? 'Hide Form' : 'Add New Schedule'}
              </button>

              {/* Add Form */}
              {showAddForm && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Create Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Day</label>
                      <select
                        value={newSchedule.day}
                        onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Time</label>
                      <input
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration (min)</label>
                      <input
                        type="number"
                        value={newSchedule.duration}
                        onChange={(e) => setNewSchedule({...newSchedule, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Problems</label>
                      <input
                        type="number"
                        value={newSchedule.problemCount}
                        onChange={(e) => setNewSchedule({...newSchedule, problemCount: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                      <select
                        value={newSchedule.difficulty}
                        onChange={(e) => setNewSchedule({...newSchedule, difficulty: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Category</label>
                      <select
                        value={newSchedule.category}
                        onChange={(e) => setNewSchedule({...newSchedule, category: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500/50"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Save button clicked');
                        addSchedule();
                      }}
                      type="button"
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Schedule
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAddForm(false);
                        resetForm();
                      }}
                      type="button"
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Weekly Schedule */}
              <div className="space-y-3">
                {days.map(day => {
                  const daySchedules = getDaySchedules(day);
                  return (
                    <div key={day} className="bg-slate-800/30 rounded-xl border border-white/5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold capitalize flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            {day}
                          </h3>
                          <span className="text-sm text-gray-400">{daySchedules.length} sessions</span>
                        </div>
                      </div>
                      <div className="p-4">
                        {daySchedules.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">No sessions scheduled</p>
                        ) : (
                          <div className="space-y-2">
                            {daySchedules.map(schedule => (
                              <div
                                key={schedule.id}
                                className={`rounded-lg border transition-all ${
                                  schedule.completed 
                                    ? 'bg-green-500/10 border-green-500/30' 
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                }`}
                              >
                                <div className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          console.log('Toggle complete:', schedule.id);
                                          toggleComplete(schedule.id);
                                        }}
                                        type="button"
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all active:scale-90 ${
                                          schedule.completed 
                                            ? 'bg-green-500 border-green-500' 
                                            : 'border-gray-400 hover:border-green-400'
                                        }`}
                                      >
                                        {schedule.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                      </button>
                                      <div 
                                        className="flex-1 cursor-pointer"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id);
                                        }}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <Clock className="w-3 h-3 text-blue-400" />
                                          <span className="text-sm font-semibold">{schedule.time}</span>
                                          <span className="text-xs text-gray-400">• {schedule.duration} min</span>
                                          <span className={`px-2 py-0.5 rounded text-xs border ${getDifficultyColor(schedule.difficulty)}`}>
                                            {schedule.difficulty}
                                          </span>
                                        </div>
                                        <div className="text-xs text-gray-400 flex items-center gap-2">
                                          <Code className="w-3 h-3" />
                                          {schedule.problemCount} problems • {schedule.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                          {schedule.problems && schedule.problems.length > 0 && (
                                            <span className="text-blue-400 ml-1">
                                              (Click to {expandedSchedule === schedule.id ? 'hide' : 'view'} problems)
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Delete schedule:', schedule.id);
                                        if (confirm('Are you sure you want to delete this schedule?')) {
                                          deleteSchedule(schedule.id);
                                        }
                                      }}
                                      type="button"
                                      className="p-1.5 hover:bg-red-500/20 rounded transition-all active:scale-90"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Problems List */}
                                {expandedSchedule === schedule.id && schedule.problems && schedule.problems.length > 0 && (
                                  <div className="border-t border-white/10 p-3 bg-slate-900/50">
                                    <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      Recommended Problems:
                                    </h4>
                                    <div className="space-y-1.5">
                                      {schedule.problems.map((problem, idx) => (
                                        <div 
                                          key={problem.id}
                                          className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-white/5 hover:border-blue-500/30 transition-all"
                                        >
                                          <div className="flex items-center gap-2 flex-1">
                                            <span className="text-xs text-gray-500 font-mono">#{idx + 1}</span>
                                            <span className="text-sm text-gray-200">{problem.title}</span>
                                          </div>
                                          <span className={`px-2 py-0.5 rounded text-xs border ${getDifficultyColor(problem.difficulty?.toLowerCase())}`}>
                                            {problem.difficulty}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'smart' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  AI-Powered Schedule Generator
                </h3>
                <p className="text-gray-300 text-sm">Let AI create an optimized practice schedule based on your goals</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Target Company</label>
                  <select
                    value={userPreferences.targetCompany}
                    onChange={(e) => setUserPreferences({...userPreferences, targetCompany: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500/50"
                  >
                    {companies.map(company => (
                      <option key={company} value={company}>{company.charAt(0).toUpperCase() + company.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Current Level</label>
                  <select
                    value={userPreferences.currentLevel}
                    onChange={(e) => setUserPreferences({...userPreferences, currentLevel: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500/50"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Daily Hours</label>
                  <input
                    type="number"
                    value={userPreferences.dailyHours}
                    onChange={(e) => setUserPreferences({...userPreferences, dailyHours: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Weekly Goal</label>
                  <input
                    type="number"
                    value={userPreferences.weeklyGoal}
                    onChange={(e) => setUserPreferences({...userPreferences, weeklyGoal: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-800 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        const newDays = userPreferences.availableDays.includes(day)
                          ? userPreferences.availableDays.filter(d => d !== day)
                          : [...userPreferences.availableDays, day];
                        setUserPreferences({...userPreferences, availableDays: newDays});
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        userPreferences.availableDays.includes(day)
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Focus Areas 
                  <span className="text-xs text-gray-500 ml-2">
                    ({userPreferences.focusAreas.length} selected)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const newAreas = userPreferences.focusAreas.includes(cat)
                          ? userPreferences.focusAreas.filter(a => a !== cat)
                          : [...userPreferences.focusAreas, cat];
                        setUserPreferences({...userPreferences, focusAreas: newAreas});
                      }}
                      type="button"
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                        userPreferences.focusAreas.includes(cat)
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Generate AI Schedule clicked');
                  generateSmartSchedule();
                }}
                type="button"
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Sparkles className="w-6 h-6" />
                Generate AI Schedule
              </button>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                  <Flame className="w-8 h-8 text-orange-400 mb-2" />
                  <div className="text-3xl font-bold text-blue-400">0</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                  <Award className="w-8 h-8 text-yellow-400 mb-2" />
                  <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                  <div className="text-sm text-gray-300">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <Star className="w-8 h-8 text-yellow-400 mb-2" />
                  <div className="text-3xl font-bold text-purple-400">{stats.completedProblems}</div>
                  <div className="text-sm text-gray-300">Problems Solved</div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Progress Overview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="text-white font-semibold">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Problems Progress</span>
                      <span className="text-white font-semibold">
                        {stats.completedProblems} / {stats.totalProblems}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${stats.totalProblems > 0 ? (stats.completedProblems / stats.totalProblems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeSchedulerRedesigned;
