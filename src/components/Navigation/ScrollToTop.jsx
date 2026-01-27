import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * ScrollToTop - Floating scroll to top button
 * Shows when user scrolls down and smoothly scrolls back to top
 */
function ScrollToTop({ target = null, threshold = 300, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const element = target || window;
      let scrollTop;

      if (target) {
        scrollTop = target.scrollTop;
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      }

      setIsVisible(scrollTop > threshold);
    };

    const element = target || window;
    element.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check

    return () => {
      element.removeEventListener('scroll', toggleVisibility);
    };
  }, [target, threshold]);

  const scrollToTop = () => {
    const element = target || window;
    
    if (target) {
      target.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } ${className}`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
      
      {/* Animated ring effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 animate-ping"></div>
    </button>
  );
}

export default ScrollToTop;