// Language-specific starter code templates
export const generateStarterCode = (functionName, parameters, returnType = 'auto') => {
  const templates = {
    javascript: {
      function: (name, params) => `function ${name}(${params.join(', ')}) {
  // Write your code here
  
}`,
      class: (className, methods) => `class ${className} {
  constructor() {
    // Initialize your data structure
    
  }
  
${methods.map(method => `  ${method.name}(${method.params.join(', ')}) {
    // Write your code here
    
  }`).join('\n\n')}
}`
    },
    
    python: {
      function: (name, params) => `def ${name}(${params.join(', ')}):
    # Write your code here
    pass`,
      class: (className, methods) => `class ${className}:
    def __init__(self):
        # Initialize your data structure
        pass
    
${methods.map(method => `    def ${method.name}(self${method.params.length > 0 ? ', ' + method.params.join(', ') : ''}):
        # Write your code here
        pass`).join('\n\n')}`
    },
    
    java: {
      function: (name, params, returnType) => `class Solution {
    public ${returnType} ${name}(${params.map(p => `${getJavaType(p)} ${p}`).join(', ')}) {
        // Write your code here
        
    }
}`,
      class: (className, methods) => `class ${className} {
    public ${className}() {
        // Initialize your data structure
        
    }
    
${methods.map(method => `    public ${getJavaType(method.returnType)} ${method.name}(${method.params.map(p => `${getJavaType(p)} ${p}`).join(', ')}) {
        // Write your code here
        
    }`).join('\n\n')}
}`
    },
    
    cpp: {
      function: (name, params, returnType) => `class Solution {
public:
    ${getCppType(returnType)} ${name}(${params.map(p => `${getCppType(p)}& ${p}`).join(', ')}) {
        // Write your code here
        
    }
};`,
      class: (className, methods) => `class ${className} {
public:
    ${className}() {
        // Initialize your data structure
        
    }
    
${methods.map(method => `    ${getCppType(method.returnType)} ${method.name}(${method.params.map(p => `${getCppType(p)} ${p}`).join(', ')}) {
        // Write your code here
        
    }`).join('\n\n')}
};`
    },
    
    typescript: {
      function: (name, params, returnType) => `function ${name}(${params.map(p => `${p}: ${getTsType(p)}`).join(', ')}): ${getTsType(returnType)} {
    // Write your code here
    
}`,
      class: (className, methods) => `class ${className} {
    constructor() {
        // Initialize your data structure
        
    }
    
${methods.map(method => `    ${method.name}(${method.params.map(p => `${p}: ${getTsType(p)}`).join(', ')}): ${getTsType(method.returnType)} {
        // Write your code here
        
    }`).join('\n\n')}
}`
    }
  };
  
  return templates;
};

// Helper functions for type mapping
const getJavaType = (param) => {
  if (typeof param === 'string') {
    if (param.includes('[]')) return param.replace('[]', '[]');
    if (param === 'number') return 'int';
    if (param === 'boolean') return 'boolean';
    if (param === 'string') return 'String';
    if (param === 'array') return 'int[]';
    if (param === 'matrix') return 'int[][]';
    return 'int';
  }
  return 'int';
};

const getCppType = (param) => {
  if (typeof param === 'string') {
    if (param === 'number') return 'int';
    if (param === 'boolean') return 'bool';
    if (param === 'string') return 'string';
    if (param === 'array') return 'vector<int>';
    if (param === 'matrix') return 'vector<vector<int>>';
    return 'int';
  }
  return 'int';
};

const getTsType = (param) => {
  if (typeof param === 'string') {
    if (param === 'number') return 'number';
    if (param === 'boolean') return 'boolean';
    if (param === 'string') return 'string';
    if (param === 'array') return 'number[]';
    if (param === 'matrix') return 'number[][]';
    return 'number';
  }
  return 'number';
};

// Common problem patterns and their starter code
export const problemPatterns = {
  twoSum: {
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
  },
  
  arrayFunction: {
    javascript: (funcName) => `function ${funcName}(nums) {
  // Write your code here
  
}`,
    python: (funcName) => `def ${funcName.replace(/([A-Z])/g, '_$1').toLowerCase()}(nums):
    # Write your code here
    pass`,
    java: (funcName, returnType = 'int') => `class Solution {
    public ${returnType} ${funcName}(int[] nums) {
        // Write your code here
        
    }
}`,
    cpp: (funcName, returnType = 'int') => `class Solution {
public:
    ${returnType} ${funcName}(vector<int>& nums) {
        // Write your code here
        
    }
};`,
    typescript: (funcName, returnType = 'number') => `function ${funcName}(nums: number[]): ${returnType} {
    // Write your code here
    
}`
  },
  
  stringFunction: {
    javascript: (funcName) => `function ${funcName}(s) {
  // Write your code here
  
}`,
    python: (funcName) => `def ${funcName.replace(/([A-Z])/g, '_$1').toLowerCase()}(s):
    # Write your code here
    pass`,
    java: (funcName, returnType = 'String') => `class Solution {
    public ${returnType} ${funcName}(String s) {
        // Write your code here
        
    }
}`,
    cpp: (funcName, returnType = 'string') => `class Solution {
public:
    ${returnType} ${funcName}(string s) {
        // Write your code here
        
    }
};`,
    typescript: (funcName, returnType = 'string') => `function ${funcName}(s: string): ${returnType} {
    // Write your code here
    
}`
  },
  
  treeFunction: {
    javascript: (funcName) => `function ${funcName}(root) {
  // Write your code here
  
}`,
    python: (funcName) => `def ${funcName.replace(/([A-Z])/g, '_$1').toLowerCase()}(root):
    # Write your code here
    pass`,
    java: (funcName, returnType = 'int') => `class Solution {
    public ${returnType} ${funcName}(TreeNode root) {
        // Write your code here
        
    }
}`,
    cpp: (funcName, returnType = 'int') => `class Solution {
public:
    ${returnType} ${funcName}(TreeNode* root) {
        // Write your code here
        
    }
};`,
    typescript: (funcName, returnType = 'number') => `function ${funcName}(root: TreeNode | null): ${returnType} {
    // Write your code here
    
}`
  },
  
  linkedListFunction: {
    javascript: (funcName) => `function ${funcName}(head) {
  // Write your code here
  
}`,
    python: (funcName) => `def ${funcName.replace(/([A-Z])/g, '_$1').toLowerCase()}(head):
    # Write your code here
    pass`,
    java: (funcName, returnType = 'ListNode') => `class Solution {
    public ${returnType} ${funcName}(ListNode head) {
        // Write your code here
        
    }
}`,
    cpp: (funcName, returnType = 'ListNode*') => `class Solution {
public:
    ${returnType} ${funcName}(ListNode* head) {
        // Write your code here
        
    }
};`,
    typescript: (funcName, returnType = 'ListNode | null') => `function ${funcName}(head: ListNode | null): ${returnType} {
    // Write your code here
    
}`
  }
};