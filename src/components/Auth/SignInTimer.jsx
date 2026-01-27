import { useState, useEffect } from 'react';
import { Clock, Zap, Trophy, Target } from 'lucide-react';

function SignInTimer({ isActive, onComplete, showGoal = true }) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isActive && !startTime) {
      setStartTime(Date.now());
    }
    
    if (!isActive && startTime) {
      const finalTime = Date.now() - startTime;
      setElapsed(finalTime);
      onComplete?.(finalTime);
      return;
    }

    if (!isActive) {
      setElapsed(0);
      setStartTime(null);
      return;
    }

    const interval = setInterval(() => {
      if (startTime) {
        setElapsed(Date.now() - startTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, startTime, onComplete]);

  const formatTime = (ms) => `${(ms / 1000).toFixed(1)}s`;
  
  const getProgressColor = () => {
    if (elapsed < 2000) return 'from-green-500 to-emerald-500';
    if (elapsed < 5000) return 'from-blue-500 to-cyan-500';
    if (elapsed < 10000) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getStatusIcon = () => {
    if (elapsed < 2000) return <Zap className="w-4 h-4" />;
    if (elapsed < 5000) return <Trophy className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isActive && elapsed === 0) return 'Ready to sign in';
    if (elapsed < 2000) return 'Lightning fast!';
    if (elapsed < 5000) return 'Great speed!';
    if (elapsed < 10000) return 'Good progress';
    return 'Taking a bit longer...';
  };

  if (!isActive && elapsed === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      {/* Goal Banner */}
      {showGoal && (
        <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-400">
          <Target className="w-4 h-4" />
          <span>Goal: Sign in under 2 minutes</span>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-white font-semibold">
            {formatTime(elapsed)}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {getStatusText()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-300`}
          style={{ 
            width: `${Math.min((elapsed / 120000) * 100, 100)}%` // 2 minutes = 120000ms
          }}
        />
      </div>

      {/* Progress Text */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>0s</span>
        <span className="text-gray-400">
          {elapsed >= 120000 ? 'Over 2 min' : `${Math.round((120000 - elapsed) / 1000)}s left`}
        </span>
        <span>2min</span>
      </div>

      {/* Success Message */}
      {!isActive && elapsed > 0 && elapsed < 120000 && (
        <div className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Trophy className="w-4 h-4" />
            <span>Success! Signed in under 2 minutes</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignInTimer;