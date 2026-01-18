import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, CheckCircle, XCircle, Clock, Code2, 
  BookOpen, Lightbulb, MessageSquare, ThumbsUp, Share2, 
  Bookmark, Trophy, Flame, Target, TrendingUp
} from 'lucide-react';
import Editor from '@monaco-editor/react';

const DSAProblemDetail = ({ problem, onBack }) => {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Mock problem data if not provided
  const problemData = problem || {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'Try using a hash map to store the numbers you\'ve seen.',
      'For each number, check if target - number exists in the hash map.',
      'Remember to return the indices, not the values.'
    ],
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
      { input: '[3,3], 6', expected: '[0,1]' }
    ],
    acceptance: 48.5,
    submissions: 12500000,
    likes: 25000,
    dislikes: 850
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      const mockResults = problemData.testCases.map((testCase, index) => ({
        id: index + 1,
        input: testCase.input,
        expected: testCase.expected,
        actual: testCase.expected, // Mock: all pass
        passed: Math.random() > 0.2, // 80% pass rate for demo
        runtime: Math.floor(Math.random() * 100) + 50,
        memory: (Math.random() * 10 + 10).toFixed(2)
      }));
      
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    handleRunCode();
    // Additional submission logic here
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Problems</span>
              </button>
              <div className="h-6 w-px bg-gray-700"></div>
              <h1 className="text-xl font-bold">{problemData.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problemData.difficulty)}`}>
                {problemData.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'text-yellow-400 bg-yellow-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-800">
              {['description', 'solutions', 'discuss'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab === 'description' && <BookOpen className="w-4 h-4 inline mr-2" />}
                  {tab === 'solutions' && <Lightbulb className="w-4 h-4 inline mr-2" />}
                  {tab === 'discuss' && <MessageSquare className="w-4 h-4 inline mr-2" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 max-h-[calc(100vh-200px)] overflow-y-auto">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{problemData.description}</p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Examples</h3>
                    <div className="space-y-4">
                      {problemData.examples.map((example, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                          <div className="font-medium text-blue-400 mb-2">Example {index + 1}:</div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Input:</span>
                              <code className="ml-2 text-green-400">{example.input}</code>
                            </div>
                            <div>
                              <span className="text-gray-400">Output:</span>
                              <code className="ml-2 text-yellow-400">{example.output}</code>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="text-gray-400">Explanation:</span>
                                <span className="ml-2 text-gray-300">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Constraints</h3>
                    <ul className="space-y-2">
                      {problemData.constraints.map((constraint, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <code className="text-sm">{constraint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hints */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">Hints</h3>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {showHint ? 'Hide Hints' : 'Show Hints'}
                      </button>
                    </div>
                    {showHint && (
                      <div className="space-y-2">
                        {problemData.hints.map((hint, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30"
                          >
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{hint}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Acceptance Rate</div>
                      <div className="text-2xl font-bold text-green-400">{problemData.acceptance}%</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Total Submissions</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {(problemData.submissions / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>

                  {/* Likes/Dislikes */}
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{(problemData.likes / 1000).toFixed(1)}K</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                      <ThumbsUp className="w-5 h-5 rotate-180" />
                      <span>{problemData.dislikes}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Solutions Coming Soon</h3>
                    <p className="text-gray-400">
                      Solve the problem first to unlock community solutions and editorial content.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'discuss' && (
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Discussion Forum</h3>
                    <p className="text-gray-400">
                      Join the discussion to share your approach and learn from others.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-4">
            {/* Language Selector */}
            <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Language:</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden">
              <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Submit</span>
              </button>
            </div>

            {/* Test Results */}
            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Test Results
                </h3>
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 rounded-lg border ${
                        result.passed
                          ? 'bg-green-900/20 border-green-500/30'
                          : 'bg-red-900/20 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className="font-medium">Test Case {result.id}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {result.runtime}ms
                          </span>
                          <span>{result.memory}MB</span>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-400">Input:</span>
                          <code className="ml-2 text-blue-400">{result.input}</code>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected:</span>
                          <code className="ml-2 text-green-400">{result.expected}</code>
                        </div>
                        <div>
                          <span className="text-gray-400">Actual:</span>
                          <code className={`ml-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            {result.actual}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">
                      Passed: {testResults.filter(r => r.passed).length} / {testResults.length}
                    </span>
                    {testResults.every(r => r.passed) && (
                      <span className="flex items-center text-green-400 font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        All tests passed!
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-4 border border-blue-500/30">
                <Target className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-sm text-gray-400">Attempts</div>
                <div className="text-xl font-bold text-white">0</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-4 border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-sm text-gray-400">Solved</div>
                <div className="text-xl font-bold text-white">0</div>
              </div>
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 rounded-lg p-4 border border-orange-500/30">
                <Flame className="w-6 h-6 text-orange-400 mb-2" />
                <div className="text-sm text-gray-400">Streak</div>
                <div className="text-xl font-bold text-white">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAProblemDetail;
