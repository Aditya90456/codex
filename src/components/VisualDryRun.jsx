import { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, 
  Zap, Activity, Box, ArrowRight, CheckCircle, XCircle,
  Eye, Code, Database, Layers, TrendingUp, AlertCircle
} from 'lucide-react';

/**
 * Visual Dry Run Component with Step-by-Step Execution Visualization
 * Shows code execution line by line with variable tracking and animations
 */
const VisualDryRun = ({ code, language, problem, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [executionSteps, setExecutionSteps] = useState([]);
  const [variables, setVariables] = useState({});
  const [callStack, setCallStack] = useState([]);
  const [output, setOutput] = useState([]);
  const [highlightedLine, setHighlightedLine] = useState(null);

  // Parse code and generate execution steps
  useEffect(() => {
    if (code) {
      const steps = parseCodeToSteps(code, language, problem);
      setExecutionSteps(steps);
    }
  }, [code, language, problem]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < executionSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= executionSteps.length - 1) {
            setIsPlaying(false);
          }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, executionSteps.length, speed]);

  // Update state based on current step
  useEffect(() => {
    if (executionSteps[currentStep]) {
      const step = executionSteps[currentStep];
      setHighlightedLine(step.line);
      setVariables(step.variables || {});
      setCallStack(step.callStack || []);
      if (step.output) {
        setOutput(prev => [...prev, step.output]);
      }
    }
  }, [currentStep, executionSteps]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setVariables({});
    setCallStack([]);
    setOutput([]);
    setHighlightedLine(null);
  };

  const codeLines = code.split('\n');
  const currentStepData = executionSteps[currentStep] || {};

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-purple-500/30 w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl shadow-purple-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Visual Dry Run</h2>
              <p className="text-sm text-gray-400">Step-by-step code execution visualization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <XCircle className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden">
          
          {/* Left Panel - Code Visualization */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Code Editor with Line Highlighting */}
            <div className="flex-1 bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Code Execution</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Line {highlightedLine || 1}</span>
                  <span>•</span>
                  <span>Step {currentStep + 1}/{executionSteps.length}</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      highlightedLine === index + 1
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500 scale-105 shadow-lg shadow-purple-500/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-8 text-right select-none ${
                      highlightedLine === index + 1 ? 'text-purple-400 font-bold' : 'text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`flex-1 ${
                      highlightedLine === index + 1 ? 'text-white font-semibold' : 'text-gray-300'
                    }`}>
                      {line || ' '}
                    </span>
                    {highlightedLine === index + 1 && (
                      <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Description */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-1">Current Step</h3>
                  <p className="text-sm text-gray-300">
                    {currentStepData.description || 'Waiting to start execution...'}
                  </p>
                  {currentStepData.explanation && (
                    <p className="text-xs text-gray-400 mt-2 italic">
                      💡 {currentStepData.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - State Visualization */}
          <div className="w-96 flex flex-col gap-4">
            
            {/* Variables */}
            <div className="bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden flex-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                <Database className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Variables</span>
                <span className="ml-auto text-xs text-gray-400">{Object.keys(variables).length} vars</span>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto max-h-64">
                {Object.keys(variables).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No variables yet
                  </div>
                ) : (
                  Object.entries(variables).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg p-3 border border-green-500/20 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono font-semibold text-green-400">{key}</span>
                        <span className="text-xs text-gray-500">{typeof value}</span>
                      </div>
                      <div className="text-sm font-mono text-white bg-slate-900/50 rounded px-2 py-1">
                        {JSON.stringify(value, null, 2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Call Stack */}
            <div className="bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-white">Call Stack</span>
                <span className="ml-auto text-xs text-gray-400">{callStack.length} calls</span>
              </div>
              <div className="p-4 space-y-2 overflow-y-auto max-h-32">
                {callStack.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Empty stack
                  </div>
                ) : (
                  callStack.map((call, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg p-2 border border-orange-500/20"
                    >
                      <span className="text-sm font-mono text-orange-400">{call}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Output */}
            <div className="bg-slate-950/50 rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">Output</span>
              </div>
              <div className="p-4 space-y-1 overflow-y-auto max-h-32 font-mono text-sm">
                {output.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    No output yet
                  </div>
                ) : (
                  output.map((line, index) => (
                    <div key={index} className="text-cyan-300 animate-fadeIn">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t border-white/10 p-6 bg-slate-900/50">
          <div className="flex items-center justify-between">
            
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-xl transition-all shadow-lg"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous Step"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all shadow-lg shadow-purple-500/30 scale-110"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentStep >= executionSteps.length - 1}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next Step"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Progress</span>
                <span className="text-xs text-gray-400">
                  {Math.round((currentStep / (executionSteps.length - 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(currentStep / (executionSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Speed Control */}
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              >
                <option value={2000}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={500}>2x</option>
                <option value={250}>4x</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Parse code into execution steps for visualization
 */
function parseCodeToSteps(code, language, problem) {
  const steps = [];
  const lines = code.split('\n').filter(line => line.trim());
  
  // Example: Two Sum problem simulation
  if (problem.title.toLowerCase().includes('two sum')) {
    const testInput = [2, 7, 11, 15];
    const target = 9;
    
    steps.push({
      line: 1,
      description: 'Function called with nums=[2,7,11,15] and target=9',
      explanation: 'Starting execution of twoSum function',
      variables: { nums: testInput, target: target },
      callStack: ['twoSum(nums, target)']
    });
    
    steps.push({
      line: 2,
      description: 'Initialize empty hash map',
      explanation: 'We use a hash map to store numbers we\'ve seen',
      variables: { nums: testInput, target: target, map: {} },
      callStack: ['twoSum(nums, target)']
    });
    
    // Simulate loop iterations
    testInput.forEach((num, i) => {
      steps.push({
        line: 4,
        description: `Loop iteration ${i + 1}: checking nums[${i}] = ${num}`,
        explanation: `Looking for complement ${target - num}`,
        variables: { 
          nums: testInput, 
          target: target, 
          map: Object.fromEntries(testInput.slice(0, i).map((n, idx) => [n, idx])),
          i: i,
          num: num,
          complement: target - num
        },
        callStack: ['twoSum(nums, target)', `iteration ${i}`]
      });
      
      if (i === 1) {
        steps.push({
          line: 6,
          description: `Found complement ${target - num} at index 0!`,
          explanation: `nums[0] + nums[1] = ${testInput[0]} + ${num} = ${target}`,
          variables: { 
            nums: testInput, 
            target: target, 
            map: { [testInput[0]]: 0 },
            i: i,
            result: [0, i]
          },
          callStack: ['twoSum(nums, target)'],
          output: `[0, ${i}]`
        });
      }
    });
    
    steps.push({
      line: 10,
      description: 'Return result [0, 1]',
      explanation: 'Successfully found two numbers that add up to target',
      variables: { result: [0, 1] },
      callStack: [],
      output: '[0, 1]'
    });
  } else {
    // Generic step generation for other problems
    lines.forEach((line, index) => {
      steps.push({
        line: index + 1,
        description: `Executing: ${line.trim()}`,
        explanation: 'Processing this line of code',
        variables: {},
        callStack: ['main()']
      });
    });
  }
  
  return steps;
}

export default VisualDryRun;
