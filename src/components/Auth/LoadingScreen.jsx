import { useEffect, useState } from 'react';

const LoadingScreen = ({ message = "Loading..." }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500 mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-blue-400 animate-pulse"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          {message}{dots}
        </h2>
        
        <p className="text-gray-400 text-sm">
          Setting up your experience
        </p>
        
        <div className="mt-6 flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;