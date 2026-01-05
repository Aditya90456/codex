import { Code, Loader2, Zap, Rocket } from 'lucide-react';

const LoadingScreen = ({ 
  message = "Loading Codex Playground...", 
  progress = 0,
  showProgress = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <img 
              src="/codex-icon.svg" 
              alt="Codex Logo" 
              className="w-20 h-20"
            />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Fast Loading Indicator */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-2xl font-bold text-white">{message}</span>
          <Rocket className="w-6 h-6 text-blue-400 animate-pulse" />
        </div>
        
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="w-80 h-3 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0%</span>
              <span className="font-bold text-purple-400">{progress}%</span>
              <span>100%</span>
            </div>
          </div>
        )}
        
        {/* Fast Loading Features */}
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>⚡ Fast 2-second loading</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>🔐 Secure Clerk authentication</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>🚀 Auto-redirect to playground</span>
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="mt-8 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-500 mt-6 text-xs">
          Professional coding environment ready in seconds
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;