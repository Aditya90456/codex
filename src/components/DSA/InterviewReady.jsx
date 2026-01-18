import { useState, useEffect, useRef } from 'react';
import {
  Award,
  CheckCircle,
  Circle,
  Star,
  Code,
  ChevronRight,
  ArrowUp,
  ChevronUp,
  Zap,
  Flame,
  ExternalLink
} from 'lucide-react';

const InterviewReady = ({ onBack }) => {
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const questionsRef = useRef(null);

  const interviewQuestions = [
    {
      id: 1,
      title: 'Two Sum Problem',
      company: 'Google',
      difficulty: 'Easy',
      frequency: 95,
      category: 'Arrays',
      pattern: 'Hash Map',
      askedIn: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      solved: false,
      importance: 5,
      tips: 'Use hash map to store complements',
      commonMistakes: ['Not handling duplicates', 'Wrong index return'],
      leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
    },
    {
      id: 2,
      title: 'Reverse Linked List',
      company: 'Amazon',
      difficulty: 'Easy',
      frequency: 92,
      category: 'Linked Lists',
      pattern: 'Two Pointers',
      askedIn: ['Amazon', 'Microsoft', 'Apple', 'Facebook'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      solved: false,
      importance: 5,
      tips: 'Track prev, current, and next pointers',
      commonMistakes: ['Losing reference to next node', 'Not handling empty list'],
      leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/'
    },
    {
      id: 3,
      title: 'Valid Parentheses',
      company: 'Facebook',
      difficulty: 'Easy',
      frequency: 88,
      category: 'Stacks',
      pattern: 'Stack',
      askedIn: ['Facebook', 'Google', 'Amazon', 'Bloomberg'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      solved: false,
      importance: 5,
      tips: 'Use stack to match opening and closing brackets',
      commonMistakes: ['Not checking stack empty at end', 'Wrong bracket matching'],
      leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/'
    },
    {
      id: 4,
      title: 'Binary Tree Level Order Traversal',
      company: 'Microsoft',
      difficulty: 'Medium',
      frequency: 90,
      category: 'Trees',
      pattern: 'BFS',
      askedIn: ['Microsoft', 'Amazon', 'Facebook', 'Apple'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      solved: false,
      importance: 5,
      tips: 'Use queue for level-by-level traversal',
      commonMistakes: ['Not tracking level size', 'Wrong queue implementation'],
      leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
    },
    {
      id: 5,
      title: 'Longest Substring Without Repeating',
      company: 'Amazon',
      difficulty: 'Medium',
      frequency: 87,
      category: 'Strings',
      pattern: 'Sliding Window',
      askedIn: ['Amazon', 'Google', 'Facebook', 'Adobe'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(m,n))',
      solved: false,
      importance: 5,
      tips: 'Use sliding window with hash set',
      commonMistakes: ['Not updating window correctly', 'Wrong max length calculation'],
      leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
    },
    {
      id: 6,
      title: 'Merge Intervals',
      company: 'Google',
      difficulty: 'Medium',
      frequency: 85,
      category: 'Arrays',
      pattern: 'Intervals',
      askedIn: ['Google', 'Facebook', 'Amazon', 'Microsoft'],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      solved: false,
      importance: 5,
      tips: 'Sort intervals first, then merge overlapping',
      commonMistakes: ['Not sorting first', 'Wrong overlap condition'],
      leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/'
    },
    {
      id: 7,
      title: 'LRU Cache',
      company: 'Amazon',
      difficulty: 'Medium',
      frequency: 83,
      category: 'Design',
      pattern: 'Hash Map + Doubly Linked List',
      askedIn: ['Amazon', 'Microsoft', 'Google', 'Apple'],
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(capacity)',
      solved: false,
      importance: 5,
      tips: 'Combine hash map with doubly linked list',
      commonMistakes: ['Not maintaining order', 'Wrong eviction logic'],
      leetcodeUrl: 'https://leetcode.com/problems/lru-cache/'
    },
    {
      id: 8,
      title: 'Word Ladder',
      company: 'Facebook',
      difficulty: 'Hard',
      frequency: 78,
      category: 'Graphs',
      pattern: 'BFS',
      askedIn: ['Facebook', 'Amazon', 'Google', 'LinkedIn'],
      timeComplexity: 'O(M^2 × N)',
      spaceComplexity: 'O(M^2 × N)',
      solved: false,
      importance: 4,
      tips: 'Use BFS with word transformations',
      commonMistakes: ['Not building graph correctly', 'Wrong distance calculation'],
      leetcodeUrl: 'https://leetcode.com/problems/word-ladder/'
    },
    {
      id: 9,
      title: 'Median of Two Sorted Arrays',
      company: 'Google',
      difficulty: 'Hard',
      frequency: 75,
      category: 'Binary Search',
      pattern: 'Binary Search',
      askedIn: ['Google', 'Microsoft', 'Amazon', 'Apple'],
      timeComplexity: 'O(log(min(m,n)))',
      spaceComplexity: 'O(1)',
      solved: false,
      importance: 4,
      tips: 'Binary search on smaller array',
      commonMistakes: ['Not handling edge cases', 'Wrong partition logic'],
      leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
    },
    {
      id: 10,
      title: 'Trapping Rain Water',
      company: 'Amazon',
      difficulty: 'Hard',
      frequency: 72,
      category: 'Arrays',
      pattern: 'Two Pointers',
      askedIn: ['Amazon', 'Google', 'Facebook', 'Bloomberg'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      solved: false,
      importance: 4,
      tips: 'Use two pointers from both ends',
      commonMistakes: ['Not tracking max heights', 'Wrong water calculation'],
      leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/'
    },
    {
      id: 11,
      title: 'Course Schedule',
      company: 'Microsoft',
      difficulty: 'Medium',
      frequency: 80,
      category: 'Graphs',
      pattern: 'Topological Sort',
      askedIn: ['Microsoft', 'Amazon', 'Facebook', 'Google'],
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      solved: false,
      importance: 5,
      tips: 'Detect cycle using DFS or BFS',
      commonMistakes: ['Not detecting cycles', 'Wrong graph representation'],
      leetcodeUrl: 'https://leetcode.com/problems/course-schedule/'
    },
    {
      id: 12,
      title: 'Serialize and Deserialize Binary Tree',
      company: 'Facebook',
      difficulty: 'Hard',
      frequency: 70,
      category: 'Trees',
      pattern: 'DFS/BFS',
      askedIn: ['Facebook', 'Amazon', 'Google', 'Microsoft'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      solved: false,
      importance: 4,
      tips: 'Use preorder traversal with markers',
      commonMistakes: ['Not handling null nodes', 'Wrong delimiter choice'],
      leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
    }
  ];

  const companies = ['All', 'Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = interviewQuestions.filter(q => {
    const companyMatch = selectedCompany === 'All' || q.askedIn.includes(selectedCompany);
    const difficultyMatch = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return companyMatch && difficultyMatch;
  });

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

  const scrollToQuestions = () => {
    questionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCompanyLogo = (company) => {
    const logos = {
      'Google': '🔍',
      'Amazon': '📦',
      'Facebook': '👥',
      'Microsoft': '🪟',
      'Apple': '🍎',
      'Bloomberg': '📊',
      'Adobe': '🎨',
      'LinkedIn': '💼'
    };
    return logos[company] || '🏢';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 animate-in slide-in-from-bottom"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
        <button
          onClick={scrollToTop}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-orange-500 rounded-full transition-all"
          title="Top"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Top
          </span>
        </button>
        <button
          onClick={scrollToQuestions}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-yellow-500 rounded-full transition-all"
          title="Questions"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Questions
          </span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-orange-600/10 via-yellow-600/10 to-amber-600/10 backdrop-blur border-b border-slate-800">
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
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                    Interview Ready
                  </h1>
                  <p className="text-slate-400 text-xl mt-2">Ace Your Technical Interviews</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {interviewQuestions.length}
                </div>
                <div className="text-sm text-slate-400 mt-1">Top Questions</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  FAANG
                </div>
                <div className="text-sm text-slate-400 mt-1">Companies</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  85%
                </div>
                <div className="text-sm text-slate-400 mt-1">Success Rate</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-slate-400 mt-1">Support</div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToQuestions}
                className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group"
              >
                <span className="text-sm font-medium">Explore Questions</span>
                <ChevronUp className="w-6 h-6 rotate-180 animate-bounce group-hover:text-orange-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Company Filter */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block font-semibold">Company</label>
                <div className="flex flex-wrap gap-2">
                  {companies.map(comp => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompany(comp)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        selectedCompany === comp
                          ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm text-slate-400 mb-2 block font-semibold">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
              Showing <span className="text-white font-semibold">{filteredQuestions.length}</span> questions
            </div>
          </div>

          {/* Questions Grid */}
          <div 
            ref={questionsRef}
            className="grid md:grid-cols-2 gap-6 scroll-mt-8"
          >
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getCompanyLogo(question.company)}</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Flame size={14} className="text-orange-400" />
                        <span className="text-orange-400 text-xs font-bold">{question.frequency}%</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {question.title}
                    </h3>
                  </div>
                  {question.solved ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 flex-shrink-0" />
                  )}
                </div>

                {/* Category & Pattern */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-semibold">
                    {question.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-semibold">
                    {question.pattern}
                  </span>
                </div>

                {/* Complexity */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <div className="text-slate-400 mb-1">Time</div>
                    <div className="text-green-400 font-mono">{question.timeComplexity}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2">
                    <div className="text-slate-400 mb-1">Space</div>
                    <div className="text-blue-400 font-mono">{question.spaceComplexity}</div>
                  </div>
                </div>

                {/* Companies */}
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-2">Asked in:</div>
                  <div className="flex flex-wrap gap-1">
                    {question.askedIn.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-xs font-semibold"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="mb-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Zap size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-green-400 font-semibold mb-1">Pro Tip</div>
                      <div className="text-xs text-slate-300">{question.tips}</div>
                    </div>
                  </div>
                </div>

                {/* Importance Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < question.importance ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">Importance</span>
                </div>

                {/* Action Button */}
                <a
                  href={question.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-4 py-3 rounded-xl font-semibold transition-all transform group-hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Code size={16} />
                  <span>Solve Now</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReady;
