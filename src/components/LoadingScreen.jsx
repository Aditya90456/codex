import { Code, Zap, Rocket } from 'lucide-react';

const LoadingScreen = ({ 
  message = "Loading Codex Playground...", 
  progress = 0,
  showProgress = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Lightning Fast Logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <img 
              src="/codex-icon.svg" 
              alt="Codex Logo" 
              className="w-16 h-16"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <Zap className="w-3 h-3 text-white" />
          </div>
        </div>
        
        {/* Fast Loading Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="text-xl font-bold text-white">{message}</span>
          <Rocket className="w-5 h-5 text-blue-400 animate-pulse" />
        </div>
        
        {/* Ultra Fast Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span className="font-bold text-green-400">{progress}%</span>
              <span>100%</span>
            </div>
          </div>
        )}
        
        {/* Lightning Fast Features */}
        <div className="space-y-1 text-sm text-gray-300">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>⚡ Lightning fast 200ms loading</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>�  Instant authorization</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>�  Zero-delay playground access</span>
          </div>
        </div>
        
        {/* Ultra Fast Animation */}
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        
        {/* Speed Subtitle */}
        <p className="text-gray-500 mt-4 text-xs">
          ⚡ Optimized for instant access • No delays • Pure speed
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;