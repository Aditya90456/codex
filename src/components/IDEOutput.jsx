import { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Play,
  Square,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Code,
  FileText,
  Bug,
  Info,
  Trash2,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';

const IDEOutput = ({ 
  isVisible = true, 
  onToggle, 
  onExecute, 
  isExecuting = false,
  language = 'javascript',
  outputs = [],
  onClearOutput
}) => {
  const [activeTab, setActiveTab] = useState('console');
  const [isMaximized, setIsMaximized] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const outputRef = useRef(null);
  const searchInputRef = useRef(null);

  const tabs = [
    { id: 'console', label: 'Console', icon: Terminal, count: outputs.length },
    { id: 'problems', label: 'Problems', icon: Bug, count: outputs.filter(o => o.type === 'error').length },
    { id: 'output', label: 'Output', icon: FileText, count: outputs.filter(o => o.type === 'log').length },
    { id: 'debug', label: 'Debug', icon: Code, count: 0 }
  ];

  const filterOptions = [
    { id: 'all', label: 'All', icon: FileText },
    { id: 'log', label: 'Logs', icon: Info },
    { id: 'error', label: 'Errors', icon: XCircle },
    { id: 'warning', label: 'Warnings', icon: AlertCircle },
    { id: 'success', label: 'Success', icon: CheckCircle }
  ];

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs, autoScroll]);

  // Sample code snippets for different languages
  const codeSnippets = {
    javascript: [
      {
        name: 'Array Methods',
        code: `// Common array operations
const arr = [1, 2, 3, 4, 5];

// Map, filter, reduce
const doubled = arr.map(x => x * 2);
const evens = arr.filter(x => x % 2 === 0);
const sum = arr.reduce((acc, x) => acc + x, 0);

console.log('Doubled:', doubled);
console.log('Evens:', evens);
console.log('Sum:', sum);`
      },
      {
        name: 'Async/Await',
        code: `// Async function example
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log('Data:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchData();`
      },
      {
        name: 'Object Destructuring',
        code: `// Object destructuring examples
const user = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    address: { city: 'New York', country: 'USA' }
};

// Basic destructuring
const { name, age } = user;

// Nested destructuring
const { address: { city } } = user;

// With default values
const { phone = 'N/A' } = user;

console.log(\`\${name}, \${age}, from \${city}\`);`
      }
    ],
    python: [
      {
        name: 'List Comprehensions',
        code: `# List comprehension examples
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Basic list comprehension
squares = [x**2 for x in numbers]

# With condition
evens = [x for x in numbers if x % 2 == 0]

# Nested comprehension
matrix = [[i*j for j in range(3)] for i in range(3)]

print("Squares:", squares)
print("Evens:", evens)
print("Matrix:", matrix)`
      },
      {
        name: 'Dictionary Operations',
        code: `# Dictionary operations
data = {'a': 1, 'b': 2, 'c': 3}

# Dictionary comprehension
squared = {k: v**2 for k, v in data.items()}

# Merging dictionaries
extra = {'d': 4, 'e': 5}
merged = {**data, **extra}

# Get with default
value = data.get('x', 'default')

print("Original:", data)
print("Squared:", squared)
print("Merged:", merged)`
      }
    ]
  };

  const clearOutput = () => {
    if (onClearOutput) {
      onClearOutput();
    }
  };

  const executeCode = () => {
    if (onExecute) {
      onExecute();
    }
  };

  const stopExecution = () => {
    // Add stop functionality if needed
    console.log('Stop execution requested');
  };

  const insertSnippet = (snippet) => {
    // This could trigger a callback to insert code into the editor
    console.log('Insert snippet:', snippet.name);
    // For now, just show in output
    console.log('Snippet code:', snippet.code);
  };

  const filteredOutputs = outputs.filter(output => {
    const matchesFilter = filter === 'all' || output.type === filter;
    const matchesSearch = !searchTerm || 
      output.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getOutputIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Terminal className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOutputColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-300 border-l-red-500';
      case 'warning': return 'text-yellow-300 border-l-yellow-500';
      case 'success': return 'text-green-300 border-l-green-500';
      case 'info': return 'text-blue-300 border-l-blue-500';
      default: return 'text-gray-300 border-l-gray-500';
    }
  };

  if (!isVisible) {
    return (
      <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-center">
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Show Output Panel
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900 border-t border-gray-700 flex flex-col ${
      isMaximized ? 'h-screen' : 'h-80'
    }`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left - Tabs */}
          <div className="flex items-center space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right - Controls */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search output..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white text-xs pl-7 pr-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-32"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {filterOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Execution Controls */}
            <div className="flex items-center space-x-1 border-l border-gray-600 pl-2">
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className={`p-1 rounded transition-colors ${
                  isExecuting
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-green-400 hover:text-green-300 hover:bg-gray-700'
                }`}
                title="Run Code"
              >
                <Play size={14} />
              </button>
              
              <button
                onClick={stopExecution}
                disabled={!isExecuting}
                className={`p-1 rounded transition-colors ${
                  !isExecuting
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-red-400 hover:text-red-300 hover:bg-gray-700'
                }`}
                title="Stop Execution"
              >
                <Square size={14} />
              </button>
            </div>

            {/* Panel Controls */}
            <div className="flex items-center space-x-1 border-l border-gray-600 pl-2">
              <button
                onClick={clearOutput}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Clear Output"
              >
                <Trash2 size={14} />
              </button>
              
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              
              <button
                onClick={onToggle}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                title="Hide Panel"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Output Area */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'console' && (
            <div className="flex-1 flex flex-col">
              {/* Output List */}
              <div 
                ref={outputRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm"
              >
                {filteredOutputs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Terminal size={48} className="mb-4 opacity-50" />
                    <p className="text-sm">No output yet</p>
                    <p className="text-xs mt-1">Run your code to see results here</p>
                  </div>
                ) : (
                  filteredOutputs.map((output, index) => (
                    <div
                      key={`${output.timestamp}-${index}`}
                      className={`flex items-start space-x-3 p-2 rounded border-l-2 ${getOutputColor(output.type)} bg-gray-800/30`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getOutputIcon(output.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="whitespace-pre-wrap break-words">
                          {output.message}
                        </div>
                        {output.details && (
                          <div className="mt-1 text-xs text-gray-400">
                            {output.details}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {output.timestamp ? new Date(output.timestamp).toLocaleTimeString() : ''}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Status Bar */}
              <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>{filteredOutputs.length} messages</span>
                  {isExecuting && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-400">Executing...</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="w-3 h-3"
                    />
                    <span>Auto-scroll</span>
                  </label>
                  <span>Language: {language}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="flex-1 p-4">
              <div className="text-center py-12">
                <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Problems</h3>
                <p className="text-gray-400">Your code looks good! No errors or warnings found.</p>
              </div>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {outputs.filter(o => o.type === 'log').map((output, index) => (
                  <div key={`${output.timestamp}-${index}`} className="bg-gray-800 p-3 rounded font-mono text-sm">
                    <div className="text-gray-300">{output.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {output.timestamp ? new Date(output.timestamp).toLocaleTimeString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="flex-1 p-4">
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Debug Console</h3>
                <p className="text-gray-400">Debug information will appear here when available.</p>
              </div>
            </div>
          )}
        </div>

        {/* Code Snippets Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Code size={16} />
              <span>Code Snippets</span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {codeSnippets[language]?.map((snippet, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{snippet.name}</h4>
                    <button
                      onClick={() => insertSnippet(snippet)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                    >
                      Insert
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{snippet.code.substring(0, 200)}...</code>
                  </pre>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No snippets available for {language}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDEOutput;