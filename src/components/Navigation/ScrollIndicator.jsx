import { useState, useEffect } from 'react';
import { MousePointer, ScrollText } from 'lucide-react';

const ScrollIndicator = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolling(true);

      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout to hide indicator
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  if (!isScrolling) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
      bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50 shadow-lg
      animate-fade-in">
      <div className="flex items-center space-x-2 text-white">
        <ScrollText size={16} className="animate-pulse" />
        <span className="text-sm font-medium">
          Scrolling {scrollDirection}
        </span>
        <div className={`w-2 h-2 rounded-full bg-blue-400 animate-bounce ${
          scrollDirection === 'down' ? 'animate-bounce' : 'animate-bounce-reverse'
        }`}></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;