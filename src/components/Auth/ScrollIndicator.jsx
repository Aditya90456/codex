import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ScrollIndicator = ({ containerRef, showHint = true }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(showHint);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      
      if (maxScroll > 0) {
        const progress = (scrollTop / maxScroll) * 100;
        setScrollProgress(progress);
        setCanScrollDown(scrollTop < maxScroll - 5);
        setCanScrollUp(scrollTop > 5);
        
        // Hide hint after user scrolls
        if (scrollTop > 10) {
          setShowScrollHint(false);
        }
      } else {
        setScrollProgress(0);
        setCanScrollDown(false);
        setCanScrollUp(false);
      }
    };

    container.addEventListener('scroll', updateScrollState);
    updateScrollState(); // Initial check

    // Hide hint after 3 seconds
    const hintTimer = setTimeout(() => {
      setShowScrollHint(false);
    }, 3000);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      clearTimeout(hintTimer);
    };
  }, [containerRef]);

  const scrollTo = (direction) => {
    const container = containerRef?.current;
    if (!container) return;

    const scrollAmount = container.clientHeight * 0.8;
    const currentScroll = container.scrollTop;
    const targetScroll = direction === 'down' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth'
    });
  };

  // Don't render if container doesn't need scrolling
  if (!canScrollDown && !canScrollUp && scrollProgress === 0) {
    return null;
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="absolute right-2 top-4 bottom-4 w-1 bg-gray-700/30 rounded-full">
        <div 
          className="w-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll Down Button */}
      {canScrollDown && (
        <button
          onClick={() => scrollTo('down')}
          className="absolute bottom-4 right-4 bg-blue-600/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          title="Scroll down"
        >
          <ChevronDown size={16} />
        </button>
      )}

      {/* Scroll Up Button */}
      {canScrollUp && (
        <button
          onClick={() => scrollTo('up')}
          className="absolute top-4 right-4 bg-blue-600/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          title="Scroll up"
        >
          <ChevronUp size={16} />
        </button>
      )}

      {/* Scroll Hint */}
      {showScrollHint && canScrollDown && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs animate-bounce z-10">
          <div className="flex items-center space-x-1">
            <span>Scroll for more</span>
            <ChevronDown size={12} />
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollIndicator;