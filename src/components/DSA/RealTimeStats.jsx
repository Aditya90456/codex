import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, TrendingUp, Clock, Target, Flame, 
  Award, BarChart3, Calendar, Zap, Crown, Medal,
  ChevronUp, ChevronDown, RefreshCw
} from 'lucide-react';

const RealTimeStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [streak, setStreak] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockStats = {
          problemsSolved: 127,
          totalProblems: 250,
          easyCompleted: 45,
          mediumCompleted: 62,
          hardCompleted: 20,
          currentStreak: 15,
          longestStreak: 28,
          totalSubmissions: 342,
          acceptanceRate: 68.5,
          rank: 1247,
          points: 8450,
          badges: ['Fast Learner', 'Problem Solver', 'Consistency King'],
          recentActivity: [
            { problem: 'Two Sum', difficulty: 'Easy', time: '2 hours ago', status: 'Solved' },
            { problem: 'Binary Tree', difficulty: 'Medium', time: '5 hours ago', status: 'Solved' },
            { problem: 'Graph Traversal', difficulty: 'Hard', time: '1 day ago', status: 'Attempted' }
          ]
        };
        
        setStats(mockStats);
        setStreak(mockStats.currentStreak);
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Mock data - replace with actual API call
        const mockLeaderboard = [
          { rank: 1, username: 'CodeMaster', points: 15420, avatar: '👑' },
          { rank: 2, username: 'AlgoNinja', points: 14890, avatar: '🥷' },
          { rank: 3, username: 'DataWizard', points: 13750, avatar: '🧙' },
          { rank: 4, username: 'BinaryBoss', points: 12340, avatar: '💪' },
          { rank: 5, username: 'You', points: 8450, avatar: '🎯', isCurrentUser: true }
        ];
        
        setLeaderboard(mockLeaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  // Fetch daily challenge
  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        // Mock data - replace with actual API call
        const mockChallenge = {
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          points: 150,
          timeLimit: '45 min',
          participants: 1247,
          completed: 892
        };
        
        setDailyChallenge(mockChallenge);
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
      }
    };

    fetchDailyChallenge();
  }, []);

  const refreshStats = () => {
    setLoading(true);
    setLastUpdate(Date.now());
    // Trigger refetch
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            Real-Time Stats
          </h1>
          <p className="text-gray-400 mt-1">Track your progress and compete with others</p>
        </div>
        <button
          onClick={refreshStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {['overview', 'leaderboard', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Target className="text-blue-500" />}
                label="Problems Solved"
                value={stats?.problemsSolved}
                total={stats?.totalProblems}
                color="blue"
              />
              <StatCard
                icon={<Flame className="text-orange-500" />}
                label="Current Streak"
                value={`${streak} days`}
                subtitle={`Best: ${stats?.longestStreak} days`}
                color="orange"
              />
              <StatCard
                icon={<Trophy className="text-yellow-500" />}
                label="Global Rank"
                value={`#${stats?.rank}`}
                subtitle={`${stats?.points} points`}
                color="yellow"
              />
              <StatCard
                icon={<TrendingUp className="text-green-500" />}
                label="Acceptance Rate"
                value={`${stats?.acceptanceRate}%`}
                subtitle={`${stats?.totalSubmissions} submissions`}
                color="green"
              />
            </div>

            {/* Progress Breakdown */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="text-purple-500" />
                Difficulty Breakdown
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  label="Easy"
                  value={stats?.easyCompleted}
                  total={80}
                  color="green"
                />
                <ProgressBar
                  label="Medium"
                  value={stats?.mediumCompleted}
                  total={120}
                  color="yellow"
                />
                <ProgressBar
                  label="Hard"
                  value={stats?.hardCompleted}
                  total={50}
                  color="red"
                />
              </div>
            </div>

            {/* Daily Challenge */}
            {dailyChallenge && (
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="text-purple-400" />
                    Daily Challenge
                  </h3>
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    +{dailyChallenge.points} pts
                  </span>
                </div>
                <h4 className="text-lg font-medium text-white mb-2">{dailyChallenge.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className={`px-2 py-1 rounded ${
                    dailyChallenge.difficulty === 'Easy' ? 'bg-green-600' :
                    dailyChallenge.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    {dailyChallenge.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {dailyChallenge.timeLimit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {dailyChallenge.participants} participants
                  </span>
                </div>
                <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Start Challenge
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Medal className="text-yellow-500" />
                Achievements
              </h3>
              <div className="flex flex-wrap gap-3">
                {stats?.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-medium shadow-lg"
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Crown className="text-yellow-500" />
              Global Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.isCurrentUser
                      ? 'bg-blue-900/50 border-2 border-blue-500'
                      : 'bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${
                      user.rank === 1 ? 'text-yellow-500' :
                      user.rank === 2 ? 'text-gray-400' :
                      user.rank === 3 ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="text-3xl">{user.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.points} points</div>
                    </div>
                  </div>
                  {user.rank <= 3 && (
                    <Trophy className={`w-6 h-6 ${
                      user.rank === 1 ? 'text-yellow-500' :
                      user.rank === 2 ? 'text-gray-400' : 'text-orange-600'
                    }`} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {stats?.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-white">{activity.problem}</div>
                    <div className="text-sm text-gray-400">{activity.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm ${
                      activity.difficulty === 'Easy' ? 'bg-green-600' :
                      activity.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                    } text-white`}>
                      {activity.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${
                      activity.status === 'Solved' ? 'bg-green-600' : 'bg-orange-600'
                    } text-white`}>
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, total, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/50 border-blue-500/30',
    orange: 'from-orange-900/50 to-orange-800/50 border-orange-500/30',
    yellow: 'from-yellow-900/50 to-yellow-800/50 border-yellow-500/30',
    green: 'from-green-900/50 to-green-800/50 border-green-500/30'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        {total && (
          <div className="text-sm text-gray-400">
            / {total}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
      )}
    </motion.div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, value, total, color }) => {
  const percentage = (value / total) * 100;
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">{label}</span>
        <span className="text-gray-400 text-sm">
          {value} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

export default RealTimeStats;
