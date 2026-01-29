// Complete DSA Multi-Language Update Script
const fs = require('fs');

// Read the current file
const filePath = './src/data/dsaProblems.js';
let content = fs.readFileSync(filePath, 'utf8');

// Function to generate multi-language starter code
function generateStarterCode(title, category, id) {
  const funcName = title.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const pythonName = funcName.replace(/([A-Z])/g, '_$1').toLowerCase();

  // Special cases for class-based problems
  const classBasedProblems = [
    'Min Stack', 'LRU Cache', 'Implement Trie', 'Design Add and Search Words',
    'MedianFinder', 'KthLargest', 'MinStack', 'Trie', 'WordDictionary'
  ];

  if (classBasedProblems.some(pattern => title.includes(pattern))) {
    const className = title.includes('Min Stack') ? 'MinStack' :
                     title.includes('LRU') ? 'LRUCache' :
                     title.includes('Trie') ? 'Trie' :
                     title.includes('Design Add') ? 'WordDictionary' :
                     title.includes('Median') ? 'MedianFinder' :
                     title.includes('Kth Largest') ? 'KthLargest' :
                     'DataStructure';

    return {
      javascript: `class ${className} {\n  constructor() {\n    // Initialize your data structure\n    \n  }\n}`,
      python: `class ${className}:\n    def __init__(self):\n        # Initialize your data structure\n        pass`,
      java: `class ${className} {\n    public ${className}() {\n        // Initialize your data structure\n        \n    }\n}`,
      cpp: `class ${className} {\npublic:\n    ${className}() {\n        // Initialize your data structure\n        \n    }\n};`,
      typescript: `class ${className} {\n    constructor() {\n        // Initialize your data structure\n        \n    }\n}`
    };
  }

  // Category-specific templates
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

  // Default array-based function
  return {
    javascript: `function ${funcName}(nums) {\n  // Write your code here\n  \n}`,
    python: `def ${pythonName}(nums):\n    # Write your code here\n    pass`,
    java: `class Solution {\n    public int ${funcName}(int[] nums) {\n        // Write your code here\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    int ${funcName}(vector<int>& nums) {\n        // Write your code here\n        \n    }\n};`,
    typescript: `function ${funcName}(nums: number[]): number {\n    // Write your code here\n    \n}`
  };
}

// Pattern to match problems with old starter code format
const oldFormatRegex = /(\{\s*id:\s*(\d+),\s*title:\s*"([^"]*)",\s*difficulty:\s*"([^"]*)",\s*category:\s*"([^"]*)",[\s\S]*?)starterCode:\s*`([^`]*)`([\s\S]*?\})/g;

let match;
let updatedContent = content;
let updateCount = 0;

// Process each problem
while ((match = oldFormatRegex.exec(content)) !== null) {
  const [fullMatch, prefix, id, title, difficulty, category, oldCode, suffix] = match;
  
  // Skip if already has multi-language support
  if (fullMatch.includes('starterCode: {')) {
    continue;
  }

  const multiLangCode = generateStarterCode(title, category, parseInt(id));
  
  const newStarterCode = `starterCode: {
      javascript: \`${multiLangCode.javascript}\`,
      python: \`${multiLangCode.python}\`,
      java: \`${multiLangCode.java}\`,
      cpp: \`${multiLangCode.cpp}\`,
      typescript: \`${multiLangCode.typescript}\`
    }`;

  const newProblem = prefix + newStarterCode + suffix;
  updatedContent = updatedContent.replace(fullMatch, newProblem);
  updateCount++;
  
  console.log(`✅ Updated Problem ${id}: ${title} (${category})`);
}

// Write the updated content
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log(`\n🎉 Successfully updated ${updateCount} problems with multi-language support!`);
console.log('📝 All problems now support JavaScript, Python, Java, C++, and TypeScript');
console.log('🚀 Multi-language DSA editor is ready to use!');