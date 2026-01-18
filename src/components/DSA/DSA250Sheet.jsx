import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Circle, Star, Trophy, Clock, 
  Filter, Search, Users, BarChart3, 
  Flame, Award, ChevronRight, HelpCircle,
  Zap, Code2, Timer, Globe, ArrowUp, ChevronDown
} from 'lucide-react';

const DSA250Sheet = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [showStats, setShowStats] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userStats] = useState({
    totalSolved: 0,
    streak: 7,
    rank: 1247,
    points: 2850,
    weeklyGoal: 5,
    weeklyProgress: 3
  });

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 400);
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

  // Smooth scroll to category
  const scrollToCategory = (category) => {
    setSelectedCategory(category);
    window.scrollTo({
      top: 300,
      behavior: 'smooth'
    });
  };

  // DSA 250 Problems Data (curated list)
  const problems = [
    // Arrays (30 problems)
    { id: 1, title: "Two Sum", category: "Arrays", difficulty: "Easy", importance: 5, companies: ["Google", "Amazon", "Microsoft"], pattern: "Hash Map", timeComplexity: "O(n)" },
    { id: 2, title: "Best Time to Buy and Sell Stock", category: "Arrays", difficulty: "Easy", importance: 5, companies: ["Amazon", "Apple"], pattern: "Greedy", timeComplexity: "O(n)" },
    { id: 3, title: "Contains Duplicate", category: "Arrays", difficulty: "Easy", importance: 4, companies: ["Google", "Apple"], pattern: "Hash Set", timeComplexity: "O(n)" },
    { id: 4, title: "Product of Array Except Self", category: "Arrays", difficulty: "Medium", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Prefix Sum", timeComplexity: "O(n)" },
    { id: 5, title: "Maximum Subarray", category: "Arrays", difficulty: "Medium", importance: 5, companies: ["LinkedIn", "Amazon"], pattern: "Kadane's Algorithm", timeComplexity: "O(n)" },
    { id: 6, title: "Maximum Product Subarray", category: "Arrays", difficulty: "Medium", importance: 4, companies: ["LinkedIn", "Amazon"], pattern: "Dynamic Programming", timeComplexity: "O(n)" },
    { id: 7, title: "Find Minimum in Rotated Sorted Array", category: "Arrays", difficulty: "Medium", importance: 4, companies: ["Amazon", "Microsoft"], pattern: "Binary Search", timeComplexity: "O(log n)" },
    { id: 8, title: "Search in Rotated Sorted Array", category: "Arrays", difficulty: "Medium", importance: 5, companies: ["Facebook", "Amazon"], pattern: "Binary Search", timeComplexity: "O(log n)" },
    { id: 9, title: "3Sum", category: "Arrays", difficulty: "Medium", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Two Pointers", timeComplexity: "O(n²)" },
    { id: 10, title: "Container With Most Water", category: "Arrays", difficulty: "Medium", importance: 5, companies: ["Amazon", "Google"], pattern: "Two Pointers", timeComplexity: "O(n)" },

    // Strings (25 problems)
    { id: 11, title: "Valid Anagram", category: "Strings", difficulty: "Easy", importance: 4, companies: ["Amazon", "Google"], pattern: "Hash Map", timeComplexity: "O(n)" },
    { id: 12, title: "Valid Parentheses", category: "Strings", difficulty: "Easy", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Stack", timeComplexity: "O(n)" },
    { id: 13, title: "Valid Palindrome", category: "Strings", difficulty: "Easy", importance: 4, companies: ["Facebook", "Microsoft"], pattern: "Two Pointers", timeComplexity: "O(n)" },
    { id: 14, title: "Longest Substring Without Repeating Characters", category: "Strings", difficulty: "Medium", importance: 5, companies: ["Amazon", "Adobe"], pattern: "Sliding Window", timeComplexity: "O(n)" },
    { id: 15, title: "Longest Repeating Character Replacement", category: "Strings", difficulty: "Medium", importance: 4, companies: ["Amazon"], pattern: "Sliding Window", timeComplexity: "O(n)" },
    { id: 16, title: "Minimum Window Substring", category: "Strings", difficulty: "Hard", importance: 5, companies: ["Facebook", "Amazon"], pattern: "Sliding Window", timeComplexity: "O(n)" },
    { id: 17, title: "Group Anagrams", category: "Strings", difficulty: "Medium", importance: 4, companies: ["Amazon", "Uber"], pattern: "Hash Map", timeComplexity: "O(n*k log k)" },
    { id: 18, title: "Palindromic Substrings", category: "Strings", difficulty: "Medium", importance: 4, companies: ["Facebook", "Amazon"], pattern: "Dynamic Programming", timeComplexity: "O(n²)" },
    { id: 19, title: "Longest Palindromic Substring", category: "Strings", difficulty: "Medium", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Dynamic Programming", timeComplexity: "O(n²)" },
    { id: 20, title: "Encode and Decode Strings", category: "Strings", difficulty: "Medium", importance: 4, companies: ["Google", "Uber"], pattern: "String Manipulation", timeComplexity: "O(n)" },

    // Linked Lists (15 problems)
    { id: 21, title: "Reverse Linked List", category: "Linked Lists", difficulty: "Easy", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Iterative/Recursive", timeComplexity: "O(n)" },
    { id: 22, title: "Detect Cycle in Linked List", category: "Linked Lists", difficulty: "Easy", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "Floyd's Algorithm", timeComplexity: "O(n)" },
    { id: 23, title: "Merge Two Sorted Lists", category: "Linked Lists", difficulty: "Easy", importance: 5, companies: ["Amazon", "Apple"], pattern: "Two Pointers", timeComplexity: "O(n)" },
    { id: 24, title: "Remove Nth Node From End", category: "Linked Lists", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Two Pointers", timeComplexity: "O(n)" },
    { id: 25, title: "Reorder List", category: "Linked Lists", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Multiple Techniques", timeComplexity: "O(n)" },

    // Trees (35 problems)
    { id: 26, title: "Maximum Depth of Binary Tree", category: "Trees", difficulty: "Easy", importance: 4, companies: ["Amazon", "LinkedIn"], pattern: "DFS/BFS", timeComplexity: "O(n)" },
    { id: 27, title: "Same Tree", category: "Trees", difficulty: "Easy", importance: 4, companies: ["Amazon"], pattern: "DFS", timeComplexity: "O(n)" },
    { id: 28, title: "Invert Binary Tree", category: "Trees", difficulty: "Easy", importance: 4, companies: ["Google", "Amazon"], pattern: "DFS/BFS", timeComplexity: "O(n)" },
    { id: 29, title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium", importance: 5, companies: ["Amazon", "Facebook"], pattern: "BFS", timeComplexity: "O(n)" },
    { id: 30, title: "Serialize and Deserialize Binary Tree", category: "Trees", difficulty: "Hard", importance: 5, companies: ["Amazon", "LinkedIn"], pattern: "DFS/BFS", timeComplexity: "O(n)" },

    // Dynamic Programming (30 problems)
    { id: 31, title: "Climbing Stairs", category: "Dynamic Programming", difficulty: "Easy", importance: 5, companies: ["Amazon", "Adobe"], pattern: "1D DP", timeComplexity: "O(n)" },
    { id: 32, title: "Coin Change", category: "Dynamic Programming", difficulty: "Medium", importance: 5, companies: ["Amazon", "Airbnb"], pattern: "1D DP", timeComplexity: "O(n*m)" },
    { id: 33, title: "Longest Increasing Subsequence", category: "Dynamic Programming", difficulty: "Medium", importance: 5, companies: ["Amazon", "Microsoft"], pattern: "1D DP", timeComplexity: "O(n log n)" },
    { id: 34, title: "Word Break", category: "Dynamic Programming", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "1D DP", timeComplexity: "O(n²)" },
    { id: 35, title: "Combination Sum", category: "Dynamic Programming", difficulty: "Medium", importance: 4, companies: ["Amazon", "Airbnb"], pattern: "Backtracking", timeComplexity: "O(2^n)" },

    // Graphs (25 problems)
    { id: 36, title: "Number of Islands", category: "Graphs", difficulty: "Medium", importance: 5, companies: ["Amazon", "Facebook"], pattern: "DFS/BFS", timeComplexity: "O(m*n)" },
    { id: 37, title: "Clone Graph", category: "Graphs", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "DFS/BFS", timeComplexity: "O(V+E)" },
    { id: 38, title: "Course Schedule", category: "Graphs", difficulty: "Medium", importance: 5, companies: ["Amazon", "Airbnb"], pattern: "Topological Sort", timeComplexity: "O(V+E)" },
    { id: 39, title: "Pacific Atlantic Water Flow", category: "Graphs", difficulty: "Medium", importance: 4, companies: ["Amazon", "Google"], pattern: "DFS", timeComplexity: "O(m*n)" },
    { id: 40, title: "Graph Valid Tree", category: "Graphs", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Union Find", timeComplexity: "O(V+E)" },

    // Intervals (10 problems)
    { id: 41, title: "Merge Intervals", category: "Intervals", difficulty: "Medium", importance: 5, companies: ["Amazon", "Facebook"], pattern: "Sorting", timeComplexity: "O(n log n)" },
    { id: 42, title: "Insert Interval", category: "Intervals", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Array Manipulation", timeComplexity: "O(n)" },
    { id: 43, title: "Non-overlapping Intervals", category: "Intervals", difficulty: "Medium", importance: 4, companies: ["Amazon"], pattern: "Greedy", timeComplexity: "O(n log n)" },
    { id: 44, title: "Meeting Rooms", category: "Intervals", difficulty: "Easy", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Sorting", timeComplexity: "O(n log n)" },
    { id: 45, title: "Meeting Rooms II", category: "Intervals", difficulty: "Medium", importance: 5, companies: ["Amazon", "Google"], pattern: "Heap", timeComplexity: "O(n log n)" },

    // Heaps (15 problems)
    { id: 46, title: "Top K Frequent Elements", category: "Heaps", difficulty: "Medium", importance: 5, companies: ["Amazon", "Yelp"], pattern: "Heap", timeComplexity: "O(n log k)" },
    { id: 47, title: "Find Median from Data Stream", category: "Heaps", difficulty: "Hard", importance: 5, companies: ["Amazon", "Google"], pattern: "Two Heaps", timeComplexity: "O(log n)" },
    { id: 48, title: "Merge k Sorted Lists", category: "Heaps", difficulty: "Hard", importance: 5, companies: ["Amazon", "Uber"], pattern: "Heap", timeComplexity: "O(n log k)" },
    { id: 49, title: "Kth Largest Element in Array", category: "Heaps", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Heap/QuickSelect", timeComplexity: "O(n)" },
    { id: 50, title: "Task Scheduler", category: "Heaps", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Heap/Greedy", timeComplexity: "O(n)" },

    // Tries (10 problems)
    { id: 51, title: "Implement Trie", category: "Tries", difficulty: "Medium", importance: 5, companies: ["Amazon", "Google"], pattern: "Trie", timeComplexity: "O(m)" },
    { id: 52, title: "Add and Search Word", category: "Tries", difficulty: "Medium", importance: 4, companies: ["Amazon", "Facebook"], pattern: "Trie + DFS", timeComplexity: "O(m)" },
    { id: 53, title: "Word Search II", category: "Tries", difficulty: "Hard", importance: 5, companies: ["Amazon", "Airbnb"], pattern: "Trie + Backtracking", timeComplexity: "O(m*n*4^l)" },
    { id: 54, title: "Design Search Autocomplete", category: "Tries", difficulty: "Hard", importance: 4, companies: ["Amazon", "Google"], pattern: "Trie", timeComplexity: "O(p+q)" },
    { id: 55, title: "Replace Words", category: "Tries", difficulty: "Medium", importance: 3, companies: ["Amazon"], pattern: "Trie", timeComplexity: "O(n*m)" },

    // Backtracking (15 problems)
    { id: 56, title: "Subsets", category: "Backtracking", difficulty: "Medium", importance: 5, companies: ["Amazon", "Facebook"], pattern: "Backtracking", timeComplexity: "O(2^n)" },
    { id: 57, title: "Combination Sum", category: "Backtracking", difficulty: "Medium", importance: 4, companies: ["Amazon", "Airbnb"], pattern: "Backtracking", timeComplexity: "O(2^n)" },
    { id: 58, title: "Permutations", category: "Backtracking", difficulty: "Medium", importance: 5, companies: ["Amazon", "LinkedIn"], pattern: "Backtracking", timeComplexity: "O(n!)" },
    { id: 59, title: "Word Search", category: "Backtracking", difficulty: "Medium", importance: 4, companies: ["Amazon", "Microsoft"], pattern: "Backtracking", timeComplexity: "O(m*n*4^l)" },
    { id: 60, title: "N-Queens", category: "Backtracking", difficulty: "Hard", importance: 4, companies: ["Amazon"], pattern: "Backtracking", timeComplexity: "O(n!)" },

    // Math & Bit Manipulation (20 problems)
    { id: 61, title: "Number of 1 Bits", category: "Bit Manipulation", difficulty: "Easy", importance: 4, companies: ["Amazon", "Apple"], pattern: "Bit Manipulation", timeComplexity: "O(1)" },
    { id: 62, title: "Counting Bits", category: "Bit Manipulation", difficulty: "Easy", importance: 4, companies: ["Amazon"], pattern: "Bit Manipulation + DP", timeComplexity: "O(n)" },
    { id: 63, title: "Missing Number", category: "Bit Manipulation", difficulty: "Easy", importance: 4, companies: ["Amazon", "Microsoft"], pattern: "Bit Manipulation", timeComplexity: "O(n)" },
    { id: 64, title: "Reverse Bits", category: "Bit Manipulation", difficulty: "Easy", importance: 3, companies: ["Amazon", "Apple"], pattern: "Bit Manipulation", timeComplexity: "O(1)" },
    { id: 65, title: "Sum of Two Integers", category: "Bit Manipulation", difficulty: "Medium", importance: 4, companies: ["Amazon"], pattern: "Bit Manipulation", timeComplexity: "O(1)" },

    // Design (15 problems)
    { id: 66, title: "LRU Cache", category: "Design", difficulty: "Medium", importance: 5, companies: ["Amazon", "Facebook"], pattern: "Hash Map + DLL", timeComplexity: "O(1)" },
    { id: 67, title: "Min Stack", category: "Design", difficulty: "Medium", importance: 4, companies: ["Amazon"], pattern: "Stack", timeComplexity: "O(1)" },
    { id: 68, title: "Implement Queue using Stacks", category: "Design", difficulty: "Easy", importance: 4, companies: ["Amazon", "Microsoft"], pattern: "Stack", timeComplexity: "O(1)" },
    { id: 69, title: "Design Hit Counter", category: "Design", difficulty: "Medium", importance: 4, companies: ["Amazon", "Dropbox"], pattern: "Queue", timeComplexity: "O(1)" },
    { id: 70, title: "Design Twitter", category: "Design", difficulty: "Medium", importance: 4, companies: ["Amazon", "Twitter"], pattern: "Hash Map + Heap", timeComplexity: "O(log n)" }
  ];

  const categories = ['all', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs', 'Intervals', 'Heaps', 'Tries', 'Backtracking', 'Bit Manipulation', 'Design'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  // Filter problems based on selected filters
  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           problem.pattern.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProblems = problems.length;
    const solvedCount = solvedProblems.size;
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
    
    const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedProblems.has(p.id)).length;
    const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && solvedProblems.has(p.id)).length;
    const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedProblems.has(p.id)).length;

    return {
      total: totalProblems,
      solved: solvedCount,
      percentage: Math.round((solvedCount / totalProblems) * 100),
      easy: { total: easyCount, solved: easySolved },
      medium: { total: mediumCount, solved: mediumSolved },
      hard: { total: hardCount, solved: hardSolved }
    };
  }, [solvedProblems]);

  const toggleProblem = (problemId) => {
    setSolvedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getImportanceStars = (importance) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < importance ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DSA 250 Sheet
              </h1>
              <p className="text-slate-400 mt-2">Curated problems for coding interviews</p>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems, patterns, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Difficulty:</span>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {diff === 'all' ? 'All' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-32 space-y-6">
                  {/* Progress Overview */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Progress
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{stats.solved}</div>
                        <div className="text-slate-400">/ {stats.total} solved</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.percentage}%</div>
                      </div>

                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.percentage}%` }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="text-green-400 font-semibold">{stats.easy.solved}</div>
                          <div className="text-slate-400">Easy</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="text-yellow-400 font-semibold">{stats.medium.solved}</div>
                          <div className="text-slate-400">Medium</div>
                        </div>
                        <div className="text-center p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <div className="text-red-400 font-semibold">{stats.hard.solved}</div>
                          <div className="text-slate-400">Hard</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Your Stats
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-slate-300">Streak</span>
                        </div>
                        <span className="text-orange-400 font-semibold">{userStats.streak} days</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-400" />
                          <span className="text-slate-300">Rank</span>
                        </div>
                        <span className="text-purple-400 font-semibold">#{userStats.rank}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-slate-300">Points</span>
                        </div>
                        <span className="text-yellow-400 font-semibold">{userStats.points}</span>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300 text-sm">Weekly Goal</span>
                          <span className="text-blue-400 text-sm">{userStats.weeklyProgress}/{userStats.weeklyGoal}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(userStats.weeklyProgress / userStats.weeklyGoal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-green-400" />
                      Quick Help
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Click checkbox to mark as solved</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Stars indicate problem importance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Time complexity shown for each problem</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">Companies that ask these problems</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Problems List */}
          <div className={`${showStats ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02 }}
                    className="group bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleProblem(problem.id)}
                        className="flex-shrink-0"
                      >
                        {solvedProblems.has(problem.id) ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400 transition-colors" />
                        )}
                      </motion.button>

                      {/* Problem Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold transition-colors ${
                              solvedProblems.has(problem.id) 
                                ? 'text-green-400 line-through' 
                                : 'text-white group-hover:text-blue-400'
                            }`}>
                              {problem.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs">
                                {problem.category}
                              </span>
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                {problem.pattern}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1">
                              {getImportanceStars(problem.importance)}
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            <span>{problem.timeComplexity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{problem.companies.slice(0, 2).join(', ')}</span>
                            {problem.companies.length > 2 && (
                              <span className="text-blue-400">+{problem.companies.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProblems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No problems found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all group"
          >
            <ArrowUp className="w-6 h-6 text-white group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Category Navigation */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-24 right-8 z-40 bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl max-w-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Quick Jump</h4>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
              {categories.slice(1, 8).map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DSA250Sheet;