import { Code, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Loading Codex..." }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Code className="w-10 h-10 text-white" />
        </div>
        
        {/* Loading spinner */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-xl font-semibold text-white">{message}</span>
        </div>
        
        {/* Loading bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* Subtitle */}
        <p className="text-gray-400 mt-4 text-sm">
          Initializing your coding environment...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;