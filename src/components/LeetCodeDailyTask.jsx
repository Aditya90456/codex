import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Calendar, CheckCircle, Clock, Target, Flame, Trophy,
  Star, TrendingUp, Zap, Award, ChevronRight, X, Play,
  BookOpen, Code, Brain, Sparkles, Gift, Crown
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LeetCodeDailyTask = ({ onSelectProblem, onClose }) => {
  const { user } = useUser();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [userProgress, setUserProgress] = useState({
    todayCompleted: false,
    weekStreak: 0,
    totalCompleted: 0,
    points: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyChallenge();
    loadWeeklyGoals();
    loadUserProgress();
  }, [user]);

  const loadDailyChallenge = () => {
    // Get today's challenge based on date - changes every day!
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    console.log('📅 Today is day', dayOfYear, 'of the year');
    
    // 30 different daily challenges that rotate
    const challenges = [
      {
        id: 1, // Two Sum
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        description: 'Find two numbers that add up to a target',
        estimatedTime: '15 min',
        topics: ['Array', 'Hash Table'],
        companies: ['Google', 'Amazon', 'Microsoft']
      },
      {
        id: 13, // Longest Substring Without Repeating Characters
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'Strings',
        points: 20,
        description: 'Find the length of the longest substring without repeating characters',
        estimatedTime: '25 min',
        topics: ['String', 'Sliding Window', 'Hash Table'],
        companies: ['Amazon', 'Bloomberg', 'Adobe']
      },
      {
        id: 45, // Merge Intervals
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 20,
        description: 'Merge all overlapping intervals',
        estimatedTime: '20 min',
        topics: ['Array', 'Sorting'],
        companies: ['Facebook', 'Google', 'LinkedIn']
      },
      {
        id: 24, // Binary Tree Level Order Traversal
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'Trees',
        points: 20,
        description: 'Return the level order traversal of a binary tree',
        estimatedTime: '20 min',
        topics: ['Tree', 'BFS', 'Queue'],
        companies: ['Microsoft', 'Amazon', 'Apple']
      },
      {
        id: 31, // Coin Change
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 25,
        description: 'Find minimum number of coins to make up an amount',
        estimatedTime: '30 min',
        topics: ['DP', 'Array'],
        companies: ['Amazon', 'Google', 'Uber']
      },
      {
        id: 26, // Valid Parentheses
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        points: 10,
        description: 'Determine if the input string has valid parentheses',
        estimatedTime: '15 min',
        topics: ['Stack', 'String'],
        companies: ['Amazon', 'Microsoft', 'Bloomberg']
      },
      {
        id: 16, // Reverse Linked List
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked Lists',
        points: 10,
        description: 'Reverse a singly linked list',
        estimatedTime: '15 min',
        topics: ['Linked List', 'Recursion'],
        companies: ['Amazon', 'Microsoft', 'Apple']
      },
      {
        id: 3, // Contains Duplicate
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        description: 'Check if array contains any duplicates',
        estimatedTime: '10 min',
        topics: ['Array', 'Hash Table'],
        companies: ['Google', 'Amazon']
      },
      {
        id: 5, // Maximum Subarray
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 20,
        description: 'Find the contiguous subarray with the largest sum',
        estimatedTime: '20 min',
        topics: ['Array', 'Dynamic Programming'],
        companies: ['Amazon', 'Microsoft', 'LinkedIn']
      },
      {
        id: 11, // Valid Anagram
        title: 'Valid Anagram',
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        description: 'Check if two strings are anagrams',
        estimatedTime: '10 min',
        topics: ['String', 'Hash Table'],
        companies: ['Amazon', 'Facebook']
      },
      {
        id: 21, // Maximum Depth of Binary Tree
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        description: 'Find the maximum depth of a binary tree',
        estimatedTime: '15 min',
        topics: ['Tree', 'DFS', 'Recursion'],
        companies: ['Amazon', 'Microsoft']
      },
      {
        id: 29, // Climbing Stairs
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        points: 10,
        description: 'Count ways to climb n stairs',
        estimatedTime: '15 min',
        topics: ['DP', 'Math'],
        companies: ['Amazon', 'Adobe']
      },
      {
        id: 34, // Number of Islands
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'Graphs',
        points: 25,
        description: 'Count the number of islands in a 2D grid',
        estimatedTime: '25 min',
        topics: ['Graph', 'DFS', 'BFS'],
        companies: ['Amazon', 'Google', 'Facebook']
      },
      {
        id: 38, // Binary Search
        title: 'Binary Search',
        difficulty: 'Easy',
        category: 'Binary Search',
        points: 10,
        description: 'Implement binary search algorithm',
        estimatedTime: '10 min',
        topics: ['Binary Search', 'Array'],
        companies: ['Google', 'Amazon']
      },
      {
        id: 42, // Subsets
        title: 'Subsets',
        difficulty: 'Medium',
        category: 'Backtracking',
        points: 20,
        description: 'Generate all possible subsets',
        estimatedTime: '20 min',
        topics: ['Backtracking', 'Array'],
        companies: ['Amazon', 'Facebook']
      },
      {
        id: 2, // Best Time to Buy and Sell Stock
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        description: 'Find maximum profit from stock prices',
        estimatedTime: '15 min',
        topics: ['Array', 'Dynamic Programming'],
        companies: ['Amazon', 'Microsoft', 'Facebook']
      },
      {
        id: 12, // Valid Palindrome
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        description: 'Check if a string is a palindrome',
        estimatedTime: '10 min',
        topics: ['String', 'Two Pointers'],
        companies: ['Facebook', 'Microsoft']
      },
      {
        id: 17, // Merge Two Sorted Lists
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'Linked Lists',
        points: 10,
        description: 'Merge two sorted linked lists',
        estimatedTime: '15 min',
        topics: ['Linked List', 'Recursion'],
        companies: ['Amazon', 'Microsoft']
      },
      {
        id: 23, // Invert Binary Tree
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        description: 'Invert a binary tree',
        estimatedTime: '10 min',
        topics: ['Tree', 'DFS'],
        companies: ['Google', 'Amazon']
      },
      {
        id: 30, // House Robber
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 20,
        description: 'Maximum amount you can rob without alerting police',
        estimatedTime: '20 min',
        topics: ['DP', 'Array'],
        companies: ['Amazon', 'LinkedIn']
      },
      {
        id: 36, // Course Schedule
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'Graphs',
        points: 25,
        description: 'Determine if you can finish all courses',
        estimatedTime: '25 min',
        topics: ['Graph', 'Topological Sort', 'DFS'],
        companies: ['Amazon', 'Google']
      },
      {
        id: 40, // Kth Largest Element
        title: 'Kth Largest Element in Array',
        difficulty: 'Medium',
        category: 'Heap',
        points: 20,
        description: 'Find the kth largest element',
        estimatedTime: '20 min',
        topics: ['Heap', 'Divide and Conquer'],
        companies: ['Amazon', 'Facebook']
      },
      {
        id: 43, // Permutations
        title: 'Permutations',
        difficulty: 'Medium',
        category: 'Backtracking',
        points: 20,
        description: 'Generate all permutations of an array',
        estimatedTime: '20 min',
        topics: ['Backtracking', 'Array'],
        companies: ['Amazon', 'Microsoft']
      },
      {
        id: 4, // Product of Array Except Self
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 20,
        description: 'Return array where each element is product of all others',
        estimatedTime: '20 min',
        topics: ['Array', 'Prefix Sum'],
        companies: ['Amazon', 'Facebook', 'Microsoft']
      },
      {
        id: 8, // Search in Rotated Sorted Array
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        points: 20,
        description: 'Search for a target in a rotated sorted array',
        estimatedTime: '20 min',
        topics: ['Binary Search', 'Array'],
        companies: ['Amazon', 'Facebook']
      },
      {
        id: 18, // Linked List Cycle
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        category: 'Linked Lists',
        points: 10,
        description: 'Detect if linked list has a cycle',
        estimatedTime: '15 min',
        topics: ['Linked List', 'Two Pointers'],
        companies: ['Amazon', 'Microsoft']
      },
      {
        id: 25, // Validate Binary Search Tree
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        points: 20,
        description: 'Check if a tree is a valid BST',
        estimatedTime: '20 min',
        topics: ['Tree', 'DFS', 'BST'],
        companies: ['Amazon', 'Facebook']
      },
      {
        id: 32, // Longest Increasing Subsequence
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 25,
        description: 'Find length of longest increasing subsequence',
        estimatedTime: '25 min',
        topics: ['DP', 'Binary Search'],
        companies: ['Amazon', 'Microsoft']
      },
      {
        id: 9, // 3Sum
        title: '3Sum',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 25,
        description: 'Find all unique triplets that sum to zero',
        estimatedTime: '30 min',
        topics: ['Array', 'Two Pointers', 'Sorting'],
        companies: ['Amazon', 'Facebook', 'Microsoft']
      },
      {
        id: 33, // Word Break
        title: 'Word Break',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 25,
        description: 'Check if string can be segmented into dictionary words',
        estimatedTime: '25 min',
        topics: ['DP', 'String'],
        companies: ['Amazon', 'Google', 'Facebook']
      }
    ];

    // Rotate through challenges based on day of year
    const todayChallenge = challenges[dayOfYear % challenges.length];
    console.log('🎯 Today\'s challenge:', todayChallenge.title);
    setDailyChallenge(todayChallenge);
    setLoading(false);
  };

  const loadWeeklyGoals = () => {
    const goals = [
      {
        id: 1,
        title: 'Solve 3 Easy Problems',
        progress: 2,
        target: 3,
        points: 30,
        icon: Target,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 2,
        title: 'Solve 2 Medium Problems',
        progress: 1,
        target: 2,
        points: 40,
        icon: TrendingUp,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        id: 3,
        title: 'Maintain 7-Day Streak',
        progress: 5,
        target: 7,
        points: 100,
        icon: Flame,
        color: 'from-orange-500 to-red-500'
      },
      {
        id: 4,
        title: 'Complete Daily Challenge',
        progress: 4,
        target: 7,
        points: 70,
        icon: Calendar,
        color: 'from-blue-500 to-purple-500'
      }
    ];
    setWeeklyGoals(goals);
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      // Load from backend or localStorage
      const saved = localStorage.getItem(`daily_progress_${user.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        
        setUserProgress({
          todayCompleted: data.lastCompleted === today,
          weekStreak: data.weekStreak || 0,
          totalCompleted: data.totalCompleted || 0,
          points: data.points || 0
        });
      }
    } catch (error) {
      console.error('Load progress error:', error);
    }
  };

  const handleStartChallenge = () => {
    if (dailyChallenge && onSelectProblem) {
      onSelectProblem(dailyChallenge);
      onClose?.();
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-gray-700/50 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Daily Challenge</h2>
                  <p className="text-blue-100 flex items-center gap-2 mt-1">
                    <Sparkles className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-700/50">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-orange-400 flex items-center justify-center gap-2">
                <Flame className="w-8 h-8" />
                {userProgress.weekStreak}
              </div>
              <div className="text-sm text-gray-400 mt-1">Day Streak</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-blue-400">{userProgress.totalCompleted}</div>
              <div className="text-sm text-gray-400 mt-1">Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-purple-400">{userProgress.points}</div>
              <div className="text-sm text-gray-400 mt-1">Points</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              {userProgress.todayCompleted ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
                  <div className="text-sm text-green-400 mt-1">Done Today!</div>
                </>
              ) : (
                <>
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto" />
                  <div className="text-sm text-yellow-400 mt-1">Pending</div>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Today's Challenge */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(dailyChallenge.difficulty)}`}>
                      {dailyChallenge.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
                      {dailyChallenge.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {dailyChallenge.points} pts
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{dailyChallenge.title}</h3>
                  <p className="text-gray-300 mb-4">{dailyChallenge.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {dailyChallenge.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {dailyChallenge.topics.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-400">Asked by:</span>
                    {dailyChallenge.companies.slice(0, 3).map((company, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>

              <button
                onClick={handleStartChallenge}
                disabled={userProgress.todayCompleted}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  userProgress.todayCompleted
                    ? 'bg-green-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white shadow-lg`}
              >
                {userProgress.todayCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Completed Today!
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Challenge
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Weekly Goals */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Weekly Goals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {weeklyGoals.map(goal => {
                  const Icon = goal.icon;
                  const progress = (goal.progress / goal.target) * 100;
                  return (
                    <div key={goal.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${goal.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          {goal.points} pts
                        </span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">{goal.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>{goal.progress} / {goal.target}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${goal.color} rounded-full transition-all`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">Complete 7 Daily Challenges</h4>
                  <p className="text-sm text-gray-300">Unlock exclusive badge and 500 bonus points!</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-yellow-400">4/7</div>
                  <div className="text-xs text-gray-400">This week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeDailyTask;
