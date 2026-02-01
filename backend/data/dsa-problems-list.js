// List of all 150 DSA Problems
// This provides metadata for the problems list endpoint

const dsaProblemsList = [
  // Arrays (30 problems)
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays" },
  { id: 2, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", category: "Arrays" },
  { id: 3, title: "Contains Duplicate", difficulty: "Easy", category: "Arrays" },
  { id: 4, title: "Product of Array Except Self", difficulty: "Medium", category: "Arrays" },
  { id: 5, title: "Maximum Subarray", difficulty: "Medium", category: "Arrays" },
  { id: 6, title: "Maximum Product Subarray", difficulty: "Medium", category: "Arrays" },
  { id: 7, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", category: "Arrays" },
  { id: 8, title: "Search in Rotated Sorted Array", difficulty: "Medium", category: "Arrays" },
  { id: 9, title: "3Sum", difficulty: "Medium", category: "Arrays" },
  { id: 10, title: "Container With Most Water", difficulty: "Medium", category: "Arrays" },
  
  // Strings (20 problems)
  { id: 11, title: "Valid Anagram", difficulty: "Easy", category: "Strings" },
  { id: 12, title: "Valid Palindrome", difficulty: "Easy", category: "Strings" },
  { id: 13, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings" },
  { id: 14, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Strings" },
  { id: 15, title: "Group Anagrams", difficulty: "Medium", category: "Strings" },
  
  // Linked Lists (15 problems)
  { id: 16, title: "Reverse Linked List", difficulty: "Easy", category: "Linked Lists" },
  { id: 17, title: "Merge Two Sorted Lists", difficulty: "Easy", category: "Linked Lists" },
  { id: 18, title: "Linked List Cycle", difficulty: "Easy", category: "Linked Lists" },
  { id: 19, title: "Remove Nth Node From End", difficulty: "Medium", category: "Linked Lists" },
  { id: 20, title: "Reorder List", difficulty: "Medium", category: "Linked Lists" },
  
  // Trees (20 problems)
  { id: 21, title: "Maximum Depth of Binary Tree", difficulty: "Easy", category: "Trees" },
  { id: 22, title: "Same Tree", difficulty: "Easy", category: "Trees" },
  { id: 23, title: "Invert Binary Tree", difficulty: "Easy", category: "Trees" },
  { id: 24, title: "Binary Tree Level Order Traversal", difficulty: "Medium", category: "Trees" },
  { id: 25, title: "Validate Binary Search Tree", difficulty: "Medium", category: "Trees" },
  
  // Stack & Queue (15 problems)
  { id: 26, title: "Valid Parentheses", difficulty: "Easy", category: "Stack" },
  { id: 27, title: "Min Stack", difficulty: "Medium", category: "Stack" },
  { id: 28, title: "Evaluate Reverse Polish Notation", difficulty: "Medium", category: "Stack" },
  
  // Dynamic Programming (20 problems)
  { id: 29, title: "Climbing Stairs", difficulty: "Easy", category: "Dynamic Programming" },
  { id: 30, title: "House Robber", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 31, title: "Coin Change", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 32, title: "Longest Increasing Subsequence", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 33, title: "Word Break", difficulty: "Medium", category: "Dynamic Programming" },
  
  // Graphs (15 problems)
  { id: 34, title: "Number of Islands", difficulty: "Medium", category: "Graphs" },
  { id: 35, title: "Clone Graph", difficulty: "Medium", category: "Graphs" },
  { id: 36, title: "Course Schedule", difficulty: "Medium", category: "Graphs" },
  { id: 37, title: "Pacific Atlantic Water Flow", difficulty: "Medium", category: "Graphs" },
  
  // Binary Search (10 problems)
  { id: 38, title: "Binary Search", difficulty: "Easy", category: "Binary Search" },
  { id: 39, title: "Find First and Last Position", difficulty: "Medium", category: "Binary Search" },
  
  // Heap/Priority Queue (10 problems)
  { id: 40, title: "Kth Largest Element", difficulty: "Medium", category: "Heap" },
  { id: 41, title: "Top K Frequent Elements", difficulty: "Medium", category: "Heap" },
  
  // Backtracking (10 problems)
  { id: 42, title: "Subsets", difficulty: "Medium", category: "Backtracking" },
  { id: 43, title: "Permutations", difficulty: "Medium", category: "Backtracking" },
  { id: 44, title: "Combination Sum", difficulty: "Medium", category: "Backtracking" },
  
  // More Arrays
  { id: 45, title: "Merge Intervals", difficulty: "Medium", category: "Arrays" },
  { id: 46, title: "Insert Interval", difficulty: "Medium", category: "Arrays" },
  { id: 47, title: "Rotate Image", difficulty: "Medium", category: "Arrays" },
  { id: 48, title: "Spiral Matrix", difficulty: "Medium", category: "Arrays" },
  { id: 49, title: "Set Matrix Zeroes", difficulty: "Medium", category: "Arrays" },
  { id: 50, title: "Missing Number", difficulty: "Easy", category: "Arrays" },
  
  // More Strings
  { id: 51, title: "Longest Common Prefix", difficulty: "Easy", category: "Strings" },
  { id: 52, title: "Palindrome Number", difficulty: "Easy", category: "Strings" },
  { id: 53, title: "String to Integer (atoi)", difficulty: "Medium", category: "Strings" },
  { id: 54, title: "Implement strStr()", difficulty: "Easy", category: "Strings" },
  { id: 55, title: "Count and Say", difficulty: "Medium", category: "Strings" },
  { id: 56, title: "Decode Ways", difficulty: "Medium", category: "Strings" },
  { id: 57, title: "Valid Palindrome II", difficulty: "Easy", category: "Strings" },
  { id: 58, title: "Minimum Window Substring", difficulty: "Hard", category: "Strings" },
  { id: 59, title: "Letter Combinations of Phone Number", difficulty: "Medium", category: "Strings" },
  { id: 60, title: "Generate Parentheses", difficulty: "Medium", category: "Strings" },
  
  // More Linked Lists
  { id: 61, title: "Add Two Numbers", difficulty: "Medium", category: "Linked Lists" },
  { id: 62, title: "Palindrome Linked List", difficulty: "Easy", category: "Linked Lists" },
  { id: 63, title: "Intersection of Two Linked Lists", difficulty: "Easy", category: "Linked Lists" },
  { id: 64, title: "Odd Even Linked List", difficulty: "Medium", category: "Linked Lists" },
  { id: 65, title: "Swap Nodes in Pairs", difficulty: "Medium", category: "Linked Lists" },
  { id: 66, title: "Reverse Nodes in k-Group", difficulty: "Hard", category: "Linked Lists" },
  { id: 67, title: "Copy List with Random Pointer", difficulty: "Medium", category: "Linked Lists" },
  { id: 68, title: "Sort List", difficulty: "Medium", category: "Linked Lists" },
  { id: 69, title: "Merge k Sorted Lists", difficulty: "Hard", category: "Linked Lists" },
  { id: 70, title: "LRU Cache", difficulty: "Medium", category: "Linked Lists" },
  
  // More Trees
  { id: 71, title: "Subtree of Another Tree", difficulty: "Easy", category: "Trees" },
  { id: 72, title: "Lowest Common Ancestor of BST", difficulty: "Easy", category: "Trees" },
  { id: 73, title: "Binary Tree Right Side View", difficulty: "Medium", category: "Trees" },
  { id: 74, title: "Count Good Nodes in Binary Tree", difficulty: "Medium", category: "Trees" },
  { id: 75, title: "Kth Smallest Element in BST", difficulty: "Medium", category: "Trees" },
  { id: 76, title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", category: "Trees" },
  { id: 77, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", category: "Trees" },
  { id: 78, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", category: "Trees" },
  { id: 79, title: "Balanced Binary Tree", difficulty: "Easy", category: "Trees" },
  { id: 80, title: "Diameter of Binary Tree", difficulty: "Easy", category: "Trees" },
  
  // More Dynamic Programming
  { id: 81, title: "Unique Paths", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 82, title: "Jump Game", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 83, title: "Decode Ways", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 84, title: "Unique Binary Search Trees", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 85, title: "Partition Equal Subset Sum", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 86, title: "Edit Distance", difficulty: "Hard", category: "Dynamic Programming" },
  { id: 87, title: "Longest Common Subsequence", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 88, title: "Maximum Product Subarray", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 89, title: "Palindromic Substrings", difficulty: "Medium", category: "Dynamic Programming" },
  { id: 90, title: "Target Sum", difficulty: "Medium", category: "Dynamic Programming" },
  
  // More Graphs
  { id: 91, title: "Graph Valid Tree", difficulty: "Medium", category: "Graphs" },
  { id: 92, title: "Number of Connected Components", difficulty: "Medium", category: "Graphs" },
  { id: 93, title: "Word Ladder", difficulty: "Hard", category: "Graphs" },
  { id: 94, title: "Surrounded Regions", difficulty: "Medium", category: "Graphs" },
  { id: 95, title: "Rotting Oranges", difficulty: "Medium", category: "Graphs" },
  { id: 96, title: "Walls and Gates", difficulty: "Medium", category: "Graphs" },
  { id: 97, title: "Alien Dictionary", difficulty: "Hard", category: "Graphs" },
  { id: 98, title: "Network Delay Time", difficulty: "Medium", category: "Graphs" },
  { id: 99, title: "Cheapest Flights Within K Stops", difficulty: "Medium", category: "Graphs" },
  { id: 100, title: "Min Cost to Connect All Points", difficulty: "Medium", category: "Graphs" },
  
  // More Backtracking
  { id: 101, title: "Word Search", difficulty: "Medium", category: "Backtracking" },
  { id: 102, title: "N-Queens", difficulty: "Hard", category: "Backtracking" },
  { id: 103, title: "Palindrome Partitioning", difficulty: "Medium", category: "Backtracking" },
  { id: 104, title: "Sudoku Solver", difficulty: "Hard", category: "Backtracking" },
  { id: 105, title: "Combinations", difficulty: "Medium", category: "Backtracking" },
  { id: 106, title: "Restore IP Addresses", difficulty: "Medium", category: "Backtracking" },
  
  // More Binary Search
  { id: 107, title: "Search in Rotated Sorted Array II", difficulty: "Medium", category: "Binary Search" },
  { id: 108, title: "Find Peak Element", difficulty: "Medium", category: "Binary Search" },
  { id: 109, title: "Search a 2D Matrix", difficulty: "Medium", category: "Binary Search" },
  { id: 110, title: "Koko Eating Bananas", difficulty: "Medium", category: "Binary Search" },
  
  // More Heap
  { id: 111, title: "Find Median from Data Stream", difficulty: "Hard", category: "Heap" },
  { id: 112, title: "Merge k Sorted Lists", difficulty: "Hard", category: "Heap" },
  
  // Additional Problems (113-150)
  { id: 113, title: "Sliding Window Maximum", difficulty: "Hard", category: "Arrays" },
  { id: 114, title: "Trapping Rain Water", difficulty: "Hard", category: "Arrays" },
  { id: 115, title: "Longest Consecutive Sequence", difficulty: "Medium", category: "Arrays" },
  { id: 116, title: "Rotate Array", difficulty: "Medium", category: "Arrays" },
  { id: 117, title: "Jump Game II", difficulty: "Medium", category: "Arrays" },
  { id: 118, title: "Gas Station", difficulty: "Medium", category: "Arrays" },
  { id: 119, title: "Candy", difficulty: "Hard", category: "Arrays" },
  { id: 120, title: "Product of Array Except Self", difficulty: "Medium", category: "Arrays" },
  
  { id: 121, title: "Implement Trie", difficulty: "Medium", category: "Trie" },
  { id: 122, title: "Word Search II", difficulty: "Hard", category: "Trie" },
  { id: 123, title: "Design Add and Search Words Data Structure", difficulty: "Medium", category: "Trie" },
  
  { id: 124, title: "Kth Largest Element in a Stream", difficulty: "Easy", category: "Heap" },
  { id: 125, title: "Last Stone Weight", difficulty: "Easy", category: "Heap" },
  { id: 126, title: "K Closest Points to Origin", difficulty: "Medium", category: "Heap" },
  { id: 127, title: "Task Scheduler", difficulty: "Medium", category: "Heap" },
  { id: 128, title: "Design Twitter", difficulty: "Medium", category: "Heap" },
  
  { id: 129, title: "Implement Queue using Stacks", difficulty: "Easy", category: "Stack" },
  { id: 130, title: "Daily Temperatures", difficulty: "Medium", category: "Stack" },
  { id: 131, title: "Car Fleet", difficulty: "Medium", category: "Stack" },
  { id: 132, title: "Largest Rectangle in Histogram", difficulty: "Hard", category: "Stack" },
  
  { id: 133, title: "Implement Stack using Queues", difficulty: "Easy", category: "Queue" },
  { id: 134, title: "Number of Recent Calls", difficulty: "Easy", category: "Queue" },
  
  { id: 135, title: "Counting Bits", difficulty: "Easy", category: "Bit Manipulation" },
  { id: 136, title: "Single Number", difficulty: "Easy", category: "Bit Manipulation" },
  { id: 137, title: "Number of 1 Bits", difficulty: "Easy", category: "Bit Manipulation" },
  { id: 138, title: "Reverse Bits", difficulty: "Easy", category: "Bit Manipulation" },
  { id: 139, title: "Missing Number", difficulty: "Easy", category: "Bit Manipulation" },
  { id: 140, title: "Sum of Two Integers", difficulty: "Medium", category: "Bit Manipulation" },
  
  { id: 141, title: "Reverse Integer", difficulty: "Medium", category: "Math" },
  { id: 142, title: "Palindrome Number", difficulty: "Easy", category: "Math" },
  { id: 143, title: "Plus One", difficulty: "Easy", category: "Math" },
  { id: 144, title: "Pow(x, n)", difficulty: "Medium", category: "Math" },
  { id: 145, title: "Sqrt(x)", difficulty: "Easy", category: "Math" },
  { id: 146, title: "Rotate Image", difficulty: "Medium", category: "Math" },
  { id: 147, title: "Spiral Matrix", difficulty: "Medium", category: "Math" },
  { id: 148, title: "Set Matrix Zeroes", difficulty: "Medium", category: "Math" },
  { id: 149, title: "Happy Number", difficulty: "Easy", category: "Math" },
  { id: 150, title: "Factorial Trailing Zeroes", difficulty: "Medium", category: "Math" }
];

module.exports = { dsaProblemsList };
