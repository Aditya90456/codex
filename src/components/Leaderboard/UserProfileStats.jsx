import { motion } from 'framer-motion';
import { useLeaderboard } from '../../contexts/LeaderboardContext';
import { Calendar, TrendingUp, Target, Award, Flame, Clock } from 'lucide-react';

const UserProfileStats = () => {
  const { userStats } = useLeaderboard();

  const stats = [
    {
      icon: Target,
      label: 'Total Solved',
      value: userStats.problemsSolved,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${userStats.currentStreak} days`,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: TrendingUp,
      label: 'Longest Streak',
      value: `${userStats.longestStreak} days`,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      label: 'Badges Earned',
      value: userStats.badges.length,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all backdrop-blur-sm"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Problem Breakdown */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Problem Breakdown
        </h3>
        <div className="space-y-4">
          <ProblemBar 
            label="Easy" 
            count={userStats.easyCount} 
            total={userStats.problemsSolved}
            color="green"
          />
          <ProblemBar 
            label="Medium" 
            count={userStats.mediumCount} 
            total={userStats.problemsSolved}
            color="yellow"
          />
          <ProblemBar 
            label="Hard" 
            count={userStats.hardCount} 
            total={userStats.problemsSolved}
            color="red"
          />
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Activity Calendar
        </h3>
        <ActivityHeatmap />
      </div>
    </div>
  );
};

const ProblemBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className={`text-${color}-400 font-medium`}>{label}</span>
        <span className="text-gray-400">{count} solved</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
        />
      </div>
    </div>
  );
};

const ActivityHeatmap = () => {
  // Generate mock activity data for the last 12 weeks
  const weeks = 12;
  const days = 7;
  const activityData = Array.from({ length: weeks }, () =>
    Array.from({ length: days }, () => Math.floor(Math.random() * 5))
  );

  const getColor = (level) => {
    const colors = [
      'bg-gray-800',
      'bg-green-900/50',
      'bg-green-700/70',
      'bg-green-500',
      'bg-green-400'
    ];
    return colors[level] || colors[0];
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {activityData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={`${weekIndex}-${dayIndex}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (weekIndex * days + dayIndex) * 0.01 }}
                className={`w-3 h-3 rounded-sm ${getColor(day)} hover:ring-2 hover:ring-green-400 transition-all cursor-pointer`}
                title={`${day} problems solved`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`w-3 h-3 rounded-sm ${getColor(level)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default UserProfileStats;
