import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Code, Flame, Trophy, Calendar, Target, Award,
  BarChart3, Clock, CheckCircle, Star, Zap, Crown, Medal,
  Activity, PieChart, ChevronRight,
  ArrowUp, ArrowDown, Minus, RefreshCw
} from 'lucide-react';
import { useClerkProgress } from '../hooks/useClerkProgress';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Dashboard = () => {
  const { user } = useUser();
  const { getProgressStats } = useClerkProgress();
  const [roadmapData, setRoadmapData] = useState(null);
  const [dailyProgress, setDailyProgress] = useState(null);
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (user) {
      loadAllData();
      
      const interval = setInterval(() => {
        loadAllData(true); // Silent refresh
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [user]);

  // Listen for storage changes (when data is updated in other tabs/components)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.includes(user?.id)) {
        console.log('📊 Dashboard: Detected data change, refreshing...');
        loadAllData(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from same tab
    const handleCustomUpdate = () => {
      console.log('📊 Dashboard: Received update event, refreshing...');
      loadAllData(true);
    };
    
    window.addEventListener('dashboardUpdate', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboardUpdate', handleCustomUpdate);
    };
  }, [user]);

  const loadAllData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    
    try {
      // Load roadmap data
      const roadmapRes = await fetch(`${API_URL}/api/roadmap/user/${user.id}`);
      const roadmapData = await roadmapRes.json();
      if (roadmapData.success) {
        setRoadmapData(roadmapData);
      }

      // Load daily progress
      const dailySaved = localStorage.getItem(`daily_progress_${user.id}`);
      if (dailySaved) {
        setDailyProgress(JSON.parse(dailySaved));
      }

      // Load monthly goals
      const monthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
      const goalsSaved = localStorage.getItem(`monthly_goals_${user.id}_${monthKey}`);
      if (goalsSaved) {
        setMonthlyGoals(JSON.parse(goalsSaved));
      }

      // Load certificates
      const certsSaved = localStorage.getItem(`dsa_certificates_${user.id}`);
      if (certsSaved) {
        setCertificates(JSON.parse(certsSaved));
      }

      // Calculate stats
      const clerkStats = getProgressStats();
      setStats(clerkStats);

      // Generate recent activity
      generateRecentActivity();
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    loadAllData();
  };

  const generateRecentActivity = () => {
    const activities = [
      { type: 'solved', text: 'Solved Two Sum', time: '2 hours ago', icon: CheckCircle, color: 'text-green-400' },
      { type: 'streak', text: '7-day streak achieved!', time: '1 day ago', icon: Flame, color: 'text-orange-400' },
      { type: 'goal', text: 'Monthly goal completed', time: '2 days ago', icon: Target, color: 'text-blue-400' },
      { type: 'cert', text: 'Earned DSA Beginner certificate', time: '3 days ago', icon: Award, color: 'text-purple-400' }
    ];
    setRecentActivity(activities);
  };

  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {change > 0 ? <ArrowUp className="w-4 h-4" /> : change < 0 ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.firstName || 'Coder'}! 👋
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-500">
                  • Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all disabled:opacity-50"
              title="Refresh dashboard data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-4 py-2 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{roadmapData?.streak?.current || 0} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Code}
            label="Problems Solved"
            value={stats?.totalProblems || 0}
            change={12}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Trophy}
            label="Certificates Earned"
            value={certificates.length}
            change={0}
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={Target}
            label="Goals Completed"
            value={monthlyGoals.filter(g => g.progress >= g.target).length}
            change={8}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={roadmapData?.streak?.current || 0}
            change={5}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Progress Overview
              </h2>
              
              <div className="space-y-4">
                {/* Difficulty Breakdown */}
                {[
                  { label: 'Easy', count: roadmapData?.stats?.easy || 0, total: 50, color: 'from-green-500 to-emerald-500' },
                  { label: 'Medium', count: roadmapData?.stats?.medium || 0, total: 75, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Hard', count: roadmapData?.stats?.hard || 0, total: 25, color: 'from-red-500 to-pink-500' }
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

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-all">
                      <div className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.text}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-green-400" />
                Category Progress
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(roadmapData?.stats?.byCategory || {}).slice(0, 6).map(([category, count]) => (
                  <div key={category} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-2xl font-black text-blue-400 mb-1">{count}</div>
                    <div className="text-sm text-gray-400">{category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Goals & Achievements */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-lg">Daily Challenge</h3>
              </div>
              {dailyProgress?.todayCompleted ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Completed Today!</p>
                  <p className="text-sm text-gray-400 mt-1">+{dailyProgress?.points || 0} points</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-400 font-semibold">Pending</p>
                  <p className="text-sm text-gray-400 mt-1">Complete today's challenge</p>
                </div>
              )}
            </div>

            {/* Monthly Goals */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Monthly Goals
                </h3>
                <span className="text-sm text-gray-400">
                  {monthlyGoals.filter(g => g.progress >= g.target).length}/{monthlyGoals.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {monthlyGoals.slice(0, 3).map(goal => (
                  <div key={goal.id} className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">{goal.title}</span>
                      <span className="text-xs text-gray-400">{Math.round((goal.progress / goal.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Medal, label: 'First Solve', unlocked: true },
                  { icon: Flame, label: '7-Day Streak', unlocked: true },
                  { icon: Crown, label: '50 Problems', unlocked: false },
                  { icon: Star, label: 'All Easy', unlocked: false },
                  { icon: Zap, label: 'Speed Demon', unlocked: false },
                  { icon: Trophy, label: 'Master', unlocked: false }
                ].map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                          : 'bg-gray-900/50 border border-gray-700/50 opacity-50'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-1 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-600'}`} />
                      <span className="text-xs text-center text-gray-400">{achievement.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Submissions</span>
                  <span className="font-bold text-white">{stats?.totalSubmissions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Acceptance Rate</span>
                  <span className="font-bold text-green-400">
                    {stats?.totalSubmissions > 0 ? Math.round((stats?.totalProblems / stats?.totalSubmissions) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="font-bold text-orange-400">{roadmapData?.streak?.longest || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Points</span>
                  <span className="font-bold text-purple-400">{dailyProgress?.points || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
