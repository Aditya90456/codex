import { useState, useEffect } from 'react';
import { BookOpen, Code, Gamepad2, List, ArrowLeft, Box, ArrowUp } from 'lucide-react';
import DSAComicViewer from '../components/DSA/DSAComicViewer';
import DSAProblemsList from '../components/DSA/DSAProblemsList';
import DSA250Sheet from '../components/DSA/DSA250Sheet';
import DSAGame from '../components/DSA/DSAGame';
import DSA3DTutorial from '../components/DSA/DSA3DTutorial';

const DSATutorialPage = () => {
  const [activeMode, setActiveMode] = useState('menu');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to modes section
  const scrollToModes = () => {
    const element = document.getElementById('modes-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const modes = [
    {
      id: '3d',
      title: '🎬 3D Interactive Tutorial',
      description: 'Stunning 3D visualizations with rotation',
      icon: Box,
      color: 'from-cyan-500 to-blue-500',
      emoji: '🎯'
    },
    {
      id: 'comics',
      title: '📚 Visual Comics',
      description: 'Learn with animated stories and pictures',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      emoji: '🎨'
    },
    {
      id: 'practice',
      title: '💻 Practice Problems',
      description: 'Solve coding challenges step by step',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      emoji: '⚡'
    },
    {
      id: 'sheet',
      title: '📋 DSA 250 Sheet',
      description: 'Complete curated problem list',
      icon: List,
      color: 'from-green-500 to-emerald-500',
      emoji: '✅'
    },
    {
      id: 'game',
      title: '🎮 Interactive Game',
      description: 'Learn by playing and visualizing',
      icon: Gamepad2,
      color: 'from-orange-500 to-red-500',
      emoji: '🎯'
    }
  ];

  const renderContent = () => {
    switch (activeMode) {
      case '3d':
        return <DSA3DTutorial />;
      case 'comics':
        return <DSAComicViewer onBack={() => setActiveMode('menu')} />;
      case 'practice':
        return <DSAProblemsList onProblemSelect={setSelectedProblem} />;
      case 'sheet':
        return <DSA250Sheet />;
      case 'game':
        return <DSAGame />;
      default:
        return null;
    }
  };

  if (activeMode !== 'menu') {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveMode('menu')}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl text-white hover:bg-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            DSA Learning Hub
          </h1>
          <p className="text-2xl text-slate-300 mb-2">
            Learn Data Structures & Algorithms Visually
          </p>
          <p className="text-xl text-slate-400">
            👁️ Watch • 📖 Read • 🎮 Play • ✍️ Practice
          </p>
          <p className="text-lg text-slate-500 mt-4">
            No speaking required - Everything is visual and interactive!
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="modes-section">
          {modes.map((mode, index) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-3xl p-8 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 text-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-3xl`}>
                    {mode.emoji}
                  </div>
                  <mode.icon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                  {mode.title}
                </h3>
                
                <p className="text-slate-400 text-lg group-hover:text-slate-300 transition-colors">
                  {mode.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold">Start Learning</span>
                  <svg className="w-4 h-4 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🎬', text: 'Animated Tutorials' },
            { emoji: '📊', text: 'Visual Diagrams' },
            { emoji: '🎯', text: 'Interactive Practice' },
            { emoji: '🏆', text: 'Track Progress' }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center hover:bg-slate-800/50 transition-all"
            >
              <div className="text-3xl mb-2">{feature.emoji}</div>
              <div className="text-slate-300 text-sm">{feature.text}</div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
          <p className="text-blue-300 text-lg">
            💡 <strong>Tip:</strong> All tutorials use visuals, animations, and text - perfect for learning without audio!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default DSATutorialPage;
