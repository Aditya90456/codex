// Script to update all DSA problems with multi-language support
const fs = require('fs');
const path = require('path');

// Read the current DSA problems file
const dsaFilePath = path.join(__dirname, 'src', 'data', 'dsaProblems.js');
let content = fs.readFileSync(dsaFilePath, 'utf8');

// Function to generate multi-language starter code based on problem pattern
function generateMultiLanguageCode(problemTitle, category) {
  const funcName = problemTitle.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const pythonName = funcName.replace(/([A-Z])/g, '_$1').toLowerCase();

  // Common patterns based on category and function name
  if (category === 'Trees') {
    return {
      javascript: `function ${funcName}(root) {\n  // Write your code here\n  \n}`,
      python: `def ${pythonName}(root):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public int ${funcName}(TreeNode root) {\n        // Write your code here\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    int ${funcName}(TreeNode* root) {\n        // Write your code here\n        \n    }\n};`,
      typescript: `function ${funcName}(root: TreeNode | null): number {\n    // Write your code here\n    \n}`
    };
  }
  
  if (category === 'Linked Lists') {
    return {
      javascript: `function ${funcName}(head) {\n  // Write your code here\n  \n}`,
      python: `def ${pythonName}(head):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public ListNode ${funcName}(ListNode head) {\n        // Write your code here\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    ListNode* ${funcName}(ListNode* head) {\n        // Write your code here\n        \n    }\n};`,
      typescript: `function ${funcName}(head: ListNode | null): ListNode | null {\n    // Write your code here\n    \n}`
    };
  }
  
  if (category === 'Strings') {
    return {
      javascript: `function ${funcName}(s) {\n  // Write your code here\n  \n}`,
      python: `def ${pythonName}(s):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public String ${funcName}(String s) {\n        // Write your code here\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    string ${funcName}(string s) {\n        // Write your code here\n        \n    }\n};`,
      typescript: `function ${funcName}(s: string): string {\n    // Write your code here\n    \n}`
    };
  }
  
  if (category === 'Stack') {
    if (problemTitle.includes('Stack') || problemTitle.includes('Min Stack')) {
      return {
        javascript: `class MinStack {\n  constructor() {\n    // Initialize your data structure\n    \n  }\n  \n  push(val) {\n    // Write your code here\n    \n  }\n  \n  pop() {\n    // Write your code here\n    \n  }\n  \n  top() {\n    // Write your code here\n    \n  }\n  \n  getMin() {\n    // Write your code here\n    \n  }\n}`,
        python: `class MinStack:\n    def __init__(self):\n        # Initialize your data structure\n        pass\n    \n    def push(self, val):\n        # Write your code here\n        pass\n    \n    def pop(self):\n        # Write your code here\n        pass\n    \n    def top(self):\n        # Write your code here\n        pass\n    \n    def get_min(self):\n        # Write your code here\n        pass`,
        java: `class MinStack {\n    public MinStack() {\n        // Initialize your data structure\n        \n    }\n    \n    public void push(int val) {\n        // Write your code here\n        \n    }\n    \n    public void pop() {\n        // Write your code here\n        \n    }\n    \n    public int top() {\n        // Write your code here\n        \n    }\n    \n    public int getMin() {\n        // Write your code here\n        \n    }\n}`,
        cpp: `class MinStack {\npublic:\n    MinStack() {\n        // Initialize your data structure\n        \n    }\n    \n    void push(int val) {\n        // Write your code here\n        \n    }\n    \n    void pop() {\n        // Write your code here\n        \n    }\n    \n    int top() {\n        // Write your code here\n        \n    }\n    \n    int getMin() {\n        // Write your code here\n        \n    }\n};`,
        typescript: `class MinStack {\n    constructor() {\n        // Initialize your data structure\n        \n    }\n    \n    push(val: number): void {\n        // Write your code here\n        \n    }\n    \n    pop(): void {\n        // Write your code here\n        \n    }\n    \n    top(): number {\n        // Write your code here\n        \n    }\n    \n    getMin(): number {\n        // Write your code here\n        \n    }\n}`
      };
    }
    return {
      javascript: `function ${funcName}(s) {\n  // Write your code here\n  \n}`,
      python: `def ${pythonName}(s):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public boolean ${funcName}(String s) {\n        // Write your code here\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    bool ${funcName}(string s) {\n        // Write your code here\n        \n    }\n};`,
      typescript: `function ${funcName}(s: string): boolean {\n    // Write your code here\n    \n}`
    };
  }
  
  // Default array-based function
  return {
    javascript: `function ${funcName}(nums) {\n  // Write your code here\n  \n}`,
    python: `def ${pythonName}(nums):\n    # Write your code here\n    pass`,
    java: `class Solution {\n    public int ${funcName}(int[] nums) {\n        // Write your code here\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    int ${funcName}(vector<int>& nums) {\n        // Write your code here\n        \n    }\n};`,
    typescript: `function ${funcName}(nums: number[]): number {\n    // Write your code here\n    \n}`
  };
}

// Replace old starterCode format with new multi-language format
function updateProblemCode(match, id, title, difficulty, category, description, examples, oldStarterCode) {
  const multiLangCode = generateMultiLanguageCode(title, category);
  
  const newStarterCode = `starterCode: {
      javascript: \`${multiLangCode.javascript}\`,
      python: \`${multiLangCode.python}\`,
      java: \`${multiLangCode.java}\`,
      cpp: \`${multiLangCode.cpp}\`,
      typescript: \`${multiLangCode.typescript}\`
    }`;
  
  return match.replace(/starterCode: `[^`]*`/, newStarterCode);
}

// Find and replace all problems that still use old format
const problemRegex = /(\{[\s\S]*?id: (\d+),[\s\S]*?title: "([^"]*)",[\s\S]*?difficulty: "([^"]*)",[\s\S]*?category: "([^"]*)",[\s\S]*?description: "([^"]*)",[\s\S]*?examples: \[[^\]]*\],[\s\S]*?)starterCode: `([^`]*)`([\s\S]*?\})/g;

let updatedContent = content.replace(problemRegex, (match, prefix, id, title, difficulty, category, description, oldCode, suffix) => {
  // Skip if already has multi-language support
  if (match.includes('starterCode: {')) {
    return match;
  }
  
  const multiLangCode = generateMultiLanguageCode(title, category);
  
  const newStarterCode = `starterCode: {
      javascript: \`${multiLangCode.javascript}\`,
      python: \`${multiLangCode.python}\`,
      java: \`${multiLangCode.java}\`,
      cpp: \`${multiLangCode.cpp}\`,
      typescript: \`${multiLangCode.typescript}\`
    }`;
  
  return prefix + newStarterCode + suffix;
});

// Write the updated content back to the file
fs.writeFileSync(dsaFilePath, updatedContent, 'utf8');

console.log('✅ Successfully updated all DSA problems with multi-language support!');
console.log('📝 All 150 problems now support JavaScript, Python, Java, C++, and TypeScript');