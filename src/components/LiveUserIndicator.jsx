import { useState, useEffect } from 'react';
import { 
  Activity, Wifi, WifiOff, Eye, Code, Mouse, Keyboard, 
  Clock, Zap, Users, Globe, Cpu, HardDrive 
} from 'lucide-react';

const LiveUserIndicator = ({ userActivity, isOnline, performance }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (userActivity.isActive) {
      setAnimationClass('animate-pulse');
      const timeout = setTimeout(() => setAnimationClass(''), 1000);
      return () => clearTimeout(timeout);
    }
  }, [userActivity.lastActivity]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Main Indicator */}
      <div 
        className={`bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 cursor-pointer transition-all duration-300 ${animationClass}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              userActivity.isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}></div>
            <span className="text-white text-sm font-medium">
              {userActivity.isActive ? 'Active' : 'Idle'}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            {isOnline ? (
              <Wifi size={16} className="text-green-400" />
            ) : (
              <WifiOff size={16} className="text-red-400" />
            )}
          </div>

          {/* Current Activity */}
          {userActivity.isTyping && (
            <div className="flex items-center space-x-1">
              <Keyboard size={16} className="text-blue-400 animate-bounce" />
              <span className="text-blue-400 text-xs">Typing</span>
            </div>
          )}

          {/* Page Indicator */}
          <div className="flex items-center space-x-1">
            {userActivity.currentEditor === 'android' && <span className="text-green-400 text-xs">📱</span>}
            {userActivity.currentEditor === 'web' && <span className="text-blue-400 text-xs">🌐</span>}
            {userActivity.currentEditor === 'advanced' && <span className="text-purple-400 text-xs">🚀</span>}
            {!userActivity.currentEditor && <span className="text-gray-400 text-xs">🏠</span>}
          </div>
        </div>
      </div>

      {/* Detailed Panel */}
      {showDetails && (
        <div className="mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-80 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Activity size={16} className="text-green-400" />
                <span>Live Activity Monitor</span>
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Current Status */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Current Status</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Eye size={12} className="text-blue-400" />
                  <span className="text-gray-300">Page: {userActivity.currentPage}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code size={12} className="text-purple-400" />
                  <span className="text-gray-300">Editor: {userActivity.currentEditor || 'None'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={12} className="text-yellow-400" />
                  <span className="text-gray-300">Session: {formatTime(userActivity.sessionDuration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe size={12} className={isOnline ? 'text-green-400' : 'text-red-400'} />
                  <span className="text-gray-300">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Activity Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Code Changes:</span>
                  <span className="text-green-400 font-medium">{userActivity.codeChanges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Files Opened:</span>
                  <span className="text-blue-400 font-medium">{userActivity.filesOpened}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Keystrokes:</span>
                  <span className="text-purple-400 font-medium">{userActivity.keystrokes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Clicks:</span>
                  <span className="text-orange-400 font-medium">{userActivity.clicks}</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <Zap size={12} className="text-yellow-400" />
                <span>Performance</span>
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Load Time:</span>
                  <span className="text-green-400">{performance.loadTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory:</span>
                  <span className="text-blue-400">{formatBytes(performance.memoryUsage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Render Time:</span>
                  <span className="text-purple-400">{performance.renderTime}ms</span>
                </div>
              </div>
            </div>

            {/* Recent Actions */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Recent Actions</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {userActivity.actions.slice(-5).reverse().map((action, index) => (
                  <div key={action.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 truncate">
                      {action.action.replace('_', ' ')}
                    </span>
                    <span className="text-gray-500">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation History */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2">Navigation</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {userActivity.navigationHistory.slice(-3).reverse().map((nav, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {nav.page} {nav.editor && `→ ${nav.editor}`}
                    </span>
                    <span className="text-gray-500">
                      {new Date(nav.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mouse Position */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                <Mouse size={12} className="text-blue-400" />
                <span>Mouse Position</span>
              </h4>
              <div className="text-xs text-gray-400">
                X: {userActivity.mousePosition.x}, Y: {userActivity.mousePosition.y}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveUserIndicator;