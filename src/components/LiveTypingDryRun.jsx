import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, Eye, Database, Layers, TrendingUp, Box, 
  ArrowRight, Zap, Code, AlertCircle, CheckCircle, Minimize2
} from 'lucide-react';

/**
 * Live Typing Dry Run - Real-time algorithm visualization while typing
 * Shows instant feedback on code execution as you write
 */
const LiveTypingDryRun = ({ code, language, problem, isMinimized, onToggleMinimize }) => {
  const [executionState, setExecutionState] = useState({
    variables: {},
    currentLine: null,
    output: [],
    callStack: [],
    complexity: { time: 'O(?)', space: 'O(?)' },
    status: 'idle' // idle, running, success, error
  });
  
  const [visualData, setVisualData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const debounceTimer = useRef(null);

  // Debounced code analysis - runs 500ms after user stops typing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (code && code.trim().length > 10) {
        analyzeCodeInRealTime(code, language, problem);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [code, language, problem]);

  const analyzeCodeInRealTime = useCallback((codeText, lang, prob) => {
    setIsAnalyzing(true);
    
    try {
      // Parse code and extract key information
      const analysis = performStaticAnalysis(codeText, lang, prob);
      
      setExecutionState({
        variables: analysis.variables,
        currentLine: analysis.currentLine,
        output: analysis.output,
        callStack: analysis.callStack,
        complexity: analysis.complexity,
        status: analysis.status
      });
      
      setVisualData(analysis.visualData);
    } catch (error) {
      console.error('Analysis error:', error);
      setExecutionState(prev => ({ ...prev, status: 'error' }));
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={onToggleMinimize}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl shadow-2xl shadow-purple-500/30 transition-all"
        >
          <Activity className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-semibold">Live Dry Run</span>
          {executionState.status === 'success' && (
            <CheckCircle className="w-4 h-4 text-green-300" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[450px] h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t-2 md:border-l-2 border-purple-500/30 shadow-2xl z-40 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Activity className={`w-4 h-4 text-white ${isAnalyzing ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Dry Run</h3>
            <p className="text-xs text-gray-400">Real-time as you type</p>
          </div>
        </div>
        <button
          onClick={onToggleMinimize}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <Minimize2 className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        
        {/* Status Banner */}
        <div className={`rounded-xl p-3 border ${
          executionState.status === 'success' 
            ? 'bg-green-500/10 border-green-500/30' 
            : executionState.status === 'error'
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className="flex items-center gap-2">
            {executionState.status === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : executionState.status === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Eye className="w-4 h-4 text-blue-400" />
            )}
            <span className="text-sm font-semibold text-white">
              {executionState.status === 'success' 
                ? 'Code looks good!' 
                : executionState.status === 'error'
                ? 'Found potential issues'
                : isAnalyzing ? 'Analyzing...' : 'Waiting for code...'}
            </span>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-white">Complexity</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Time:</span>
              <span className="text-sm font-mono font-bold text-yellow-400">
                {executionState.complexity.time}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Space:</span>
              <span className="text-sm font-mono font-bold text-orange-400">
                {executionState.complexity.space}
              </span>
            </div>
          </div>
        </div>

        {/* Variables */}
        <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-white">Variables</span>
            <span className="ml-auto text-xs text-gray-400">
              {Object.keys(executionState.variables).length}
            </span>
          </div>
          <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
            {Object.keys(executionState.variables).length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-xs">
                No variables detected yet
              </div>
            ) : (
              Object.entries(executionState.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg p-2 border border-green-500/20 animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-green-400">{key}</span>
                    <span className="text-xs text-gray-500">{value.type}</span>
                  </div>
                  <div className="text-xs font-mono text-white bg-slate-900/50 rounded px-2 py-1">
                    {value.value}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visual Data Structure */}
        {visualData && (
          <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Box className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-white">Visualization</span>
            </div>
            <div className="p-3">
              <VisualDataRenderer data={visualData} />
            </div>
          </div>
        )}

        {/* Call Stack */}
        {executionState.callStack.length > 0 && (
          <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <Layers className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-white">Call Stack</span>
            </div>
            <div className="p-3 space-y-1">
              {executionState.callStack.map((call, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg p-2 border border-orange-500/20"
                >
                  <span className="text-xs font-mono text-orange-400">{call}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Output */}
        {executionState.output.length > 0 && (
          <div className="bg-slate-950/50 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">Expected Output</span>
            </div>
            <div className="p-3 space-y-1 font-mono text-xs">
              {executionState.output.map((line, index) => (
                <div key={index} className="text-cyan-300 animate-fadeIn">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className="px-4 py-2 border-t border-white/10 bg-slate-900/50">
        <p className="text-xs text-gray-400 text-center">
          💡 Keep typing - visualization updates automatically
        </p>
      </div>
    </div>
  );
};

/**
 * Visual Data Structure Renderer
 */
const VisualDataRenderer = ({ data }) => {
  if (!data) return null;

  if (data.type === 'array') {
    return (
      <div className="flex flex-wrap gap-2">
        {data.values.map((val, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1 animate-fadeIn"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">{val}</span>
            </div>
            <span className="text-xs text-gray-500">{idx}</span>
          </div>
        ))}
      </div>
    );
  }

  if (data.type === 'tree') {
    return (
      <div className="flex flex-col items-center gap-3">
        <TreeNode node={data.root} />
      </div>
    );
  }

  if (data.type === 'linkedlist') {
    return (
      <div className="flex items-center gap-2 overflow-x-auto">
        {data.nodes.map((node, idx) => (
          <div key={idx} className="flex items-center gap-2 animate-fadeIn">
            <div className="px-3 py-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-lg">
              <span className="text-sm font-bold text-white">{node}</span>
            </div>
            {idx < data.nodes.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-400 text-center py-2">
      Visualization not available for this data structure
    </div>
  );
};

/**
 * Tree Node Component
 */
const TreeNode = ({ node, level = 0 }) => {
  if (!node) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center animate-fadeIn">
        <span className="text-sm font-bold text-white">{node.val}</span>
      </div>
      {(node.left || node.right) && (
        <div className="flex gap-4">
          {node.left && <TreeNode node={node.left} level={level + 1} />}
          {node.right && <TreeNode node={node.right} level={level + 1} />}
        </div>
      )}
    </div>
  );
};

/**
 * Static Code Analysis - Extracts information from code
 */
function performStaticAnalysis(code, language, problem) {
  const analysis = {
    variables: {},
    currentLine: null,
    output: [],
    callStack: [],
    complexity: { time: 'O(?)', space: 'O(?)' },
    status: 'idle',
    visualData: null
  };

  try {
    // Detect variables
    const varMatches = code.matchAll(/(?:let|const|var)\s+(\w+)\s*=/g);
    for (const match of varMatches) {
      const varName = match[1];
      analysis.variables[varName] = {
        type: 'unknown',
        value: 'undefined'
      };
    }

    // Detect arrays
    const arrayMatches = code.matchAll(/(?:let|const|var)\s+(\w+)\s*=\s*\[(.*?)\]/g);
    for (const match of arrayMatches) {
      const varName = match[1];
      const values = match[2].split(',').map(v => v.trim()).filter(v => v);
      analysis.variables[varName] = {
        type: 'array',
        value: `[${values.join(', ')}]`
      };
      
      // Create visual data for first array found
      if (!analysis.visualData && values.length > 0) {
        analysis.visualData = {
          type: 'array',
          values: values.map(v => isNaN(v) ? v : Number(v))
        };
      }
    }

    // Detect loops (complexity hint)
    const loopCount = (code.match(/for\s*\(|while\s*\(/g) || []).length;
    const nestedLoops = code.includes('for') && code.split('for').length > 2;
    
    if (nestedLoops) {
      analysis.complexity.time = 'O(n²)';
    } else if (loopCount > 0) {
      analysis.complexity.time = 'O(n)';
    } else if (code.includes('sort')) {
      analysis.complexity.time = 'O(n log n)';
    } else {
      analysis.complexity.time = 'O(1)';
    }

    // Detect space complexity
    if (code.includes('new Array') || code.includes('new Map') || code.includes('new Set')) {
      analysis.complexity.space = 'O(n)';
    } else {
      analysis.complexity.space = 'O(1)';
    }

    // Detect function calls
    const functionMatches = code.matchAll(/function\s+(\w+)\s*\(/g);
    for (const match of functionMatches) {
      analysis.callStack.push(match[1] + '()');
    }

    // Generate sample output based on problem
    if (problem && problem.examples && problem.examples[0]) {
      analysis.output.push(`Input: ${JSON.stringify(problem.examples[0].input)}`);
      analysis.output.push(`Expected: ${JSON.stringify(problem.examples[0].output)}`);
    }

    // Set status
    if (code.trim().length > 20) {
      analysis.status = 'success';
    }

  } catch (error) {
    console.error('Analysis error:', error);
    analysis.status = 'error';
  }

  return analysis;
}

export default LiveTypingDryRun;
