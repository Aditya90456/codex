import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  dsa250Problems,
  getTopCompanies
} from '../../data/dsa250Problems';
import {
  Trophy,
  Zap,
  CheckCircle,
  Circle,
  Filter,
  Search,
  Star,
  ChevronRight,
  ExternalLink,
  Play,
  ChevronUp,
  ArrowUp,
  Cloud,
  CloudOff
} from 'lucide-react';

const DSA250Awesome = ({ onBack }) => {
  const { user } = useUser();
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProblems, setFilteredProblems] = useState(dsa250Problems);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('id'); // id, difficulty, importance
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const containerRef = useRef(null);
  const problemsGridRef = useRef(null);
  
  const topCompanies = getTopCompanies();

  const categories = ['All', ...new Set(dsa250Problems.map(p => p.category))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const companies = ['All', ...topCompanies.slice(0, 10).map(c => c.company)];

  // Load solved problems from Clerk user metadata on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        try {
          // Load from unsafeMetadata (user-writable)
          const savedProgress = user.unsafeMetadata?.dsa250Progress || [];
          setSolvedProblems(new Set(savedProgress));
          setLastSyncTime(new Date());
        } catch (error) {
          console.error('Error loading progress:', error);
          // Fallback to localStorage
          const localProgress = localStorage.getItem('dsa250-progress');
          if (localProgress) {
            setSolvedProblems(new Set(JSON.parse(localProgress)));
          }
        }
      } else {
        // Load from localStorage if not logged in
        const localProgress = localStorage.getItem('dsa250-progress');
        if (localProgress) {
          setSolvedProblems(new Set(JSON.parse(localProgress)));
        }
      }
    };
    loadProgress();
  }, [user]);

  // Save progress to cloud (Clerk) and localStorage
  const saveProgress = async (newSolvedSet) => {
    setSolvedProblems(newSolvedSet);
    const progressArray = Array.from(newSolvedSet);
    
    // Always save to localStorage
    localStorage.setItem('dsa250-progress', JSON.stringify(progressArray));
    
    // Save to cloud if user is logged in
    if (user) {
      setIsSyncing(true);
      try {
        // Use unsafeMetadata for user-writable data
        await user.update({
          unsafeMetadata: {
            dsa250Progress: progressArray,
            lastUpdated: new Date().toISOString()
          }
        });
        setLastSyncTime(new Date());
      } catch (error) {
        console.error('Error syncing to cloud:', error);
        // Silently fail - localStorage still works
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Toggle problem solved status
  const toggleProblemSolved = (problemId) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(problemId)) {
      newSolved.delete(problemId);
    } else {
      newSolved.add(problemId);
    }
    saveProgress(newSolved);
  };

  // Calculate stats based on solved problems
  const solvedCount = solvedProblems.size;
  const totalCount = dsa250Problems.length;
  const progressPercentage = Math.round((solvedCount / totalCount) * 100);
  
  const solvedByDifficulty = {
    Easy: dsa250Problems.filter(p => p.difficulty === 'Easy' && solvedProblems.has(p.id)).length,
    Medium: dsa250Problems.filter(p => p.difficulty === 'Medium' && solvedProblems.has(p.id)).length,
    Hard: dsa250Problems.filter(p => p.difficulty === 'Hard' && solvedProblems.has(p.id)).length
  };

  const totalByDifficulty = {
    Easy: dsa250Problems.filter(p => p.difficulty === 'Easy').length,
    Medium: dsa250Problems.filter(p => p.difficulty === 'Medium').length,
    Hard: dsa250Problems.filter(p => p.difficulty === 'Hard').length
  };

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

  // Smooth scroll to top
  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll to problems section
  const scrollToProblems = () => {
    problemsGridRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Filter problems
  useEffect(() => {
    let filtered = [...dsa250Problems];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedCompany !== 'All') {
      filtered = filtered.filter(p => p.companies.includes(selectedCompany));
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pattern.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'difficulty') {
        const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      } else if (sortBy === 'importance') {
        return b.importance - a.importance;
      }
      return a.id - b.id;
    });

    setFilteredProblems(filtered);
  }, [selectedCategory, selectedDifficulty, selectedCompany, searchQuery, sortBy]);

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Arrays': 'from-blue-500 to-cyan-500',
      'Strings': 'from-purple-500 to-pink-500',
      'Linked Lists': 'from-green-500 to-emerald-500',
      'Trees': 'from-orange-500 to-red-500',
      'Dynamic Programming': 'from-indigo-500 to-purple-500',
      'Graphs': 'from-teal-500 to-cyan-500',
      'Backtracking': 'from-rose-500 to-pink-500',
      'Heaps': 'from-violet-500 to-purple-500',
      'Stacks': 'from-amber-500 to-orange-500',
      'Bit Manipulation': 'from-cyan-500 to-blue-500',
      'Math': 'from-pink-500 to-rose-500',
      'Greedy': 'from-lime-500 to-green-500',
      'Trie': 'from-fuchsia-500 to-pink-500',
      'Union Find': 'from-sky-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 animate-in slide-in-from-bottom"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        <button
          onClick={scrollToTop}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-blue-500 rounded-full transition-all"
          title="Top"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Top
          </span>
        </button>
        <button
          onClick={scrollToProblems}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-purple-500 rounded-full transition-all"
          title="Problems"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Problems
          </span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-4"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to Home</span>
                  </button>
                )}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      DSA 250
                    </h1>
                    <p className="text-slate-400 text-lg">Master Data Structures & Algorithms</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {solvedCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Solved</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {progressPercentage}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Progress</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {totalCount}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Total</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Overall Progress</span>
                <span>{solvedCount} / {totalCount} problems</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">{progressPercentage}%</div>

              {/* Cloud Sync Status */}
              {user && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    {isSyncing ? (
                      <>
                        <Cloud className="w-4 h-4 animate-pulse text-blue-400" />
                        <span>Syncing...</span>
                      </>
                    ) : lastSyncTime ? (
                      <>
                        <Cloud className="w-4 h-4 text-green-400" />
                        <span>Synced {lastSyncTime.toLocaleTimeString()}</span>
                      </>
                    ) : (
                      <>
                        <CloudOff className="w-4 h-4 text-slate-500" />
                        <span>Not synced</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Difficulty Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold">Easy</span>
                  <span className="text-2xl font-bold text-green-400">{solvedByDifficulty.Easy}/{totalByDifficulty.Easy}</span>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold">Medium</span>
                  <span className="text-2xl font-bold text-yellow-400">{solvedByDifficulty.Medium}/{totalByDifficulty.Medium}</span>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-semibold">Hard</span>
                  <span className="text-2xl font-bold text-red-400">{solvedByDifficulty.Hard}/{totalByDifficulty.Hard}</span>
                </div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToProblems}
                className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group"
              >
                <span className="text-sm font-medium">Explore Problems</span>
                <ChevronUp className="w-6 h-6 rotate-180 animate-bounce group-hover:text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8">
            {/* Search Bar */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search problems by title or pattern..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 text-white pl-12 pr-4 py-4 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                  showFilters 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-slate-700">
                {/* Category Filter */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none"
                  >
                    {companies.map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sort & View Options */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">Sort by:</span>
                <button
                  onClick={() => setSortBy('id')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    sortBy === 'id' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setSortBy('difficulty')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    sortBy === 'difficulty' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Difficulty
                </button>
                <button
                  onClick={() => setSortBy('importance')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    sortBy === 'importance' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Importance
                </button>
              </div>

              <div className="text-sm text-slate-400">
                Showing <span className="text-white font-semibold">{filteredProblems.length}</span> problems
              </div>
            </div>
          </div>

          {/* Problems Grid */}
          <div 
            ref={problemsGridRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-8"
          >
            {filteredProblems.map((problem) => {
              const isSolved = solvedProblems.has(problem.id);
              return (
              <div
                key={problem.id}
                className={`group relative bg-slate-800/50 backdrop-blur border rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 ${
                  isSolved ? 'border-green-500/50 bg-green-900/10' : 'border-slate-700 hover:border-blue-500/50'
                }`}
              >
                {/* Problem Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(problem.category)} rounded-xl flex items-center justify-center text-white font-bold`}>
                      {problem.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {problem.title}
                      </h3>
                      <p className="text-xs text-slate-400">{problem.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleProblemSolved(problem.id)}
                    className="flex-shrink-0 transition-all hover:scale-110"
                    title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                  >
                    {isSolved ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Difficulty & Importance */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyBg(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < problem.importance ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                </div>

                {/* Pattern */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap size={14} className="text-purple-400" />
                    <span className="text-slate-300">{problem.pattern}</span>
                  </div>
                </div>

                {/* Complexity */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <div className="text-slate-400 mb-1">Time</div>
                    <div className="text-green-400 font-mono">{problem.timeComplexity}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <div className="text-slate-400 mb-1">Space</div>
                    <div className="text-blue-400 font-mono">{problem.spaceComplexity}</div>
                  </div>
                </div>

                {/* Companies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {problem.companies.slice(0, 3).map((company, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-semibold"
                      >
                        {company}
                      </span>
                    ))}
                    {problem.companies.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                        +{problem.companies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all transform group-hover:scale-105"
                >
                  <Play size={16} />
                  <span>Solve on LeetCode</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            );
            })}
          </div>

          {/* Empty State */}
          {filteredProblems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No problems found</h3>
              <p className="text-slate-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSA250Awesome;
