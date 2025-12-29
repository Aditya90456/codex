import { useState } from 'react';
import TestCaseRenderer from './TestCaseRenderer';
import ProblemViewer from './ProblemViewer';
import { 
  Code, 
  Play, 
  ArrowLeft, 
  Target,
  BookOpen,
  Zap
} from 'lucide-react';

const TestCaseDemo = ({ onBack }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userCode, setUserCode] = useState('');

  // Sample problems with test cases
  const sampleProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Array",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "Only one valid answer exists."
      ],
      starterCode: {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
};`
      },
      testCases: [
        {
          input: { nums: [2, 7, 11, 15], target: 9 },
          expected: [0, 1]
        },
        {
          input: { nums: [3, 2, 4], target: 6 },
          expected: [1, 2]
        },
        {
          input: { nums: [3, 3], target: 6 },
          expected: [0, 1]
        }
      ]
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Stack",
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.`,
      examples: [
        {
          input: 's = "()"',
          output: "true"
        },
        {
          input: 's = "()[]{}"',
          output: "true"
        }
      ],
      starterCode: {
        javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Your code here
    const stack = [];
    const pairs = {
        '(': ')',
        '{': '}',
        '[': ']'
    };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
};`
      },
      testCases: [
        {
          input: { s: "()" },
          expected: true
        },
        {
          input: { s: "()[]{}" },
          expected: true
        },
        {
          input: { s: "(]" },
          expected: false
        },
        {
          input: { s: "([)]" },
          expected: false
        }
      ]
    },
    {
      id: 3,
      title: "Reverse String",
      difficulty: "Easy",
      category: "String",
      description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
      examples: [
        {
          input: 's = ["h","e","l","l","o"]',
          output: '["o","l","l","e","h"]'
        }
      ],
      starterCode: {
        javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    // Your code here
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
};`
      },
      testCases: [
        {
          input: { s: ["h","e","l","l","o"] },
          expected: ["o","l","l","e","h"]
        },
        {
          input: { s: ["H","a","n","n","a","h"] },
          expected: ["h","a","n","n","a","H"]
        }
      ]
    }
  ];

  if (selectedProblem) {
    return (
      <ProblemViewer
        problemId={selectedProblem.id}
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
        onCodeChange={setUserCode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Test Case Demo</h1>
              <p className="text-gray-400">Interactive test case execution and problem solving</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Target className="w-4 h-4" />
              <span>{sampleProblems.length} Problems Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Interactive Test Case System</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience our advanced test case execution system. Select a problem below to see 
            how test cases are rendered, executed, and validated in real-time.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Execution</h3>
            <p className="text-gray-400">Execute your code against test cases instantly with detailed feedback</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comprehensive Testing</h3>
            <p className="text-gray-400">Multiple test cases with input/output validation and error handling</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive UI</h3>
            <p className="text-gray-400">Expandable test cases with detailed input/output comparison</p>
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-6">Sample Problems</h3>
          
          {sampleProblems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600"
              onClick={() => setSelectedProblem(problem)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-semibold text-white">{problem.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      problem.difficulty === 'Easy' 
                        ? 'text-green-400 bg-green-900/20 border-green-500/30'
                        : problem.difficulty === 'Medium'
                        ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
                        : 'text-red-400 bg-red-900/20 border-red-500/30'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-gray-400 text-sm">{problem.category}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {problem.description.split('\n')[0]}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{problem.testCases.length} test cases</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Code className="w-4 h-4" />
                      <span>JavaScript ready</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Try Problem</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>How to Use</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">1. Select a Problem</h4>
              <p>Click on any problem above to open the interactive problem viewer.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">2. Review Test Cases</h4>
              <p>Navigate to the "Test Cases" tab to see all available test cases.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">3. Write Your Solution</h4>
              <p>Use the code editor to write your solution. Starter code is provided.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">4. Run Tests</h4>
              <p>Click "Run Tests" to execute your code against all test cases.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseDemo;