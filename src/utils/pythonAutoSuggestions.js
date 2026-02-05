/**
 * Python Auto-Suggestions System
 * Provides intelligent code completions for Python files
 */

export class PythonAutoSuggestions {
  constructor() {
    this.pythonKeywords = [
      'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else',
      'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
      'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
    ];

    this.builtinFunctions = [
      'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable',
      'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod',
      'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr',
      'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
      'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min',
      'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range',
      'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
      'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ];

    this.commonModules = {
      'os': ['path', 'getcwd', 'listdir', 'mkdir', 'rmdir', 'remove', 'rename', 'environ'],
      'sys': ['argv', 'exit', 'path', 'version', 'platform', 'stdout', 'stderr', 'stdin'],
      'json': ['loads', 'dumps', 'load', 'dump'],
      'datetime': ['datetime', 'date', 'time', 'timedelta', 'now', 'today'],
      'math': ['pi', 'e', 'sqrt', 'sin', 'cos', 'tan', 'log', 'exp', 'floor', 'ceil'],
      'random': ['random', 'randint', 'choice', 'shuffle', 'sample', 'uniform'],
      'collections': ['defaultdict', 'Counter', 'deque', 'namedtuple', 'OrderedDict'],
      'itertools': ['combinations', 'permutations', 'product', 'chain', 'cycle', 'repeat'],
      'functools': ['reduce', 'partial', 'wraps', 'lru_cache'],
      'typing': ['List', 'Dict', 'Set', 'Tuple', 'Optional', 'Union', 'Any', 'Callable']
    };

    this.dataStructureMethods = {
      'list': ['append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse', 'copy'],
      'dict': ['keys', 'values', 'items', 'get', 'pop', 'popitem', 'clear', 'update', 'copy', 'setdefault'],
      'str': ['upper', 'lower', 'strip', 'lstrip', 'rstrip', 'split', 'join', 'replace', 'find', 'startswith', 'endswith', 'isdigit', 'isalpha', 'format'],
      'set': ['add', 'remove', 'discard', 'pop', 'clear', 'union', 'intersection', 'difference', 'symmetric_difference']
    };

    this.leetcodePatterns = {
      'two_pointers': {
        template: `# Two Pointers Approach
left, right = 0, len(arr) - 1
while left < right:
    # Process elements
    if condition:
        left += 1
    else:
        right -= 1`,
        description: 'Two pointers technique'
      },
      'sliding_window': {
        template: `# Sliding Window Approach
left = 0
for right in range(len(arr)):
    # Expand window
    window_sum += arr[right]
    
    # Shrink window if needed
    while window_condition:
        window_sum -= arr[left]
        left += 1`,
        description: 'Sliding window technique'
      },
      'binary_search': {
        template: `# Binary Search
left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
return -1`,
        description: 'Binary search algorithm'
      },
      'dfs': {
        template: `# Depth-First Search
def dfs(node, visited):
    if node in visited:
        return
    
    visited.add(node)
    # Process node
    
    for neighbor in graph[node]:
        dfs(neighbor, visited)`,
        description: 'Depth-first search'
      },
      'bfs': {
        template: `# Breadth-First Search
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = set([start])
    
    while queue:
        node = queue.popleft()
        # Process node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
        description: 'Breadth-first search'
      },
      'dp': {
        template: `# Dynamic Programming
dp = [0] * (n + 1)
dp[0] = base_case

for i in range(1, n + 1):
    dp[i] = # recurrence relation
    
return dp[n]`,
        description: 'Dynamic programming pattern'
      }
    };
  }

  /**
   * Get suggestions based on current context
   */
  getSuggestions(code, cursorPosition, maxSuggestions = 10) {
    const beforeCursor = code.substring(0, cursorPosition);
    const afterCursor = code.substring(cursorPosition);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    const previousLines = lines.slice(Math.max(0, lines.length - 5), lines.length - 1);
    
    const suggestions = [];

    // Function definitions
    if (currentLine.includes('def ')) {
      suggestions.push(...this.getFunctionSuggestions(currentLine));
    }

    // Class definitions
    if (currentLine.includes('class ')) {
      suggestions.push(...this.getClassSuggestions(currentLine));
    }

    // Import statements
    if (currentLine.includes('import ') || currentLine.includes('from ')) {
      suggestions.push(...this.getImportSuggestions(currentLine));
    }

    // Control flow
    if (this.isControlFlowContext(currentLine)) {
      suggestions.push(...this.getControlFlowSuggestions(currentLine));
    }

    // Method calls
    if (currentLine.includes('.')) {
      suggestions.push(...this.getMethodSuggestions(currentLine));
    }

    // Variable assignments
    if (currentLine.includes('=') && !currentLine.includes('==')) {
      suggestions.push(...this.getAssignmentSuggestions(currentLine));
    }

    // LeetCode patterns
    if (this.isLeetCodeContext(code)) {
      suggestions.push(...this.getLeetCodeSuggestions(currentLine));
    }

    // Built-in functions
    if (this.shouldSuggestBuiltins(currentLine)) {
      suggestions.push(...this.getBuiltinSuggestions(currentLine));
    }

    // Keywords
    if (this.shouldSuggestKeywords(currentLine)) {
      suggestions.push(...this.getKeywordSuggestions(currentLine));
    }

    // Common patterns
    suggestions.push(...this.getCommonPatterns(currentLine, previousLines));

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  }

  getFunctionSuggestions(currentLine) {
    const suggestions = [];
    
    if (currentLine.includes('def ') && !currentLine.includes(':')) {
      suggestions.push(
        { text: '():\n    pass', description: 'Basic function', type: 'snippet', confidence: 0.9 },
        { text: '(self):\n    pass', description: 'Method definition', type: 'snippet', confidence: 0.8 },
        { text: '(self, *args, **kwargs):\n    pass', description: 'Method with args', type: 'snippet', confidence: 0.7 },
        { text: '() -> None:\n    pass', description: 'Function with type hint', type: 'snippet', confidence: 0.8 }
      );
    }

    // Common function names
    if (currentLine.trim() === 'def ') {
      suggestions.push(
        { text: '__init__(self):\n    pass', description: 'Constructor method', type: 'snippet', confidence: 0.9 },
        { text: '__str__(self):\n    return ""', description: 'String representation', type: 'snippet', confidence: 0.8 },
        { text: '__repr__(self):\n    return ""', description: 'Object representation', type: 'snippet', confidence: 0.7 },
        { text: 'main():\n    pass', description: 'Main function', type: 'snippet', confidence: 0.8 }
      );
    }

    return suggestions;
  }

  getClassSuggestions(currentLine) {
    const suggestions = [];
    
    if (currentLine.includes('class ') && !currentLine.includes(':')) {
      suggestions.push(
        { text: ':\n    def __init__(self):\n        pass', description: 'Basic class', type: 'snippet', confidence: 0.9 },
        { text: '(object):\n    def __init__(self):\n        pass', description: 'Class inheriting from object', type: 'snippet', confidence: 0.8 },
        { text: '(Exception):\n    pass', description: 'Custom exception class', type: 'snippet', confidence: 0.7 }
      );
    }

    return suggestions;
  }

  getImportSuggestions(currentLine) {
    const suggestions = [];
    
    if (currentLine.includes('import ')) {
      Object.keys(this.commonModules).forEach(module => {
        if (!currentLine.includes(module)) {
          suggestions.push({
            text: module,
            description: `Import ${module} module`,
            type: 'module',
            confidence: 0.8
          });
        }
      });
    }

    if (currentLine.includes('from ')) {
      const fromMatch = currentLine.match(/from\s+(\w+)/);
      if (fromMatch) {
        const moduleName = fromMatch[1];
        if (this.commonModules[moduleName]) {
          this.commonModules[moduleName].forEach(item => {
            suggestions.push({
              text: item,
              description: `Import ${item} from ${moduleName}`,
              type: 'import',
              confidence: 0.8
            });
          });
        }
      }

      // Common from imports
      suggestions.push(
        { text: 'typing import List, Dict, Optional', description: 'Type hints', type: 'import', confidence: 0.9 },
        { text: 'collections import defaultdict, Counter', description: 'Collections module', type: 'import', confidence: 0.8 },
        { text: 'itertools import combinations, permutations', description: 'Itertools module', type: 'import', confidence: 0.7 }
      );
    }

    return suggestions;
  }

  getControlFlowSuggestions(currentLine) {
    const suggestions = [];
    
    if (currentLine.includes('if ') && !currentLine.includes(':')) {
      suggestions.push(
        { text: ':\n    pass', description: 'If statement body', type: 'snippet', confidence: 0.9 },
        { text: '__name__ == "__main__":\n    pass', description: 'Main guard', type: 'snippet', confidence: 0.8 }
      );
    }

    if (currentLine.includes('for ') && !currentLine.includes(':')) {
      suggestions.push(
        { text: 'i in range(len(arr)):\n    pass', description: 'For loop with range', type: 'snippet', confidence: 0.9 },
        { text: 'item in items:\n    pass', description: 'For loop over items', type: 'snippet', confidence: 0.8 },
        { text: 'i, item in enumerate(items):\n    pass', description: 'For loop with enumerate', type: 'snippet', confidence: 0.8 },
        { text: 'key, value in dict.items():\n    pass', description: 'For loop over dictionary', type: 'snippet', confidence: 0.7 }
      );
    }

    if (currentLine.includes('while ') && !currentLine.includes(':')) {
      suggestions.push(
        { text: 'True:\n    pass', description: 'Infinite loop', type: 'snippet', confidence: 0.8 },
        { text: 'condition:\n    pass', description: 'While loop', type: 'snippet', confidence: 0.9 }
      );
    }

    if (currentLine.includes('try') && !currentLine.includes(':')) {
      suggestions.push(
        { text: ':\n    pass\nexcept Exception as e:\n    pass', description: 'Try-except block', type: 'snippet', confidence: 0.9 },
        { text: ':\n    pass\nexcept:\n    pass\nfinally:\n    pass', description: 'Try-except-finally', type: 'snippet', confidence: 0.8 }
      );
    }

    return suggestions;
  }

  getMethodSuggestions(currentLine) {
    const suggestions = [];
    const dotIndex = currentLine.lastIndexOf('.');
    
    if (dotIndex !== -1) {
      const beforeDot = currentLine.substring(0, dotIndex).trim();
      
      // Detect data structure type and suggest appropriate methods
      if (this.isListLike(beforeDot)) {
        this.dataStructureMethods.list.forEach(method => {
          suggestions.push({
            text: `${method}()`,
            description: `List method: ${method}`,
            type: 'method',
            confidence: 0.8
          });
        });
      }

      if (this.isDictLike(beforeDot)) {
        this.dataStructureMethods.dict.forEach(method => {
          suggestions.push({
            text: `${method}()`,
            description: `Dict method: ${method}`,
            type: 'method',
            confidence: 0.8
          });
        });
      }

      if (this.isStringLike(beforeDot)) {
        this.dataStructureMethods.str.forEach(method => {
          suggestions.push({
            text: `${method}()`,
            description: `String method: ${method}`,
            type: 'method',
            confidence: 0.8
          });
        });
      }

      if (this.isSetLike(beforeDot)) {
        this.dataStructureMethods.set.forEach(method => {
          suggestions.push({
            text: `${method}()`,
            description: `Set method: ${method}`,
            type: 'method',
            confidence: 0.8
          });
        });
      }
    }

    return suggestions;
  }

  getAssignmentSuggestions(currentLine) {
    const suggestions = [];
    
    if (currentLine.includes('= ') && currentLine.endsWith('= ')) {
      suggestions.push(
        { text: '[]', description: 'Empty list', type: 'literal', confidence: 0.8 },
        { text: '{}', description: 'Empty dictionary', type: 'literal', confidence: 0.8 },
        { text: 'set()', description: 'Empty set', type: 'literal', confidence: 0.7 },
        { text: '()', description: 'Empty tuple', type: 'literal', confidence: 0.6 },
        { text: 'None', description: 'None value', type: 'literal', confidence: 0.7 },
        { text: 'True', description: 'Boolean True', type: 'literal', confidence: 0.6 },
        { text: 'False', description: 'Boolean False', type: 'literal', confidence: 0.6 },
        { text: '""', description: 'Empty string', type: 'literal', confidence: 0.7 },
        { text: '0', description: 'Zero', type: 'literal', confidence: 0.6 }
      );
    }

    return suggestions;
  }

  getLeetCodeSuggestions(currentLine) {
    const suggestions = [];
    
    // Suggest algorithm patterns
    Object.entries(this.leetcodePatterns).forEach(([key, pattern]) => {
      if (currentLine.includes('#') || currentLine.trim() === '') {
        suggestions.push({
          text: pattern.template,
          description: pattern.description,
          type: 'algorithm',
          confidence: 0.7
        });
      }
    });

    // Common LeetCode function signatures
    if (currentLine.includes('def ') && (currentLine.includes('Solution') || currentLine.includes('solve'))) {
      suggestions.push(
        { text: 'twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass', description: 'Two Sum function', type: 'leetcode', confidence: 0.9 },
        { text: 'reverseString(self, s: List[str]) -> None:\n    pass', description: 'Reverse String function', type: 'leetcode', confidence: 0.8 },
        { text: 'isPalindrome(self, s: str) -> bool:\n    pass', description: 'Palindrome check', type: 'leetcode', confidence: 0.8 },
        { text: 'maxSubArray(self, nums: List[int]) -> int:\n    pass', description: 'Maximum subarray', type: 'leetcode', confidence: 0.7 },
        { text: 'mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:\n    pass', description: 'Merge two sorted lists', type: 'leetcode', confidence: 0.7 }
      );
    }

    return suggestions;
  }

  getBuiltinSuggestions(currentLine) {
    const suggestions = [];
    
    this.builtinFunctions.forEach(func => {
      if (func.startsWith(currentLine.trim()) || currentLine.trim() === '') {
        suggestions.push({
          text: `${func}()`,
          description: `Built-in function: ${func}`,
          type: 'builtin',
          confidence: 0.7
        });
      }
    });

    return suggestions;
  }

  getKeywordSuggestions(currentLine) {
    const suggestions = [];
    
    this.pythonKeywords.forEach(keyword => {
      if (keyword.startsWith(currentLine.trim()) && currentLine.trim().length > 0) {
        suggestions.push({
          text: keyword,
          description: `Python keyword: ${keyword}`,
          type: 'keyword',
          confidence: 0.6
        });
      }
    });

    return suggestions;
  }

  getCommonPatterns(currentLine, previousLines) {
    const suggestions = [];
    
    // Main guard pattern
    if (currentLine.trim() === '' && !previousLines.some(line => line.includes('if __name__'))) {
      suggestions.push({
        text: 'if __name__ == "__main__":\n    main()',
        description: 'Main guard pattern',
        type: 'pattern',
        confidence: 0.8
      });
    }

    // Docstring patterns
    if (previousLines.some(line => line.includes('def ')) && currentLine.trim() === '') {
      suggestions.push({
        text: '"""Docstring here."""',
        description: 'Function docstring',
        type: 'docstring',
        confidence: 0.7
      });
    }

    // Exception handling
    if (currentLine.includes('raise')) {
      suggestions.push(
        { text: 'ValueError("Invalid value")', description: 'Raise ValueError', type: 'exception', confidence: 0.8 },
        { text: 'TypeError("Invalid type")', description: 'Raise TypeError', type: 'exception', confidence: 0.7 },
        { text: 'NotImplementedError("Not implemented")', description: 'Raise NotImplementedError', type: 'exception', confidence: 0.6 }
      );
    }

    return suggestions;
  }

  // Helper methods
  isControlFlowContext(line) {
    return line.includes('if ') || line.includes('for ') || line.includes('while ') || line.includes('try');
  }

  isLeetCodeContext(code) {
    return code.includes('class Solution') || code.includes('def solve') || code.includes('# LeetCode');
  }

  shouldSuggestBuiltins(line) {
    return line.trim() === '' || line.endsWith(' ') || line.endsWith('(');
  }

  shouldSuggestKeywords(line) {
    return line.trim().length > 0 && line.trim().length < 10;
  }

  isListLike(variable) {
    return variable.includes('[') || variable.includes('list') || variable.includes('arr') || variable.includes('nums');
  }

  isDictLike(variable) {
    return variable.includes('{') || variable.includes('dict') || variable.includes('map');
  }

  isStringLike(variable) {
    return variable.includes('"') || variable.includes("'") || variable.includes('str') || variable.includes('text');
  }

  isSetLike(variable) {
    return variable.includes('set') || variable.includes('Set');
  }
}

// Export singleton instance
export const pythonSuggestions = new PythonAutoSuggestions();
export default pythonSuggestions;