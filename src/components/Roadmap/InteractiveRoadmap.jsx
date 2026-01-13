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
  Navigation,
  Rocket,
  Brain,
  Award,
  TrendingUp,
  Activity,
  Flame,
  Crown,
  Medal,
  Sparkles
} from 'lucide-react';

const InteractiveRoadmap = ({ onBack }) => {
  const [selectedTrack, setSelectedTrack] = useState('web');
  const [completedItems, setCompletedItems] = useState(new Set());
  const [animationStep, setAnimationStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showScrollNav, setShowScrollNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [showStats, setShowStats] = useState(false);
  
  // Refs for scrolling
  const headerRef = useRef(null);
  const trackSelectionRef = useRef(null);
  const progressRef = useRef(null);
  const phaseRefs = useRef([]);
  const achievementRef = useRef(null);
  const containerRef = useRef(null);

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
      const scrollPercentage = Math.min((scrollY / documentHeight) * 100, 100);
      
      setScrollProgress(scrollPercentage);
      setShowScrollNav(scrollY > 200);
      
      // Detect current phase based on scroll position
      phaseRefs.current.forEach((ref, index) => {
        if (ref && ref.getBoundingClientRect().top <= 150 && ref.getBoundingClientRect().bottom > 150) {
          setCurrentPhase(index);
        }
      });
    };

    const handleScrollStart = () => {
      setIsScrolling(true);
    };

    const handleScrollEnd = () => {
      setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollStart);
    window.addEventListener('scroll', handleScrollEnd);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollStart);
      window.removeEventListener('scroll', handleScrollEnd);
    };
  }, []);

  // Smooth scroll functions - Welcome page style
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  const scrollToPhase = (phaseIndex) => {
    if (phaseRefs.current[phaseIndex]) {
      phaseRefs.current[phaseIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
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

  // Enhanced scroll navigation
  const scrollToNextPhase = () => {
    const nextPhase = Math.min(currentPhase + 1, currentTrack.phases.length - 1);
    scrollToPhase(nextPhase);
  };

  const scrollToPrevPhase = () => {
    const prevPhase = Math.max(currentPhase - 1, 0);
    scrollToPhase(prevPhase);
  };

  // Full screen scrolling functions
  const scrollPageUp = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    window.scrollTo({ 
      top: Math.max(0, currentScroll - scrollAmount), 
      behavior: 'smooth' 
    });
  };

  const scrollPageDown = () => {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.9; // Scroll 90% of viewport height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ 
      top: Math.min(maxScroll, currentScroll + scrollAmount), 
      behavior: 'smooth' 
    });
  };

  // Reset all progress
  const resetProgress = () => {
    setCompletedItems(new Set());
  };

  // Clear progress for current track only
  const clearTrackProgress = () => {
    const currentTrackItems = currentTrack.phases.flatMap(phase => phase.items.map(item => item.id));
    const newCompleted = new Set([...completedItems].filter(id => !currentTrackItems.includes(id)));
    setCompletedItems(newCompleted);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Full screen scrolling with Page Up/Down and Space
      if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        scrollPageDown();
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        scrollPageUp();
      } 
      // Phase navigation with arrow keys
      else if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        scrollToNextPhase();
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        scrollToPrevPhase();
      }
      // Quick navigation
      else if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        scrollToTop();
      } else if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        scrollToBottom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPhase]);

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
            { id: 'html', title: 'HTML5 Fundamentals', difficulty: 'Beginner', time: '2 weeks', completed: false },
            { id: 'css', title: 'CSS3 & Flexbox/Grid', difficulty: 'Beginner', time: '3 weeks', completed: false },
            { id: 'js-basics', title: 'JavaScript Basics', difficulty: 'Beginner', time: '4 weeks', completed: false },
            { id: 'responsive', title: 'Responsive Design', difficulty: 'Intermediate', time: '2 weeks', completed: false }
          ]
        },
        {
          title: "Frontend Frameworks",
          duration: "3-4 months",
          items: [
            { id: 'react', title: 'React.js Fundamentals', difficulty: 'Intermediate', time: '6 weeks', completed: false },
            { id: 'state-mgmt', title: 'State Management (Redux/Context)', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'routing', title: 'React Router', difficulty: 'Intermediate', time: '2 weeks', completed: false },
            { id: 'hooks', title: 'Advanced React Hooks', difficulty: 'Advanced', time: '3 weeks', completed: false }
          ]
        },
        {
          title: "Backend Development",
          duration: "4-5 months",
          items: [
            { id: 'nodejs', title: 'Node.js & Express', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'databases', title: 'Databases (MongoDB/PostgreSQL)', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'apis', title: 'RESTful APIs & GraphQL', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'auth', title: 'Authentication & Security', difficulty: 'Advanced', time: '3 weeks', completed: false }
          ]
        },
        {
          title: "Advanced Topics",
          duration: "3-4 months",
          items: [
            { id: 'testing', title: 'Testing (Jest, Cypress)', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'deployment', title: 'Deployment & DevOps', difficulty: 'Advanced', time: '3 weeks', completed: false },
            { id: 'performance', title: 'Performance Optimization', difficulty: 'Advanced', time: '3 weeks', completed: false },
            { id: 'pwa', title: 'Progressive Web Apps', difficulty: 'Advanced', time: '2 weeks', completed: false }
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
            { id: 'java-kotlin', title: 'Java/Kotlin Fundamentals', difficulty: 'Beginner', time: '4 weeks', completed: false },
            { id: 'android-studio', title: 'Android Studio Setup', difficulty: 'Beginner', time: '1 week', completed: false },
            { id: 'activities', title: 'Activities & Intents', difficulty: 'Beginner', time: '3 weeks', completed: false },
            { id: 'layouts', title: 'Layouts & UI Components', difficulty: 'Beginner', time: '4 weeks', completed: false }
          ]
        },
        {
          title: "UI/UX Development",
          duration: "3-4 months",
          items: [
            { id: 'material-design', title: 'Material Design', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'fragments', title: 'Fragments & Navigation', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'recyclerview', title: 'RecyclerView & Adapters', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'animations', title: 'Animations & Transitions', difficulty: 'Intermediate', time: '2 weeks', completed: false }
          ]
        },
        {
          title: "Data & Networking",
          duration: "3-4 months",
          items: [
            { id: 'room-db', title: 'Room Database', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'retrofit', title: 'Retrofit & API Integration', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'mvvm', title: 'MVVM Architecture', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'data-binding', title: 'Data Binding & LiveData', difficulty: 'Advanced', time: '3 weeks', completed: false }
          ]
        },
        {
          title: "Advanced Features",
          duration: "4-5 months",
          items: [
            { id: 'jetpack-compose', title: 'Jetpack Compose', difficulty: 'Advanced', time: '6 weeks', completed: false },
            { id: 'background-tasks', title: 'Background Processing', difficulty: 'Advanced', time: '3 weeks', completed: false },
            { id: 'testing-android', title: 'Android Testing', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'publishing', title: 'Play Store Publishing', difficulty: 'Advanced', time: '2 weeks', completed: false }
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
            { id: 'complexity', title: 'Time & Space Complexity', difficulty: 'Beginner', time: '2 weeks', completed: false },
            { id: 'arrays', title: 'Arrays & Strings', difficulty: 'Beginner', time: '3 weeks', completed: false },
            { id: 'linked-lists', title: 'Linked Lists', difficulty: 'Beginner', time: '3 weeks', completed: false },
            { id: 'stacks-queues', title: 'Stacks & Queues', difficulty: 'Beginner', time: '2 weeks', completed: false }
          ]
        },
        {
          title: "Intermediate Structures",
          duration: "3-4 months",
          items: [
            { id: 'trees', title: 'Binary Trees & BST', difficulty: 'Intermediate', time: '4 weeks', completed: false },
            { id: 'heaps', title: 'Heaps & Priority Queues', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'hashing', title: 'Hash Tables & Maps', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'graphs-basic', title: 'Graph Basics', difficulty: 'Intermediate', time: '4 weeks', completed: false }
          ]
        },
        {
          title: "Algorithms",
          duration: "4-5 months",
          items: [
            { id: 'sorting', title: 'Sorting Algorithms', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'searching', title: 'Binary Search & Variants', difficulty: 'Intermediate', time: '3 weeks', completed: false },
            { id: 'recursion', title: 'Recursion & Backtracking', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'dp', title: 'Dynamic Programming', difficulty: 'Advanced', time: '6 weeks', completed: false }
          ]
        },
        {
          title: "Advanced Topics",
          duration: "3-4 months",
          items: [
            { id: 'graph-algorithms', title: 'Graph Algorithms (DFS/BFS)', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'greedy', title: 'Greedy Algorithms', difficulty: 'Advanced', time: '3 weeks', completed: false },
            { id: 'advanced-trees', title: 'Advanced Trees (Trie, Segment)', difficulty: 'Advanced', time: '4 weeks', completed: false },
            { id: 'system-design', title: 'System Design Basics', difficulty: 'Advanced', time: '4 weeks', completed: false }
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
      // Update streak
      const today = new Date().toDateString();
      if (lastCompletedDate !== today) {
        setStreakCount(prev => prev + 1);
        setLastCompletedDate(today);
      }
    }
    setCompletedItems(newCompleted);
  };

  // Calculate achievements
  const getAchievements = () => {
    const achievements = [];
    const completedCount = completedItems.size;
    
    if (completedCount >= 1) achievements.push({ title: "First Step", icon: <Target size={16} />, color: "text-green-400" });
    if (completedCount >= 5) achievements.push({ title: "Getting Started", icon: <Rocket size={16} />, color: "text-blue-400" });
    if (completedCount >= 10) achievements.push({ title: "On Fire", icon: <Flame size={16} />, color: "text-orange-400" });
    if (completedCount >= 25) achievements.push({ title: "Dedicated Learner", icon: <Medal size={16} />, color: "text-purple-400" });
    if (completedCount >= 50) achievements.push({ title: "Master", icon: <Crown size={16} />, color: "text-yellow-400" });
    if (streakCount >= 7) achievements.push({ title: "Week Warrior", icon: <Activity size={16} />, color: "text-pink-400" });
    
    return achievements;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative scroll-smooth">
      {/* Welcome Page Style Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 shadow-2xl">
        <div className="flex flex-col space-y-3">
          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to top (Ctrl+Home)"
          >
            <ChevronUp size={20} />
          </button>

          {/* Page Up - Full screen scroll */}
          <button
            onClick={scrollPageUp}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Up (Page Up / Shift+Space)"
          >
            <ChevronUp size={16} className="opacity-75" />
          </button>

          {/* Previous phase */}
          <button
            onClick={scrollToPrevPhase}
            disabled={currentPhase === 0}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPhase === 0 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Previous phase (Ctrl+↑)"
          >
            <Navigation size={16} className="rotate-180" />
          </button>

          {/* Phase indicators */}
          <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
            {currentTrack.phases.map((phase, index) => {
              const isActive = currentPhase === index;
              const phaseCompleted = phase.items.filter(item => completedItems.has(item.id)).length;
              const isCompleted = phaseCompleted === phase.items.length;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToPhase(index)}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : isCompleted
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={`Phase ${index + 1}: ${phase.title}`}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-gray-700">
                    <div className="font-medium">Phase {index + 1}: {phase.title}</div>
                    <div className="text-gray-400 text-xs mt-1">{phase.duration}</div>
                    <div className="text-gray-400 text-xs">{phaseCompleted}/{phase.items.length} completed</div>
                    
                    {/* Arrow */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 border-gray-700 rotate-45 border-l border-t"></div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next phase */}
          <button
            onClick={scrollToNextPhase}
            disabled={currentPhase === currentTrack.phases.length - 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPhase === currentTrack.phases.length - 1
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            title="Next phase (Ctrl+↓)"
          >
            <Navigation size={16} />
          </button>

          {/* Page Down - Full screen scroll */}
          <button
            onClick={scrollPageDown}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Page Down (Page Down / Space)"
          >
            <ChevronDown size={16} className="opacity-75" />
          </button>
          
          {/* Scroll to bottom */}
          <button
            onClick={scrollToBottom}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Scroll to bottom (Ctrl+End)"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Progress</div>
            <div className="text-xs font-medium text-blue-400">
              {Math.round(progressPercentage)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className={`h-full bg-gradient-to-r from-${currentTrack.color}-500 to-${currentTrack.color}-400 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase info and shortcuts */}
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-500 mb-1">
            Phase {currentPhase + 1} / {currentTrack.phases.length}
          </div>
          <div className="text-xs text-gray-600">
            Space/PgDn: Page scroll
          </div>
        </div>
      </div>

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
            const trackItems = track.phases.flatMap(phase => phase.items);
            const trackCompleted = trackItems.filter(item => completedItems.has(item.id)).length;
            const trackProgress = (trackCompleted / trackItems.length) * 100;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedTrack(key)}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? `border-${track.color}-500 bg-${track.color}-500/20 shadow-lg shadow-${track.color}-500/25` 
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                {/* Progress Ring */}
                {trackProgress > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative w-8 h-8">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-600"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${trackProgress * 0.88} 88`}
                          className={`text-${track.color}-400`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{Math.round(trackProgress)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <IconComponent 
                    size={40} 
                    className={`${isSelected ? `text-${track.color}-400` : 'text-gray-400'}`} 
                  />
                  <div className="text-center">
                    <h3 className={`font-bold text-lg ${isSelected ? `text-${track.color}-300` : 'text-gray-300'}`}>
                      {track.title.split(' ')[0]}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{track.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {trackCompleted}/{trackItems.length} completed
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Progress Overview */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-gray-700" ref={progressRef}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
              <p className="text-gray-400 text-lg">{currentTrack.description}</p>
            </div>
            <div className="flex items-center gap-6">
              {/* Stats Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 hover:text-blue-300 rounded-xl transition-all duration-200"
                title="View detailed statistics"
              >
                <TrendingUp size={20} />
              </button>
              
              {/* Achievements Toggle */}
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-400 hover:text-purple-300 rounded-xl transition-all duration-200"
                title="View achievements"
              >
                <Award size={20} />
              </button>

              <div className="text-right">
                <div className="text-4xl font-bold text-blue-400">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-gray-400">{completedCount}/{totalItems} completed</div>
                {streakCount > 0 && (
                  <div className="text-xs text-orange-400 flex items-center gap-1 mt-1">
                    <Flame size={12} />
                    {streakCount} day streak
                  </div>
                )}
              </div>
              
              {progressPercentage > 0 && (
                <button
                  onClick={clearTrackProgress}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-all duration-200"
                  title="Reset progress for this track"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Stats Panel */}
          {showStats && (
            <div className="mb-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain size={20} className="text-blue-400" />
                Learning Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                  <div className="text-sm text-gray-400">Items Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{currentTrack.phases.length}</div>
                  <div className="text-sm text-gray-400">Learning Phases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{streakCount}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{getAchievements().length}</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Panel */}
          {showAchievements && (
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                Your Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getAchievements().map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className={achievement.color}>
                      {achievement.icon}
                    </div>
                    <span className="text-white font-medium">{achievement.title}</span>
                  </div>
                ))}
                {getAchievements().length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-4">
                    Complete your first item to unlock achievements!
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
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
        <div className="space-y-16">
          {currentTrack.phases.map((phase, phaseIndex) => {
            const phaseCompleted = phase.items.filter(item => completedItems.has(item.id)).length;
            const phaseProgress = (phaseCompleted / phase.items.length) * 100;
            
            return (
              <div 
                key={phaseIndex}
                ref={el => phaseRefs.current[phaseIndex] = el}
                className={`bg-gray-800/30 rounded-xl p-6 border border-gray-700 backdrop-blur-sm transition-all duration-500 scroll-mt-32 min-h-[60vh] ${
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

        {/* Achievement Section - Only show when user has made progress */}
        {progressPercentage > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-6 border border-purple-500/30" ref={achievementRef}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Zap className="text-purple-400 animate-pulse" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Great Progress! 🚀</h3>
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

        {/* Getting Started Section - Show when user has 0% progress */}
        {progressPercentage === 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-800/30 to-green-800/30 rounded-xl p-6 border border-blue-500/30" ref={achievementRef}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Target className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Ready to Start Your Journey? 🎯</h3>
                <p className="text-gray-300">
                  Choose items from the roadmap above to begin tracking your progress. Click on any item to mark it as completed!
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