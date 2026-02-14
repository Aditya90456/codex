// Company-wise LeetCode problems with real interview questions
export const companyWiseProblems = {
  google: {
    name: "Google",
    logo: "🔍",
    color: "from-blue-500 to-green-500",
    totalProblems: 50,
    problems: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        frequency: "Very High",
        tags: ["Array", "Hash Table"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
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
          "-10^9 <= target <= 10^9"
        ],
        template: {
          javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
          python: `def twoSum(nums, target):
    # Your code here
    pass`,
          java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    
}`
        }
      },
      {
        id: 200,
        title: "Number of Islands",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
        description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
        examples: [
          {
            input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
            output: "1"
          }
        ],
        template: {
          javascript: `function numIslands(grid) {
    // Your code here
    
}`,
          python: `def numIslands(grid):
    # Your code here
    pass`
        }
      },
      {
        id: 23,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        frequency: "High",
        tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        template: {
          javascript: `function mergeKLists(lists) {
    // Your code here
    
}`
        }
      }
    ]
  },
  
  amazon: {
    name: "Amazon",
    logo: "📦",
    color: "from-orange-500 to-yellow-500",
    totalProblems: 45,
    problems: [
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        frequency: "Very High",
        tags: ["Hash Table", "String", "Sliding Window"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [
          {
            input: 's = "abcabcbb"',
            output: "3",
            explanation: 'The answer is "abc", with the length of 3.'
          }
        ],
        template: {
          javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
    
}`
        }
      },
      {
        id: 121,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        frequency: "High",
        tags: ["Array", "Dynamic Programming"],
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        template: {
          javascript: `function maxProfit(prices) {
    // Your code here
    
}`
        }
      },
      {
        id: 42,
        title: "Trapping Rain Water",
        difficulty: "Hard",
        frequency: "Medium",
        tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"],
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        template: {
          javascript: `function trap(height) {
    // Your code here
    
}`
        }
      }
    ]
  },

  microsoft: {
    name: "Microsoft",
    logo: "🪟",
    color: "from-blue-600 to-cyan-500",
    totalProblems: 40,
    problems: [
      {
        id: 206,
        title: "Reverse Linked List",
        difficulty: "Easy",
        frequency: "Very High",
        tags: ["Linked List", "Recursion"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        template: {
          javascript: `function reverseList(head) {
    // Your code here
    
}`
        }
      },
      {
        id: 146,
        title: "LRU Cache",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        template: {
          javascript: `var LRUCache = function(capacity) {
    // Your code here
    
};

LRUCache.prototype.get = function(key) {
    // Your code here
    
};

LRUCache.prototype.put = function(key, value) {
    // Your code here
    
};`
        }
      }
    ]
  },

  apple: {
    name: "Apple",
    logo: "🍎",
    color: "from-gray-600 to-gray-800",
    totalProblems: 35,
    problems: [
      {
        id: 15,
        title: "3Sum",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        template: {
          javascript: `function threeSum(nums) {
    // Your code here
    
}`
        }
      },
      {
        id: 53,
        title: "Maximum Subarray",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        template: {
          javascript: `function maxSubArray(nums) {
    // Your code here
    
}`
        }
      }
    ]
  },

  facebook: {
    name: "Meta (Facebook)",
    logo: "📘",
    color: "from-blue-500 to-purple-600",
    totalProblems: 42,
    problems: [
      {
        id: 125,
        title: "Valid Palindrome",
        difficulty: "Easy",
        frequency: "High",
        tags: ["Two Pointers", "String"],
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        template: {
          javascript: `function isPalindrome(s) {
    // Your code here
    
}`
        }
      },
      {
        id: 238,
        title: "Product of Array Except Self",
        difficulty: "Medium",
        frequency: "Very High",
        tags: ["Array", "Prefix Sum"],
        description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
        template: {
          javascript: `function productExceptSelf(nums) {
    // Your code here
    
}`
        }
      }
    ]
  },

  netflix: {
    name: "Netflix",
    logo: "🎬",
    color: "from-red-600 to-red-800",
    totalProblems: 25,
    problems: [
      {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        frequency: "High",
        tags: ["String", "Dynamic Programming"],
        description: "Given a string s, return the longest palindromic substring in s.",
        template: {
          javascript: `function longestPalindrome(s) {
    // Your code here
    
}`
        }
      }
    ]
  },

  uber: {
    name: "Uber",
    logo: "🚗",
    color: "from-black to-gray-700",
    totalProblems: 30,
    problems: [
      {
        id: 49,
        title: "Group Anagrams",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Array", "Hash Table", "String", "Sorting"],
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        template: {
          javascript: `function groupAnagrams(strs) {
    // Your code here
    
}`
        }
      }
    ]
  },

  linkedin: {
    name: "LinkedIn",
    logo: "💼",
    color: "from-blue-700 to-blue-900",
    totalProblems: 28,
    problems: [
      {
        id: 56,
        title: "Merge Intervals",
        difficulty: "Medium",
        frequency: "Very High",
        tags: ["Array", "Sorting"],
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
        template: {
          javascript: `function merge(intervals) {
    // Your code here
    
}`
        }
      }
    ]
  },

  airbnb: {
    name: "Airbnb",
    logo: "🏠",
    color: "from-pink-500 to-rose-600",
    totalProblems: 22,
    problems: [
      {
        id: 20,
        title: "Valid Parentheses",
        difficulty: "Easy",
        frequency: "High",
        tags: ["String", "Stack"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        template: {
          javascript: `function isValid(s) {
    // Your code here
    
}`
        }
      }
    ]
  },

  tesla: {
    name: "Tesla",
    logo: "⚡",
    color: "from-red-500 to-gray-900",
    totalProblems: 18,
    problems: [
      {
        id: 11,
        title: "Container With Most Water",
        difficulty: "Medium",
        frequency: "High",
        tags: ["Array", "Two Pointers", "Greedy"],
        description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
        template: {
          javascript: `function maxArea(height) {
    // Your code here
    
}`
        }
      }
    ]
  }
};

// Timer presets for different interview scenarios
export const timerPresets = {
  easy: {
    name: "Easy Problems",
    duration: 15, // minutes
    description: "Perfect for easy LeetCode problems"
  },
  medium: {
    name: "Medium Problems", 
    duration: 25,
    description: "Standard time for medium difficulty"
  },
  hard: {
    name: "Hard Problems",
    duration: 45,
    description: "Extended time for complex problems"
  },
  phone: {
    name: "Phone Interview",
    duration: 30,
    description: "Typical phone screening duration"
  },
  onsite: {
    name: "Onsite Round",
    duration: 60,
    description: "Full onsite interview session"
  },
  contest: {
    name: "Contest Mode",
    duration: 90,
    description: "Competitive programming contest"
  },
  custom: {
    name: "Custom Timer",
    duration: 20,
    description: "Set your own time limit"
  }
};

// Company interview statistics
export const companyStats = {
  google: {
    avgInterviewRounds: 5,
    technicalRounds: 3,
    avgDifficulty: "Medium-Hard",
    focusAreas: ["Algorithms", "System Design", "Coding"],
    tips: [
      "Focus on optimal solutions with good time complexity",
      "Be ready to explain your thought process clearly",
      "Practice system design for senior roles"
    ]
  },
  amazon: {
    avgInterviewRounds: 4,
    technicalRounds: 2,
    avgDifficulty: "Medium",
    focusAreas: ["Leadership Principles", "Coding", "System Design"],
    tips: [
      "Prepare STAR format stories for behavioral questions",
      "Focus on scalability and customer obsession",
      "Practice coding under pressure"
    ]
  },
  microsoft: {
    avgInterviewRounds: 4,
    technicalRounds: 3,
    avgDifficulty: "Medium",
    focusAreas: ["Problem Solving", "Design", "Collaboration"],
    tips: [
      "Show collaborative problem-solving approach",
      "Discuss trade-offs in your solutions",
      "Be prepared for design questions"
    ]
  }
};