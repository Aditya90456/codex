import { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Menu, 
  X, 
  BookOpen, 
  Navigation,
  ArrowUp,
  ArrowDown,
  Home,
  Target,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';

const ScrollingSidebar = ({ 
  sections = [], 
  currentSection = 0, 
  onSectionChange, 
  title = "Navigation",
  showProgress = true,
  completedSections = new Set(),
  onToggleCompletion,
  className = "",
  position = "left" // left or right
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sidebarRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);
      setScrollProgress(scrollPercentage);
    };

    const handleScrollStart = () => setIsScrolling(true);
    const handleScrollEnd = () => setTimeout(() => setIsScrolling(false), 150);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollStart);
    window.addEventListener('scroll', handleScrollEnd);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollStart);
      window.removeEventListener('scroll', handleScrollEnd);
    };
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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection]);

  // Auto-hide sidebar on mobile when section changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [currentSection]);

  const scrollToSection = (index) => {
    if (onSectionChange) {
      setIsScrolling(true);
      onSectionChange(index);
      setTimeout(() => setIsScrolling(false), 800);
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
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };

  const scrollToBottom = () => {
    setIsScrolling(true);
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 800);
  };

  const toggleCompletion = (sectionId) => {
    if (onToggleCompletion) {
      onToggleCompletion(sectionId);
    }
  };

  const sidebarClasses = `
    fixed ${position === 'left' ? 'left-0' : 'right-0'} top-0 h-full w-80 
    bg-gray-900/95 backdrop-blur-xl border-${position === 'left' ? 'r' : 'l'} border-gray-700/50 
    transform transition-transform duration-300 z-50 
    ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
    ${className}
  `;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-4 z-50 p-3 bg-gray-800/90 hover:bg-gray-700/90 
          rounded-xl border border-gray-600/50 text-white transition-all duration-200 shadow-lg backdrop-blur-sm
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title={`Open ${title}`}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className={sidebarClasses} ref={sidebarRef}>
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} />
              {title}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Navigation Controls */}
          <div className="flex items-center justify-between mb-6 p-3 bg-gray-800/50 rounded-lg">
            <button
              onClick={scrollToPrev}
              disabled={currentSection === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentSection === 0 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title="Previous section (Alt + ↑)"
            >
              <ArrowUp size={16} />
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-400">Section</div>
              <div className="text-white font-medium">
                {currentSection + 1} / {sections.length}
              </div>
            </div>

            <button
              onClick={scrollToNext}
              disabled={currentSection === sections.length - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentSection === sections.length - 1
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title="Next section (Alt + ↓)"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Progress Overview */}
          {showProgress && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-blue-400 font-medium">
                  {completedSections.size}/{sections.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Sections List */}
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {sections.map((section, index) => {
              const isActive = currentSection === index;
              const isCompleted = completedSections.has(section.id || index);
              
              return (
                <div
                  key={section.id || index}
                  className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                      : isCompleted
                      ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                  onClick={() => scrollToSection(index)}
                >
                  <div className="flex items-start gap-3">
                    {/* Completion Toggle */}
                    {onToggleCompletion && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompletion(section.id || index);
                        }}
                        className="mt-0.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Circle size={16} />
                        )}
                      </button>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm leading-tight mb-1 ${
                        isActive ? 'text-blue-300' : isCompleted ? 'text-green-300' : 'text-white'
                      }`}>
                        {section.title}
                      </h4>
                      
                      {section.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {section.description}
                        </p>
                      )}

                      {section.duration && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={10} className="text-gray-500" />
                          <span className="text-xs text-gray-500">{section.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Section Number */}
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className={`absolute ${position === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-blue-500 rounded-full`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                title="Scroll to top (Alt + Home)"
              >
                <Home size={14} />
                <span>Top</span>
              </button>

              <button
                onClick={scrollToBottom}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                title="Scroll to bottom (Alt + End)"
              >
                <Target size={14} />
                <span>End</span>
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-3 text-xs text-gray-500 text-center">
              Use Alt + ↑/↓ for quick navigation
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Mini Navigation (when sidebar is closed) */}
      {!isOpen && sections.length > 0 && (
        <div className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-40 
          bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-700/50 shadow-2xl`}>
          <div className="flex flex-col space-y-2">
            <button
              onClick={scrollToPrev}
              disabled={currentSection === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentSection === 0 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title="Previous section"
            >
              <ChevronUp size={16} />
            </button>
            
            <div className="w-px h-4 bg-gray-600 mx-auto"></div>
            
            <div className="text-xs text-center text-gray-400 font-medium">
              {currentSection + 1}/{sections.length}
            </div>
            
            <div className="w-px h-4 bg-gray-600 mx-auto"></div>
            
            <button
              onClick={scrollToNext}
              disabled={currentSection === sections.length - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentSection === sections.length - 1
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title="Next section"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: rgb(75 85 99);
          border-radius: 4px;
        }

        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: rgb(31 41 55);
          border-radius: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </>
  );
};

export default ScrollingSidebar;