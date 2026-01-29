// 150 DSA Problems Database
export const dsaProblems = [
  // Arrays (30 problems)
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    examples: [
      { input: "[2,7,11,15], target = 9", output: "[0,1]" },
      { input: "[3,2,4], target = 6", output: "[1,2]" }
    ],
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, expected: [1,2] }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    
}`
    }
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays",
    description: "Find the maximum profit from buying and selling a stock once.",
    examples: [
      { input: "[7,1,5,3,6,4]", output: "5" }
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your code here
  
}`,
      python: `def max_profit(prices):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your code here
        
    }
};`,
      typescript: `function maxProfit(prices: number[]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 3,
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays",
    description: "Return true if any value appears at least twice in the array.",
    examples: [
      { input: "[1,2,3,1]", output: "true" }
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  // Write your code here
  
}`,
      python: `def contains_duplicate(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 4,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Arrays",
    description: "Return an array where each element is the product of all elements except itself.",
    examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Write your code here
  
}`,
      python: `def product_except_self(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
    // Write your code here
    
}`
    }
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find the contiguous subarray with the largest sum.",
    examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your code here
  
}`,
      python: `def max_sub_array(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function maxSubArray(nums: number[]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 6,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find the contiguous subarray with the largest product.",
    examples: [{ input: "[2,3,-2,4]", output: "6" }],
    starterCode: {
      javascript: `function maxProduct(nums) {
  // Write your code here
  
}`,
      python: `def max_product(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxProduct(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function maxProduct(nums: number[]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 7,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find the minimum element in a rotated sorted array.",
    examples: [{ input: "[3,4,5,1,2]", output: "1" }],
    starterCode: {
      javascript: `function findMin(nums) {
  // Write your code here
  
}`,
      python: `def find_min(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int findMin(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function findMin(nums: number[]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 8,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Arrays",
    description: "Search for a target value in a rotated sorted array.",
    examples: [{ input: "[4,5,6,7,0,1,2], target = 0", output: "4" }],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your code here
  
}`,
      python: `def search(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      typescript: `function search(nums: number[], target: number): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 9,
    title: "3Sum",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find all unique triplets that sum to zero.",
    examples: [{ input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    starterCode: {
      javascript: `function threeSum(nums) {
  // Write your code here
  
}`,
      python: `def three_sum(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function threeSum(nums: number[]): number[][] {
    // Write your code here
    
}`
    }
  },
  {
    id: 10,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find two lines that together with x-axis form a container with most water.",
    examples: [{ input: "[1,8,6,2,5,4,8,3,7]", output: "49" }],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your code here
  
}`,
      python: `def max_area(height):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your code here
        
    }
};`,
      typescript: `function maxArea(height: number[]): number {
    // Write your code here
    
}`
    }
  },
  // Strings (20 problems)
  {
    id: 11,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Strings",
    description: "Determine if two strings are anagrams of each other.",
    examples: [{ input: "s = 'anagram', t = 'nagaram'", output: "true" }],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Write your code here
  
}`,
      python: `def is_anagram(s, t):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        // Write your code here
        
    }
};`,
      typescript: `function isAnagram(s: string, t: string): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 12,
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Strings",
    description: "Check if a string is a palindrome, ignoring non-alphanumeric characters.",
    examples: [{ input: "'A man, a plan, a canal: Panama'", output: "true" }],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your code here
  
}`,
      python: `def is_palindrome(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        // Write your code here
        
    }
};`,
      typescript: `function isPalindrome(s: string): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 13,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    description: "Find the length of the longest substring without repeating characters.",
    examples: [{ input: "'abcabcbb'", output: "3" }],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your code here
  
}`,
      python: `def length_of_longest_substring(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your code here
        
    }
};`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 14,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "Strings",
    description: "Find the longest palindromic substring in a string.",
    examples: [{ input: "'babad'", output: "'bab' or 'aba'" }],
    starterCode: {
      javascript: `function longestPalindrome(s) {
  // Write your code here
  
}`,
      python: `def longest_palindrome(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    string longestPalindrome(string s) {
        // Write your code here
        
    }
};`,
      typescript: `function longestPalindrome(s: string): string {
    // Write your code here
    
}`
    }
  },
  {
    id: 15,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Strings",
    description: "Group strings that are anagrams of each other.",
    examples: [{ input: "['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" }],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Write your code here
  
}`,
      python: `def group_anagrams(strs):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your code here
        
    }
};`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
    // Write your code here
    
}`
    }
  },
  // Linked Lists (15 problems)
  {
    id: 16,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "Reverse a singly linked list.",
    examples: [{ input: "1->2->3->4->5", output: "5->4->3->2->1" }],
    starterCode: {
      javascript: `function reverseList(head) {
  // Write your code here
  
}`,
      python: `def reverse_list(head):
    # Write your code here
    pass`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your code here
        
    }
};`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
    // Write your code here
    
}`
    }
  },
  {
    id: 17,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "Merge two sorted linked lists into one sorted list.",
    examples: [{ input: "1->2->4, 1->3->4", output: "1->1->2->3->4->4" }],
    starterCode: {
      javascript: `function mergeTwoLists(l1, l2) {
  // Write your code here
  
}`,
      python: `def merge_two_lists(l1, l2):
    # Write your code here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        // Write your code here
        
    }
};`,
      typescript: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // Write your code here
    
}`
    }
  },
  {
    id: 18,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "Determine if a linked list has a cycle.",
    examples: [{ input: "3->2->0->-4 (cycle at node 1)", output: "true" }],
    starterCode: {
      javascript: `function hasCycle(head) {
  // Write your code here
  
}`,
      python: `def has_cycle(head):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean hasCycle(ListNode head) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        // Write your code here
        
    }
};`,
      typescript: `function hasCycle(head: ListNode | null): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 19,
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Remove the nth node from the end of a linked list.",
    examples: [{ input: "1->2->3->4->5, n = 2", output: "1->2->3->5" }],
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {
  // Write your code here
  
}`,
      python: `def remove_nth_from_end(head, n):
    # Write your code here
    pass`,
      java: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // Write your code here
        
    }
};`,
      typescript: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // Write your code here
    
}`
    }
  },
  {
    id: 20,
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Reorder list to L0→Ln→L1→Ln-1→L2→Ln-2→…",
    examples: [{ input: "1->2->3->4", output: "1->4->2->3" }],
    starterCode: {
      javascript: `function reorderList(head) {
  // Write your code here
  
}`,
      python: `def reorder_list(head):
    # Write your code here
    pass`,
      java: `class Solution {
    public void reorderList(ListNode head) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    void reorderList(ListNode* head) {
        // Write your code here
        
    }
};`,
      typescript: `function reorderList(head: ListNode | null): void {
    // Write your code here
    
}`
    }
  },
  // Trees (20 problems)
  {
    id: 21,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Find the maximum depth of a binary tree.",
    examples: [{ input: "[3,9,20,null,null,15,7]", output: "3" }],
    starterCode: {
      javascript: `function maxDepth(root) {
  // Write your code here
  
}`,
      python: `def max_depth(root):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxDepth(TreeNode root) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Write your code here
        
    }
};`,
      typescript: `function maxDepth(root: TreeNode | null): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 22,
    title: "Same Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if two binary trees are identical.",
    examples: [{ input: "[1,2,3], [1,2,3]", output: "true" }],
    starterCode: {
      javascript: `function isSameTree(p, q) {
  // Write your code here
  
}`,
      python: `def is_same_tree(p, q):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        // Write your code here
        
    }
};`,
      typescript: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 23,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Invert a binary tree (mirror image).",
    examples: [{ input: "[4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
    starterCode: {
      javascript: `function invertTree(root) {
  // Write your code here
  
}`,
      python: `def invert_tree(root):
    # Write your code here
    pass`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Write your code here
        
    }
};`,
      typescript: `function invertTree(root: TreeNode | null): TreeNode | null {
    // Write your code here
    
}`
    }
  },
  {
    id: 24,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Return level order traversal of a binary tree.",
    examples: [{ input: "[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
    starterCode: `function levelOrder(root) {\n  \n}`
  },
  {
    id: 25,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Determine if a binary tree is a valid BST.",
    examples: [{ input: "[2,1,3]", output: "true" }],
    starterCode: `function isValidBST(root) {\n  \n}`
  },
  // Stack & Queue (15 problems)
  {
    id: 26,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Determine if parentheses string is valid.",
    examples: [{ input: "'()[]{}' ", output: "true" }],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your code here
  
}`,
      python: `def is_valid(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        
    }
};`,
      typescript: `function isValid(s: string): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 27,
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    description: "Design a stack that supports push, pop, top, and retrieving minimum in O(1).",
    examples: [{ input: "push(-2), push(0), push(-3), getMin()", output: "-3" }],
    starterCode: {
      javascript: `class MinStack {
  constructor() {
    // Initialize your data structure
    
  }
  
  push(val) {
    // Write your code here
    
  }
  
  pop() {
    // Write your code here
    
  }
  
  top() {
    // Write your code here
    
  }
  
  getMin() {
    // Write your code here
    
  }
}`,
      python: `class MinStack:
    def __init__(self):
        # Initialize your data structure
        pass
    
    def push(self, val):
        # Write your code here
        pass
    
    def pop(self):
        # Write your code here
        pass
    
    def top(self):
        # Write your code here
        pass
    
    def get_min(self):
        # Write your code here
        pass`,
      java: `class MinStack {
    public MinStack() {
        // Initialize your data structure
        
    }
    
    public void push(int val) {
        // Write your code here
        
    }
    
    public void pop() {
        // Write your code here
        
    }
    
    public int top() {
        // Write your code here
        
    }
    
    public int getMin() {
        // Write your code here
        
    }
}`,
      cpp: `class MinStack {
public:
    MinStack() {
        // Initialize your data structure
        
    }
    
    void push(int val) {
        // Write your code here
        
    }
    
    void pop() {
        // Write your code here
        
    }
    
    int top() {
        // Write your code here
        
    }
    
    int getMin() {
        // Write your code here
        
    }
};`,
      typescript: `class MinStack {
    constructor() {
        // Initialize your data structure
        
    }
    
    push(val: number): void {
        // Write your code here
        
    }
    
    pop(): void {
        // Write your code here
        
    }
    
    top(): number {
        // Write your code here
        
    }
    
    getMin(): number {
        // Write your code here
        
    }
}`
    }
  },
  {
    id: 28,
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    category: "Stack",
    description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
    examples: [{ input: "['2','1','+','3','*']", output: "9" }],
    starterCode: {
      javascript: `function evalRPN(tokens) {
  // Write your code here
  
}`,
      python: `def eval_rpn(tokens):
    # Write your code here
    pass`,
      java: `class Solution {
    public int evalRPN(String[] tokens) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        // Write your code here
        
    }
};`,
      typescript: `function evalRPN(tokens: string[]): number {
    // Write your code here
    
}`
    }
  },
  // Dynamic Programming (20 problems)
  {
    id: 29,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: "Count ways to climb n stairs taking 1 or 2 steps at a time.",
    examples: [{ input: "n = 3", output: "3" }],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your code here
  
}`,
      python: `def climb_stairs(n):
    # Write your code here
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        
    }
};`,
      typescript: `function climbStairs(n: number): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 30,
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Rob houses to maximize money without robbing adjacent houses.",
    examples: [{ input: "[1,2,3,1]", output: "4" }],
    starterCode: {
      javascript: `function rob(nums) {
  // Write your code here
  
}`,
      python: `def rob(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int rob(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int rob(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function rob(nums: number[]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 31,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Find minimum coins needed to make up an amount.",
    examples: [{ input: "coins = [1,2,5], amount = 11", output: "3" }],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your code here
  
}`,
      python: `def coin_change(coins, amount):
    # Write your code here
    pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your code here
        
    }
};`,
      typescript: `function coinChange(coins: number[], amount: number): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 32,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Find length of longest increasing subsequence.",
    examples: [{ input: "[10,9,2,5,3,7,101,18]", output: "4" }],
    starterCode: `function lengthOfLIS(nums) {\n  \n}`
  },
  {
    id: 33,
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Determine if string can be segmented into dictionary words.",
    examples: [{ input: "s = 'leetcode', dict = ['leet','code']", output: "true" }],
    starterCode: `function wordBreak(s, wordDict) {\n  \n}`
  },
  // Graphs (15 problems)
  {
    id: 34,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graphs",
    description: "Count number of islands in a 2D grid.",
    examples: [{ input: "grid with 1s and 0s", output: "1" }],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your code here
  
}`,
      python: `def num_islands(grid):
    # Write your code here
    pass`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your code here
        
    }
};`,
      typescript: `function numIslands(grid: string[][]): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 35,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graphs",
    description: "Return a deep copy of an undirected graph.",
    examples: [{ input: "[[2,4],[1,3],[2,4],[1,3]]", output: "cloned graph" }],
    starterCode: {
      javascript: `function cloneGraph(node) {
  // Write your code here
  
}`,
      python: `def clone_graph(node):
    # Write your code here
    pass`,
      java: `class Solution {
    public Node cloneGraph(Node node) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    Node* cloneGraph(Node* node) {
        // Write your code here
        
    }
};`,
      typescript: `function cloneGraph(node: Node | null): Node | null {
    // Write your code here
    
}`
    }
  },
  {
    id: 36,
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graphs",
    description: "Determine if you can finish all courses given prerequisites.",
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Write your code here
  
}`,
      python: `def can_finish(num_courses, prerequisites):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Write your code here
        
    }
};`,
      typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // Write your code here
    
}`
    }
  },
  {
    id: 37,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find cells where water can flow to both oceans.",
    examples: [{ input: "heights matrix", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }],
    starterCode: `function pacificAtlantic(heights) {\n  \n}`
  },
  // Binary Search (10 problems)
  {
    id: 38,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Search for a target value in a sorted array.",
    examples: [{ input: "[-1,0,3,5,9,12], target = 9", output: "4" }],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your code here
  
}`,
      python: `def search(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      typescript: `function search(nums: number[], target: number): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 39,
    title: "Find First and Last Position",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find starting and ending position of target in sorted array.",
    examples: [{ input: "[5,7,7,8,8,10], target = 8", output: "[3,4]" }],
    starterCode: {
      javascript: `function searchRange(nums, target) {
  // Write your code here
  
}`,
      python: `def search_range(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
      typescript: `function searchRange(nums: number[], target: number): number[] {
    // Write your code here
    
}`
    }
  },
  // Heap/Priority Queue (10 problems)
  {
    id: 40,
    title: "Kth Largest Element",
    difficulty: "Medium",
    category: "Heap",
    description: "Find the kth largest element in an array.",
    examples: [{ input: "[3,2,1,5,6,4], k = 2", output: "5" }],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {
  // Write your code here
  
}`,
      python: `def find_kth_largest(nums, k):
    # Write your code here
    pass`,
      java: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Write your code here
        
    }
};`,
      typescript: `function findKthLargest(nums: number[], k: number): number {
    // Write your code here
    
}`
    }
  },
  {
    id: 41,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Heap",
    description: "Return k most frequent elements.",
    examples: [{ input: "[1,1,1,2,2,3], k = 2", output: "[1,2]" }],
    starterCode: `function topKFrequent(nums, k) {\n  \n}`
  },
  // Backtracking (10 problems)
  {
    id: 42,
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Return all possible subsets of a set.",
    examples: [{ input: "[1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }],
    starterCode: {
      javascript: `function subsets(nums) {
  // Write your code here
  
}`,
      python: `def subsets(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function subsets(nums: number[]): number[][] {
    // Write your code here
    
}`
    }
  },
  {
    id: 43,
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Return all possible permutations.",
    examples: [{ input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }],
    starterCode: {
      javascript: `function permute(nums) {
  // Write your code here
  
}`,
      python: `def permute(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        // Write your code here
        
    }
};`,
      typescript: `function permute(nums: number[]): number[][] {
    // Write your code here
    
}`
    }
  },
  {
    id: 44,
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Find all combinations that sum to target.",
    examples: [{ input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" }],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {
  // Write your code here
  
}`,
      python: `def combination_sum(candidates, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        // Write your code here
        
    }
};`,
      typescript: `function combinationSum(candidates: number[], target: number): number[][] {
    // Write your code here
    
}`
    }
  },
  // More Arrays
  {
    id: 45,
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Arrays",
    description: "Merge all overlapping intervals.",
    examples: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
    starterCode: `function merge(intervals) {\n  \n}`
  },
  {
    id: 46,
    title: "Insert Interval",
    difficulty: "Medium",
    category: "Arrays",
    description: "Insert a new interval and merge if necessary.",
    examples: [{ input: "[[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" }],
    starterCode: `function insert(intervals, newInterval) {\n  \n}`
  },
  {
    id: 47,
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Arrays",
    description: "Rotate n x n matrix by 90 degrees clockwise.",
    examples: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]" }],
    starterCode: `function rotate(matrix) {\n  \n}`
  },
  {
    id: 48,
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Arrays",
    description: "Return all elements in spiral order.",
    examples: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }],
    starterCode: `function spiralOrder(matrix) {\n  \n}`
  },
  {
    id: 49,
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Arrays",
    description: "Set entire row and column to 0 if element is 0.",
    examples: [{ input: "[[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]" }],
    starterCode: `function setZeroes(matrix) {\n  \n}`
  },
  {
    id: 50,
    title: "Missing Number",
    difficulty: "Easy",
    category: "Arrays",
    description: "Find the missing number in array [0, n].",
    examples: [{ input: "[3,0,1]", output: "2" }],
    starterCode: `function missingNumber(nums) {\n  \n}`
  },
  // More Strings
  {
    id: 51,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "Strings",
    description: "Find longest common prefix among strings.",
    examples: [{ input: "['flower','flow','flight']", output: "'fl'" }],
    starterCode: `function longestCommonPrefix(strs) {\n  \n}`
  },
  {
    id: 52,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Strings",
    description: "Determine if an integer is a palindrome.",
    examples: [{ input: "121", output: "true" }],
    starterCode: `function isPalindrome(x) {\n  \n}`
  },
  {
    id: 53,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    category: "Strings",
    description: "Implement atoi to convert string to integer.",
    examples: [{ input: "'42'", output: "42" }],
    starterCode: `function myAtoi(s) {\n  \n}`
  },
  {
    id: 54,
    title: "Implement strStr()",
    difficulty: "Easy",
    category: "Strings",
    description: "Return index of first occurrence of needle in haystack.",
    examples: [{ input: "haystack = 'hello', needle = 'll'", output: "2" }],
    starterCode: `function strStr(haystack, needle) {\n  \n}`
  },
  {
    id: 55,
    title: "Count and Say",
    difficulty: "Medium",
    category: "Strings",
    description: "Generate the nth term of count-and-say sequence.",
    examples: [{ input: "n = 4", output: "'1211'" }],
    starterCode: `function countAndSay(n) {\n  \n}`
  },
  {
    id: 56,
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Strings",
    description: "Count ways to decode a digit string.",
    examples: [{ input: "'226'", output: "3" }],
    starterCode: `function numDecodings(s) {\n  \n}`
  },
  {
    id: 57,
    title: "Valid Palindrome II",
    difficulty: "Easy",
    category: "Strings",
    description: "Check if string can be palindrome after deleting at most one character.",
    examples: [{ input: "'aba'", output: "true" }],
    starterCode: `function validPalindrome(s) {\n  \n}`
  },
  {
    id: 58,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Strings",
    description: "Find minimum window substring containing all characters of t.",
    examples: [{ input: "s = 'ADOBECODEBANC', t = 'ABC'", output: "'BANC'" }],
    starterCode: `function minWindow(s, t) {\n  \n}`
  },
  {
    id: 59,
    title: "Letter Combinations of Phone Number",
    difficulty: "Medium",
    category: "Strings",
    description: "Return all possible letter combinations from phone digits.",
    examples: [{ input: "'23'", output: "['ad','ae','af','bd','be','bf','cd','ce','cf']" }],
    starterCode: `function letterCombinations(digits) {\n  \n}`
  },
  {
    id: 60,
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Strings",
    description: "Generate all combinations of well-formed parentheses.",
    examples: [{ input: "n = 3", output: "['((()))','(()())','(())()','()(())','()()()']" }],
    starterCode: `function generateParenthesis(n) {\n  \n}`
  },
  // More Linked Lists
  {
    id: 61,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Add two numbers represented by linked lists.",
    examples: [{ input: "(2->4->3) + (5->6->4)", output: "7->0->8" }],
    starterCode: `function addTwoNumbers(l1, l2) {\n  \n}`
  },
  {
    id: 62,
    title: "Palindrome Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "Check if linked list is a palindrome.",
    examples: [{ input: "1->2->2->1", output: "true" }],
    starterCode: `function isPalindrome(head) {\n  \n}`
  },
  {
    id: 63,
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    description: "Find the node where two linked lists intersect.",
    examples: [{ input: "intersectVal = 8", output: "Reference to node with value 8" }],
    starterCode: `function getIntersectionNode(headA, headB) {\n  \n}`
  },
  {
    id: 64,
    title: "Odd Even Linked List",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Group odd nodes together followed by even nodes.",
    examples: [{ input: "1->2->3->4->5", output: "1->3->5->2->4" }],
    starterCode: `function oddEvenList(head) {\n  \n}`
  },
  {
    id: 65,
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Swap every two adjacent nodes.",
    examples: [{ input: "1->2->3->4", output: "2->1->4->3" }],
    starterCode: `function swapPairs(head) {\n  \n}`
  },
  {
    id: 66,
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    category: "Linked Lists",
    description: "Reverse nodes in groups of k.",
    examples: [{ input: "1->2->3->4->5, k = 2", output: "2->1->4->3->5" }],
    starterCode: `function reverseKGroup(head, k) {\n  \n}`
  },
  {
    id: 67,
    title: "Copy List with Random Pointer",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Deep copy a linked list with random pointers.",
    examples: [{ input: "[[7,null],[13,0],[11,4],[10,2],[1,0]]", output: "Deep copy" }],
    starterCode: `function copyRandomList(head) {\n  \n}`
  },
  {
    id: 68,
    title: "Sort List",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Sort a linked list in O(n log n) time.",
    examples: [{ input: "4->2->1->3", output: "1->2->3->4" }],
    starterCode: `function sortList(head) {\n  \n}`
  },
  {
    id: 69,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked Lists",
    description: "Merge k sorted linked lists.",
    examples: [{ input: "[[1,4,5],[1,3,4],[2,6]]", output: "1->1->2->3->4->4->5->6" }],
    starterCode: `function mergeKLists(lists) {\n  \n}`
  },
  {
    id: 70,
    title: "LRU Cache",
    difficulty: "Medium",
    category: "Linked Lists",
    description: "Design and implement an LRU cache.",
    examples: [{ input: "capacity = 2", output: "LRU cache operations" }],
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    \n  }\n}`
  },
  // More Trees
  {
    id: 71,
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if tree has a subtree identical to another tree.",
    examples: [{ input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" }],
    starterCode: `function isSubtree(root, subRoot) {\n  \n}`
  },
  {
    id: 72,
    title: "Lowest Common Ancestor of BST",
    difficulty: "Easy",
    category: "Trees",
    description: "Find LCA of two nodes in a BST.",
    examples: [{ input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" }],
    starterCode: `function lowestCommonAncestor(root, p, q) {\n  \n}`
  },
  {
    id: 73,
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    category: "Trees",
    description: "Return values of nodes visible from right side.",
    examples: [{ input: "[1,2,3,null,5,null,4]", output: "[1,3,4]" }],
    starterCode: `function rightSideView(root) {\n  \n}`
  },
  {
    id: 74,
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Count nodes where value >= all ancestors.",
    examples: [{ input: "[3,1,4,3,null,1,5]", output: "4" }],
    starterCode: `function goodNodes(root) {\n  \n}`
  },
  {
    id: 75,
    title: "Kth Smallest Element in BST",
    difficulty: "Medium",
    category: "Trees",
    description: "Find kth smallest element in a BST.",
    examples: [{ input: "root = [3,1,4,null,2], k = 1", output: "1" }],
    starterCode: `function kthSmallest(root, k) {\n  \n}`
  },
  {
    id: 76,
    title: "Construct Binary Tree from Preorder and Inorder",
    difficulty: "Medium",
    category: "Trees",
    description: "Build tree from preorder and inorder traversals.",
    examples: [{ input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]" }],
    starterCode: `function buildTree(preorder, inorder) {\n  \n}`
  },
  {
    id: 77,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    category: "Trees",
    description: "Find maximum path sum in a binary tree.",
    examples: [{ input: "[1,2,3]", output: "6" }],
    starterCode: `function maxPathSum(root) {\n  \n}`
  },
  {
    id: 78,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    description: "Design algorithm to serialize and deserialize binary tree.",
    examples: [{ input: "[1,2,3,null,null,4,5]", output: "Serialized string" }],
    starterCode: `function serialize(root) {\n  \n}\nfunction deserialize(data) {\n  \n}`
  },
  {
    id: 79,
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if binary tree is height-balanced.",
    examples: [{ input: "[3,9,20,null,null,15,7]", output: "true" }],
    starterCode: `function isBalanced(root) {\n  \n}`
  },
  {
    id: 80,
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Find diameter (longest path between any two nodes).",
    examples: [{ input: "[1,2,3,4,5]", output: "3" }],
    starterCode: `function diameterOfBinaryTree(root) {\n  \n}`
  },
  // More Dynamic Programming
  {
    id: 81,
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Count unique paths in m x n grid from top-left to bottom-right.",
    examples: [{ input: "m = 3, n = 7", output: "28" }],
    starterCode: `function uniquePaths(m, n) {\n  \n}`
  },
  {
    id: 82,
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Determine if you can reach the last index.",
    examples: [{ input: "[2,3,1,1,4]", output: "true" }],
    starterCode: `function canJump(nums) {\n  \n}`
  },
  {
    id: 83,
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Count ways to decode a digit string to letters.",
    examples: [{ input: "'12'", output: "2" }],
    starterCode: `function numDecodings(s) {\n  \n}`
  },
  {
    id: 84,
    title: "Unique Binary Search Trees",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Count structurally unique BSTs with n nodes.",
    examples: [{ input: "n = 3", output: "5" }],
    starterCode: `function numTrees(n) {\n  \n}`
  },
  {
    id: 85,
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Check if array can be partitioned into two equal sum subsets.",
    examples: [{ input: "[1,5,11,5]", output: "true" }],
    starterCode: `function canPartition(nums) {\n  \n}`
  },
  {
    id: 86,
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Find minimum operations to convert word1 to word2.",
    examples: [{ input: "word1 = 'horse', word2 = 'ros'", output: "3" }],
    starterCode: `function minDistance(word1, word2) {\n  \n}`
  },
  {
    id: 87,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Find length of longest common subsequence.",
    examples: [{ input: "text1 = 'abcde', text2 = 'ace'", output: "3" }],
    starterCode: `function longestCommonSubsequence(text1, text2) {\n  \n}`
  },
  {
    id: 88,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Find contiguous subarray with largest product.",
    examples: [{ input: "[2,3,-2,4]", output: "6" }],
    starterCode: `function maxProduct(nums) {\n  \n}`
  },
  {
    id: 89,
    title: "Palindromic Substrings",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Count palindromic substrings.",
    examples: [{ input: "'abc'", output: "3" }],
    starterCode: `function countSubstrings(s) {\n  \n}`
  },
  {
    id: 90,
    title: "Target Sum",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Count ways to assign +/- to reach target sum.",
    examples: [{ input: "nums = [1,1,1,1,1], target = 3", output: "5" }],
    starterCode: `function findTargetSumWays(nums, target) {\n  \n}`
  },
  // More Graphs
  {
    id: 91,
    title: "Graph Valid Tree",
    difficulty: "Medium",
    category: "Graphs",
    description: "Check if edges form a valid tree.",
    examples: [{ input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" }],
    starterCode: `function validTree(n, edges) {\n  \n}`
  },
  {
    id: 92,
    title: "Number of Connected Components",
    difficulty: "Medium",
    category: "Graphs",
    description: "Count connected components in undirected graph.",
    examples: [{ input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" }],
    starterCode: `function countComponents(n, edges) {\n  \n}`
  },
  {
    id: 93,
    title: "Word Ladder",
    difficulty: "Hard",
    category: "Graphs",
    description: "Find shortest transformation sequence from beginWord to endWord.",
    examples: [{ input: "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']", output: "5" }],
    starterCode: `function ladderLength(beginWord, endWord, wordList) {\n  \n}`
  },
  {
    id: 94,
    title: "Surrounded Regions",
    difficulty: "Medium",
    category: "Graphs",
    description: "Capture all regions surrounded by 'X'.",
    examples: [{ input: "board with X and O", output: "Modified board" }],
    starterCode: `function solve(board) {\n  \n}`
  },
  {
    id: 95,
    title: "Rotting Oranges",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find minimum time for all oranges to rot.",
    examples: [{ input: "[[2,1,1],[1,1,0],[0,1,1]]", output: "4" }],
    starterCode: `function orangesRotting(grid) {\n  \n}`
  },
  {
    id: 96,
    title: "Walls and Gates",
    difficulty: "Medium",
    category: "Graphs",
    description: "Fill each empty room with distance to nearest gate.",
    examples: [{ input: "rooms grid", output: "Modified grid with distances" }],
    starterCode: `function wallsAndGates(rooms) {\n  \n}`
  },
  {
    id: 97,
    title: "Alien Dictionary",
    difficulty: "Hard",
    category: "Graphs",
    description: "Derive order of characters in alien language.",
    examples: [{ input: "['wrt','wrf','er','ett','rftt']", output: "'wertf'" }],
    starterCode: `function alienOrder(words) {\n  \n}`
  },
  {
    id: 98,
    title: "Network Delay Time",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find time for all nodes to receive signal.",
    examples: [{ input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2" }],
    starterCode: `function networkDelayTime(times, n, k) {\n  \n}`
  },
  {
    id: 99,
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find cheapest price with at most k stops.",
    examples: [{ input: "n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1", output: "200" }],
    starterCode: `function findCheapestPrice(n, flights, src, dst, k) {\n  \n}`
  },
  {
    id: 100,
    title: "Min Cost to Connect All Points",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find minimum cost to connect all points.",
    examples: [{ input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", output: "20" }],
    starterCode: `function minCostConnectPoints(points) {\n  \n}`
  },
  // More Backtracking
  {
    id: 101,
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Check if word exists in grid.",
    examples: [{ input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'", output: "true" }],
    starterCode: `function exist(board, word) {\n  \n}`
  },
  {
    id: 102,
    title: "N-Queens",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Place n queens on n×n chessboard.",
    examples: [{ input: "n = 4", output: "[['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]" }],
    starterCode: `function solveNQueens(n) {\n  \n}`
  },
  {
    id: 103,
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Partition string into palindrome substrings.",
    examples: [{ input: "'aab'", output: "[['a','a','b'],['aa','b']]" }],
    starterCode: `function partition(s) {\n  \n}`
  },
  {
    id: 104,
    title: "Sudoku Solver",
    difficulty: "Hard",
    category: "Backtracking",
    description: "Solve a Sudoku puzzle.",
    examples: [{ input: "9x9 board", output: "Solved board" }],
    starterCode: `function solveSudoku(board) {\n  \n}`
  },
  {
    id: 105,
    title: "Combinations",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Return all combinations of k numbers from 1 to n.",
    examples: [{ input: "n = 4, k = 2", output: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" }],
    starterCode: `function combine(n, k) {\n  \n}`
  },
  {
    id: 106,
    title: "Restore IP Addresses",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Return all valid IP addresses from string.",
    examples: [{ input: "'25525511135'", output: "['255.255.11.135','255.255.111.35']" }],
    starterCode: `function restoreIpAddresses(s) {\n  \n}`
  },
  // More Binary Search
  {
    id: 107,
    title: "Search in Rotated Sorted Array II",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Search in rotated array with duplicates.",
    examples: [{ input: "nums = [2,5,6,0,0,1,2], target = 0", output: "true" }],
    starterCode: `function search(nums, target) {\n  \n}`
  },
  {
    id: 108,
    title: "Find Peak Element",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find a peak element in array.",
    examples: [{ input: "[1,2,3,1]", output: "2" }],
    starterCode: `function findPeakElement(nums) {\n  \n}`
  },
  {
    id: 109,
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Search for value in 2D matrix.",
    examples: [{ input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true" }],
    starterCode: `function searchMatrix(matrix, target) {\n  \n}`
  },
  {
    id: 110,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find minimum eating speed to finish bananas in h hours.",
    examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4" }],
    starterCode: `function minEatingSpeed(piles, h) {\n  \n}`
  },
  // More Heap
  {
    id: 111,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Heap",
    description: "Design data structure to find median from stream.",
    examples: [{ input: "addNum(1), addNum(2), findMedian()", output: "1.5" }],
    starterCode: `class MedianFinder {\n  constructor() {\n    \n  }\n}`
  },
  {
    id: 112,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Heap",
    description: "Merge k sorted linked lists using heap.",
    examples: [{ input: "[[1,4,5],[1,3,4],[2,6]]", output: "1->1->2->3->4->4->5->6" }],
    starterCode: `function mergeKLists(lists) {\n  \n}`
  },
  {
    id: 113,
    title: "Task Scheduler",
    difficulty: "Medium",
    category: "Heap",
    description: "Find minimum intervals to execute all tasks.",
    examples: [{ input: "tasks = ['A','A','A','B','B','B'], n = 2", output: "8" }],
    starterCode: `function leastInterval(tasks, n) {\n  \n}`
  },
  {
    id: 114,
    title: "Kth Largest Element in Stream",
    difficulty: "Easy",
    category: "Heap",
    description: "Design class to find kth largest element in stream.",
    examples: [{ input: "k = 3, nums = [4,5,8,2]", output: "KthLargest class" }],
    starterCode: `class KthLargest {\n  constructor(k, nums) {\n    \n  }\n}`
  },
  {
    id: 115,
    title: "Last Stone Weight",
    difficulty: "Easy",
    category: "Heap",
    description: "Find weight of last remaining stone.",
    examples: [{ input: "[2,7,4,1,8,1]", output: "1" }],
    starterCode: `function lastStoneWeight(stones) {\n  \n}`
  },
  {
    id: 116,
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    category: "Heap",
    description: "Find k closest points to origin.",
    examples: [{ input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]" }],
    starterCode: `function kClosest(points, k) {\n  \n}`
  },
  {
    id: 117,
    title: "Reorganize String",
    difficulty: "Medium",
    category: "Heap",
    description: "Reorganize string so no adjacent characters are same.",
    examples: [{ input: "'aab'", output: "'aba'" }],
    starterCode: `function reorganizeString(s) {\n  \n}`
  },
  // Bit Manipulation (10 problems)
  {
    id: 118,
    title: "Number of 1 Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Count number of 1 bits in integer.",
    examples: [{ input: "11", output: "3" }],
    starterCode: `function hammingWeight(n) {\n  \n}`
  },
  {
    id: 119,
    title: "Counting Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Count 1 bits for numbers from 0 to n.",
    examples: [{ input: "5", output: "[0,1,1,2,1,2]" }],
    starterCode: `function countBits(n) {\n  \n}`
  },
  {
    id: 120,
    title: "Reverse Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Reverse bits of a 32-bit integer.",
    examples: [{ input: "00000010100101000001111010011100", output: "00111001011110000010100101000000" }],
    starterCode: `function reverseBits(n) {\n  \n}`
  },
  {
    id: 121,
    title: "Single Number",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Find element that appears once while others appear twice.",
    examples: [{ input: "[2,2,1]", output: "1" }],
    starterCode: `function singleNumber(nums) {\n  \n}`
  },
  {
    id: 122,
    title: "Single Number II",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: "Find element that appears once while others appear thrice.",
    examples: [{ input: "[2,2,3,2]", output: "3" }],
    starterCode: `function singleNumber(nums) {\n  \n}`
  },
  {
    id: 123,
    title: "Power of Two",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Check if integer is a power of two.",
    examples: [{ input: "16", output: "true" }],
    starterCode: `function isPowerOfTwo(n) {\n  \n}`
  },
  {
    id: 124,
    title: "Sum of Two Integers",
    difficulty: "Medium",
    category: "Bit Manipulation",
    description: "Add two integers without using + or - operators.",
    examples: [{ input: "a = 1, b = 2", output: "3" }],
    starterCode: `function getSum(a, b) {\n  \n}`
  },
  {
    id: 125,
    title: "Missing Number",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: "Find missing number in array [0, n].",
    examples: [{ input: "[3,0,1]", output: "2" }],
    starterCode: `function missingNumber(nums) {\n  \n}`
  },
  // Math (10 problems)
  {
    id: 126,
    title: "Fizz Buzz",
    difficulty: "Easy",
    category: "Math",
    description: "Return array with FizzBuzz pattern.",
    examples: [{ input: "n = 5", output: "['1','2','Fizz','4','Buzz']" }],
    starterCode: `function fizzBuzz(n) {\n  \n}`
  },
  {
    id: 127,
    title: "Happy Number",
    difficulty: "Easy",
    category: "Math",
    description: "Determine if number is happy.",
    examples: [{ input: "19", output: "true" }],
    starterCode: `function isHappy(n) {\n  \n}`
  },
  {
    id: 128,
    title: "Plus One",
    difficulty: "Easy",
    category: "Math",
    description: "Add one to number represented as array.",
    examples: [{ input: "[1,2,3]", output: "[1,2,4]" }],
    starterCode: `function plusOne(digits) {\n  \n}`
  },
  {
    id: 129,
    title: "Pow(x, n)",
    difficulty: "Medium",
    category: "Math",
    description: "Calculate x raised to power n.",
    examples: [{ input: "x = 2.0, n = 10", output: "1024.0" }],
    starterCode: `function myPow(x, n) {\n  \n}`
  },
  {
    id: 130,
    title: "Sqrt(x)",
    difficulty: "Easy",
    category: "Math",
    description: "Compute square root of x.",
    examples: [{ input: "8", output: "2" }],
    starterCode: `function mySqrt(x) {\n  \n}`
  },
  {
    id: 131,
    title: "Factorial Trailing Zeroes",
    difficulty: "Medium",
    category: "Math",
    description: "Count trailing zeroes in n!",
    examples: [{ input: "5", output: "1" }],
    starterCode: `function trailingZeroes(n) {\n  \n}`
  },
  {
    id: 132,
    title: "Excel Sheet Column Number",
    difficulty: "Easy",
    category: "Math",
    description: "Convert Excel column title to number.",
    examples: [{ input: "'AB'", output: "28" }],
    starterCode: `function titleToNumber(columnTitle) {\n  \n}`
  },
  {
    id: 133,
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "Math",
    description: "Convert Roman numeral to integer.",
    examples: [{ input: "'III'", output: "3" }],
    starterCode: `function romanToInt(s) {\n  \n}`
  },
  {
    id: 134,
    title: "Integer to Roman",
    difficulty: "Medium",
    category: "Math",
    description: "Convert integer to Roman numeral.",
    examples: [{ input: "58", output: "'LVIII'" }],
    starterCode: `function intToRoman(num) {\n  \n}`
  },
  {
    id: 135,
    title: "Multiply Strings",
    difficulty: "Medium",
    category: "Math",
    description: "Multiply two numbers represented as strings.",
    examples: [{ input: "num1 = '2', num2 = '3'", output: "'6'" }],
    starterCode: `function multiply(num1, num2) {\n  \n}`
  },
  // Greedy (10 problems)
  {
    id: 136,
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    category: "Greedy",
    description: "Maximize profit with multiple transactions.",
    examples: [{ input: "[7,1,5,3,6,4]", output: "7" }],
    starterCode: `function maxProfit(prices) {\n  \n}`
  },
  {
    id: 137,
    title: "Jump Game II",
    difficulty: "Medium",
    category: "Greedy",
    description: "Find minimum jumps to reach last index.",
    examples: [{ input: "[2,3,1,1,4]", output: "2" }],
    starterCode: `function jump(nums) {\n  \n}`
  },
  {
    id: 138,
    title: "Gas Station",
    difficulty: "Medium",
    category: "Greedy",
    description: "Find starting gas station to complete circuit.",
    examples: [{ input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" }],
    starterCode: `function canCompleteCircuit(gas, cost) {\n  \n}`
  },
  {
    id: 139,
    title: "Hand of Straights",
    difficulty: "Medium",
    category: "Greedy",
    description: "Check if cards can be rearranged into groups.",
    examples: [{ input: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3", output: "true" }],
    starterCode: `function isNStraightHand(hand, groupSize) {\n  \n}`
  },
  {
    id: 140,
    title: "Merge Triplets",
    difficulty: "Medium",
    category: "Greedy",
    description: "Check if target triplet can be formed.",
    examples: [{ input: "triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]", output: "true" }],
    starterCode: `function mergeTriplets(triplets, target) {\n  \n}`
  },
  // Intervals (5 problems)
  {
    id: 141,
    title: "Meeting Rooms",
    difficulty: "Easy",
    category: "Intervals",
    description: "Check if person can attend all meetings.",
    examples: [{ input: "[[0,30],[5,10],[15,20]]", output: "false" }],
    starterCode: `function canAttendMeetings(intervals) {\n  \n}`
  },
  {
    id: 142,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    category: "Intervals",
    description: "Find minimum conference rooms required.",
    examples: [{ input: "[[0,30],[5,10],[15,20]]", output: "2" }],
    starterCode: `function minMeetingRooms(intervals) {\n  \n}`
  },
  {
    id: 143,
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Intervals",
    description: "Find minimum intervals to remove to make non-overlapping.",
    examples: [{ input: "[[1,2],[2,3],[3,4],[1,3]]", output: "1" }],
    starterCode: `function eraseOverlapIntervals(intervals) {\n  \n}`
  },
  {
    id: 144,
    title: "Minimum Interval to Include Each Query",
    difficulty: "Hard",
    category: "Intervals",
    description: "Find minimum interval size for each query.",
    examples: [{ input: "intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]", output: "[3,3,1,4]" }],
    starterCode: `function minInterval(intervals, queries) {\n  \n}`
  },
  // Trie (5 problems)
  {
    id: 145,
    title: "Implement Trie",
    difficulty: "Medium",
    category: "Trie",
    description: "Implement a trie with insert, search, and startsWith.",
    examples: [{ input: "insert('apple'), search('apple')", output: "true" }],
    starterCode: {
      javascript: `class Trie {
  constructor() {
    // Initialize your data structure
    
  }
  
  insert(word) {
    // Write your code here
    
  }
  
  search(word) {
    // Write your code here
    
  }
  
  startsWith(prefix) {
    // Write your code here
    
  }
}`,
      python: `class Trie:
    def __init__(self):
        # Initialize your data structure
        pass
    
    def insert(self, word):
        # Write your code here
        pass
    
    def search(self, word):
        # Write your code here
        pass
    
    def starts_with(self, prefix):
        # Write your code here
        pass`,
      java: `class Trie {
    public Trie() {
        // Initialize your data structure
        
    }
    
    public void insert(String word) {
        // Write your code here
        
    }
    
    public boolean search(String word) {
        // Write your code here
        
    }
    
    public boolean startsWith(String prefix) {
        // Write your code here
        
    }
}`,
      cpp: `class Trie {
public:
    Trie() {
        // Initialize your data structure
        
    }
    
    void insert(string word) {
        // Write your code here
        
    }
    
    bool search(string word) {
        // Write your code here
        
    }
    
    bool startsWith(string prefix) {
        // Write your code here
        
    }
};`,
      typescript: `class Trie {
    constructor() {
        // Initialize your data structure
        
    }
    
    insert(word: string): void {
        // Write your code here
        
    }
    
    search(word: string): boolean {
        // Write your code here
        
    }
    
    startsWith(prefix: string): boolean {
        // Write your code here
        
    }
}`
    }
  },
  {
    id: 146,
    title: "Design Add and Search Words",
    difficulty: "Medium",
    category: "Trie",
    description: "Design data structure supporting add and search with wildcards.",
    examples: [{ input: "addWord('bad'), search('.ad')", output: "true" }],
    starterCode: `class WordDictionary {\n  constructor() {\n    \n  }\n}`
  },
  {
    id: 147,
    title: "Word Search II",
    difficulty: "Hard",
    category: "Trie",
    description: "Find all words from dictionary in board.",
    examples: [{ input: "board, words = ['oath','pea','eat','rain']", output: "['eat','oath']" }],
    starterCode: `function findWords(board, words) {\n  \n}`
  },
  {
    id: 148,
    title: "Longest Word in Dictionary",
    difficulty: "Medium",
    category: "Trie",
    description: "Find longest word built one character at a time.",
    examples: [{ input: "['w','wo','wor','worl','world']", output: "'world'" }],
    starterCode: `function longestWord(words) {\n  \n}`
  },
  {
    id: 149,
    title: "Replace Words",
    difficulty: "Medium",
    category: "Trie",
    description: "Replace words with shortest root from dictionary.",
    examples: [{ input: "dictionary = ['cat','bat','rat'], sentence = 'the cattle was rattled by the battery'", output: "'the cat was rat by the bat'" }],
    starterCode: `function replaceWords(dictionary, sentence) {\n  \n}`
  },
  {
    id: 150,
    title: "Maximum XOR of Two Numbers",
    difficulty: "Medium",
    category: "Trie",
    description: "Find maximum XOR of two numbers in array.",
    examples: [{ input: "[3,10,5,25,2,8]", output: "28" }],
    starterCode: `function findMaximumXOR(nums) {\n  \n}`
  }
];

// Categories for filtering
export const categories = [
  'All',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Trees',
  'Stack',
  'Dynamic Programming',
  'Graphs',
  'Binary Search',
  'Heap',
  'Backtracking',
  'Bit Manipulation',
  'Math',
  'Greedy',
  'Intervals',
  'Trie'
];

// Difficulties for filtering
export const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
