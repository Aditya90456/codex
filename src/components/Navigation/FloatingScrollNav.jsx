import { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Home,
  Target,
  Circle,
  CheckCircle
} from 'lucide-react';

const FloatingScrollNav = ({ 
  sections = [], 
  currentSection = 0, 
  onSectionChange,
  completedSections = new Set(),
  showProgress = true,
  className = "",
  position = "right", // left or right
  onToggleCompletion
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll progress and visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);
      
      setScrollProgress(scrollPercentage);
      setIsVisible(scrollY > 200); // Show after scrolling 200px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          scrollToNext();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          scrollToPrev();
        } else if (e.key === 'Home') {
          e.preventDefault();
          scrollToTop();
        } else if (e.key === 'End') {
          e.preventDefault();
          scrollToBottom();
        }
      } else if (e.ctrlKey) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          scrollDown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          scrollUp();
        }
      } else {
        // Standard page navigation
        if (e.key === 'PageDown') {
          e.preventDefault();
          scrollDown();
        } else if (e.key === 'PageUp') {
          e.preventDefault();
          scrollUp();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection]);

  const scrollToSection = (index) => {
    if (onSectionChange) {
      onSectionChange(index);
    }
  };

  const scrollToNext = () => {
    const nextSection = Math.min(currentSection + 1, sections.length - 1);
    scrollToSection(nextSection);
  };

  const scrollToPrev = () => {
    const prevSection = Math.max(currentSection - 1, 0);
    scrollToSection(prevSection);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const scrollUp = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.8; // Scroll 80% of viewport height
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollDown = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.8; // Scroll 80% of viewport height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  if (!isVisible || sections.length === 0) return null;

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Navigation */}
      <div className={`fixed ${position === 'left' ? 'left-6' : 'right-6'} top-1/2 transform -translate-y-1/2 z-40 
        bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl ${className}`}>
        
        <div className="flex flex-col space-y-3">
          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to top (Alt + Home)"
          >
            <Home size={16} />
          </button>

          {/* Scroll up (page up) */}
          <button
            onClick={scrollUp}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll up (Page Up / Ctrl + ↑)"
          >
            <ChevronUp size={20} />
          </button>
          
          <div className="w-px h-4 bg-gray-600 mx-auto"></div>
          
          {/* Previous section */}
          <button
            onClick={scrollToPrev}
            disabled={currentSection === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentSection === 0 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Previous section (Alt + ↑)"
          >
            <ArrowUp size={16} />
          </button>

          {/* Section indicators */}
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {sections.map((section, index) => {
              const isActive = currentSection === index;
              const isCompleted = completedSections.has(section.id || index);
              
              return (
                <button
                  key={section.id || index}
                  onClick={() => scrollToSection(index)}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : isCompleted
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={section.title}
                >
                  <div className="flex items-center justify-center">
                    {showProgress && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleCompletion) {
                            onToggleCompletion(section.id || index);
                          }
                        }}
                        className="absolute -left-1 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                      >
                        {isCompleted ? (
                          <CheckCircle size={8} className="text-green-500" />
                        ) : (
                          <Circle size={8} className="text-gray-600 hover:text-gray-400" />
                        )}
                      </button>
                    )}
                    
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className={`absolute ${position === 'left' ? 'left-full ml-2' : 'right-full mr-2'} top-1/2 transform -translate-y-1/2 
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700`}>
                    <div className="font-medium">{section.title}</div>
                    {section.description && (
                      <div className="text-gray-400 text-xs mt-1">{section.description}</div>
                    )}
                    
                    {/* Arrow */}
                    <div className={`absolute top-1/2 transform -translate-y-1/2 ${
                      position === 'left' ? '-left-1' : '-right-1'
                    } w-2 h-2 bg-gray-900 border-gray-700 rotate-45 ${
                      position === 'left' ? 'border-r border-b' : 'border-l border-t'
                    }`}></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next section */}
          <button
            onClick={scrollToNext}
            disabled={currentSection === sections.length - 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentSection === sections.length - 1
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Next section (Alt + ↓)"
          >
            <ArrowDown size={16} />
          </button>
          
          <div className="w-px h-4 bg-gray-600 mx-auto"></div>

          {/* Scroll down (page down) */}
          <button
            onClick={scrollDown}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll down (Page Down / Ctrl + ↓)"
          >
            <ChevronDown size={20} />
          </button>
          
          {/* Scroll to bottom */}
          <button
            onClick={scrollToBottom}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to bottom (Alt + End)"
          >
            <Target size={16} />
          </button>
        </div>

        {/* Progress indicator */}
        {showProgress && (
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Progress</div>
              <div className="text-xs font-medium text-blue-400">
                {completedSections.size}/{sections.length}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Keyboard shortcuts hint */}
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500">
            {currentSection + 1} / {sections.length}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Shortcuts: Page ↑/↓, Alt+↑/↓, Ctrl+↑/↓
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgb(31 41 55);
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(75 85 99);
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
      `}</style>
    </>
  );
};

export default FloatingScrollNav;