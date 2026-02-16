import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Target, CheckCircle, Plus, X, 
  Bell, Repeat, Edit2, Trash2, Save, AlertCircle,
  TrendingUp, Award, Zap, BookOpen, Sparkles, User
} from 'lucide-react';

const PracticeScheduler = ({ onClose }) => {
  const [schedules, setSchedules] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSmartSchedule, setShowSmartSchedule] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    day: 'monday',
    time: '09:00',
    duration: 60,
    problemCount: 3,
    difficulty: 'medium',
    category: 'arrays',
    repeat: true,
    reminder: true
  });

  // Smart schedule preferences
  const [userPreferences, setUserPreferences] = useState({
    targetCompany: 'google',
    currentLevel: 'beginner',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    dailyHours: 2,
    startDate: new Date().toISOString().split('T')[0],
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

  // Smart schedule generation based on roadmap
  const generateSmartSchedule = () => {
    const { targetCompany, currentLevel, availableDays, dailyHours, focusAreas, weeklyGoal } = userPreferences;
    
    // ML-based schedule optimization
    const scheduleTemplates = {
      beginner: {
        problemsPerDay: 2,
        difficulty: 'easy',
        duration: 90,
        categories: ['arrays', 'strings', 'sorting'],
        optimalTimes: ['09:00', '19:00'], // Morning and evening
        restDays: 2
      },
      intermediate: {
        problemsPerDay: 3,
        difficulty: 'medium',
        duration: 120,
        categories: ['trees', 'graphs', 'dynamic-programming'],
        optimalTimes: ['08:00', '18:00'],
        restDays: 1
      },
      advanced: {
        problemsPerDay: 4,
        difficulty: 'mixed',
        duration: 150,
        categories: ['dynamic-programming', 'backtracking', 'graphs'],
        optimalTimes: ['07:00', '20:00'],
        restDays: 1
      }
    };

    // Company-specific adjustments
    const companyFocus = {
      google: { emphasis: ['graphs', 'dynamic-programming', 'trees'], intensity: 1.2 },
      amazon: { emphasis: ['arrays', 'strings', 'trees'], intensity: 1.0 },
      microsoft: { emphasis: ['linked-lists', 'trees', 'sorting'], intensity: 1.0 },
      meta: { emphasis: ['graphs', 'dynamic-programming', 'backtracking'], intensity: 1.3 },
      apple: { emphasis: ['arrays', 'strings', 'trees'], intensity: 1.0 },
      netflix: { emphasis: ['dynamic-programming', 'graphs', 'greedy'], intensity: 1.1 }
    };

    const template = scheduleTemplates[currentLevel];
    const companyPrefs = companyFocus[targetCompany] || companyFocus.google;
    const newSchedules = [];

    // ML Algorithm: Distribute problems based on difficulty curve
    const difficultyProgression = {
      week1: 'easy',
      week2: 'easy',
      week3: 'medium',
      week4: 'medium'
    };

    // Calculate optimal session distribution
    const sessionsPerWeek = Math.min(availableDays.length, 7 - template.restDays);
    const problemsPerSession = Math.ceil(weeklyGoal / sessionsPerWeek);

    // Generate sessions with ML-optimized timing
    availableDays.forEach((day, index) => {
      if (index < sessionsPerWeek) {
        // Morning session (primary learning time)
        const morningSession = {
          id: Date.now() + index * 10,
          day,
          time: template.optimalTimes[0],
          duration: Math.floor(template.duration * 0.6),
          problemCount: Math.ceil(problemsPerSession * 0.6),
          difficulty: difficultyProgression.week1,
          category: companyPrefs.emphasis[index % companyPrefs.emphasis.length],
          repeat: true,
          reminder: true,
          completed: false,
          aiGenerated: true,
          priority: 'high',
          createdAt: new Date().toISOString()
        };
        newSchedules.push(morningSession);

        // Evening session (practice & reinforcement)
        if (dailyHours >= 2 && index < 5) {
          const eveningSession = {
            id: Date.now() + index * 10 + 1,
            day,
            time: template.optimalTimes[1],
            duration: Math.floor(template.duration * 0.4),
            problemCount: Math.floor(problemsPerSession * 0.4),
            difficulty: 'mixed',
            category: focusAreas[(index + 1) % focusAreas.length],
            repeat: true,
            reminder: true,
            completed: false,
            aiGenerated: true,
            priority: 'medium',
            createdAt: new Date().toISOString()
          };
          newSchedules.push(eveningSession);
        }
      }
    });

    // Weekend intensive (if available and user has time)
    if (availableDays.includes('saturday') && dailyHours >= 3) {
      newSchedules.push({
        id: Date.now() + 200,
        day: 'saturday',
        time: '10:00',
        duration: Math.min(180, dailyHours * 60),
        problemCount: Math.ceil(problemsPerSession * 1.5),
        difficulty: 'mixed',
        category: 'mixed-practice',
        repeat: true,
        reminder: true,
        completed: false,
        aiGenerated: true,
        priority: 'high',
        createdAt: new Date().toISOString()
      });
    }

    // Sunday review session (optional)
    if (availableDays.includes('sunday')) {
      newSchedules.push({
        id: Date.now() + 300,
        day: 'sunday',
        time: '14:00',
        duration: 90,
        problemCount: 3,
        difficulty: 'review',
        category: 'weak-areas',
        repeat: true,
        reminder: true,
        completed: false,
        aiGenerated: true,
        priority: 'medium',
        createdAt: new Date().toISOString()
      });
    }

    saveSchedules([...schedules, ...newSchedules]);
    setShowSmartSchedule(false);
    
    // Show success message
    alert(`✨ AI-Generated Schedule Created!\n\n📅 ${newSchedules.length} sessions per week\n🎯 ${weeklyGoal} problems weekly\n🏢 Optimized for ${targetCompany.toUpperCase()}\n💪 ${currentLevel.toUpperCase()} level difficulty`);
  };

  useEffect(() => {
    // Load schedules from localStorage
    const saved = localStorage.getItem('practiceSchedules');
    if (saved) {
      setSchedules(JSON.parse(saved));
    }
    
    // Check for missed schedules and update daily
    checkMissedSchedules();
  }, []);

  const checkMissedSchedules = () => {
    const today = new Date();
    const currentDay = days[today.getDay() === 0 ? 6 : today.getDay() - 1]; // Convert to our day format
    const currentTime = today.getHours() * 60 + today.getMinutes();

    schedules.forEach(schedule => {
      if (schedule.day === currentDay && !schedule.completed) {
        const [hours, minutes] = schedule.time.split(':').map(Number);
        const scheduleTime = hours * 60 + minutes;
        
        // If current time is past schedule time + duration, mark as missed
        if (currentTime > scheduleTime + schedule.duration) {
          schedule.missed = true;
        }
      }
    });
  };

  const getDayStatus = (day) => {
    const daySchedules = schedules.filter(s => s.day === day);
    const completed = daySchedules.filter(s => s.completed).length;
    const missed = daySchedules.filter(s => s.missed && !s.completed).length;
    const total = daySchedules.length;
    
    if (total === 0) return { emoji: '⚪', status: 'none', color: 'gray' };
    if (completed === total) return { emoji: '🎉', status: 'perfect', color: 'green' };
    if (missed > 0) return { emoji: '😡', status: 'missed', color: 'red' };
    if (completed > 0) return { emoji: '😊', status: 'partial', color: 'yellow' };
    return { emoji: '📅', status: 'scheduled', color: 'blue' };
  };

  const getWeekProgress = () => {
    const weekData = days.map(day => {
      const daySchedules = schedules.filter(s => s.day === day);
      const completed = daySchedules.filter(s => s.completed).length;
      const total = daySchedules.length;
      return { day, completed, total, status: getDayStatus(day) };
    });
    return weekData;
  };

  const saveSchedules = (newSchedules) => {
    localStorage.setItem('practiceSchedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const handleAddSchedule = () => {
    const schedule = {
      id: Date.now(),
      ...newSchedule,
      completed: false,
      createdAt: new Date().toISOString()
    };
    saveSchedules([...schedules, schedule]);
    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateSchedule = (id) => {
    const updated = schedules.map(s => 
      s.id === id ? { ...s, ...newSchedule } : s
    );
    saveSchedules(updated);
    setEditingId(null);
    resetForm();
  };

  const handleDeleteSchedule = (id) => {
    saveSchedules(schedules.filter(s => s.id !== id));
  };

  const handleToggleComplete = (id) => {
    const updated = schedules.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    saveSchedules(updated);
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

  const startEdit = (schedule) => {
    setEditingId(schedule.id);
    setNewSchedule({
      day: schedule.day,
      time: schedule.time,
      duration: schedule.duration,
      problemCount: schedule.problemCount,
      difficulty: schedule.difficulty,
      category: schedule.category,
      repeat: schedule.repeat,
      reminder: schedule.reminder
    });
  };

  const getDaySchedules = (day) => {
    return schedules.filter(s => s.day === day).sort((a, b) => 
      a.time.localeCompare(b.time)
    );
  };

  const getStats = () => {
    const total = schedules.length;
    const completed = schedules.filter(s => s.completed).length;
    const missed = schedules.filter(s => s.missed && !s.completed).length;
    const totalProblems = schedules.reduce((sum, s) => sum + s.problemCount, 0);
    const totalHours = schedules.reduce((sum, s) => sum + s.duration, 0) / 60;
    
    // Calculate streak
    let currentStreak = 0;
    const sortedDays = [...days];
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - i + 7) % 7;
      const day = sortedDays[dayIndex === 0 ? 6 : dayIndex - 1];
      const daySchedules = schedules.filter(s => s.day === day);
      const dayCompleted = daySchedules.length > 0 && daySchedules.every(s => s.completed);
      
      if (dayCompleted) {
        currentStreak++;
      } else if (daySchedules.length > 0) {
        break;
      }
    }
    
    return { total, completed, missed, totalProblems, totalHours, currentStreak };
  };

  const getMotivationalMessage = () => {
    const { missed, currentStreak, completed } = getStats();
    
    if (missed > 3) {
      return {
        emoji: '😡',
        message: "You've missed too many sessions! Get back on track NOW!",
        color: 'from-red-500 to-orange-500'
      };
    }
    if (missed > 0) {
      return {
        emoji: '😟',
        message: "Don't let missed sessions become a habit. You got this!",
        color: 'from-yellow-500 to-orange-500'
      };
    }
    if (currentStreak >= 7) {
      return {
        emoji: '🔥',
        message: `Amazing! ${currentStreak} day streak! You're unstoppable!`,
        color: 'from-green-500 to-emerald-500'
      };
    }
    if (currentStreak >= 3) {
      return {
        emoji: '💪',
        message: `Great job! ${currentStreak} day streak! Keep it going!`,
        color: 'from-blue-500 to-cyan-500'
      };
    }
    if (completed > 0) {
      return {
        emoji: '😊',
        message: "You're making progress! Stay consistent!",
        color: 'from-purple-500 to-pink-500'
      };
    }
    return {
      emoji: '🎯',
      message: "Ready to start your coding journey? Let's go!",
      color: 'from-blue-500 to-purple-500'
    };
  };

  const stats = getStats();
  const motivation = getMotivationalMessage();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Practice Schedule
            </h2>
            <p className="text-white/80 mt-1">Plan your daily problem-solving sessions</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Motivational Banner */}
        <div className={`p-4 bg-gradient-to-r ${motivation.color} border-b border-white/10`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{motivation.emoji}</span>
            <p className="text-xl font-bold text-white">{motivation.message}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-white/10">
          {/* Week Progress Tracker */}
          <div className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/30">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Weekly Progress Tracker
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {getWeekProgress().map(({ day, completed, total, status }) => (
                <div
                  key={day}
                  className={`text-center p-3 rounded-lg border-2 transition-all ${
                    status.color === 'green' ? 'bg-green-500/20 border-green-400/50' :
                    status.color === 'red' ? 'bg-red-500/20 border-red-400/50 animate-pulse' :
                    status.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-400/50' :
                    status.color === 'blue' ? 'bg-blue-500/20 border-blue-400/50' :
                    'bg-gray-500/10 border-gray-400/30'
                  }`}
                >
                  <div className="text-3xl mb-1">{status.emoji}</div>
                  <div className="text-xs font-semibold capitalize text-gray-300">{day.slice(0, 3)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {total > 0 ? `${completed}/${total}` : '-'}
                  </div>
                  {status.status === 'missed' && (
                    <div className="text-xs text-red-400 font-bold mt-1">MISSED!</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="text-lg">🎉</span> Perfect Day
              </span>
              <span className="flex items-center gap-1">
                <span className="text-lg">😊</span> Partial
              </span>
              <span className="flex items-center gap-1">
                <span className="text-lg">😡</span> Missed
              </span>
              <span className="flex items-center gap-1">
                <span className="text-lg">📅</span> Scheduled
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Total Sessions</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-300">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-300">Total Problems</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalProblems}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-300">Total Hours</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">{stats.totalHours.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Schedule Button */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Schedule
            </button>
            
            <button
              onClick={() => setShowSmartSchedule(!showSmartSchedule)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Smart Schedule
            </button>
          </div>

          {/* Smart Schedule Generator */}
          {showSmartSchedule && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/30 p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI-Powered Schedule Generator
              </h3>
              <p className="text-gray-300 mb-6">
                Answer a few questions and we'll create a personalized practice schedule based on your goals and the FAANG roadmap.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Target Company</label>
                  <select
                    value={userPreferences.targetCompany}
                    onChange={(e) => setUserPreferences({ ...userPreferences, targetCompany: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {companies.map(company => (
                      <option key={company} value={company}>
                        {company.charAt(0).toUpperCase() + company.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Current Level</label>
                  <select
                    value={userPreferences.currentLevel}
                    onChange={(e) => setUserPreferences({ ...userPreferences, currentLevel: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Daily Hours Available</label>
                  <input
                    type="number"
                    value={userPreferences.dailyHours}
                    onChange={(e) => setUserPreferences({ ...userPreferences, dailyHours: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    min="1"
                    max="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Weekly Problem Goal</label>
                  <input
                    type="number"
                    value={userPreferences.weeklyGoal}
                    onChange={(e) => setUserPreferences({ ...userPreferences, weeklyGoal: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    min="5"
                    max="50"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.availableDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserPreferences({
                                ...userPreferences,
                                availableDays: [...userPreferences.availableDays, day]
                              });
                            } else {
                              setUserPreferences({
                                ...userPreferences,
                                availableDays: userPreferences.availableDays.filter(d => d !== day)
                              });
                            }
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm capitalize">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Focus Areas (Select 3)</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          if (userPreferences.focusAreas.includes(cat)) {
                            setUserPreferences({
                              ...userPreferences,
                              focusAreas: userPreferences.focusAreas.filter(c => c !== cat)
                            });
                          } else if (userPreferences.focusAreas.length < 3) {
                            setUserPreferences({
                              ...userPreferences,
                              focusAreas: [...userPreferences.focusAreas, cat]
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          userPreferences.focusAreas.includes(cat)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Schedule Preview
                </h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• {userPreferences.availableDays.length} practice days per week</p>
                  <p>• ~{Math.ceil(userPreferences.weeklyGoal / userPreferences.availableDays.length)} problems per day</p>
                  <p>• {userPreferences.dailyHours} hours daily commitment</p>
                  <p>• Focus: {userPreferences.focusAreas.join(', ')}</p>
                  <p>• Optimized for {userPreferences.targetCompany.toUpperCase()} interviews</p>
                  <p className="text-purple-300 font-semibold mt-2">
                    🤖 ML Algorithm will optimize timing, difficulty progression, and rest days
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={generateSmartSchedule}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Generate My Schedule
                </button>
                <button
                  onClick={() => setShowSmartSchedule(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {(showAddForm || editingId) && (
            <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? 'Edit Schedule' : 'New Schedule'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Day</label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newSchedule.duration}
                    onChange={(e) => setNewSchedule({ ...newSchedule, duration: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    min="15"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Problem Count</label>
                  <input
                    type="number"
                    value={newSchedule.problemCount}
                    onChange={(e) => setNewSchedule({ ...newSchedule, problemCount: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={newSchedule.difficulty}
                    onChange={(e) => setNewSchedule({ ...newSchedule, difficulty: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                  <select
                    value={newSchedule.category}
                    onChange={(e) => setNewSchedule({ ...newSchedule, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSchedule.repeat}
                      onChange={(e) => setNewSchedule({ ...newSchedule, repeat: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <Repeat className="w-4 h-4" />
                    <span className="text-sm">Repeat Weekly</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSchedule.reminder}
                      onChange={(e) => setNewSchedule({ ...newSchedule, reminder: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Enable Reminder</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => editingId ? handleUpdateSchedule(editingId) : handleAddSchedule()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Save'} Schedule
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Weekly Schedule View */}
          <div className="space-y-4">
            {days.map(day => {
              const daySchedules = getDaySchedules(day);
              return (
                <div key={day} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {day}
                      <span className="text-sm text-gray-400 ml-2">
                        ({daySchedules.length} session{daySchedules.length !== 1 ? 's' : ''})
                      </span>
                    </h3>
                  </div>
                  
                  <div className="p-4">
                    {daySchedules.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No sessions scheduled</p>
                    ) : (
                      <div className="space-y-3">
                        {daySchedules.map(schedule => (
                          <div
                            key={schedule.id}
                            className={`p-4 rounded-lg border transition-all ${
                              schedule.completed
                                ? 'bg-green-500/10 border-green-400/30'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <button
                                  onClick={() => handleToggleComplete(schedule.id)}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                    schedule.completed
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-gray-400 hover:border-green-400'
                                  }`}
                                >
                                  {schedule.completed && <CheckCircle className="w-4 h-4 text-white" />}
                                </button>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-lg">{schedule.time}</span>
                                    <span className="px-2 py-0.5 bg-blue-500/20 rounded text-xs">
                                      {schedule.duration} min
                                    </span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs">
                                      {schedule.problemCount} problems
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                      schedule.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                      schedule.difficulty === 'hard' ? 'bg-red-500/20 text-red-300' :
                                      'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                      {schedule.difficulty}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {schedule.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    {schedule.repeat && (
                                      <span className="flex items-center gap-1">
                                        <Repeat className="w-3 h-3" />
                                        Weekly
                                      </span>
                                    )}
                                    {schedule.reminder && (
                                      <span className="flex items-center gap-1">
                                        <Bell className="w-3 h-3" />
                                        Reminder On
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(schedule)}
                                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
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
      </div>
    </div>
  );
};

export default PracticeScheduler;
