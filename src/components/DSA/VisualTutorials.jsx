import { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  CheckCircle,
  Clock,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  Code,
  Zap,
  Target,
  ChevronRight,
  ArrowUp,
  ChevronUp,
  Layers,
  GitBranch,
  Box,
  List,
  Binary
} from 'lucide-react';

const VisualTutorials = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const tutorialsRef = useRef(null);

  const tutorials = [
    {
      id: 1,
      title: 'Arrays & Sorting Algorithms',
      description: 'Visual guide to bubble sort, merge sort, quick sort with step-by-step animations',
      category: 'Arrays',
      duration: '45 min',
      lessons: 12,
      difficulty: 'Beginner',
      rating: 4.9,
      students: 15420,
      thumbnail: '🔢',
      color: 'from-blue-500 to-cyan-500',
      topics: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Binary Search']
    },
    {
      id: 2,
      title: 'Linked Lists Mastery',
      description: 'Master singly, doubly, and circular linked lists with interactive visualizations',
      category: 'Linked Lists',
      duration: '38 min',
      lessons: 10,
      difficulty: 'Beginner',
      rating: 4.8,
      students: 12350,
      thumbnail: '🔗',
      color: 'from-green-500 to-emerald-500',
      topics: ['Singly Linked List', 'Doubly Linked List', 'Circular List', 'Reversal']
    },
    {
      id: 3,
      title: 'Binary Trees & BST',
      description: 'Explore tree traversals, BST operations, and balancing with 3D animations',
      category: 'Trees',
      duration: '52 min',
      lessons: 15,
      difficulty: 'Intermediate',
      rating: 4.9,
      students: 18900,
      thumbnail: '🌳',
      color: 'from-purple-500 to-pink-500',
      topics: ['Inorder', 'Preorder', 'Postorder', 'BST Operations', 'AVL Trees']
    },
    {
      id: 4,
      title: 'Graph Algorithms',
      description: 'BFS, DFS, Dijkstra, and more with interactive graph visualizations',
      category: 'Graphs',
      duration: '65 min',
      lessons: 18,
      difficulty: 'Advanced',
      rating: 4.9,
      students: 14200,
      thumbnail: '🕸️',
      color: 'from-orange-500 to-red-500',
      topics: ['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Kruskal', 'Prim']
    },
    {
      id: 5,
      title: 'Dynamic Programming',
      description: 'Master DP patterns with visual state transitions and memoization',
      category: 'Dynamic Programming',
      duration: '70 min',
      lessons: 20,
      difficulty: 'Advanced',
      rating: 4.8,
      students: 11500,
      thumbnail: '💎',
      color: 'from-indigo-500 to-purple-500',
      topics: ['Fibonacci', 'Knapsack', 'LCS', 'LIS', 'Matrix Chain']
    },
    {
      id: 6,
      title: 'Stacks & Queues',
      description: 'Learn stack and queue operations with real-world examples',
      category: 'Stacks',
      duration: '35 min',
      lessons: 9,
      difficulty: 'Beginner',
      rating: 4.7,
      students: 13800,
      thumbnail: '📚',
      color: 'from-teal-500 to-cyan-500',
      topics: ['Stack Operations', 'Queue Operations', 'Priority Queue', 'Deque']
    },
    {
      id: 7,
      title: 'Hash Tables & Maps',
      description: 'Understand hashing, collision resolution, and hash map internals',
      category: 'Hashing',
      duration: '42 min',
      lessons: 11,
      difficulty: 'Intermediate',
      rating: 4.8,
      students: 10200,
      thumbnail: '🗂️',
      color: 'from-rose-500 to-pink-500',
      topics: ['Hash Functions', 'Chaining', 'Open Addressing', 'HashMap']
    },
    {
      id: 8,
      title: 'Heaps & Priority Queues',
      description: 'Master min/max heaps and priority queue operations visually',
      category: 'Heaps',
      duration: '40 min',
      lessons: 10,
      difficulty: 'Intermediate',
      rating: 4.7,
      students: 9800,
      thumbnail: '⛰️',
      color: 'from-violet-500 to-purple-500',
      topics: ['Min Heap', 'Max Heap', 'Heapify', 'Heap Sort']
    },
    {
      id: 9,
      title: 'Backtracking Patterns',
      description: 'Solve N-Queens, Sudoku, and more with backtracking visualizations',
      category: 'Backtracking',
      duration: '48 min',
      lessons: 13,
      difficulty: 'Advanced',
      rating: 4.9,
      students: 8500,
      thumbnail: '🔄',
      color: 'from-amber-500 to-orange-500',
      topics: ['N-Queens', 'Sudoku', 'Permutations', 'Combinations']
    }
  ];

  const categories = ['All', ...new Set(tutorials.map(t => t.category))];
  const filteredTutorials = selectedCategory === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTutorials = () => {
    tutorialsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 animate-in slide-in-from-bottom"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        <button
          onClick={scrollToTop}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-cyan-500 rounded-full transition-all"
          title="Top"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Top
          </span>
        </button>
        <button
          onClick={scrollToTutorials}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-blue-500 rounded-full transition-all"
          title="Tutorials"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Tutorials
          </span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 backdrop-blur border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span>Back to Home</span>
              </button>
            )}

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Visual Tutorials
                  </h1>
                  <p className="text-slate-400 text-xl mt-2">Learn DSA with Interactive Animations</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {tutorials.length}
                </div>
                <div className="text-sm text-slate-400 mt-1">Tutorials</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {tutorials.reduce((sum, t) => sum + t.lessons, 0)}
                </div>
                <div className="text-sm text-slate-400 mt-1">Lessons</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {Math.round(tutorials.reduce((sum, t) => sum + t.rating, 0) / tutorials.length * 10) / 10}
                </div>
                <div className="text-sm text-slate-400 mt-1">Avg Rating</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  {(tutorials.reduce((sum, t) => sum + t.students, 0) / 1000).toFixed(0)}K+
                </div>
                <div className="text-sm text-slate-400 mt-1">Students</div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToTutorials}
                className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group"
              >
                <span className="text-sm font-medium">Explore Tutorials</span>
                <ChevronUp className="w-6 h-6 rotate-180 animate-bounce group-hover:text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tutorials Grid */}
          <div 
            ref={tutorialsRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-8"
          >
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Thumbnail */}
                <div className={`w-full h-40 bg-gradient-to-r ${tutorial.color} rounded-xl flex items-center justify-center text-6xl mb-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <span className="relative z-10">{tutorial.thumbnail}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur px-3 py-1 rounded-lg flex items-center space-x-1">
                    <Play size={14} className="text-white" />
                    <span className="text-white text-sm font-semibold">{tutorial.lessons} lessons</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold text-sm">{tutorial.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock size={14} />
                    <span>{tutorial.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Users size={14} />
                    <span>{(tutorial.students / 1000).toFixed(1)}K students</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tutorial.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                    {tutorial.topics.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                        +{tutorial.topics.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all transform group-hover:scale-105 flex items-center justify-center space-x-2">
                  <Play size={16} />
                  <span>Start Learning</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualTutorials;
