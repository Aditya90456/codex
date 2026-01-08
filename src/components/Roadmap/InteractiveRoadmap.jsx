import { useState, useEffect, useRef } from 'react';
import { 
  Code, 
  Smartphone, 
  Database, 
  CheckCircle, 
  Circle, 
  Star, 
  Trophy, 
  Target,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Navigation
} from 'lucide-react';

const InteractiveRoadmap = ({ onBack }) => {
  const [selectedTrack, setSelectedTrack] = useState('web');
  const [completedItems, setCompletedItems] = useState(new Set());
  const [animationStep, setAnimationStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs for scrolling
  const headerRef = useRef(null);
  const trackSelectionRef = useRef(null);
  const progressRef = useRef(null);
  const phaseRefs = useRef([]);
  const achievementRef = useRef(null);

  // Animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Scroll detection for navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollY / documentHeight) * 100;
      
      setScrollProgress(scrollPercentage);
      setShowScrollNav(scrollY > 200);
      
      // Detect current phase based on scroll position
      phaseRefs.current.forEach((ref, index) => {
        if (ref && ref.getBoundingClientRect().top <= 100 && ref.getBoundingClientRect().bottom > 100) {
          setCurrentPhase(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll functions
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const scrollToPhase = (phaseIndex) => {
    if (phaseRefs.current[phaseIndex]) {
      phaseRefs.current[phaseIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setCurrentPhase(phaseIndex);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const roadmapData = {
    web: {
      title: "Web Development Roadmap",
      icon: Code,
      color: "blue",
      description: "Master modern web development from basics to advanced",
      phases: [
        {
          title: "Foundation",
          duration: "2-3 months",
          items: [
            { id: 'html', title: 'HTML5 Fundamentals', difficulty: 'Beginner', time: '2 weeks' },
            { id: 'css', title: 'CSS3 & Flexbox/Grid', difficulty: 'Beginner', time: '3 weeks' },
            { id: 'js-basics', title: 'JavaScript Basics', difficulty: 'Beginner', time: '4 weeks' },
            { id: 'responsive', title: 'Responsive Design', difficulty: 'Intermediate', time: '2 weeks' }
          ]
        },
        {
          title: "Frontend Frameworks",
          duration: "3-4 months",
          items: [
            { id: 'react', title: 'React.js Fundamentals', difficulty: 'Intermediate', time: '6 weeks' },
            { id: 'state-mgmt', title: 'State Management (Redux/Context)', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'routing', title: 'React Router', difficulty: 'Intermediate', time: '2 weeks' },
            { id: 'hooks', title: 'Advanced React Hooks', difficulty: 'Advanced', time: '3 weeks' }
          ]
        },
        {
          title: "Backend Development",
          duration: "4-5 months",
          items: [
            { id: 'nodejs', title: 'Node.js & Express', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'databases', title: 'Databases (MongoDB/PostgreSQL)', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'apis', title: 'RESTful APIs & GraphQL', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'auth', title: 'Authentication & Security', difficulty: 'Advanced', time: '3 weeks' }
          ]
        },
        {
          title: "Advanced Topics",
          duration: "3-4 months",
          items: [
            { id: 'testing', title: 'Testing (Jest, Cypress)', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'deployment', title: 'Deployment & DevOps', difficulty: 'Advanced', time: '3 weeks' },
            { id: 'performance', title: 'Performance Optimization', difficulty: 'Advanced', time: '3 weeks' },
            { id: 'pwa', title: 'Progressive Web Apps', difficulty: 'Advanced', time: '2 weeks' }
          ]
        }
      ]
    },
    android: {
      title: "Android Development Roadmap",
      icon: Smartphone,
      color: "green",
      description: "Build native Android apps with modern tools",
      phases: [
        {
          title: "Android Basics",
          duration: "2-3 months",
          items: [
            { id: 'java-kotlin', title: 'Java/Kotlin Fundamentals', difficulty: 'Beginner', time: '4 weeks' },
            { id: 'android-studio', title: 'Android Studio Setup', difficulty: 'Beginner', time: '1 week' },
            { id: 'activities', title: 'Activities & Intents', difficulty: 'Beginner', time: '3 weeks' },
            { id: 'layouts', title: 'Layouts & UI Components', difficulty: 'Beginner', time: '4 weeks' }
          ]
        },
        {
          title: "UI/UX Development",
          duration: "3-4 months",
          items: [
            { id: 'material-design', title: 'Material Design', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'fragments', title: 'Fragments & Navigation', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'recyclerview', title: 'RecyclerView & Adapters', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'animations', title: 'Animations & Transitions', difficulty: 'Intermediate', time: '2 weeks' }
          ]
        },
        {
          title: "Data & Networking",
          duration: "3-4 months",
          items: [
            { id: 'room-db', title: 'Room Database', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'retrofit', title: 'Retrofit & API Integration', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'mvvm', title: 'MVVM Architecture', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'data-binding', title: 'Data Binding & LiveData', difficulty: 'Advanced', time: '3 weeks' }
          ]
        },
        {
          title: "Advanced Features",
          duration: "4-5 months",
          items: [
            { id: 'jetpack-compose', title: 'Jetpack Compose', difficulty: 'Advanced', time: '6 weeks' },
            { id: 'background-tasks', title: 'Background Processing', difficulty: 'Advanced', time: '3 weeks' },
            { id: 'testing-android', title: 'Android Testing', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'publishing', title: 'Play Store Publishing', difficulty: 'Advanced', time: '2 weeks' }
          ]
        }
      ]
    },
    dsa: {
      title: "Data Structures & Algorithms",
      icon: Database,
      color: "purple",
      description: "Master problem-solving and coding interviews",
      phases: [
        {
          title: "Fundamentals",
          duration: "2-3 months",
          items: [
            { id: 'complexity', title: 'Time & Space Complexity', difficulty: 'Beginner', time: '2 weeks' },
            { id: 'arrays', title: 'Arrays & Strings', difficulty: 'Beginner', time: '3 weeks' },
            { id: 'linked-lists', title: 'Linked Lists', difficulty: 'Beginner', time: '3 weeks' },
            { id: 'stacks-queues', title: 'Stacks & Queues', difficulty: 'Beginner', time: '2 weeks' }
          ]
        },
        {
          title: "Intermediate Structures",
          duration: "3-4 months",
          items: [
            { id: 'trees', title: 'Binary Trees & BST', difficulty: 'Intermediate', time: '4 weeks' },
            { id: 'heaps', title: 'Heaps & Priority Queues', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'hashing', title: 'Hash Tables & Maps', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'graphs-basic', title: 'Graph Basics', difficulty: 'Intermediate', time: '4 weeks' }
          ]
        },
        {
          title: "Algorithms",
          duration: "4-5 months",
          items: [
            { id: 'sorting', title: 'Sorting Algorithms', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'searching', title: 'Binary Search & Variants', difficulty: 'Intermediate', time: '3 weeks' },
            { id: 'recursion', title: 'Recursion & Backtracking', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'dp', title: 'Dynamic Programming', difficulty: 'Advanced', time: '6 weeks' }
          ]
        },
        {
          title: "Advanced Topics",
          duration: "3-4 months",
          items: [
            { id: 'graph-algorithms', title: 'Graph Algorithms (DFS/BFS)', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'greedy', title: 'Greedy Algorithms', difficulty: 'Advanced', time: '3 weeks' },
            { id: 'advanced-trees', title: 'Advanced Trees (Trie, Segment)', difficulty: 'Advanced', time: '4 weeks' },
            { id: 'system-design', title: 'System Design Basics', difficulty: 'Advanced', time: '4 weeks' }
          ]
        }
      ]
    }
  };

  const toggleCompletion = (itemId) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500 bg-green-100';
      case 'Intermediate': return 'text-yellow-500 bg-yellow-100';
      case 'Advanced': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const currentTrack = roadmapData[selectedTrack];
  const totalItems = currentTrack.phases.reduce((acc, phase) => acc + phase.items.length, 0);
  const completedCount = currentTrack.phases.reduce((acc, phase) => 
    acc + phase.items.filter(item => completedItems.has(item.id)).length, 0
  );
  const progressPercentage = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Scroll Navigation */}
      {showScrollNav && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col space-y-3">
            <button
              onClick={scrollToTop}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 scroll-indicator"
              title="Scroll to top"
            >
              <ChevronUp size={20} />
            </button>
            
            <div className="w-px h-8 bg-gray-600 mx-auto"></div>
            
            {/* Phase Navigation */}
            {currentTrack.phases.map((phase, index) => (
              <button
                key={index}
                onClick={() => scrollToPhase(index)}
                className={`p-2 rounded-lg transition-all duration-200 text-xs font-medium ${
                  currentPhase === index 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title={`Phase ${index + 1}: ${phase.title}`}
              >
                {index + 1}
              </button>
            ))}
            
            <div className="w-px h-8 bg-gray-600 mx-auto"></div>
            
            <button
              onClick={scrollToBottom}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 scroll-indicator"
              title="Scroll to bottom"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8" ref={headerRef}>
            <button
              onClick={() => onBack && onBack()}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
            
            {/* Quick Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => scrollToSection(trackSelectionRef)}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <Navigation size={16} />
                <span>Tracks</span>
              </button>
              <button
                onClick={() => scrollToSection(progressRef)}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <Target size={16} />
                <span>Progress</span>
              </button>
              <button
                onClick={() => scrollToSection(achievementRef)}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <Trophy size={16} />
                <span>Achievement</span>
              </button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Interactive Learning Roadmap
            </h1>
            <p className="text-gray-300 text-lg">
              Choose your path and track your progress with animated milestones
            </p>
          </div>

        {/* Track Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8" ref={trackSelectionRef}>
          {Object.entries(roadmapData).map(([key, track]) => {
            const IconComponent = track.icon;
            const isSelected = selectedTrack === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedTrack(key)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? `border-${track.color}-500 bg-${track.color}-500/20 shadow-lg shadow-${track.color}-500/25` 
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <IconComponent 
                    size={32} 
                    className={`${isSelected ? `text-${track.color}-400` : 'text-gray-400'}`} 
                  />
                  <h3 className={`font-semibold ${isSelected ? `text-${track.color}-300` : 'text-gray-300'}`}>
                    {track.title.split(' ')[0]}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Overview */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 backdrop-blur-sm border border-gray-700" ref={progressRef}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h2>
              <p className="text-gray-400">{currentTrack.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-400">{completedCount}/{totalItems} completed</div>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-${currentTrack.color}-500 to-${currentTrack.color}-400 rounded-full transition-all duration-1000 ease-out relative`}
              style={{ width: `${progressPercentage}%` }}
            >
              <div 
                className="absolute inset-0 bg-white/20 rounded-full"
                style={{
                  transform: `translateX(${Math.sin(animationStep * 0.1) * 10}px)`,
                  opacity: progressPercentage > 0 ? 0.6 : 0
                }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-8">
          {currentTrack.phases.map((phase, phaseIndex) => {
            const phaseCompleted = phase.items.filter(item => completedItems.has(item.id)).length;
            const phaseProgress = (phaseCompleted / phase.items.length) * 100;
            
            return (
              <div 
                key={phaseIndex}
                ref={el => phaseRefs.current[phaseIndex] = el}
                className={`bg-gray-800/30 rounded-xl p-6 border border-gray-700 backdrop-blur-sm transition-all duration-500 ${
                  currentPhase === phaseIndex ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''
                }`}
                style={{
                  animationDelay: `${phaseIndex * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      phaseProgress === 100 
                        ? 'bg-green-600 text-white' 
                        : currentPhase === phaseIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {phaseIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Phase {phaseIndex + 1}: {phase.title}
                      </h3>
                      <p className="text-gray-400">Duration: {phase.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-400">
                        {Math.round(phaseProgress)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {phaseCompleted}/{phase.items.length}
                      </div>
                    </div>
                    {phaseProgress === 100 && (
                      <Trophy className="text-yellow-500 animate-bounce" size={24} />
                    )}
                  </div>
                </div>

                {/* Phase Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                  <div 
                    className={`h-full bg-gradient-to-r from-${currentTrack.color}-500 to-${currentTrack.color}-400 rounded-full transition-all duration-700`}
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>

                {/* Scroll to Next Phase Button */}
                {phaseIndex < currentTrack.phases.length - 1 && (
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => scrollToPhase(phaseIndex + 1)}
                      className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50"
                      title="Next Phase"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                )}

                {/* Phase Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.items.map((item, itemIndex) => {
                    const isCompleted = completedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-102 ${
                          isCompleted 
                            ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20' 
                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                        }`}
                        onClick={() => toggleCompletion(item.id)}
                        style={{
                          animationDelay: `${(phaseIndex * 4 + itemIndex) * 0.1}s`,
                          animation: 'slideInLeft 0.5s ease-out forwards'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {isCompleted ? (
                                <CheckCircle className="text-green-500 animate-pulse" size={20} />
                              ) : (
                                <Circle className="text-gray-500" size={20} />
                              )}
                              <h4 className={`font-semibold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                                {item.title}
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                                {item.difficulty}
                              </span>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Target size={12} />
                                {item.time}
                              </span>
                            </div>
                          </div>
                          
                          {isCompleted && (
                            <Star className="text-yellow-500 animate-spin" size={16} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Section */}
        {progressPercentage > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-6 border border-purple-500/30" ref={achievementRef}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Zap className="text-purple-400 animate-pulse" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Keep Going! 🚀</h3>
                <p className="text-gray-300">
                  You've completed {completedCount} items. {totalItems - completedCount} more to master {currentTrack.title.toLowerCase()}!
                </p>
              </div>
              <button
                onClick={scrollToTop}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
                title="Back to top"
              >
                <ChevronUp size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scrollPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .scroll-indicator {
          animation: scrollPulse 2s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </div>
  );
};

export default InteractiveRoadmap;