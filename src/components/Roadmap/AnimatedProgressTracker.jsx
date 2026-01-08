import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Star, 
  Trophy, 
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';

const AnimatedProgressTracker = ({ 
  totalItems = 0, 
  completedItems = 0, 
  currentStreak = 0,
  weeklyGoal = 5,
  trackColor = "blue" 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const weeklyProgress = Math.min((completedItems % weeklyGoal) / weeklyGoal * 100, 100);

  // Animate progress on mount and updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  // Animate completed count
  useEffect(() => {
    if (completedItems > animatedCompleted) {
      const increment = Math.ceil((completedItems - animatedCompleted) / 10);
      const timer = setInterval(() => {
        setAnimatedCompleted(prev => {
          const next = prev + increment;
          if (next >= completedItems) {
            clearInterval(timer);
            return completedItems;
          }
          return next;
        });
      }, 50);

      return () => clearInterval(timer);
    } else {
      setAnimatedCompleted(completedItems);
    }
  }, [completedItems]);

  // Show celebration for milestones
  useEffect(() => {
    if (completedItems > 0 && completedItems % 10 === 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedItems]);

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'from-purple-500 to-pink-500';
    if (percentage >= 70) return 'from-blue-500 to-purple-500';
    if (percentage >= 50) return 'from-green-500 to-blue-500';
    if (percentage >= 25) return 'from-yellow-500 to-green-500';
    return 'from-red-500 to-yellow-500';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 relative overflow-hidden">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 animate-pulse rounded-xl" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className={`text-${trackColor}-400`} size={24} />
          Progress Tracker
        </h3>
        <div className="flex items-center gap-2">
          <Zap className={getStreakColor(currentStreak)} size={20} />
          <span className="text-sm font-medium text-gray-300">
            {currentStreak} day streak
          </span>
        </div>
      </div>

      {/* Main Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Overall Progress</span>
          <span className="text-2xl font-bold text-white">
            {Math.round(animatedProgress)}%
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor(animatedProgress)} rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
          
          {/* Progress milestones */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {animatedCompleted}
          </div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {totalItems - completedItems}
          </div>
          <div className="text-xs text-gray-400">Remaining</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className={`text-2xl font-bold mb-1 ${getStreakColor(currentStreak)}`}>
            {currentStreak}
          </div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {Math.floor(completedItems / 10)}
          </div>
          <div className="text-xs text-gray-400">Milestones</div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300 flex items-center gap-2">
            <Calendar size={16} />
            Weekly Goal
          </span>
          <span className="text-sm font-medium text-gray-300">
            {completedItems % weeklyGoal}/{weeklyGoal}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="flex flex-wrap gap-2">
        {completedItems >= 10 && (
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
            <Star size={12} />
            First 10
          </div>
        )}
        
        {completedItems >= 50 && (
          <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
            <Trophy size={12} />
            Half Century
          </div>
        )}
        
        {currentStreak >= 7 && (
          <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
            <Zap size={12} />
            Week Warrior
          </div>
        )}
        
        {currentStreak >= 30 && (
          <div className="flex items-center gap-1 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
            <TrendingUp size={12} />
            Month Master
          </div>
        )}
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <p className="text-sm text-gray-300">
          {progressPercentage >= 90 ? "🎯 Almost there! You're in the final stretch!" :
           progressPercentage >= 70 ? "🚀 Great momentum! Keep pushing forward!" :
           progressPercentage >= 50 ? "💪 Halfway there! You're doing amazing!" :
           progressPercentage >= 25 ? "🌟 Good progress! Stay consistent!" :
           "🎯 Every expert was once a beginner. Keep going!"}
        </p>
      </div>
    </div>
  );
};

export default AnimatedProgressTracker;