import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Trophy, Clock, TrendingUp, CheckCircle, Circle, Lock, Star, Filter, Search, ChevronRight } from 'lucide-react';

const DSAProblemsList = ({ onProblemSelect }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      topic: "Arrays",
      solved: true,
      acceptance: 48.5,
      submissions: 12500000,
      likes: 45000,
      description: "Find two numbers that add up to a target",
      companies: ["Google", "Amazon", "Microsoft"],
      premium: false
    },
    {
      id: 2,
      title: "Reverse Linked List",
      difficulty: "easy",
      topic: "Linked List",
      solved: true,
      acceptance: 72.3,
      submissions: 8900000,
      likes: 38000,
      description: "Reverse a singly linked list",
      companies: ["Facebook", "Apple", "Netflix"],
      premium: false
    },
    {
      id: 3,
      title: "Binary Tree Level Order Traversal",
      difficulty: "medium",
      topic: "Trees",
      solved: false,
      acceptance: 61.8,
      submissions: 5600000,
      likes: 28000,
      description: "Return level order traversal of nodes",
      companies: ["Amazon", "Microsoft", "Bloomberg"],
      premium: false
    },
    {
      id: 4,
      title: "Longest Substring Without Repeating",
      difficulty: "medium",
      topic: "Strings",
      solved: false,
      acceptance: 33.2,
      submissions: 9800000,
      likes: 52000,
      description: "Find longest substring without repeating characters",
      companies: ["Google", "Amazon", "Adobe"],
      premium: false
    },
    {
      id: 5,
      title: "Merge K Sorted Lists",
      difficulty: "hard",
      topic: "Linked List",
      solved: false,
      acceptance: 48.9,
      submissions: 3200000,
      likes: 19000,
      description: "Merge k sorted linked lists",
      companies: ["Google", "Facebook", "Uber"],
      premium: true
    },
    {
      id: 6,
      title: "Valid Parentheses",
      difficulty: "easy",
      topic: "Stack",
      solved: true,
      acceptance: 40.1,
      submissions: 7800000,
      likes: 32000,
      description: "Check if parentheses are valid",
      companies: ["Amazon", "Microsoft", "Apple"],
      premium: false
    },
    {
      id: 7,
      title: "Maximum Subarray",
      difficulty: "medium",
      topic: "Dynamic Programming",
      solved: false,
      acceptance: 49.7,
      submissions: 6700000,
      likes: 41000,
      description: "Find contiguous subarray with largest sum",
      companies: ["Amazon", "LinkedIn", "Apple"],
      premium: false
    },
    {
      id: 8,
      title: "Trapping Rain Water",
      difficulty: "hard",
      topic: "Arrays",
      solved: false,
      acceptance: 56.4,
      submissions: 4100000,
      likes: 35000,
      description: "Calculate trapped rainwater",
      companies: ["Google", "Amazon", "Facebook"],
      premium: false
    }
  ];

  const topics = ['all', 'Arrays', 'Linked List', 'Trees', 'Strings', 'Stack', 'Dynamic Programming'];
  
  const difficultyColors = {
    easy: 'text-green-500 bg-green-500/10 border-green-500/20',
    medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    hard: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'all' || problem.topic === selectedTopic;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DSA Problems
              </h1>
              <p className="text-slate-400 mt-2">Master Data Structures & Algorithms</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">3 Solved</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">450 Points</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 text-sm">Difficulty:</span>
              {['all', 'easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Topic Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-sm">Topic:</span>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedTopic === topic
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !problem.premium && onProblemSelect(problem)}
                className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 ${
                  problem.premium 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer hover:-translate-y-1'
                }`}
              >
                {/* Premium Badge */}
                {problem.premium && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                      <Lock className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-semibold">Premium</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-6">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {problem.solved ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  {/* Problem Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {problem.title}
                        </h3>
                        <p className="text-slate-400 text-sm">{problem.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-medium">
                        {problem.topic}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>{problem.acceptance}% Acceptance</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{(problem.likes / 1000).toFixed(1)}k</span>
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-500 text-xs">Asked by:</span>
                      {problem.companies.map(company => (
                        <span
                          key={company}
                          className="px-2 py-1 bg-slate-700/30 text-slate-300 rounded text-xs font-medium"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />
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
            <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No problems found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DSAProblemsList;
