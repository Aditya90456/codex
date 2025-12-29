import { useState } from 'react';
import IDEOutput from './IDEOutput';
import { 
  Code, 
  Play, 
  ArrowLeft, 
  Zap,
  Terminal,
  FileText,
  Lightbulb
} from 'lucide-react';

const IDEDemo = ({ onBack }) => {
  const [outputs, setOutputs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const sampleOutputs = [
    {
      type: 'info',
      message: '🚀 Starting code execution...',
      timestamp: Date.now() - 5000
    },
    {
      type: 'log',
      message: 'Hello, World!',
      timestamp: Date.now() - 4000
    },
    {
      type: 'log',
      message: 'Processing array: [1, 2, 3, 4, 5]',
      timestamp: Date.now() - 3000
    },
    {
      type: 'log',
      message: 'Filtered results: [2, 4]',
      timestamp: Date.now() - 2000
    },
    {
      type: 'warning',
      message: 'Deprecated function used: Array.prototype.find()',
      timestamp: Date.now() - 1500
    },
    {
      type: 'success',
      message: '✅ Code executed successfully in 1.2s',
      timestamp: Date.now() - 1000
    }
  ];

  const handleExecute = () => {
    setIsExecuting(true);
    setOutputs([]);
    
    // Simulate code execution with progressive output
    setTimeout(() => {
      setOutputs([sampleOutputs[0]]);
    }, 200);
    
    setTimeout(() => {
      setOutputs(prev => [...prev, sampleOutputs[1]]);
    }, 800);
    
    setTimeout(() => {
      setOutputs(prev => [...prev, sampleOutputs[2]]);
    }, 1200);
    
    setTimeout(() => {
      setOutputs(prev => [...prev, sampleOutputs[3]]);
    }, 1600);
    
    setTimeout(() => {
      setOutputs(prev => [...prev, sampleOutputs[4]]);
    }, 2000);
    
    setTimeout(() => {
      setOutputs(prev => [...prev, sampleOutputs[5]]);
      setIsExecuting(false);
    }, 2400);
  };

  const handleClearOutput = () => {
    setOutputs([]);
  };

  const demoCode = `// Array processing example
const numbers = [1, 2, 3, 4, 5];

console.log('Processing array:', numbers);

// Filter even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log('Filtered results:', evens);

// Using deprecated method (triggers warning)
const found = numbers.find(n => n > 3);

console.log('✅ Code executed successfully');`;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">IDE Output Demo</h1>
              <p className="text-gray-400">Professional IDE-style output panel with advanced features</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isExecuting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Run Demo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Code Editor Area */}
        <div className="flex-1 bg-gray-900 p-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
            {/* Editor Header */}
            <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-300">demo.js</span>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="p-6 h-full overflow-auto">
              <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                <code>{demoCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>IDE Features</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Terminal className="w-5 h-5 text-green-400" />
                <h4 className="font-medium">Advanced Console</h4>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Multiple output tabs</li>
                <li>• Real-time filtering</li>
                <li>• Search functionality</li>
                <li>• Auto-scroll control</li>
                <li>• Execution timing</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Code className="w-5 h-5 text-purple-400" />
                <h4 className="font-medium">Code Snippets</h4>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Language-specific snippets</li>
                <li>• Quick insertion</li>
                <li>• Common patterns</li>
                <li>• Best practices</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium">Output Management</h4>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Categorized messages</li>
                <li>• Timestamp tracking</li>
                <li>• Error highlighting</li>
                <li>• Performance metrics</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h4 className="font-medium">Smart Features</h4>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Execution control</li>
                <li>• Memory usage tracking</li>
                <li>• Debug information</li>
                <li>• Problem detection</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-medium text-blue-300 mb-2">Try It Out!</h4>
            <p className="text-sm text-blue-200">
              Click "Run Demo" to see the IDE output panel in action with real-time 
              code execution simulation.
            </p>
          </div>
        </div>
      </div>

      {/* IDE Output Panel */}
      <IDEOutput
        isVisible={showOutput}
        onToggle={() => setShowOutput(!showOutput)}
        onExecute={handleExecute}
        isExecuting={isExecuting}
        language="javascript"
        outputs={outputs}
        onClearOutput={handleClearOutput}
      />
    </div>
  );
};

export default IDEDemo;