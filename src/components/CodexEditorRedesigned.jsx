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
  Monitor,
  Eye,
  Layout,
  ExternalLink,
  Zap,
  Award,
  BookOpen,
  Users,
  X
} from 'lucide-react';

const CodexEditorRedesigned = ({ onBack }) => {
  const { user } = useUniversalAuth();
  
  // Welcome screen state
  const [showWelcome, setShowWelcome] = useState(true);
  
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
  const [showConsole, setShowConsole] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [htmlOutput, setHtmlOutput] = useState('');
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
          insertText: 'console.time(\'${1:operation}\');\n${2:// Your code here}\nconsole.timeEnd(\'${1:operation}\');',
          documentation: 'Performance timing wrapper'
        },
        {
          label: 'array-methods',
          kind: 'Snippet',
          insertText: 'const result = array\n  .filter(item => ${1:condition})\n  .map(item => ${2:transformation})\n  .reduce((acc, item) => ${3:accumulator}, ${4:initial});',
          documentation: 'Chained array methods pattern'
        }
      ],
      typescript: [
        {
          label: 'interface',
          kind: 'Snippet',
          insertText: 'interface ${1:InterfaceName} {\n  ${2:property}: ${3:type};\n  ${4:method}(${5:params}): ${6:returnType};\n}',
          documentation: 'TypeScript interface definition'
        },
        {
          label: 'generic-function',
          kind: 'Snippet',
          insertText: 'function ${1:functionName}<T>(${2:param}: T): T {\n  ${3:// Implementation}\n  return ${2:param};\n}',
          documentation: 'Generic function template'
        },
        {
          label: 'type-guard',
          kind: 'Snippet',
          insertText: 'function is${1:Type}(value: any): value is ${1:Type} {\n  return ${2:condition};\n}',
          documentation: 'Type guard function'
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
        },
        {
          label: 'list-comprehension',
          kind: 'Snippet',
          insertText: 'result = [${1:expression} for ${2:item} in ${3:iterable} if ${4:condition}]',
          documentation: 'List comprehension pattern'
        },
        {
          label: 'decorator',
          kind: 'Snippet',
          insertText: 'def ${1:decorator_name}(func):\n    def wrapper(*args, **kwargs):\n        ${2:# Before function call}\n        result = func(*args, **kwargs)\n        ${3:# After function call}\n        return result\n    return wrapper',
          documentation: 'Function decorator template'
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
        },
        {
          label: 'try-catch',
          kind: 'Snippet',
          insertText: 'try {\n    ${1:// Code that may throw exception}\n} catch (${2:Exception} e) {\n    ${3:// Handle exception}\n    e.printStackTrace();\n}',
          documentation: 'Try-catch exception handling'
        },
        {
          label: 'stream-api',
          kind: 'Snippet',
          insertText: 'List<${1:Type}> result = list.stream()\n    .filter(item -> ${2:condition})\n    .map(item -> ${3:transformation})\n    .collect(Collectors.toList());',
          documentation: 'Java Stream API pattern'
        }
      ],
      cpp: [
        {
          label: 'class-template',
          kind: 'Snippet',
          insertText: 'class ${1:ClassName} {\nprivate:\n    ${2:type} ${3:member};\n    \npublic:\n    ${1:ClassName}(${4:params}) : ${3:member}(${5:value}) {}\n    \n    ${6:returnType} ${7:methodName}(${8:params}) {\n        ${9:// Implementation}\n    }\n};',
          documentation: 'C++ class template'
        },
        {
          label: 'vector-loop',
          kind: 'Snippet',
          insertText: 'for (const auto& ${1:item} : ${2:vector}) {\n    ${3:// Process item}\n}',
          documentation: 'Range-based for loop for vectors'
        },
        {
          label: 'smart-pointer',
          kind: 'Snippet',
          insertText: 'std::unique_ptr<${1:Type}> ${2:ptr} = std::make_unique<${1:Type}>(${3:args});',
          documentation: 'Smart pointer creation'
        }
      ],
      go: [
        {
          label: 'struct-template',
          kind: 'Snippet',
          insertText: 'type ${1:StructName} struct {\n    ${2:Field} ${3:type}\n}\n\nfunc (${4:s} *${1:StructName}) ${5:MethodName}() ${6:returnType} {\n    ${7:// Implementation}\n}',
          documentation: 'Go struct with method'
        },
        {
          label: 'error-handling',
          kind: 'Snippet',
          insertText: 'if err != nil {\n    return ${1:nil}, fmt.Errorf("${2:error message}: %w", err)\n}',
          documentation: 'Go error handling pattern'
        },
        {
          label: 'goroutine',
          kind: 'Snippet',
          insertText: 'go func() {\n    ${1:// Concurrent code}\n}()',
          documentation: 'Anonymous goroutine'
        }
      ],
      rust: [
        {
          label: 'struct-impl',
          kind: 'Snippet',
          insertText: 'struct ${1:StructName} {\n    ${2:field}: ${3:type},\n}\n\nimpl ${1:StructName} {\n    fn ${4:method_name}(&self) -> ${5:ReturnType} {\n        ${6:// Implementation}\n    }\n}',
          documentation: 'Rust struct with implementation'
        },
        {
          label: 'result-handling',
          kind: 'Snippet',
          insertText: 'match ${1:result} {\n    Ok(${2:value}) => ${3:// Handle success},\n    Err(${4:error}) => ${5:// Handle error},\n}',
          documentation: 'Result type pattern matching'
        },
        {
          label: 'option-handling',
          kind: 'Snippet',
          insertText: 'if let Some(${1:value}) = ${2:option} {\n    ${3:// Use value}\n}',
          documentation: 'Option type handling'
        }
      ],
      html: [
        {
          label: 'html5-template',
          kind: 'Snippet',
          insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${1:Page Title}</title>\n</head>\n<body>\n    ${2:<!-- Content -->}\n</body>\n</html>',
          documentation: 'HTML5 document template'
        },
        {
          label: 'form-template',
          kind: 'Snippet',
          insertText: '<form action="${1:/submit}" method="${2:post}">\n    <label for="${3:field}">${4:Label}:</label>\n    <input type="${5:text}" id="${3:field}" name="${3:field}" required>\n    <button type="submit">${6:Submit}</button>\n</form>',
          documentation: 'HTML form template'
        }
      ],
      css: [
        {
          label: 'flexbox-center',
          kind: 'Snippet',
          insertText: '.${1:container} {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}',
          documentation: 'Flexbox centering pattern'
        },
        {
          label: 'grid-layout',
          kind: 'Snippet',
          insertText: '.${1:container} {\n    display: grid;\n    grid-template-columns: repeat(${2:3}, 1fr);\n    gap: ${3:1rem};\n}',
          documentation: 'CSS Grid layout'
        },
        {
          label: 'media-query',
          kind: 'Snippet',
          insertText: '@media (max-width: ${1:768px}) {\n    ${2:// Responsive styles}\n}',
          documentation: 'Media query for responsive design'
        }
      ],
      sql: [
        {
          label: 'select-join',
          kind: 'Snippet',
          insertText: 'SELECT ${1:columns}\nFROM ${2:table1}\nINNER JOIN ${3:table2}\n  ON ${2:table1}.${4:id} = ${3:table2}.${5:foreign_id}\nWHERE ${6:condition};',
          documentation: 'SELECT with JOIN statement'
        },
        {
          label: 'create-table',
          kind: 'Snippet',
          insertText: 'CREATE TABLE ${1:table_name} (\n    ${2:id} INT PRIMARY KEY AUTO_INCREMENT,\n    ${3:column} ${4:VARCHAR(255)} NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);',
          documentation: 'CREATE TABLE statement'
        }
      ],
      php: [
        {
          label: 'class-template',
          kind: 'Snippet',
          insertText: 'class ${1:ClassName} {\n    private $${2:property};\n    \n    public function __construct($${2:property}) {\n        $this->${2:property} = $${2:property};\n    }\n    \n    public function ${3:methodName}() {\n        ${4:// Implementation}\n    }\n}',
          documentation: 'PHP class template'
        },
        {
          label: 'try-catch',
          kind: 'Snippet',
          insertText: 'try {\n    ${1:// Code that may throw exception}\n} catch (${2:Exception} $e) {\n    ${3:// Handle exception}\n    error_log($e->getMessage());\n}',
          documentation: 'PHP exception handling'
        }
      ],
      ruby: [
        {
          label: 'class-template',
          kind: 'Snippet',
          insertText: 'class ${1:ClassName}\n  attr_accessor :${2:attribute}\n  \n  def initialize(${2:attribute})\n    @${2:attribute} = ${2:attribute}\n  end\n  \n  def ${3:method_name}\n    ${4:# Implementation}\n  end\nend',
          documentation: 'Ruby class template'
        },
        {
          label: 'each-loop',
          kind: 'Snippet',
          insertText: '${1:array}.each do |${2:item}|\n  ${3:# Process item}\nend',
          documentation: 'Ruby each loop'
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
    { value: 'javascript', label: 'JavaScript', ext: '.js', icon: '🟨', color: 'yellow' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts', icon: '🔷', color: 'blue' },
    { value: 'python', label: 'Python', ext: '.py', icon: '🐍', color: 'green' },
    { value: 'java', label: 'Java', ext: '.java', icon: '☕', color: 'orange' },
    { value: 'cpp', label: 'C++', ext: '.cpp', icon: '⚡', color: 'purple' },
    { value: 'go', label: 'Go', ext: '.go', icon: '🐹', color: 'cyan' },
    { value: 'rust', label: 'Rust', ext: '.rs', icon: '🦀', color: 'red' },
    { value: 'html', label: 'HTML', ext: '.html', icon: '🌐', color: 'pink' },
    { value: 'css', label: 'CSS', ext: '.css', icon: '🎨', color: 'indigo' },
    { value: 'sql', label: 'SQL', ext: '.sql', icon: '🗄️', color: 'teal' },
    { value: 'php', label: 'PHP', ext: '.php', icon: '🐘', color: 'violet' },
    { value: 'ruby', label: 'Ruby', ext: '.rb', icon: '💎', color: 'rose' },
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

  // Real-time output preview for HTML
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (language === 'html') {
        // Direct HTML preview
        setHtmlOutput(code);
        // Auto-open output panel when HTML code is present
        if (code.trim().length > 0) {
          setShowOutput(true);
        }
      } else if (language === 'javascript' && code.includes('document.')) {
        // JavaScript with DOM manipulation
        setHtmlOutput(code);
        if (code.trim().length > 0) {
          setShowOutput(true);
        }
      }
    }, 300); // Debounce for performance

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
    console.log('🚀 Execute button clicked');
    setIsExecuting(true);
    setConsoleOutput([{
      type: 'info',
      content: '🚀 Starting execution...',
      timestamp: new Date().toLocaleTimeString()
    }]);
    
    const startTime = performance.now();
    
    try {
      // Simulate code execution
      const output = [{
        type: 'info',
        content: '🚀 Starting execution...',
        timestamp: new Date().toLocaleTimeString()
      }];
      
      if (language === 'javascript') {
        // Create a safe execution environment
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          const content = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output.push({
            type: 'log',
            content,
            timestamp: new Date().toLocaleTimeString()
          });
          originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
          const content = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output.push({
            type: 'error',
            content,
            timestamp: new Date().toLocaleTimeString()
          });
          originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
          const content = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          output.push({
            type: 'warn',
            content,
            timestamp: new Date().toLocaleTimeString()
          });
          originalWarn.apply(console, args);
        };
        
        try {
          // Execute the code
          // eslint-disable-next-line no-eval
          const result = eval(code);
          if (result !== undefined) {
            output.push({
              type: 'result',
              content: `Result: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`,
              timestamp: new Date().toLocaleTimeString()
            });
          }
        } catch (error) {
          output.push({
            type: 'error',
            content: `❌ Error: ${error.message}`,
            timestamp: new Date().toLocaleTimeString()
          });
          if (error.stack) {
            output.push({
              type: 'error',
              content: error.stack.split('\n').slice(0, 3).join('\n'),
              timestamp: new Date().toLocaleTimeString()
            });
          }
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
      
      // Generate HTML output for web languages
      if (language === 'html' || (language === 'javascript' && code.includes('document.'))) {
        setHtmlOutput(code);
        setShowOutput(true);
      } else if (language === 'javascript') {
        // For JavaScript, create a simple visualization of the output
        const visualOutput = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
              }
              .output-container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              }
              .output-item {
                background: rgba(255, 255, 255, 0.2);
                padding: 12px;
                margin: 8px 0;
                border-radius: 8px;
                border-left: 4px solid #4ade80;
              }
              h2 { margin-top: 0; color: #fbbf24; }
              pre { 
                background: rgba(0, 0, 0, 0.3); 
                padding: 12px; 
                border-radius: 6px; 
                overflow-x: auto;
                color: #a5f3fc;
              }
            </style>
          </head>
          <body>
            <div class="output-container">
              <h2>🚀 Execution Output</h2>
              ${output.filter(o => o.type === 'log' || o.type === 'result').map(o => 
                `<div class="output-item">${o.content}</div>`
              ).join('')}
              ${output.filter(o => o.type === 'log' || o.type === 'result').length === 0 ? 
                '<div class="output-item">✅ Code executed successfully (no output)</div>' : ''}
            </div>
          </body>
          </html>
        `;
        setHtmlOutput(visualOutput);
      }
      
      // Add execution success message
      if (output.length === 1) {
        output.push({
          type: 'success',
          content: '✅ Code executed successfully (no output)',
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        output.push({
          type: 'success',
          content: `✅ Execution completed in ${execTime.toFixed(2)}ms`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      
      setConsoleOutput(output);
      
      // Auto-show console when code is executed
      if (!showConsole) {
        setShowConsole(true);
      }
      
    } catch (error) {
      console.error('Execution error:', error);
      setConsoleOutput([{
        type: 'error',
        content: `❌ Execution Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    
    setIsExecuting(false);
    console.log('✅ Execution complete');
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

  // Welcome Screen Component
  const WelcomeScreen = () => (
    <div className={`h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900' : 'bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white'} overflow-y-auto`}>
      <div className="min-h-screen flex flex-col">
        {/* Header with Back Button */}
        <div className={`${theme === 'light' ? 'bg-white/80 backdrop-blur-xl border-gray-200/50' : 'bg-gray-900/80 backdrop-blur-xl border-gray-800/50'} border-b shadow-sm sticky top-0 z-10`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {onBack && (
                  <button
                    onClick={onBack}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-gray-800'} transition-all duration-200`}
                  >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Back</span>
                  </button>
                )}
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Codex Editor
                    </h1>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Professional code development environment
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {themes.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`p-2 rounded-lg transition-all ${
                      theme === t.value 
                        ? theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                        : theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'
                    }`}
                    title={t.label}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className={`max-w-6xl w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-12 text-white text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                  <Code className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-3">Welcome to Codex Editor</h2>
              <p className="text-xl text-blue-100">Your professional code development environment</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'} border ${theme === 'light' ? 'border-purple-200' : 'border-purple-800'}`}>
              <Zap className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Live Preview</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                See your HTML/CSS/JavaScript code render in real-time as you type
              </p>
            </div>

            <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'} border ${theme === 'light' ? 'border-blue-200' : 'border-blue-800'}`}>
              <Brain className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Smart Analysis</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Real-time code quality analysis, complexity metrics, and performance insights
              </p>
            </div>

            <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'} border ${theme === 'light' ? 'border-green-200' : 'border-green-800'}`}>
              <Sparkles className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Smart Snippets</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Language-specific code snippets with autocomplete support
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-6">
            <h3 className="font-bold text-xl mb-4 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <span>Pricing Plans</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Free Plan */}
              <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-2`}>
                <h4 className="font-bold text-lg mb-2">Free</h4>
                <div className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>12 Languages Support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Live HTML Preview</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Code Analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Smart Snippets</span>
                  </li>
                </ul>
                <button className={`w-full py-2 rounded-lg ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} transition-colors font-medium`}>
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className={`p-6 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white border-2 border-purple-400 relative overflow-hidden`}>
                <div className="absolute top-2 right-2 bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                  POPULAR
                </div>
                <h4 className="font-bold text-lg mb-2">Pro</h4>
                <div className="text-3xl font-bold mb-4">$9<span className="text-sm font-normal">/month</span></div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Unlimited Projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Cloud Save & Sync</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Advanced Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <button className="w-full py-2 rounded-lg bg-white text-purple-600 hover:bg-gray-100 transition-colors font-bold">
                  Upgrade to Pro
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'} border-2`}>
                <h4 className="font-bold text-lg mb-2">Enterprise</h4>
                <div className="text-3xl font-bold mb-4">Custom</div>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Team Collaboration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Custom Integrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Dedicated Support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SLA Guarantee</span>
                  </li>
                </ul>
                <button className={`w-full py-2 rounded-lg ${theme === 'light' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'} transition-colors font-medium`}>
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="text-center">
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Coding Now →
            </button>
            <p className={`text-sm mt-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );

  // Show welcome screen as main view (not overlay)
  if (showWelcome) {
    return <WelcomeScreen />;
  }

  return (
    <div className={`h-screen ${theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900' : 'bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white'} flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header - Modern Design */}
      <div className={`${theme === 'light' ? 'bg-white/80 backdrop-blur-xl border-gray-200/50' : 'bg-gray-900/80 backdrop-blur-xl border-gray-800/50'} border-b shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-gray-800'} transition-all duration-200`}
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Codex Editor
                  </h1>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Real-time analysis • Smart snippets • Live preview
                  </p>
                </div>
              </div>
            </div>

            {/* Center - File Info with Status */}
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-xl ${theme === 'light' ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'} shadow-sm`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'} shadow-lg ${isAnalyzing ? 'shadow-yellow-500/50' : 'shadow-green-500/50'}`}></div>
                  <span className="text-sm font-semibold">{fileName}</span>
                </div>
              </div>
              
              {analysis && getLanguageSnippets(language).length > 0 && (
                <div className={`px-3 py-2 rounded-xl ${theme === 'light' ? 'bg-purple-50 border border-purple-200' : 'bg-purple-900/20 border border-purple-800/50'}`}>
                  <div className="flex items-center space-x-2">
                    <Sparkles size={14} className="text-purple-500" />
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      {getLanguageSnippets(language).length} snippets
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowWelcome(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-gray-800'} transition-all duration-200 text-sm`}
                title="View pricing"
              >
                <Award size={16} />
                <span className="hidden md:inline">Pricing</span>
              </button>
              
              <SignedIn>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {user?.firstName || user?.username || 'User'}
                  </span>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 ring-2 ring-purple-500/20"
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
      </div>

      {/* Toolbar - Redesigned */}
      <div className={`${theme === 'light' ? 'bg-white/60 backdrop-blur-lg border-gray-200/50' : 'bg-gray-900/60 backdrop-blur-lg border-gray-800/50'} border-b`}>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Language and Theme */}
            <div className="flex items-center space-x-3">
              <select
                value={language}
                onChange={(e) => {
                  const newLanguage = e.target.value;
                  setLanguage(newLanguage);
                  const lang = languages.find(l => l.value === newLanguage);
                  if (lang) {
                    setFileName(`solution${lang.ext}`);
                  }
                  setCode(getDefaultCode(newLanguage));
                  
                  // Auto-open output panel for HTML
                  if (newLanguage === 'html') {
                    setShowOutput(true);
                  }
                  
                  if (editorRef.current) {
                    const model = editorRef.current.getModel();
                    if (model) {
                      window.monaco?.editor?.setModelLanguage(model, newLanguage);
                    }
                  }
                }}
                className={`px-4 py-2 rounded-xl font-medium text-sm ${theme === 'light' ? 'bg-white border-gray-200 text-gray-700 hover:border-gray-300' : 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-600'} border-2 transition-all cursor-pointer focus:ring-2 focus:ring-purple-500/50 focus:outline-none`}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                {themes.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`p-2 rounded-lg transition-all ${
                      theme === t.value 
                        ? 'bg-white dark:bg-gray-700 shadow-md' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                    title={t.label}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Center - Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:shadow-none text-sm"
              >
                <Play size={16} />
                <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
              
              <button
                onClick={saveCode}
                className={`p-2.5 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all`}
                title="Save file"
              >
                <Save size={18} />
              </button>
              
              <label className={`p-2.5 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all cursor-pointer`} title="Load file">
                <Upload size={18} />
                <input
                  type="file"
                  onChange={loadCode}
                  className="hidden"
                  accept=".js,.ts,.py,.java,.cpp,.c,.go,.rs,.html,.css,.json"
                />
              </label>
              
              <button
                onClick={copyCode}
                className={`p-2.5 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all`}
                title="Copy code"
              >
                <Copy size={18} />
              </button>
              
              <button
                onClick={resetCode}
                className={`p-2.5 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all`}
                title="Reset code"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Right - View toggles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  showAnalysis 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Brain size={16} />
                <span>Analysis</span>
              </button>
              
              <button
                onClick={() => setShowOutput(!showOutput)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  showOutput 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' 
                    : theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Eye size={16} />
                <span>Output</span>
              </button>
              
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 text-sm ${
                  showConsole 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Terminal size={16} />
                <span>Console</span>
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2.5 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all`}
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`${showAnalysis && showOutput ? 'w-1/3' : showAnalysis || showOutput ? 'w-2/3' : 'w-full'} flex-shrink-0`}>
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
                folding: true,
                lineNumbersMinChars: 3,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                },
                padding: { top: 16, bottom: 16 }
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        {showOutput && (
          <div className={`${showAnalysis ? 'w-1/3' : 'w-1/3'} ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-l overflow-hidden flex flex-col`}>
            <div className={`px-4 py-3 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'} border-b flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Layout className="text-green-500" size={18} />
                <span className="font-semibold">Live Output</span>
                <div className="flex items-center space-x-1 ml-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setHtmlOutput('')}
                  className={`text-xs px-3 py-1.5 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'} transition-colors`}
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowOutput(false)}
                  className={`text-xs px-3 py-1.5 rounded-lg ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'} transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {htmlOutput ? (
                <iframe
                  srcDoc={htmlOutput}
                  title="Output Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className={`text-lg font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Live Preview Active
                    </p>
                    <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Start typing HTML or JavaScript to see live output
                    </p>
                    <div className={`mt-4 text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <p>✨ Real-time preview:</p>
                      <p className="mt-1">• HTML updates as you type</p>
                      <p>• JavaScript with document.* auto-renders</p>
                      <p>• Click "Run" for console output</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Panel */}
        {showAnalysis && (
          <div className={`${showOutput ? 'w-1/3' : 'w-1/3'} ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-l overflow-y-auto`}>
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

      {/* Console - Always Visible by Default */}
      {showConsole && (
        <div className={`h-96 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900 border-gray-700'} border-t flex flex-col shadow-lg`}>
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
                onClick={() => setConsoleOutput([])}
                className={`text-xs px-2 py-1 rounded ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
              >
                Clear
              </button>
            </div>
          </div>
          
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
        </div>
      )}
    </div>
  );
};

export default CodexEditorRedesigned;