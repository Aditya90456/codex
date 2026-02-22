import { useState } from 'react';
import { useLeaderboard } from '../../contexts/LeaderboardContext';
import { Trophy, TrendingUp, Award, Zap, Target, Crown, Medal, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeaderboardPage = () => {
  const { userStats, leaderboard, getUserRankPosition, RANKS } = useLeaderboard();
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [categoryFilter, setCategoryFilter] = useState('global');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-lg">Compete with the best coders worldwide</p>
        </motion.div>

        {/* User Stats Card */}
        <UserStatsCard userStats={userStats} position={getUserRankPosition()} />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            {['all-time', 'monthly', 'weekly', 'daily'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  timeFilter === filter
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            {['global', 'country', 'friends'].map(filter => (
              <button
                key={filter}
                onClick={() => setCategoryFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  categoryFilter === filter
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <TopThreePodium leaderboard={leaderboard} />

        {/* Leaderboard Table */}
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
};

const UserStatsCard = ({ userStats, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Rank Badge */}
        <div className="flex items-center gap-4">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${userStats.rank.color} flex items-center justify-center text-4xl shadow-lg`}>
            {userStats.rank.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{userStats.rank.name}</h3>
            <p className="text-gray-400">Global Rank #{position}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">{userStats.totalPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem icon={Target} label="Solved" value={userStats.problemsSolved} color="blue" />
          <StatItem icon={Zap} label="Streak" value={`${userStats.currentStreak}d`} color="orange" />
          <StatItem icon={Award} label="Badges" value={userStats.badges.length} color="purple" />
          <StatItem icon={TrendingUp} label="Best" value={`${userStats.longestStreak}d`} color="green" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress to next rank</span>
          <span>{userStats.totalPoints} / {userStats.rank.max === Infinity ? '∞' : userStats.rank.max}</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: userStats.rank.max === Infinity 
                ? '100%' 
                : `${(userStats.totalPoints / userStats.rank.max) * 100}%` 
            }}
            className={`h-full bg-gradient-to-r ${userStats.rank.color}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="text-center">
    <Icon className={`w-6 h-6 text-${color}-400 mx-auto mb-1`} />
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

const TopThreePodium = ({ leaderboard }) => {
  const top3 = leaderboard.slice(0, 3);
  const [first, second, third] = [top3[0], top3[1], top3[2]];

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {/* Second Place */}
      {second && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-3xl border-4 border-gray-300 shadow-xl">
              {second.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-900">
              2
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="font-bold text-white">{second.name}</p>
            <p className="text-yellow-400 font-semibold">{second.points} pts</p>
          </div>
          <div className="w-32 h-32 bg-gradient-to-t from-gray-600 to-gray-700 rounded-t-lg mt-2 flex items-center justify-center">
            <Medal className="w-12 h-12 text-gray-300" />
          </div>
        </motion.div>
      )}

      {/* First Place */}
      {first && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <Crown className="w-8 h-8 text-yellow-400 mb-2 animate-bounce" />
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl border-4 border-yellow-300 shadow-2xl">
              {first.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-900">
              1
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="font-bold text-white text-lg">{first.name}</p>
            <p className="text-yellow-400 font-bold text-xl">{first.points} pts</p>
          </div>
          <div className="w-32 h-40 bg-gradient-to-t from-yellow-600 to-yellow-700 rounded-t-lg mt-2 flex items-center justify-center">
            <Trophy className="w-16 h-16 text-yellow-300" />
          </div>
        </motion.div>
      )}

      {/* Third Place */}
      {third && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-3xl border-4 border-amber-600 shadow-xl">
              {third.avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-900">
              3
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="font-bold text-white">{third.name}</p>
            <p className="text-yellow-400 font-semibold">{third.points} pts</p>
          </div>
          <div className="w-32 h-24 bg-gradient-to-t from-amber-800 to-amber-900 rounded-t-lg mt-2 flex items-center justify-center">
            <Medal className="w-10 h-10 text-amber-600" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

const LeaderboardTable = ({ leaderboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tier</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Points</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Solved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboard.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-700' :
                      'text-gray-500'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{user.rank.icon}</span>
                    <span className="text-sm text-gray-300">{user.rank.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-yellow-400">{user.points}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-300">{user.solved}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;
