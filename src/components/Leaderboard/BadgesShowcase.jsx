import { motion } from 'framer-motion';
import { useLeaderboard } from '../../contexts/LeaderboardContext';
import { Lock, Sparkles } from 'lucide-react';

const BadgesShowcase = () => {
  const { userStats, BADGES } = useLeaderboard();

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Achievement Badges</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(BADGES).map(([key, badge]) => {
          const isUnlocked = userStats.badges.includes(key);
          const progress = typeof badge.requirement === 'number' 
            ? Math.min((userStats.problemsSolved / badge.requirement) * 100, 100)
            : 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isUnlocked
                  ? `bg-gradient-to-br from-${badge.color}-900/30 to-${badge.color}-800/20 border-${badge.color}-500/50`
                  : 'bg-gray-900/50 border-gray-700 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className={`text-5xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                {badge.icon}
              </div>

              {/* Badge Name */}
              <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                {badge.name}
              </h3>

              {/* Requirement */}
              {typeof badge.requirement === 'number' && (
                <div className="text-xs text-gray-400 mb-2">
                  {isUnlocked ? 'Unlocked!' : `${userStats.problemsSolved}/${badge.requirement} problems`}
                </div>
              )}

              {/* Progress Bar */}
              {!isUnlocked && typeof badge.requirement === 'number' && (
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full bg-gradient-to-r from-${badge.color}-500 to-${badge.color}-600`}
                  />
                </div>
              )}

              {/* Lock Icon */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              )}

              {/* Shine Effect for Unlocked */}
              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesShowcase;
