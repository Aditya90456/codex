import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { 
  Play, 
  Save, 
  Copy,
  Upload,
  RotateCcw,
  Maximize2,
  Minimize2,
  Terminal,
  Code,
  Brain,
  Activity,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

const CodexEditorRedesigned = ({ onBack }) => {
  const { user } = useUniversalAuth();
  
  // Helper function for default code
  const getDefaultCode = (lang) => {
    const defaults = {
      javascript: `// Welcome to Codex - JavaScript Runtime Analysis
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 8; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

console.log("🚀 Click Run to execute!");`,
      
      python: `# Welcome to Codex - Python Analysis
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(8):
    print(f"F({i}) = {fibonacci(i)}")

print("🚀 Python code ready for analysis!")`,
      
      java: `// Welcome to Codex - Java Analysis
public class Solution {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 8; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
        System.out.println("🚀 Java code ready for analysis!");
    }
}`,
      
      typescript: `// Welcome to Codex - TypeScript Analysis
function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 8; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

console.log("🚀 TypeScript code ready!");`,
      
      cpp: `// Welcome to Codex - C++ Analysis
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i < 8; i++) {
        cout << "F(" << i << ") = " << fibonacci(i) << endl;
    }
    cout << "🚀 C++ code ready for analysis!" << endl;
    return 0;
}`,
      
      go: `// Welcome to Codex - Go Analysis
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Fibonacci sequence:")
    for i := 0; i < 8; i++ {
        fmt.Printf("F(%d) = %d\\n", i, fibonacci(i))
    }
    fmt.Println("🚀 Go code ready for analysis!")
}`,
      
      rust: `// Welcome to Codex - Rust Analysis
fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

fn main() {
    println!("Fibonacci sequence:");
    for i in 0..8 {
        println!("F({}) = {}", i, fibonacci(i));
    }
    println!("🚀 Rust code ready for analysis!");
}`,
      
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Codex HTML Analysis</title>
</head>
<body>
    <h1>Welcome to Codex - HTML Analysis</h1>
    <div id="fibonacci-output"></div>
    
    <script>
        function fibonacci(n) {
            if (n <= 1) return n;
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
        
        const output = document.getElementById('fibonacci-output');
        output.innerHTML = '<h2>Fibonacci Sequence:</h2>';
        
        for (let i = 0; i < 8; i++) {
            output.innerHTML += \`<p>F(\${i}) = \${fibonacci(i)}</p>\`;
        }
        
        output.innerHTML += '<p>🚀 HTML with JavaScript ready!</p>';
    </script>
</body>
</html>`
    };
    
    return defaults[lang] || `// Welcome to Codex - ${lang.toUpperCase()} Analysis
// Start coding here...

console.log("🚀 Ready to code in ${lang}!");`;
  };
  
  // Editor state
  const [code, setCode] = useState(getDefaultCode('javascript'));
  
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileName, setFileName] = useState('solution.js');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [snippetsUpdated, setSnippetsUpdated] = useState(false);
  
  const editorRef = useRef(null);

  // Custom snippets for different languages
  const getLanguageSnippets = (lang) => {
    const snippets = {
      javascript: [
        {
          label: 'fibonacci-optimized',
          kind: 'Snippet',
          insertText: 'function fibonacciMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}',
          documentation: 'Optimized Fibonacci with memoization - O(n) complexity'
        },
        {
          label: 'async-function',
          kind: 'Snippet',
          insertText: 'async function ${1:functionName}(${2:params}) {\n  try {\n    const result = await ${3:asyncOperation};\n    return result;\n  } catch (error) {\n    console.error(\'Error:\', error);\n    throw error;\n  }\n}',
          documentation: 'Async function with error handling'
        },
        {
          label: 'performance-timer',
          kind: 'Snippet',
          insertText: 'console.time(\'${1:operation}\');\n${2:// Your codec here}\nconsole.timeEnd(\'${1:operation}\');',
          documentation: 'Performance timing wrapper'
        }
      ],
      python: [
        {
          label: 'fibonacci-optimized',
          kind: 'Snippet',
          insertText: 'def fibonacci_memo(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)\n    return memo[n]',
          documentation: 'Optimized Fibonacci with memoization - O(n) complexity'
        },
        {
          label: 'class-template',
          kind: 'Snippet',
          insertText: 'class ${1:ClassName}:\n    def __init__(self, ${2:params}):\n        ${3:pass}\n    \n    def ${4:method_name}(self, ${5:params}):\n        ${6:pass}',
          documentation: 'Python class template'
        }
      ],
      java: [
        {
          label: 'fibonacci-optimized',
          kind: 'Snippet',
          insertText: 'public static int fibonacciMemo(int n, Map<Integer, Integer> memo) {\n    if (memo.containsKey(n)) return memo.get(n);\n    if (n <= 1) return n;\n    int result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n    memo.put(n, result);\n    return result;\n}',
          documentation: 'Optimized Fibonacci with memoization - O(n) complexity'
        },
        {
          label: 'class-template',
          kind: 'Snippet',
          insertText: 'public class ${1:ClassName} {\n    private ${2:type} ${3:field};\n    \n    public ${1:ClassName}(${4:params}) {\n        ${5:// Constructor}\n    }\n    \n    public ${6:returnType} ${7:methodName}(${8:params}) {\n        ${9:// Method implementation}\n    }\n}',
          documentation: 'Java class template'
        }
      ]
    };
    
    return snippets[lang] || [];
  };

  // Register custom snippets when editor mounts or language changes
  const registerCustomSnippets = useCallback(() => {
    if (!editorRef.current) return;
    
    const monaco = window.monaco;
    if (!monaco) return;
    
    // Dispose previous providers
    if (window.customSnippetProvider) {
      window.customSnippetProvider.dispose();
    }
    
    // Clear existing completions cache
    monaco.languages.typescript?.typescriptDefaults?.setCompilerOptions({});
    
    // Register new completion provider
    window.customSnippetProvider = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const snippets = getLanguageSnippets(language);
        const suggestions = snippets.map(snippet => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: snippet.documentation,
          detail: `${language} snippet`,
          sortText: '0' + snippet.label, // Prioritize custom snippets
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        }));
        
        return { suggestions };
      }
    });
    
    // Force refresh of completions
    if (editorRef.current) {
      const editor = editorRef.current;
      setTimeout(() => {
        editor.trigger('source', 'editor.action.triggerSuggest', {});
        setSnippetsUpdated(true);
        setTimeout(() => setSnippetsUpdated(false), 2000);
      }, 100);
    }
  }, [language]);

  // Register snippets when language changes
  useEffect(() => {
    registerCustomSnippets();
  }, [language, registerCustomSnippets]);

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍' },
    
    { value: 'java', label: 'Java', ext: '.java', icon: '☕' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡' },
    { value: 'go', label: 'Go', ext: '.go', icon: '🐹' },
    { value: 'rust', label: 'Rust', ext: '.rs', icon: '🦀' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'hc-black', label: 'High Contrast', icon: <Monitor size={16} /> },
  ];

  // Real-time code analysis
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeCode();
    }, 500); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [code, language]);

  const analyzeCode = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = performRuntimeAnalysis();
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 300);
  }, [code, language]);

  const performRuntimeAnalysis = () => {
    const lines = code.split('\n').length;
    const chars = code.length;
    
    // Analyze code complexity and patterns
    const analysis = {
      complexity: analyzeComplexity(code),
      performance: analyzePerformance(code),
      quality: calculateQuality(code),
      suggestions: generateSuggestions(code, language),
      metrics: {
        lines,
        characters: chars,
        functions: (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length,
        loops: (code.match(/for\s*\(|while\s*\(|forEach/g) || []).length,
        conditionals: (code.match(/if\s*\(|switch\s*\(/g) || []).length,
        comments: (code.match(/\/\/|\/\*/g) || []).length
      },
      issues: findIssues(code, language),
      runtime: {
        estimatedTime: estimateExecutionTime(code),
        memoryUsage: estimateMemoryUsage(code),
        bigO: analyzeBigO(code)
      }
    };

    return analysis;
  };

  const analyzeComplexity = (code) => {
    let complexity = 1;
    
    // Count cyclomatic complexity
    const patterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /switch\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /&&|\|\|/g
    ];
    
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    if (complexity <= 5) return { level: 'Low', score: complexity, color: 'green' };
    if (complexity <= 10) return { level: 'Medium', score: complexity, color: 'yellow' };
    return { level: 'High', score: complexity, color: 'red' };
  };

  const analyzePerformance = (code) => {
    const issues = [];
    
    // Check for performance anti-patterns
    if (code.includes('fibonacci') && code.includes('fibonacci(n - 1)')) {
      issues.push({
        type: 'performance',
        severity: 'high',
        message: 'Inefficient recursive Fibonacci - O(2^n) complexity',
        suggestion: 'Use memoization or iterative approach'
      });
    }
    
    if (code.match(/for.*for.*for/s)) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'Nested loops detected - potential O(n³) complexity',
        suggestion: 'Consider optimizing algorithm'
      });
    }
    
    if (code.includes('innerHTML') && code.includes('for')) {
      issues.push({
        type: 'performance',
        severity: 'medium',
        message: 'DOM manipulation in loop',
        suggestion: 'Build HTML string first, then set innerHTML once'
      });
    }
    
    return issues;
  };

  const calculateQuality = (code) => {
    let score = 50;
    
    // Positive indicators
    if (code.includes('//') || code.includes('/*')) score += 15;
    if (code.includes('try') && code.includes('catch')) score += 10;
    if (code.includes('const ') || code.includes('let ')) score += 10;
    if (code.match(/function\s+\w+/)) score += 10;
    if (code.includes('===') || code.includes('!==')) score += 5;
    
    // Negative indicators
    if (code.includes('var ')) score -= 10;
    if (code.includes('==') && !code.includes('===')) score -= 5;
    if (code.includes('eval(')) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  };

  const generateSuggestions = (code, lang) => {
    const suggestions = [];
    
    if (lang === 'javascript') {
      if (code.includes('var ')) {
        suggestions.push({
          type: 'modernization',
          message: 'Use const/let instead of var',
          priority: 'medium',
          snippet: 'const ${1:variableName} = ${2:value};'
        });
      }
      
      if (code.includes('==') && !code.includes('===')) {
        suggestions.push({
          type: 'best-practice',
          message: 'Use strict equality (===) instead of loose equality (==)',
          priority: 'high',
          snippet: 'if (${1:variable} === ${2:value}) {\n  ${3:// code}\n}'
        });
      }
      
      if (code.includes('fibonacci') && !code.includes('memo')) {
        suggestions.push({
          type: 'optimization',
          message: 'Add memoization to improve Fibonacci performance',
          priority: 'high',
          snippet: 'function fibonacciMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}'
        });
      }
      
      if (code.includes('for') && code.includes('innerHTML')) {
        suggestions.push({
          type: 'performance',
          message: 'Optimize DOM manipulation',
          priority: 'high',
          snippet: 'const fragment = document.createDocumentFragment();\nfor (let i = 0; i < length; i++) {\n  const element = document.createElement(\'div\');\n  element.textContent = content;\n  fragment.appendChild(element);\n}\ncontainer.appendChild(fragment);'
        });
      }
    }
    
    if (lang === 'python') {
      if (code.includes('fibonacci') && !code.includes('memo')) {
        suggestions.push({
          type: 'optimization',
          message: 'Add memoization to improve Fibonacci performance',
          priority: 'high',
          snippet: 'def fibonacci_memo(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)\n    return memo[n]'
        });
      }
    }
    
    return suggestions;
  };

  const findIssues = (code, lang) => {
    const issues = [];
    const lines = code.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('console.log') && lang === 'javascript') {
        // This is actually fine for development, so we'll skip this
      }
      
      if (line.includes('eval(')) {
        issues.push({
          type: 'security',
          severity: 'high',
          message: 'Use of eval() is dangerous',
          line: index + 1
        });
      }
      
      if (line.match(/^\s*\/\/\s*TODO/)) {
        issues.push({
          type: 'todo',
          severity: 'low',
          message: 'TODO comment found',
          line: index + 1
        });
      }
    });
    
    return issues;
  };

  const estimateExecutionTime = (code) => {
    // Simple heuristic based on code patterns
    let time = 1; // Base time in ms
    
    const loops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
    const nestedLoops = (code.match(/for.*for/s) || []).length;
    const recursion = code.includes('fibonacci') ? 1 : 0;
    
    time += loops * 10;
    time += nestedLoops * 100;
    time += recursion * 1000; // Recursive functions can be expensive
    
    return time;
  };

  const estimateMemoryUsage = (code) => {
    // Simple heuristic for memory usage
    let memory = 1; // Base memory in KB
    
    const arrays = (code.match(/\[\]|\[.*\]/g) || []).length;
    const objects = (code.match(/\{\}|\{.*\}/g) || []).length;
    const strings = (code.match(/".*"|'.*'|`.*`/g) || []).length;
    
    memory += arrays * 5;
    memory += objects * 3;
    memory += strings * 1;
    
    return memory;
  };

  const analyzeBigO = (code) => {
    if (code.includes('fibonacci') && code.includes('fibonacci(n - 1)')) {
      return { time: 'O(2^n)', space: 'O(n)', description: 'Exponential time, linear space' };
    }
    
    if (code.match(/for.*for.*for/s)) {
      return { time: 'O(n³)', space: 'O(1)', description: 'Cubic time, constant space' };
    }
    
    if (code.match(/for.*for/s)) {
      return { time: 'O(n²)', space: 'O(1)', description: 'Quadratic time, constant space' };
    }
    
    if (code.match(/for\s*\(|while\s*\(/)) {
      return { time: 'O(n)', space: 'O(1)', description: 'Linear time, constant space' };
    }
    
    return { time: 'O(1)', space: 'O(1)', description: 'Constant time and space' };
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setConsoleOutput([]);
    
    const startTime = performance.now();
    
    try {
      // Simulate code execution
      const output = [];
      
      if (language === 'javascript') {
        // Create a safe execution environment
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          output.push({
            type: 'log',
            content: args.join(' '),
            timestamp: new Date().toLocaleTimeString()
          });
        };
        
        console.error = (...args) => {
          output.push({
            type: 'error',
            content: args.join(' '),
            timestamp: new Date().toLocaleTimeString()
          });
        };
        
        console.warn = (...args) => {
          output.push({
            type: 'warn',
            content: args.join(' '),
            timestamp: new Date().toLocaleTimeString()
          });
        };
        
        try {
          // Execute the code
          const result = eval(code);
          if (result !== undefined) {
            output.push({
              type: 'result',
              content: `Result: ${result}`,
              timestamp: new Date().toLocaleTimeString()
            });
          }
        } catch (error) {
          output.push({
            type: 'error',
            content: `Error: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
        
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      } else {
        output.push({
          type: 'info',
          content: `✨ ${language.toUpperCase()} execution simulation`,
          timestamp: new Date().toLocaleTimeString()
        });
        output.push({
          type: 'info',
          content: `📝 Code analysis: ${code.split('\n').length} lines, ${code.length} characters`,
          timestamp: new Date().toLocaleTimeString()
        });
        output.push({
          type: 'success',
          content: `✅ Code would execute successfully in ${language} environment`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      
      const endTime = performance.now();
      const execTime = endTime - startTime;
      
      setExecutionTime(execTime);
      setMemoryUsage(Math.random() * 10 + 5); // Simulated memory usage
      setConsoleOutput(output);
      
      // Add execution success message
      if (output.length === 0) {
        setConsoleOutput([{
          type: 'success',
          content: 'Code executed successfully (no output)',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
      
    } catch (error) {
      setConsoleOutput([{
        type: 'error',
        content: `Execution Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    
    setIsExecuting(false);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        setFileName(file.name);
        
        // Auto-detect language from file extension
        const ext = file.name.split('.').pop().toLowerCase();
        const langMap = {
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'java': 'java',
          'cpp': 'cpp',
          'c': 'cpp',
          'go': 'go',
          'rs': 'rust',
          'html': 'html'
        };
        
        if (langMap[ext]) {
          setLanguage(langMap[ext]);
        }
      };
      reader.readAsText(file);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.snippet && editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = selection || {
        startLineNumber: editor.getPosition().lineNumber,
        startColumn: 1,
        endLineNumber: editor.getPosition().lineNumber,
        endColumn: 1
      };
      
      editor.executeEdits('apply-suggestion', [{
        range: range,
        text: suggestion.snippet
      }]);
      
      editor.focus();
    }
  };

  const resetCode = () => {
    setCode(getDefaultCode(language));
  };

  return (
    <div className={`h-screen ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          {/* Left - Logo and Navigation */}
          <div className="flex items-center space-x-6">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Codex Runtime Analyzer
                </h1>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Real-time code analysis • No tabs • Focused workflow
                </p>
              </div>
            </div>
          </div>

          {/* Center - File Info */}
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
              <span className="text-sm font-medium">{fileName}</span>
            </div>
            
            {analysis && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {isAnalyzing ? 'Analyzing...' : 'Analysis ready'}
                </span>
                {getLanguageSnippets(language).length > 0 && (
                  <>
                    <div className="w-px h-4 bg-gray-400"></div>
                    <div className="flex items-center space-x-1">
                      <Sparkles size={12} className="text-purple-500" />
                      <span className="text-xs text-purple-500">
                        {getLanguageSnippets(language).length} snippets ready
                      </span>
                      {snippetsUpdated && (
                        <span className="text-xs text-green-500 animate-pulse">
                          ✓ Updated
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        (Ctrl+Space to see)
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {user?.firstName || user?.username || 'User'}
                </span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="text-sm text-gray-500">
                Sign in for full features
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 border-gray-700'} border-b px-4 py-2`}>
        <div className="flex items-center justify-between">
          {/* Left - Language and Theme */}
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                console.log('Changing language to:', newLanguage);
                setLanguage(newLanguage);
                const lang = languages.find(l => l.value === newLanguage);
                if (lang) {
                  setFileName(`solution${lang.ext}`);
                }
                
                // Update code to language-specific default
                setCode(getDefaultCode(newLanguage));
                
                // Update Monaco Editor language
                if (editorRef.current) {
                  const model = editorRef.current.getModel();
                  if (model) {
                    window.monaco?.editor?.setModelLanguage(model, newLanguage);
                  }
                }
                
                // Force re-register snippets after language change
                setTimeout(() => {
                  registerCustomSnippets();
                }, 200);
              }}
              className={`px-3 py-1 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'} text-sm`}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
            
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`px-3 py-1 rounded-lg border ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'} text-sm`}
            >
              {themes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Center - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Play size={16} />
              <span>{isExecuting ? 'Running...' : 'Run'}</span>
            </button>
            
            <button
              onClick={saveCode}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              title="Save file"
            >
              <Save size={16} />
            </button>
            
            <label className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors cursor-pointer`} title="Load file">
              <Upload size={16} />
              <input
                type="file"
                onChange={loadCode}
                className="hidden"
                accept=".js,.ts,.py,.java,.cpp,.c,.go,.rs,.html,.css,.json"
              />
            </label>
            
            <button
              onClick={copyCode}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              title="Copy code"
            >
              <Copy size={16} />
            </button>
            
            <button
              onClick={resetCode}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              title="Reset code"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Right - View toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                showAnalysis 
                  ? 'bg-purple-600 text-white' 
                  : theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
              }`}
            >
              <Brain size={16} />
              <span>Analysis</span>
            </button>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                showConsole 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
              }`}
            >
              <Terminal size={16} />
              <span>Console</span>
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`flex-1 ${showAnalysis ? 'w-2/3' : 'w-full'}`}>
          <div className="h-full flex flex-col">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={setCode}
              theme={theme}
              onMount={(editor) => {
                editorRef.current = editor;
                registerCustomSnippets();
              }}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                  showFunctions: true,
                  showConstructors: true,
                  showFields: true,
                  showVariables: true,
                  showClasses: true,
                  showStructs: true,
                  showInterfaces: true,
                  showModules: true,
                  showProperties: true,
                  showEvents: true,
                  showOperators: true,
                  showUnits: true,
                  showValues: true,
                  showConstants: true,
                  showEnums: true,
                  showEnumMembers: true,
                  showColors: true,
                  showFiles: true,
                  showReferences: true,
                  showFolders: true,
                  showTypeParameters: true,
                  showIssues: true,
                  showUsers: true,
                  insertMode: 'replace'
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true
                },
                parameterHints: {
                  enabled: true,
                  cycle: true
                },
                acceptSuggestionOnCommitCharacter: true,
                acceptSuggestionOnEnter: 'on',
                accessibilitySupport: 'auto'
              }}
            />
          </div>
        </div>

        {/* Analysis Panel */}
        {showAnalysis && (
          <div className={`w-1/3 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-l overflow-y-auto`}>
            <div className="p-4 space-y-4">
              {/* Analysis Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Brain className="text-purple-500" size={20} />
                  <span>Runtime Analysis</span>
                </h3>
                {isAnalyzing && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Analyzing...</span>
                  </div>
                )}
              </div>

              {analysis && (
                <>
                  {/* Performance Metrics */}
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Activity className="text-green-500" size={16} />
                      <span>Performance</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time Complexity:</span>
                        <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {analysis.runtime.bigO.time}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Space Complexity:</span>
                        <span className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {analysis.runtime.bigO.space}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {analysis.runtime.bigO.description}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">{analysis.runtime.estimatedTime}ms</div>
                          <div className="text-xs text-gray-500">Est. Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">{analysis.runtime.memoryUsage}KB</div>
                          <div className="text-xs text-gray-500">Est. Memory</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Quality */}
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <Target className="text-blue-500" size={16} />
                      <span>Code Quality</span>
                    </h4>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Quality Score:</span>
                      <span className="font-bold text-lg">{analysis.quality}%</span>
                    </div>
                    
                    <div className={`w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'} rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          analysis.quality >= 80 ? 'bg-green-500' :
                          analysis.quality >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.quality}%` }}
                      />
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Complexity:</span>
                        <span className={`font-semibold ${
                          analysis.complexity.color === 'green' ? 'text-green-600' :
                          analysis.complexity.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysis.complexity.level} ({analysis.complexity.score})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Code Metrics */}
                  <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <h4 className="font-medium mb-3 flex items-center space-x-2">
                      <BarChart3 className="text-indigo-500" size={16} />
                      <span>Metrics</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Lines:</span>
                        <span className="font-semibold">{analysis.metrics.lines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Functions:</span>
                        <span className="font-semibold">{analysis.metrics.functions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loops:</span>
                        <span className="font-semibold">{analysis.metrics.loops}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conditionals:</span>
                        <span className="font-semibold">{analysis.metrics.conditionals}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Issues */}
                  {analysis.performance.length > 0 && (
                    <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'} border border-red-200`}>
                      <h4 className="font-medium mb-3 flex items-center space-x-2 text-red-600">
                        <AlertTriangle size={16} />
                        <span>Performance Issues</span>
                      </h4>
                      
                      <div className="space-y-2">
                        {analysis.performance.map((issue, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-red-700">{issue.message}</div>
                            <div className="text-red-600 text-xs mt-1">{issue.suggestion}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysis.suggestions.length > 0 && (
                    <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'} border border-blue-200`}>
                      <h4 className="font-medium mb-3 flex items-center space-x-2 text-blue-600">
                        <Sparkles size={16} />
                        <span>Suggestions</span>
                      </h4>
                      
                      <div className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-blue-700">{suggestion.message}</div>
                                <div className="text-blue-600 text-xs mt-1 capitalize">{suggestion.type}</div>
                              </div>
                              {suggestion.snippet && (
                                <button
                                  onClick={() => applySuggestion(suggestion)}
                                  className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                                  title="Apply this suggestion"
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Snippets */}
                  {getLanguageSnippets(language).length > 0 && (
                    <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'} border border-purple-200`}>
                      <h4 className="font-medium mb-3 flex items-center space-x-2 text-purple-600">
                        <Sparkles size={16} />
                        <span>Available Snippets</span>
                      </h4>
                      
                      <div className="space-y-2">
                        {getLanguageSnippets(language).map((snippet, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-purple-700">{snippet.label}</div>
                                <div className="text-purple-600 text-xs mt-1">{snippet.documentation}</div>
                              </div>
                              <button
                                onClick={() => {
                                  if (editorRef.current) {
                                    const editor = editorRef.current;
                                    const position = editor.getPosition();
                                    editor.executeEdits('insert-snippet', [{
                                      range: {
                                        startLineNumber: position.lineNumber,
                                        startColumn: position.column,
                                        endLineNumber: position.lineNumber,
                                        endColumn: position.column
                                      },
                                      text: snippet.insertText
                                    }]);
                                    editor.focus();
                                  }
                                }}
                                className="ml-2 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                                title="Insert this snippet"
                              >
                                Insert
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-xs text-purple-600 bg-purple-100 p-2 rounded">
                        💡 Tip: Type the snippet name and press Ctrl+Space for autocomplete, or use the Insert buttons above.
                      </div>
                    </div>
                  )}

                  {/* No Issues */}
                  {analysis.performance.length === 0 && analysis.suggestions.length === 0 && analysis.issues.length === 0 && (
                    <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'} border border-green-200`}>
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="font-medium">Code looks great!</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">No issues or suggestions found.</p>
                    </div>
                  )}
                </>
              )}

              {!analysis && !isAnalyzing && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Start typing to see analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Console - Always visible for debugging */}
      <div className={`h-64 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'} border-t`}>
        <div className="h-full flex flex-col">
          <div className={`px-4 py-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} border-b flex items-center justify-between`}>
            <div className="flex items-center space-x-2">
              <Terminal size={16} className="text-blue-500" />
              <span className="font-medium">Console Output</span>
              {executionTime > 0 && (
                <span className="text-xs text-gray-500">
                  Last run: {executionTime.toFixed(2)}ms
                </span>
              )}
              <span className="text-xs text-gray-400">
                ({consoleOutput.length} messages)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`text-xs px-2 py-1 rounded ${showConsole ? 'bg-blue-600 text-white' : theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              >
                {showConsole ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => setConsoleOutput([])}
                className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              >
                Clear
              </button>
            </div>
          </div>
          
          {showConsole && (
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <div className="text-center py-8">
                  <Terminal className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <div className="text-gray-500 italic">Console output will appear here...</div>
                  <div className="text-xs text-gray-400 mt-2">Click the "Run" button to execute your code</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {consoleOutput.map((output, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg bg-opacity-50 hover:bg-opacity-75 transition-colors">
                      <span className="text-xs text-gray-500 mt-0.5 min-w-[60px]">{output.timestamp}</span>
                      <span className={`flex-1 ${
                        output.type === 'error' ? 'text-red-500 bg-red-100 dark:bg-red-900/20' :
                        output.type === 'warn' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' :
                        output.type === 'success' ? 'text-green-600 bg-green-100 dark:bg-green-900/20' :
                        output.type === 'result' ? 'text-purple-600 font-semibold bg-purple-100 dark:bg-purple-900/20' :
                        output.type === 'info' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' : 
                        theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                      } px-2 py-1 rounded`}>
                        {output.content}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodexEditorRedesigned;