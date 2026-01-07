import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowUp, ArrowDown, MousePointer2 } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Show button when page is scrolled down and calculate scroll progress
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300);
      setIsNearBottom(scrollPercent > 80);
      
      // Hide scroll hint after user scrolls
      if (scrollTop > 100) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Hide scroll hint after 5 seconds
    const hintTimer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      clearTimeout(hintTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll Hint for New Users */}
      {showScrollHint && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-bounce">
          <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2 backdrop-blur-sm">
            <MousePointer2 size={16} />
            <span>Scroll to explore</span>
            <ChevronDown size={16} />
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-fade-in-up group"
          aria-label="Scroll to top"
          title={`Scroll to top (${Math.round(scrollProgress)}% scrolled)`}
        >
          <ChevronUp size={24} />
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Back to top
          </div>
        </button>
      )}

      {/* Scroll to Bottom Button (when near top) */}
      {!isNearBottom && scrollProgress < 20 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-8 right-24 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-fade-in-up group"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ChevronDown size={24} />
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Go to bottom
          </div>
        </button>
      )}

      {/* Scroll Position Indicator */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 text-white text-xs">
          <div className="w-2 h-20 bg-gray-600 rounded-full relative">
            <div 
              className="w-2 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ height: `${scrollProgress}%` }}
            />
            <div 
              className="absolute w-3 h-3 bg-white rounded-full border-2 border-purple-600 transform -translate-x-0.5 transition-all duration-300"
              style={{ top: `${scrollProgress}%`, transform: 'translateY(-50%) translateX(-1px)' }}
            />
          </div>
        </div>
      </div>

      {/* Section Navigation Dots */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        {['Top', 'Editor', 'Console', 'Bottom'].map((section, index) => (
          <button
            key={section}
            onClick={() => {
              const sectionProgress = (index / 3) * 100;
              const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * (sectionProgress / 100);
              window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 group relative ${
              Math.abs(scrollProgress - (index / 3) * 100) < 25 
                ? 'bg-purple-600 shadow-lg' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            title={`Go to ${section}`}
          >
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {section}
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

export default ScrollToTop;