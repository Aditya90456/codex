// Comprehensive DSA Roadmap for Product-Based Companies (FAANG, Microsoft, Google, etc.)
// Structured learning path with milestones, timelines, and company-specific focus

export const productCompanyRoadmap = {
  overview: {
    title: "DSA Roadmap for Product-Based Companies",
    description: "A structured 6-month plan to crack interviews at top product companies",
    totalWeeks: 24,
    estimatedHours: 400,
    targetCompanies: ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber", "Adobe"]
  },

  phases: [
    {
      id: "phase1",
      title: "Foundation Building",
      duration: "Weeks 1-4",
      weeks: 4,
      description: "Master the fundamentals and basic problem-solving patterns",
      goals: [
        "Understand time and space complexity",
        "Master basic data structures",
        "Solve 50+ easy problems",
        "Build problem-solving intuition"
      ],
      topics: [
        {
          id: "arrays-basics",
          name: "Arrays & Strings Fundamentals",
          priority: "High",
          estimatedDays: 5,
          problems: 20,
          keyProblems: [
            "Two Sum", "Best Time to Buy and Sell Stock", "Contains Duplicate",
            "Valid Anagram", "Product of Array Except Self"
          ],
          concepts: ["Array traversal", "Two pointers", "Sliding window basics", "Hash maps"],
          companies: ["Amazon", "Microsoft", "Google"]
        },
        {
          id: "basic-math",
          name: "Basic Math & Bit Manipulation",
          priority: "Medium",
          estimatedDays: 3,
          problems: 10,
          keyProblems: [
            "Reverse Integer", "Palindrome Number", "Power of Two",
            "Number of 1 Bits", "Single Number"
          ],
          concepts: ["Mathematical operations", "Bit operations", "Number theory basics"],
          companies: ["Google", "Facebook", "Amazon"]
        },
        {
          id: "sorting-searching",
          name: "Sorting & Searching Basics",
          priority: "High",
          estimatedDays: 4,
          problems: 15,
          keyProblems: [
            "Binary Search", "First Bad Version", "Search Insert Position",
            "Sqrt(x)", "Valid Perfect Square"
          ],
          concepts: ["Binary search", "Sorting algorithms", "Search space reduction"],
          companies: ["Microsoft", "Amazon", "Adobe"]
        },
        {
          id: "recursion-basics",
          name: "Recursion Fundamentals",
          priority: "High",
          estimatedDays: 3,
          problems: 12,
          keyProblems: [
            "Fibonacci Number", "Climbing Stairs", "Power(x, n)",
            "Reverse String", "Merge Two Sorted Lists"
          ],
          concepts: ["Recursion tree", "Base cases", "Recursive thinking"],
          companies: ["Google", "Amazon", "Facebook"]
        }
      ],
      milestones: [
        "Solve 50 easy problems",
        "Understand Big O notation",
        "Complete 5 mock interviews"
      ]
    },

    {
      id: "phase2",
      title: "Intermediate Patterns",
      duration: "Weeks 5-10",
      weeks: 6,
      description: "Learn advanced patterns and medium-level problem solving",
      goals: [
        "Master sliding window and two pointers",
        "Understand linked lists and stacks",
        "Solve 80+ medium problems",
        "Learn pattern recognition"
      ],
      topics: [
        {
          id: "two-pointers-advanced",
          name: "Two Pointers & Sliding Window",
          priority: "High",
          estimatedDays: 7,
          problems: 25,
          keyProblems: [
            "3Sum", "Container With Most Water", "Longest Substring Without Repeating",
            "Minimum Window Substring", "Trapping Rain Water"
          ],
          concepts: ["Fast-slow pointers", "Variable window", "Fixed window", "Multiple pointers"],
          companies: ["Facebook", "Amazon", "Google", "Microsoft"]
        },
        {
          id: "linked-lists",
          name: "Linked Lists Mastery",
          priority: "High",
          estimatedDays: 6,
          problems: 20,
          keyProblems: [
            "Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle",
            "Remove Nth Node", "Reorder List", "Copy List with Random Pointer"
          ],
          concepts: ["Fast-slow pointers", "Dummy nodes", "In-place reversal", "Cycle detection"],
          companies: ["Amazon", "Microsoft", "Apple", "Google"]
        },
        {
          id: "stacks-queues",
          name: "Stacks & Queues",
          priority: "High",
          estimatedDays: 5,
          problems: 18,
          keyProblems: [
            "Valid Parentheses", "Min Stack", "Daily Temperatures",
            "Largest Rectangle in Histogram", "Sliding Window Maximum"
          ],
          concepts: ["Monotonic stack", "Queue using stacks", "Deque", "Priority queue basics"],
          companies: ["Google", "Amazon", "Bloomberg"]
        },
        {
          id: "binary-search-advanced",
          name: "Advanced Binary Search",
          priority: "High",
          estimatedDays: 6,
          problems: 20,
          keyProblems: [
            "Search in Rotated Array", "Find Peak Element", "Koko Eating Bananas",
            "Median of Two Sorted Arrays", "Split Array Largest Sum"
          ],
          concepts: ["Binary search on answer", "Rotated arrays", "Search space design"],
          companies: ["Google", "Facebook", "Amazon"]
        },
        {
          id: "hashing-advanced",
          name: "Advanced Hashing & Sets",
          priority: "Medium",
          estimatedDays: 4,
          problems: 15,
          keyProblems: [
            "Group Anagrams", "Top K Frequent Elements", "Longest Consecutive Sequence",
            "Subarray Sum Equals K", "LRU Cache"
          ],
          concepts: ["Hash map patterns", "Frequency counting", "Prefix sums", "Cache design"],
          companies: ["Amazon", "Microsoft", "Facebook"]
        }
      ],
      milestones: [
        "Solve 80 medium problems",
        "Complete 10 pattern-based problem sets",
        "Participate in 3 coding contests"
      ]
    },

    {
      id: "phase3",
      title: "Trees & Graphs",
      duration: "Weeks 11-15",
      weeks: 5,
      description: "Master tree and graph algorithms - crucial for top companies",
      goals: [
        "Master tree traversals and BST operations",
        "Learn graph algorithms (BFS, DFS, Dijkstra)",
        "Solve 60+ tree/graph problems",
        "Understand advanced graph patterns"
      ],
      topics: [
        {
          id: "binary-trees",
          name: "Binary Trees & BST",
          priority: "High",
          estimatedDays: 8,
          problems: 30,
          keyProblems: [
            "Invert Binary Tree", "Maximum Depth", "Validate BST",
            "Lowest Common Ancestor", "Serialize and Deserialize", "Binary Tree Maximum Path Sum"
          ],
          concepts: ["DFS/BFS traversals", "BST properties", "Tree construction", "Path problems"],
          companies: ["Google", "Facebook", "Amazon", "Microsoft"]
        },
        {
          id: "tree-advanced",
          name: "Advanced Tree Problems",
          priority: "High",
          estimatedDays: 6,
          problems: 20,
          keyProblems: [
            "Kth Smallest in BST", "Count Complete Tree Nodes",
            "Binary Tree Right Side View", "Vertical Order Traversal"
          ],
          concepts: ["Morris traversal", "Tree DP", "Level order variations"],
          companies: ["Amazon", "Google", "Microsoft"]
        },
        {
          id: "graphs-basics",
          name: "Graph Fundamentals",
          priority: "High",
          estimatedDays: 7,
          problems: 25,
          keyProblems: [
            "Number of Islands", "Clone Graph", "Course Schedule",
            "Pacific Atlantic Water Flow", "Graph Valid Tree"
          ],
          concepts: ["Graph representation", "DFS/BFS on graphs", "Cycle detection", "Topological sort"],
          companies: ["Facebook", "Google", "Amazon", "Uber"]
        },
        {
          id: "graphs-advanced",
          name: "Advanced Graph Algorithms",
          priority: "High",
          estimatedDays: 7,
          problems: 20,
          keyProblems: [
            "Dijkstra's Algorithm", "Network Delay Time", "Cheapest Flights",
            "Word Ladder", "Alien Dictionary", "Minimum Spanning Tree"
          ],
          concepts: ["Shortest path", "Union-Find", "MST", "Advanced BFS"],
          companies: ["Google", "Facebook", "Amazon"]
        }
      ],
      milestones: [
        "Solve 60 tree/graph problems",
        "Implement all graph algorithms from scratch",
        "Complete 5 system design basics"
      ]
    },

    {
      id: "phase4",
      title: "Dynamic Programming",
      duration: "Weeks 16-19",
      weeks: 4,
      description: "Master DP - the most important topic for top companies",
      goals: [
        "Understand DP patterns and state transitions",
        "Master 1D and 2D DP",
        "Solve 50+ DP problems",
        "Learn space optimization techniques"
      ],
      topics: [
        {
          id: "dp-1d",
          name: "1D Dynamic Programming",
          priority: "High",
          estimatedDays: 6,
          problems: 20,
          keyProblems: [
            "Climbing Stairs", "House Robber", "Coin Change",
            "Longest Increasing Subsequence", "Word Break", "Decode Ways"
          ],
          concepts: ["State definition", "Recurrence relations", "Memoization vs tabulation"],
          companies: ["Google", "Amazon", "Facebook", "Microsoft"]
        },
        {
          id: "dp-2d",
          name: "2D Dynamic Programming",
          priority: "High",
          estimatedDays: 8,
          problems: 25,
          keyProblems: [
            "Unique Paths", "Longest Common Subsequence", "Edit Distance",
            "Maximal Square", "Interleaving String", "Regular Expression Matching"
          ],
          concepts: ["2D state transitions", "Grid DP", "String DP", "Space optimization"],
          companies: ["Google", "Facebook", "Amazon", "Microsoft"]
        },
        {
          id: "dp-advanced",
          name: "Advanced DP Patterns",
          priority: "High",
          estimatedDays: 7,
          problems: 20,
          keyProblems: [
            "Burst Balloons", "Palindrome Partitioning II", "Distinct Subsequences",
            "Best Time to Buy and Sell Stock IV", "Wildcard Matching"
          ],
          concepts: ["Interval DP", "Bitmask DP", "DP on trees", "State compression"],
          companies: ["Google", "Facebook", "Amazon"]
        },
        {
          id: "dp-optimization",
          name: "DP Optimization Techniques",
          priority: "Medium",
          estimatedDays: 4,
          problems: 10,
          keyProblems: [
            "Maximal Rectangle", "Largest Rectangle in Histogram",
            "Trapping Rain Water", "Jump Game Series"
          ],
          concepts: ["Space optimization", "Rolling arrays", "Monotonic stack with DP"],
          companies: ["Google", "Amazon", "Microsoft"]
        }
      ],
      milestones: [
        "Solve 50 DP problems",
        "Master all DP patterns",
        "Complete 8 mock interviews"
      ]
    },

    {
      id: "phase5",
      title: "Advanced Topics & Hard Problems",
      duration: "Weeks 20-22",
      weeks: 3,
      description: "Tackle hard problems and advanced algorithms",
      goals: [
        "Solve 30+ hard problems",
        "Learn advanced data structures",
        "Master backtracking and greedy",
        "Understand system design basics"
      ],
      topics: [
        {
          id: "backtracking",
          name: "Backtracking & Recursion",
          priority: "High",
          estimatedDays: 5,
          problems: 18,
          keyProblems: [
            "Permutations", "Subsets", "Combination Sum", "N-Queens",
            "Word Search", "Palindrome Partitioning", "Generate Parentheses"
          ],
          concepts: ["Backtracking template", "Pruning", "State space tree"],
          companies: ["Google", "Facebook", "Amazon", "Microsoft"]
        },
        {
          id: "greedy",
          name: "Greedy Algorithms",
          priority: "High",
          estimatedDays: 4,
          problems: 15,
          keyProblems: [
            "Jump Game", "Gas Station", "Meeting Rooms II",
            "Task Scheduler", "Partition Labels", "Minimum Number of Arrows"
          ],
          concepts: ["Greedy choice property", "Interval scheduling", "Activity selection"],
          companies: ["Amazon", "Google", "Microsoft"]
        },
        {
          id: "advanced-ds",
          name: "Advanced Data Structures",
          priority: "High",
          estimatedDays: 6,
          problems: 20,
          keyProblems: [
            "Implement Trie", "Design Add and Search Words", "Word Search II",
            "Kth Largest Element", "Find Median from Data Stream", "LFU Cache"
          ],
          concepts: ["Trie", "Heap/Priority Queue", "Segment Tree", "Fenwick Tree"],
          companies: ["Google", "Facebook", "Amazon"]
        },
        {
          id: "hard-problems",
          name: "Hard Problem Practice",
          priority: "High",
          estimatedDays: 6,
          problems: 15,
          keyProblems: [
            "Merge K Sorted Lists", "Trapping Rain Water II", "Alien Dictionary",
            "Serialize Binary Tree", "Longest Valid Parentheses", "Median of Two Sorted Arrays"
          ],
          concepts: ["Problem decomposition", "Multiple pattern combination"],
          companies: ["Google", "Facebook", "Amazon", "Microsoft"]
        }
      ],
      milestones: [
        "Solve 30 hard problems",
        "Complete 10 company-specific mock interviews",
        "Learn system design fundamentals"
      ]
    },

    {
      id: "phase6",
      title: "Interview Preparation & Practice",
      duration: "Weeks 23-24",
      weeks: 2,
      description: "Final preparation with company-specific practice and mock interviews",
      goals: [
        "Complete 20+ mock interviews",
        "Solve company-specific problems",
        "Practice behavioral questions",
        "Review all patterns"
      ],
      topics: [
        {
          id: "company-specific",
          name: "Company-Specific Practice",
          priority: "High",
          estimatedDays: 5,
          problems: 40,
          keyProblems: [
            "Google: Design Search Autocomplete, Snapshot Array",
            "Amazon: LRU Cache, Design Amazon Locker",
            "Microsoft: Design Excel, Serialize Binary Tree",
            "Facebook: Design News Feed, Friend Recommendations"
          ],
          concepts: ["Company patterns", "Interview formats", "Follow-up questions"],
          companies: ["Google", "Amazon", "Microsoft", "Facebook", "Apple"]
        },
        {
          id: "mock-interviews",
          name: "Mock Interview Marathon",
          priority: "High",
          estimatedDays: 5,
          problems: 30,
          keyProblems: [
            "Timed problem solving", "Communication practice",
            "Edge case handling", "Code optimization"
          ],
          concepts: ["Interview communication", "Time management", "Debugging under pressure"],
          companies: ["All"]
        },
        {
          id: "pattern-review",
          name: "Pattern Review & Weak Areas",
          priority: "High",
          estimatedDays: 4,
          problems: 20,
          keyProblems: [
            "Review all patterns", "Revisit failed problems",
            "Speed optimization", "Common mistakes"
          ],
          concepts: ["Pattern recognition", "Quick recall", "Template mastery"],
          companies: ["All"]
        }
      ],
      milestones: [
        "Complete 20 mock interviews",
        "Solve 300+ total problems",
        "Ready for real interviews"
      ]
    }
  ],

  // Company-specific focus areas
  companyFocus: {
    google: {
      name: "Google",
      focusAreas: ["Graphs", "Trees", "Dynamic Programming", "System Design"],
      commonPatterns: ["DFS/BFS", "Binary Search", "DP", "Backtracking"],
      difficulty: "Hard",
      rounds: 4-5,
      tips: "Focus on optimal solutions, discuss trade-offs, strong CS fundamentals"
    },
    amazon: {
      name: "Amazon",
      focusAreas: ["Arrays", "Strings", "Trees", "OOP Design"],
      commonPatterns: ["Two Pointers", "Sliding Window", "BFS/DFS", "Hash Maps"],
      difficulty: "Medium",
      rounds: 5-7,
      tips: "Leadership principles, practical solutions, discuss scalability"
    },
    microsoft: {
      name: "Microsoft",
      focusAreas: ["Arrays", "Linked Lists", "Trees", "Design"],
      commonPatterns: ["Two Pointers", "DFS/BFS", "DP", "OOP"],
      difficulty: "Medium",
      rounds: 4-5,
      tips: "Clean code, testing, edge cases, collaborative approach"
    },
    facebook: {
      name: "Meta/Facebook",
      focusAreas: ["Graphs", "Dynamic Programming", "Arrays", "System Design"],
      commonPatterns: ["BFS/DFS", "DP", "Hash Maps", "Backtracking"],
      difficulty: "Hard",
      rounds: 2-3,
      tips: "Fast problem solving, multiple approaches, system design depth"
    },
    apple: {
      name: "Apple",
      focusAreas: ["Arrays", "Strings", "Trees", "OOP Design"],
      commonPatterns: ["Two Pointers", "Binary Search", "DFS/BFS"],
      difficulty: "Medium",
      rounds: 4-6,
      tips: "Clean code, attention to detail, user-focused thinking"
    }
  },

  // Weekly practice schedule
  weeklySchedule: {
    monday: { focus: "New pattern learning", problems: 3, duration: "2-3 hours" },
    tuesday: { focus: "Pattern practice", problems: 4, duration: "2-3 hours" },
    wednesday: { focus: "Mixed problems", problems: 3, duration: "2 hours" },
    thursday: { focus: "Hard problem day", problems: 2, duration: "2-3 hours" },
    friday: { focus: "Company-specific", problems: 3, duration: "2 hours" },
    saturday: { focus: "Mock interview", problems: 2, duration: "2 hours" },
    sunday: { focus: "Review & weak areas", problems: 3, duration: "2 hours" }
  },

  // Success metrics
  successMetrics: {
    totalProblems: 300,
    easyProblems: 80,
    mediumProblems: 160,
    hardProblems: 60,
    mockInterviews: 20,
    contestsParticipated: 10,
    patternsLearned: 25
  }
};

// Helper functions
export const getPhaseByWeek = (weekNumber) => {
  return productCompanyRoadmap.phases.find(phase => {
    const [start, end] = phase.duration.match(/\d+/g).map(Number);
    return weekNumber >= start && weekNumber <= end;
  });
};

export const getTopicsByPhase = (phaseId) => {
  const phase = productCompanyRoadmap.phases.find(p => p.id === phaseId);
  return phase?.topics || [];
};

export const getCompanyFocus = (companyName) => {
  const key = companyName.toLowerCase().replace(/\s+/g, '');
  return productCompanyRoadmap.companyFocus[key];
};

export const calculateProgress = (completedProblems) => {
  const total = productCompanyRoadmap.successMetrics.totalProblems;
  return {
    percentage: Math.round((completedProblems / total) * 100),
    remaining: total - completedProblems,
    onTrack: completedProblems >= (total / 24) * getCurrentWeek()
  };
};

export const getCurrentWeek = () => {
  // This should be calculated based on user's start date
  // For now, returning a placeholder
  return 1;
};

export default productCompanyRoadmap;
