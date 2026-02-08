// DSA Educational Articles - Comprehensive Learning Resource
export const dsaArticles = {
  arrays: [
    {
      id: 'arrays-intro',
      title: 'Introduction to Arrays',
      difficulty: 'Beginner',
      readTime: '8 min',
      category: 'Arrays',
      tags: ['basics', 'data-structures', 'arrays'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn the fundamentals of arrays, one of the most important data structures in programming.',
      thumbnail: '📊',
      content: `# Introduction to Arrays

## What is an Array?
An **array** is a fundamental data structure that stores elements of the same type in contiguous memory locations.

### Key Characteristics
- **Fixed Size**: Once created, size cannot be changed
- **Indexed Access**: Elements accessed via index (0-based)
- **Contiguous Memory**: Elements stored next to each other
- **Same Type**: All elements must be of the same data type

## Time Complexity
- Access: O(1)
- Search: O(n)
- Insert: O(n)
- Delete: O(n)

## Common Operations
\`\`\`javascript
// Declaration
let arr = [1, 2, 3, 4, 5];

// Access
console.log(arr[0]); // 1

// Update
arr[2] = 10;

// Traverse
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
\`\`\`

## When to Use Arrays
- When you need fast access to elements by index
- When the size is known in advance
- When you need to store a collection of similar items`
    },
    {
      id: 'two-pointer-technique',
      title: 'Two Pointer Technique',
      difficulty: 'Intermediate',
      readTime: '12 min',
      category: 'Arrays',
      tags: ['technique', 'optimization', 'arrays'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Master the two-pointer technique for solving array problems efficiently.',
      thumbnail: '👉👈',
      content: `# Two Pointer Technique

## What is Two Pointer?
A technique where two pointers traverse the array from different positions to solve problems efficiently.

## Types of Two Pointer
1. **Opposite Direction**: Start from both ends
2. **Same Direction**: Both move forward
3. **Sliding Window**: Fixed or variable window size

## Example: Two Sum (Sorted Array)
\`\`\`javascript
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}
\`\`\`

## Time Complexity: O(n)
## Space Complexity: O(1)

## Common Problems
- Two Sum
- Container With Most Water
- Remove Duplicates
- Palindrome Check`
    }
  ],

  strings: [
    {
      id: 'strings-basics',
      title: 'String Manipulation Fundamentals',
      difficulty: 'Beginner',
      readTime: '10 min',
      category: 'Strings',
      tags: ['strings', 'basics', 'manipulation'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn essential string operations and manipulation techniques.',
      thumbnail: '📝',
      content: `# String Manipulation Fundamentals

## What are Strings?
Strings are sequences of characters used to represent text.

## Common Operations
\`\`\`javascript
// Length
let str = "Hello";
console.log(str.length); // 5

// Access
console.log(str[0]); // 'H'

// Concatenation
let greeting = str + " World";

// Substring
console.log(str.substring(0, 2)); // "He"

// Split
let words = "Hello World".split(" ");

// Join
let joined = words.join("-");
\`\`\`

## Important Methods
- charAt(index)
- indexOf(substring)
- slice(start, end)
- toLowerCase() / toUpperCase()
- trim()
- replace(old, new)

## Time Complexity
- Access: O(1)
- Search: O(n)
- Concatenation: O(n)

## Common Patterns
1. Two Pointer
2. Sliding Window
3. Hash Map
4. String Builder`
    },
    {
      id: 'anagram-patterns',
      title: 'Anagram Detection Patterns',
      difficulty: 'Intermediate',
      readTime: '15 min',
      category: 'Strings',
      tags: ['anagrams', 'hash-map', 'sorting'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Different approaches to detect and work with anagrams.',
      thumbnail: '🔤',
      content: `# Anagram Detection Patterns

## What is an Anagram?
Two strings are anagrams if they contain the same characters with the same frequency.

## Approach 1: Sorting
\`\`\`javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const sortedS = s.split('').sort().join('');
  const sortedT = t.split('').sort().join('');
  
  return sortedS === sortedT;
}
// Time: O(n log n), Space: O(1)
\`\`\`

## Approach 2: Hash Map
\`\`\`javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const count = {};
  
  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  
  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  
  return true;
}
// Time: O(n), Space: O(1) - max 26 letters
\`\`\`

## Approach 3: Character Array
\`\`\`javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const count = new Array(26).fill(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  
  return count.every(c => c === 0);
}
// Time: O(n), Space: O(1)
\`\`\`

## Which to Use?
- **Sorting**: Simple, works for any characters
- **Hash Map**: Faster, flexible
- **Array**: Fastest for lowercase letters only`
    }
  ],

  linkedLists: [
    {
      id: 'linked-list-intro',
      title: 'Introduction to Linked Lists',
      difficulty: 'Beginner',
      readTime: '12 min',
      category: 'Linked Lists',
      tags: ['linked-list', 'data-structures', 'pointers'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Understanding linked lists and their advantages over arrays.',
      thumbnail: '🔗',
      content: `# Introduction to Linked Lists

## What is a Linked List?
A linear data structure where elements are stored in nodes, and each node points to the next node.

## Node Structure
\`\`\`javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
\`\`\`

## Types of Linked Lists
1. **Singly Linked List**: One direction
2. **Doubly Linked List**: Two directions
3. **Circular Linked List**: Last points to first

## Basic Operations
\`\`\`javascript
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // Insert at beginning - O(1)
  insertFirst(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }
  
  // Insert at end - O(n)
  insertLast(value) {
    const node = new Node(value);
    
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }
  
  // Delete node - O(n)
  delete(value) {
    if (!this.head) return;
    
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.size--;
        return;
      }
      current = current.next;
    }
  }
}
\`\`\`

## Advantages vs Arrays
✅ Dynamic size
✅ Easy insertion/deletion
✅ No memory waste

## Disadvantages
❌ No random access
❌ Extra memory for pointers
❌ Not cache friendly`
    },
    {
      id: 'reverse-linked-list',
      title: 'Reversing a Linked List',
      difficulty: 'Intermediate',
      readTime: '10 min',
      category: 'Linked Lists',
      tags: ['linked-list', 'reversal', 'pointers'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn iterative and recursive approaches to reverse a linked list.',
      thumbnail: '🔄',
      content: `# Reversing a Linked List

## Iterative Approach
\`\`\`javascript
function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    // Save next
    let next = current.next;
    
    // Reverse pointer
    current.next = prev;
    
    // Move forward
    prev = current;
    current = next;
  }
  
  return prev;
}
// Time: O(n), Space: O(1)
\`\`\`

## Recursive Approach
\`\`\`javascript
function reverseList(head) {
  // Base case
  if (!head || !head.next) {
    return head;
  }
  
  // Recursive call
  const newHead = reverseList(head.next);
  
  // Reverse the link
  head.next.next = head;
  head.next = null;
  
  return newHead;
}
// Time: O(n), Space: O(n) - call stack
\`\`\`

## Step-by-Step Visualization
\`\`\`
Original: 1 -> 2 -> 3 -> 4 -> null

Step 1:   null <- 1    2 -> 3 -> 4 -> null
Step 2:   null <- 1 <- 2    3 -> 4 -> null
Step 3:   null <- 1 <- 2 <- 3    4 -> null
Step 4:   null <- 1 <- 2 <- 3 <- 4

Result:   4 -> 3 -> 2 -> 1 -> null
\`\`\`

## Key Points
- Three pointers: prev, current, next
- Reverse one link at a time
- Move all pointers forward
- Return prev at the end`
    }
  ],

  trees: [
    {
      id: 'binary-trees-intro',
      title: 'Introduction to Binary Trees',
      difficulty: 'Intermediate',
      readTime: '15 min',
      category: 'Trees',
      tags: ['trees', 'binary-tree', 'data-structures'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn about binary trees, their properties, and traversal methods.',
      thumbnail: '🌳',
      content: `# Introduction to Binary Trees

## What is a Binary Tree?
A tree data structure where each node has at most two children (left and right).

## Node Structure
\`\`\`javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
\`\`\`

## Types of Binary Trees
1. **Full Binary Tree**: Every node has 0 or 2 children
2. **Complete Binary Tree**: All levels filled except possibly last
3. **Perfect Binary Tree**: All internal nodes have 2 children
4. **Balanced Binary Tree**: Height difference ≤ 1

## Tree Traversals

### 1. Inorder (Left, Root, Right)
\`\`\`javascript
function inorder(root) {
  if (!root) return;
  
  inorder(root.left);
  console.log(root.value);
  inorder(root.right);
}
// Result: Sorted order for BST
\`\`\`

### 2. Preorder (Root, Left, Right)
\`\`\`javascript
function preorder(root) {
  if (!root) return;
  
  console.log(root.value);
  preorder(root.left);
  preorder(root.right);
}
// Result: Root first
\`\`\`

### 3. Postorder (Left, Right, Root)
\`\`\`javascript
function postorder(root) {
  if (!root) return;
  
  postorder(root.left);
  postorder(root.right);
  console.log(root.value);
}
// Result: Root last
\`\`\`

### 4. Level Order (BFS)
\`\`\`javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const level = [];
    const size = queue.length;
    
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
\`\`\`

## Common Operations
- Height: O(n)
- Search: O(n)
- Insert: O(n)
- Delete: O(n)

## Applications
- File systems
- Expression parsing
- Database indexing
- Decision trees`
    },
    {
      id: 'bst-operations',
      title: 'Binary Search Tree Operations',
      difficulty: 'Intermediate',
      readTime: '18 min',
      category: 'Trees',
      tags: ['bst', 'search', 'trees'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Master BST operations: search, insert, delete, and validation.',
      thumbnail: '🔍',
      content: `# Binary Search Tree Operations

## BST Property
For every node:
- Left subtree values < node value
- Right subtree values > node value

## Search Operation
\`\`\`javascript
function search(root, target) {
  if (!root) return null;
  
  if (root.value === target) {
    return root;
  }
  
  if (target < root.value) {
    return search(root.left, target);
  } else {
    return search(root.right, target);
  }
}
// Time: O(h) where h is height
// Best: O(log n), Worst: O(n)
\`\`\`

## Insert Operation
\`\`\`javascript
function insert(root, value) {
  if (!root) {
    return new TreeNode(value);
  }
  
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  
  return root;
}
// Time: O(h)
\`\`\`

## Delete Operation
\`\`\`javascript
function deleteNode(root, key) {
  if (!root) return null;
  
  if (key < root.value) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.value) {
    root.right = deleteNode(root.right, key);
  } else {
    // Node found
    
    // Case 1: Leaf node
    if (!root.left && !root.right) {
      return null;
    }
    
    // Case 2: One child
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    // Case 3: Two children
    // Find inorder successor (min in right subtree)
    let successor = root.right;
    while (successor.left) {
      successor = successor.left;
    }
    
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }
  
  return root;
}
\`\`\`

## Validate BST
\`\`\`javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  
  if (root.value <= min || root.value >= max) {
    return false;
  }
  
  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}
\`\`\`

## Time Complexity
- Balanced BST: O(log n)
- Skewed BST: O(n)

## Self-Balancing Trees
- AVL Tree
- Red-Black Tree
- B-Tree`
    }
  ],

  dynamicProgramming: [
    {
      id: 'dp-introduction',
      title: 'Dynamic Programming Fundamentals',
      difficulty: 'Advanced',
      readTime: '20 min',
      category: 'Dynamic Programming',
      tags: ['dp', 'optimization', 'memoization'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Master the fundamentals of dynamic programming and when to use it.',
      thumbnail: '🎯',
      content: `# Dynamic Programming Fundamentals

## What is Dynamic Programming?
An optimization technique that solves complex problems by breaking them into simpler subproblems and storing results.

## Key Characteristics
1. **Optimal Substructure**: Solution can be built from optimal solutions of subproblems
2. **Overlapping Subproblems**: Same subproblems solved multiple times

## Approaches

### 1. Memoization (Top-Down)
\`\`\`javascript
// Fibonacci with memoization
function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
// Time: O(n), Space: O(n)
\`\`\`

### 2. Tabulation (Bottom-Up)
\`\`\`javascript
// Fibonacci with tabulation
function fib(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}
// Time: O(n), Space: O(n)
\`\`\`

### 3. Space Optimized
\`\`\`javascript
// Fibonacci space optimized
function fib(n) {
  if (n <= 1) return n;
  
  let prev2 = 0;
  let prev1 = 1;
  
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}
// Time: O(n), Space: O(1)
\`\`\`

## When to Use DP?
✅ Problem has optimal substructure
✅ Overlapping subproblems exist
✅ Need to optimize recursive solution
✅ Counting or optimization problems

## Common DP Patterns
1. 0/1 Knapsack
2. Unbounded Knapsack
3. Fibonacci
4. LCS (Longest Common Subsequence)
5. LIS (Longest Increasing Subsequence)
6. Matrix Chain Multiplication
7. Palindrome Problems
8. Grid Problems

## Steps to Solve DP
1. Define state (dp array meaning)
2. Find recurrence relation
3. Initialize base cases
4. Determine iteration order
5. Return final answer`
    },
    {
      id: 'knapsack-problem',
      title: '0/1 Knapsack Problem',
      difficulty: 'Advanced',
      readTime: '25 min',
      category: 'Dynamic Programming',
      tags: ['dp', 'knapsack', 'optimization'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Deep dive into the classic 0/1 knapsack problem with multiple approaches.',
      thumbnail: '🎒',
      content: `# 0/1 Knapsack Problem

## Problem Statement
Given weights and values of n items, put items in a knapsack of capacity W to get maximum total value.

## Recursive Solution
\`\`\`javascript
function knapsack(weights, values, W, n) {
  // Base case
  if (n === 0 || W === 0) {
    return 0;
  }
  
  // If weight exceeds capacity
  if (weights[n - 1] > W) {
    return knapsack(weights, values, W, n - 1);
  }
  
  // Max of including or excluding item
  const include = values[n - 1] + 
    knapsack(weights, values, W - weights[n - 1], n - 1);
  const exclude = knapsack(weights, values, W, n - 1);
  
  return Math.max(include, exclude);
}
// Time: O(2^n) - Exponential!
\`\`\`

## Memoization Solution
\`\`\`javascript
function knapsack(weights, values, W, n, memo = {}) {
  const key = \`\${n}-\${W}\`;
  
  if (key in memo) return memo[key];
  
  if (n === 0 || W === 0) {
    return 0;
  }
  
  if (weights[n - 1] > W) {
    memo[key] = knapsack(weights, values, W, n - 1, memo);
  } else {
    const include = values[n - 1] + 
      knapsack(weights, values, W - weights[n - 1], n - 1, memo);
    const exclude = knapsack(weights, values, W, n - 1, memo);
    memo[key] = Math.max(include, exclude);
  }
  
  return memo[key];
}
// Time: O(n * W), Space: O(n * W)
\`\`\`

## Tabulation Solution
\`\`\`javascript
function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0)
    .map(() => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][W];
}
// Time: O(n * W), Space: O(n * W)
\`\`\`

## Space Optimized
\`\`\`javascript
function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(W + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(
        dp[w],
        values[i] + dp[w - weights[i]]
      );
    }
  }
  
  return dp[W];
}
// Time: O(n * W), Space: O(W)
\`\`\`

## Example
\`\`\`
Weights: [1, 3, 4, 5]
Values:  [1, 4, 5, 7]
Capacity: 7

DP Table:
     0  1  2  3  4  5  6  7
  0  0  0  0  0  0  0  0  0
  1  0  1  1  1  1  1  1  1
  3  0  1  1  4  5  5  5  5
  4  0  1  1  4  5  6  6  9
  5  0  1  1  4  5  7  8  9

Answer: 9 (items 3 and 4)
\`\`\`

## Variations
- Unbounded Knapsack
- Fractional Knapsack
- Multiple Knapsack
- Subset Sum`
    }
  ],

  graphs: [
    {
      id: 'graph-basics',
      title: 'Introduction to Graphs',
      difficulty: 'Intermediate',
      readTime: '15 min',
      category: 'Graphs',
      tags: ['graphs', 'data-structures', 'basics'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn graph fundamentals, representations, and basic traversals.',
      thumbnail: '🕸️',
      content: `# Introduction to Graphs

## What is a Graph?
A non-linear data structure consisting of vertices (nodes) and edges (connections).

## Types of Graphs
1. **Directed**: Edges have direction (A → B)
2. **Undirected**: Edges have no direction (A — B)
3. **Weighted**: Edges have weights/costs
4. **Unweighted**: All edges equal
5. **Cyclic**: Contains cycles
6. **Acyclic**: No cycles (DAG)

## Graph Representations

### 1. Adjacency Matrix
\`\`\`javascript
// For n vertices
const graph = Array(n).fill(0)
  .map(() => Array(n).fill(0));

// Add edge from u to v
graph[u][v] = 1;

// For weighted graph
graph[u][v] = weight;

// Space: O(V²)
// Edge lookup: O(1)
\`\`\`

### 2. Adjacency List
\`\`\`javascript
// Using Map
const graph = new Map();

// Add vertex
graph.set(vertex, []);

// Add edge
graph.get(u).push(v);

// For weighted graph
graph.get(u).push({node: v, weight: w});

// Space: O(V + E)
// Edge lookup: O(degree)
\`\`\`

## Graph Traversals

### BFS (Breadth-First Search)
\`\`\`javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length) {
    const node = queue.shift();
    console.log(node);
    
    for (let neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
// Time: O(V + E), Space: O(V)
\`\`\`

### DFS (Depth-First Search)
\`\`\`javascript
function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  console.log(node);
  
  for (let neighbor of graph.get(node)) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
// Time: O(V + E), Space: O(V)
\`\`\`

## Common Graph Problems
- Shortest Path (Dijkstra, Bellman-Ford)
- Minimum Spanning Tree (Kruskal, Prim)
- Cycle Detection
- Topological Sort
- Connected Components
- Bipartite Check

## Applications
- Social networks
- Maps and navigation
- Network routing
- Recommendation systems
- Dependency resolution`
    },
    {
      id: 'dijkstra-algorithm',
      title: "Dijkstra's Shortest Path Algorithm",
      difficulty: 'Advanced',
      readTime: '20 min',
      category: 'Graphs',
      tags: ['graphs', 'shortest-path', 'dijkstra'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: "Master Dijkstra's algorithm for finding shortest paths in weighted graphs.",
      thumbnail: '🛣️',
      content: `# Dijkstra's Shortest Path Algorithm

## Problem
Find shortest path from source to all vertices in a weighted graph with non-negative weights.

## Algorithm Steps
1. Initialize distances (source = 0, others = ∞)
2. Use min-heap to get vertex with minimum distance
3. Update distances of neighbors
4. Repeat until all vertices processed

## Implementation
\`\`\`javascript
function dijkstra(graph, start) {
  const distances = new Map();
  const visited = new Set();
  const pq = new MinPriorityQueue();
  
  // Initialize distances
  for (let vertex of graph.keys()) {
    distances.set(vertex, Infinity);
  }
  distances.set(start, 0);
  
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const { element: current } = pq.dequeue();
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (let { node, weight } of graph.get(current)) {
      const newDist = distances.get(current) + weight;
      
      if (newDist < distances.get(node)) {
        distances.set(node, newDist);
        pq.enqueue(node, newDist);
      }
    }
  }
  
  return distances;
}
// Time: O((V + E) log V) with min-heap
// Space: O(V)
\`\`\`

## Example
\`\`\`
Graph:
    A --1-- B
    |       |
    4       2
    |       |
    C --1-- D

Starting from A:
Step 1: A=0, B=∞, C=∞, D=∞
Step 2: A=0, B=1, C=4, D=∞
Step 3: A=0, B=1, C=4, D=3
Step 4: A=0, B=1, C=4, D=3

Shortest paths from A:
A → A: 0
A → B: 1
A → C: 4
A → D: 3
\`\`\`

## Path Reconstruction
\`\`\`javascript
function dijkstraWithPath(graph, start, end) {
  const distances = new Map();
  const previous = new Map();
  const pq = new MinPriorityQueue();
  
  for (let vertex of graph.keys()) {
    distances.set(vertex, Infinity);
    previous.set(vertex, null);
  }
  distances.set(start, 0);
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const { element: current } = pq.dequeue();
    
    if (current === end) break;
    
    for (let { node, weight } of graph.get(current)) {
      const newDist = distances.get(current) + weight;
      
      if (newDist < distances.get(node)) {
        distances.set(node, newDist);
        previous.set(node, current);
        pq.enqueue(node, newDist);
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous.get(current);
  }
  
  return { distance: distances.get(end), path };
}
\`\`\`

## Limitations
❌ Doesn't work with negative weights
❌ Use Bellman-Ford for negative weights
❌ Use Floyd-Warshall for all-pairs shortest path

## Optimizations
- Use Fibonacci heap: O(E + V log V)
- Bidirectional search
- A* algorithm with heuristics`
    }
  ],

  stackQueue: [
    {
      id: 'stack-basics',
      title: 'Stack Data Structure',
      difficulty: 'Beginner',
      readTime: '10 min',
      category: 'Stack & Queue',
      tags: ['stack', 'lifo', 'data-structures'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Learn about stacks and their applications in programming.',
      thumbnail: '📚',
      content: `# Stack Data Structure

## What is a Stack?
A linear data structure that follows LIFO (Last In First Out) principle.

## Operations
- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1)
- **Peek/Top**: View top element - O(1)
- **isEmpty**: Check if empty - O(1)

## Implementation

### Using Array
\`\`\`javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}
\`\`\`

### Using Linked List
\`\`\`javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
    this.size = 0;
  }
  
  push(value) {
    const node = new Node(value);
    node.next = this.top;
    this.top = node;
    this.size++;
  }
  
  pop() {
    if (!this.top) return null;
    const value = this.top.value;
    this.top = this.top.next;
    this.size--;
    return value;
  }
  
  peek() {
    return this.top ? this.top.value : null;
  }
}
\`\`\`

## Common Applications
1. **Function Call Stack**: Recursion
2. **Undo/Redo**: Text editors
3. **Expression Evaluation**: Calculators
4. **Backtracking**: Maze solving
5. **Browser History**: Back button
6. **Syntax Parsing**: Compilers

## Classic Problems
- Valid Parentheses
- Min Stack
- Next Greater Element
- Largest Rectangle in Histogram
- Evaluate Reverse Polish Notation`
    },
    {
      id: 'queue-basics',
      title: 'Queue Data Structure',
      difficulty: 'Beginner',
      readTime: '10 min',
      category: 'Stack & Queue',
      tags: ['queue', 'fifo', 'data-structures'],
      author: 'CP-AI Team',
      date: '2026-02-08',
      summary: 'Understanding queues and their real-world applications.',
      thumbnail: '🎫',
      content: `# Queue Data Structure

## What is a Queue?
A linear data structure that follows FIFO (First In First Out) principle.

## Operations
- **Enqueue**: Add element to rear - O(1)
- **Dequeue**: Remove element from front - O(1)
- **Front**: View front element - O(1)
- **isEmpty**: Check if empty - O(1)

## Implementation

### Using Array
\`\`\`javascript
class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element) {
    this.items.push(element);
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
  
  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}
\`\`\`

### Circular Queue
\`\`\`javascript
class CircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.size = k;
    this.front = -1;
    this.rear = -1;
  }
  
  enqueue(value) {
    if (this.isFull()) return false;
    
    if (this.isEmpty()) {
      this.front = 0;
    }
    
    this.rear = (this.rear + 1) % this.size;
    this.queue[this.rear] = value;
    return true;
  }
  
  dequeue() {
    if (this.isEmpty()) return false;
    
    if (this.front === this.rear) {
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.size;
    }
    return true;
  }
  
  isEmpty() {
    return this.front === -1;
  }
  
  isFull() {
    return (this.rear + 1) % this.size === this.front;
  }
}
\`\`\`

## Types of Queues
1. **Simple Queue**: Basic FIFO
2. **Circular Queue**: Last connects to first
3. **Priority Queue**: Elements have priority
4. **Deque**: Insert/delete from both ends

## Applications
1. **CPU Scheduling**: Process management
2. **Printer Queue**: Print jobs
3. **BFS**: Graph traversal
4. **Request Handling**: Web servers
5. **Buffering**: IO operations

## Classic Problems
- Implement Queue using Stacks
- Sliding Window Maximum
- Design Circular Queue
- Number of Recent Calls
- Task Scheduler`
    }
  ]
};

// Helper function to get all articles
export function getAllArticles() {
  return Object.values(dsaArticles).flat();
}

// Helper function to get articles by category
export function getArticlesByCategory(category) {
  return dsaArticles[category] || [];
}

// Helper function to get article by ID
export function getArticleById(id) {
  const allArticles = getAllArticles();
  return allArticles.find(article => article.id === id);
}

// Helper function to search articles
export function searchArticles(query) {
  const allArticles = getAllArticles();
  const lowerQuery = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.summary.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Helper function to get articles by difficulty
export function getArticlesByDifficulty(difficulty) {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.difficulty === difficulty);
}

// Helper function to get articles by tag
export function getArticlesByTag(tag) {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.tags.includes(tag));
}

export default dsaArticles;
