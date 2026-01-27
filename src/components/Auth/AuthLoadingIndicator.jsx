import { useState, useEffect } from 'react';
import { Clock, Zap, CheckCircle } from 'lucide-react';

function AuthLoadingIndicator({ isVisible, type = 'signin', onComplete }) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (isVisible && !startTime) {
      setStartTime(Date.now());
    }
    
    if (!isVisible && startTime) {
      const finalTime = Date.now() - startTime;
      setElapsed(finalTime);
      onComplete?.(finalTime);
      return;
    }

    if (!isVisible) {
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
  }, [isVisible, startTime, onComplete]);

  const formatTime = (ms) => `${(ms / 1000).toFixed(1)}s`;
  
  const getStatusMessage = () => {
    if (type === 'signin') {
      if (elapsed < 1000) return 'Verifying credentials...';
      if (elapsed < 3000) return 'Loading your workspace...';
      if (elapsed < 5000) return 'Almost ready...';
      return 'Just a moment more...';
    } else {
      if (elapsed < 1000) return 'Creating your account...';
      if (elapsed < 3000) return 'Setting up your profile...';
      if (elapsed < 5000) return 'Preparing your workspace...';
      return 'Finalizing setup...';
    }
  };

  const getProgressWidth = () => {
    // Progress based on 2-minute goal
    return Math.min((elapsed / 120000) * 100, 100);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
        {/* Loading Animation */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {type === 'signin' ? 'Signing You In' : 'Creating Your Account'}
          </h3>
          <p className="text-gray-400 mb-4">{getStatusMessage()}</p>
          
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>Time: {formatTime(elapsed)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{elapsed < 120000 ? 'Under 2 min goal' : 'Taking longer...'}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                elapsed < 120000 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                  : 'bg-gradient-to-r from-yellow-500 to-red-500'
              }`}
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
        </div>

        {/* Speed Indicator */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            elapsed < 2000 ? 'bg-green-500/20 text-green-400' :
            elapsed < 5000 ? 'bg-blue-500/20 text-blue-400' :
            elapsed < 10000 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {elapsed < 2000 ? <Zap className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>
              {elapsed < 2000 ? 'Lightning Fast' :
               elapsed < 5000 ? 'Fast' :
               elapsed < 10000 ? 'Good' : 'Slow'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLoadingIndicator;