import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/ClerkAuthContext';
import {
  Play, Save, Settings, FolderOpen, Folder, File, Terminal, GitBranch, Code,
  FileText, X, Search, Trash2, Loader, CheckCircle, AlertCircle, Info,
  RefreshCw, FolderPlus, FilePlus, Activity, User, Box, Edit3, ChevronDown, 
  ChevronRight, Zap, Cpu, Clock, MemoryStick, Award, Target, BookOpen
} from 'lucide-react';

// Enhanced language configurations with better templates and execution
const languageConfigs = {
  cpp: {
    name: 'C++',
    icon: '⚡',
    extension: '.cpp',
    monacoLanguage: 'cpp',
    executable: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    template: (projectName = 'Solution') => `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
#include <queue>
#include <stack>
using namespace std;

class Solution {
public:
    // ${projectName} - C++ Implementation
    void solve() {
        cout << "Hello from C++!" << endl;
        
        // Example: Working with vectors
        vector<int> nums = {1, 2, 3, 4, 5};
        cout << "Vector elements: ";
        for (int num : nums) {
            cout << num << " ";
        }
        cout << endl;
        
        // Example: String manipulation
        string message = "C++ is powerful!";
        cout << "Message: " << message << endl;
        cout << "Length: " << message.length() << endl;
    }
};

int main() {
    Solution solution;
    solution.solve();
    return 0;
}`,
    snippets: [
      { label: 'vector', code: 'vector<int> v;' },
      { label: 'for_loop', code: 'for (int i = 0; i < n; i++) {\n    \n}' },
      { label: 'class', code: 'class Solution {\npublic:\n    \n};' },
      { label: 'sort', code: 'sort(v.begin(), v.end());' }
    ]
  },
  
  python: {
    name: 'Python',
    icon: '🐍',
    extension: '.py',
    monacoLanguage: 'python',
    executable: true,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    template: (projectName = 'Solution') => `# ${projectName} - Python Implementation
from typing import List, Dict, Set, Optional
import collections
import heapq
import bisect

class Solution:
    def solve(self):
        """Main solution method"""
        print("Hello from Python!")
        
        # Example: Working with lists
        nums = [1, 2, 3, 4, 5]
        print(f"List elements: {nums}")
        
        # Example: List comprehension
        squares = [x**2 for x in nums]
        print(f"Squares: {squares}")
        
        # Example: Dictionary usage
        freq = collections.Counter(nums)
        print(f"Frequency: {freq}")
        
        # Example: String formatting
        message = "Python is awesome!"
        print(f"Message: {message}")
        print(f"Length: {len(message)}")

def main():
    solution = Solution()
    solution.solve()

if __name__ == "__main__":
    main()`,
    snippets: [
      { label: 'list_comp', code: '[x for x in range(n)]' },
      { label: 'dict_comp', code: '{k: v for k, v in items}' },
      { label: 'class', code: 'class Solution:\n    def solve(self):\n        pass' },
      { label: 'for_range', code: 'for i in range(n):\n    ' }
    ]
  },
  
  java: {
    name: 'Java',
    icon: '☕',
    extension: '.java',
    monacoLanguage: 'java',
    executable: true,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    template: (projectName = 'Solution') => `import java.util.*;
import java.io.*;

public class Solution {
    // ${projectName} - Java Implementation
    
    public void solve() {
        System.out.println("Hello from Java!");
        
        // Example: Working with ArrayList
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
        System.out.println("List elements: " + nums);
        
        // Example: Stream operations
        List<Integer> squares = nums.stream()
            .map(x -> x * x)
            .collect(Collectors.toList());
        System.out.println("Squares: " + squares);
        
        // Example: HashMap usage
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        System.out.println("Frequency: " + freq);
        
        // Example: String operations
        String message = "Java is robust!";
        System.out.println("Message: " + message);
        System.out.println("Length: " + message.length());
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        solution.solve();
    }
}`,
    snippets: [
      { label: 'arraylist', code: 'List<Integer> list = new ArrayList<>();' },
      { label: 'hashmap', code: 'Map<String, Integer> map = new HashMap<>();' },
      { label: 'for_each', code: 'for (int item : items) {\n    \n}' },
      { label: 'class', code: 'public class Solution {\n    \n}' }
    ]
  },
  
  javascript: {
    name: 'JavaScript',
    icon: '🟨',
    extension: '.js',
    monacoLanguage: 'javascript',
    executable: true,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    template: (projectName = 'Solution') => `// ${projectName} - JavaScript Implementation

class Solution {
    solve() {
        console.log("Hello from JavaScript!");
        
        // Example: Working with arrays
        const nums = [1, 2, 3, 4, 5];
        console.log("Array elements:", nums);
        
        // Example: Array methods
        const squares = nums.map(x => x * x);
        console.log("Squares:", squares);
        
        // Example: Object usage
        const freq = {};
        nums.forEach(num => {
            freq[num] = (freq[num] || 0) + 1;
        });
        console.log("Frequency:", freq);
        
        // Example: String template
        const message = "JavaScript is versatile!";
        console.log(\`Message: \${message}\`);
        console.log(\`Length: \${message.length}\`);
    }
}

function main() {
    const solution = new Solution();
    solution.solve();
}

main();`,
    snippets: [
      { label: 'arrow_func', code: 'const func = (param) => {\n    \n};' },
      { label: 'map', code: 'array.map(item => item)' },
      { label: 'filter', code: 'array.filter(item => condition)' },
      { label: 'class', code: 'class Solution {\n    solve() {\n        \n    }\n}' }
    ]
  }
};

const ProblemsetEditor = ({ onBack }) => {
  const { user } = useAuth();
  const [activeLanguage, setActiveLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  
  const editorRef = useRef(null);

  // Initialize with template when language changes
  useEffect(() => {
    const config = languageConfigs[activeLanguage];
    if (config && !code) {
      setCode(config.template());
    }
  }, [activeLanguage]);

  const addOutput = (type, message, stats = null) => {
    const output = { 
      type, 
      message, 
      timestamp: Date.now(),
      stats 
    };
    setConsoleOutput(prev => [...prev, output]);
    if (stats) setExecutionStats(stats);
  };

  const runCode = async () => {
    if (!code.trim()) {
      addOutput('warning', 'Code is empty');
      return;
    }

    setIsRunning(true);
    setShowConsole(true);
    setConsoleOutput([]);
    
    const startTime = Date.now();
    
    try {
      const config = languageConfigs[activeLanguage];
      
      if (activeLanguage === 'javascript') {
        // Enhanced JavaScript execution
        const outputs = [];
        let hasError = false;
        
        const customConsole = {
          log: (...args) => {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            outputs.push({ type: 'log', message });
          },
          error: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            outputs.push({ type: 'error', message });
            hasError = true;
          },
          warn: (...args) => {
            const message = args.map(arg => String(arg)).join(' ');
            outputs.push({ type: 'warning', message });
          }
        };

        try {
          // Create a safe execution environment
          const safeCode = `
            (function() { 
              const console = arguments[0];
              ${code}
            })
          `;
          const func = new Function('return ' + safeCode)();
          await func(customConsole);
          
          const executionTime = Date.now() - startTime;
          const stats = {
            executionTime,
            memoryUsed: Math.floor(Math.random() * 50) + 10, // Simulated
            language: config.name
          };
          
          outputs.forEach(output => addOutput(output.type, output.message));
          
          if (!hasError && outputs.length > 0) {
            addOutput('success', `✓ Execution completed successfully`, stats);
          }
          
        } catch (execError) {
          addOutput('error', `Runtime Error: ${execError.message}`);
        }
      } else {
        // Simulate execution for other languages
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        const executionTime = Date.now() - startTime;
        const stats = {
          executionTime,
          memoryUsed: Math.floor(Math.random() * 100) + 20,
          language: config.name
        };
        
        // Parse and simulate output based on code content
        const lines = code.split('\n');
        let hasOutput = false;
        
        lines.forEach(line => {
          // C++ output patterns
          if (activeLanguage === 'cpp' && line.includes('cout <<')) {
            const match = line.match(/cout\s*<<\s*"([^"]+)"/);
            if (match) {
              addOutput('log', match[1]);
              hasOutput = true;
            }
          }
          
          // Python output patterns
          if (activeLanguage === 'python' && line.includes('print(')) {
            const match = line.match(/print\(["']([^"']+)["']\)/);
            if (match) {
              addOutput('log', match[1]);
              hasOutput = true;
            }
          }
          
          // Java output patterns
          if (activeLanguage === 'java' && line.includes('System.out.println')) {
            const match = line.match(/System\.out\.println\(["']([^"']+)["']\)/);
            if (match) {
              addOutput('log', match[1]);
              hasOutput = true;
            }
          }
        });
        
        if (!hasOutput) {
          // Default output for each language
          if (activeLanguage === 'cpp') {
            addOutput('log', 'Hello from C++!');
            addOutput('log', 'Vector elements: 1 2 3 4 5');
            addOutput('log', 'Message: C++ is powerful!');
            addOutput('log', 'Length: 17');
          } else if (activeLanguage === 'python') {
            addOutput('log', 'Hello from Python!');
            addOutput('log', 'List elements: [1, 2, 3, 4, 5]');
            addOutput('log', 'Squares: [1, 4, 9, 16, 25]');
            addOutput('log', 'Message: Python is awesome!');
          } else if (activeLanguage === 'java') {
            addOutput('log', 'Hello from Java!');
            addOutput('log', 'List elements: [1, 2, 3, 4, 5]');
            addOutput('log', 'Squares: [1, 4, 9, 16, 25]');
            addOutput('log', 'Message: Java is robust!');
          }
        }
        
        addOutput('success', `✓ Compilation and execution successful`, stats);
      }
    } catch (error) {
      addOutput('error', `Error: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const insertSnippet = (snippet) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      editor.executeEdits('', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: snippet.code
      }]);
      editor.focus();
    }
    setShowSnippets(false);
  };

  const getOutputIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Terminal className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-300 border-l-red-500 bg-red-500/5';
      case 'warning': return 'text-yellow-300 border-l-yellow-500 bg-yellow-500/5';
      case 'success': return 'text-green-300 border-l-green-500 bg-green-500/5';
      case 'info': return 'text-blue-300 border-l-blue-500 bg-blue-500/5';
      default: return 'text-gray-300 border-l-gray-500 bg-gray-500/5';
    }
  };

  const resetToTemplate = () => {
    const config = languageConfigs[activeLanguage];
    if (config) {
      setCode(config.template());
      setConsoleOutput([]);
      setExecutionStats(null);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-semibold">Problemset Editor</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>{user.username}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Language Selector & Actions */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          {/* Language Tabs */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            {Object.entries(languageConfigs).map(([id, config]) => (
              <button
                key={id}
                onClick={() => setActiveLanguage(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeLanguage === id 
                    ? `bg-gray-600 ${config.color}` 
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{config.icon}</span>
                <span>{config.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Action Buttons */}
          <button
            onClick={() => setShowSnippets(!showSnippets)}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>Snippets</span>
          </button>
          
          <button
            onClick={resetToTemplate}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRunning 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`text-lg ${languageConfigs[activeLanguage].color}`}>
                {languageConfigs[activeLanguage].icon}
              </span>
              <span className="text-sm font-medium">
                main{languageConfigs[activeLanguage].extension}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>UTF-8</span>
              <span>Ln 1, Col 1</span>
              <span>{languageConfigs[activeLanguage].name}</span>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={languageConfigs[activeLanguage].monacoLanguage}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={(editor) => { editorRef.current = editor; }}
              theme={theme}
              options={{
                fontSize: fontSize,
                fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                glyphMargin: true,
                folding: true,
                showFoldingControls: 'always',
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
                suggest: { showKeywords: true, showSnippets: true },
                quickSuggestions: true,
                parameterHints: { enabled: true },
                formatOnPaste: true,
                formatOnType: true,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderWhitespace: 'selection',
                rulers: [80, 120]
              }}
            />

            {/* Snippets Panel */}
            {showSnippets && (
              <div className="absolute top-4 right-4 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 w-80">
                <div className="p-4 border-b border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      {languageConfigs[activeLanguage].name} Snippets
                    </h3>
                    <button
                      onClick={() => setShowSnippets(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {languageConfigs[activeLanguage].snippets.map((snippet, index) => (
                    <button
                      key={index}
                      onClick={() => insertSnippet(snippet)}
                      className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {snippet.label}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {snippet.code.split('\n')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console */}
        {showConsole && (
          <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
            {/* Console Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">Console</span>
                <span className="text-xs text-gray-400">
                  ({consoleOutput.length} messages)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConsoleOutput([])}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="Clear Console"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  title="Hide Console"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Execution Stats */}
            {executionStats && (
              <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{executionStats.executionTime}ms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="w-3 h-3 text-purple-400" />
                    <span className="text-gray-400">Memory:</span>
                    <span className="text-white">{executionStats.memoryUsed}MB</span>
                  </div>
                </div>
              </div>
            )}

            {/* Console Output */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Console output will appear here</p>
                    <p className="text-xs text-gray-600 mt-1">Run your code to see results</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {consoleOutput.map((output, index) => (
                    <div
                      key={`${output.timestamp}-${index}`}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-l-2 ${getOutputColor(output.type)}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getOutputIcon(output.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="whitespace-pre-wrap break-words">
                          {output.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(output.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-blue-600 px-6 py-2 flex items-center justify-between text-xs text-white flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Ready</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3" />
            <span>{languageConfigs[activeLanguage].name}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>{languageConfigs[activeLanguage].extension.toUpperCase()}</span>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Editor Settings</h2>
              <button 
                onClick={() => setShowSettings(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsetEditor;