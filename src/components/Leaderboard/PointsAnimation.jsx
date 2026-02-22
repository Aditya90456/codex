import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Trophy, Award } from 'lucide-react';

const PointsAnimation = ({ points, bonusPoints, newBadges, onComplete }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onComplete}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl max-w-md w-full mx-4"
        >
          {/* Celebration Icon */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-6"
          >
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
          </motion.div>

          {/* Points Display */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="text-6xl font-bold text-yellow-400 mb-2"
            >
              +{points}
            </motion.div>
            <p className="text-2xl text-white font-semibold">Points Earned!</p>
          </div>

          {/* Bonus Points */}
          {bonusPoints > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 mb-4 bg-orange-500/20 rounded-lg p-3 border border-orange-500/50"
            >
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-bold">+{bonusPoints} Bonus!</span>
            </motion.div>
          )}

          {/* New Badges */}
          {newBadges && newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">New Badges Unlocked!</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {newBadges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1 + index * 0.2, type: 'spring' }}
                    className="bg-purple-500/20 rounded-lg px-4 py-2 border border-purple-500/50"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-white text-sm ml-2">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
                className="absolute"
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onComplete}
            className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all"
          >
            Awesome!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PointsAnimation;
