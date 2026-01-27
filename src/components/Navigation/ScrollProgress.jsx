import { useState, useEffect } from 'react';

/**
 * ScrollProgress - Shows scroll progress indicator
 * Displays a beautiful progress bar at the top of scrollable content
 */
function ScrollProgress({ target = null, className = "" }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const element = target || window;
      let scrollTop, scrollHeight, clientHeight;

      if (target) {
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        clientHeight = window.innerHeight;
      }

      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsVisible(scrollTop > 50);
    };

    const element = target || window;
    element.addEventListener('scroll', calculateScrollProgress);
    calculateScrollProgress(); // Initial calculation

    return () => {
      element.removeEventListener('scroll', calculateScrollProgress);
    };
  }, [target]);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-800/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Animated glow effect */}
      <div 
        className="absolute top-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-sm transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export default ScrollProgress;