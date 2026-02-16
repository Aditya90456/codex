import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronDown, Zap, Eye, Code, Terminal } from 'lucide-react';

const RealTimeDryRun = ({ code, language = 'javascript' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [variables, setVariables] = useState({});
  const [executionStack, setExecutionStack] = useState([]);
  const [output, setOutput] = useState([]);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [expandedScopes, setExpandedScopes] = useState(new Set(['global']));
  const intervalRef = useRef(null);

  // Parse and analyze code in real-time
  useEffect(() => {
    if (code && !isRunning) {
      analyzeCode(code);
    }
  }, [code]);

  const analyzeCode = (sourceCode) => {
    try {
      const lines = sourceCode.split('\n').filter(line => line.trim());
      const analysis = {
        lines: lines.length,
        variables: extractVariables(sourceCode),
        functions: extractFunctions(sourceCode),
        loops: extractLoops(sourceCode)
      };
      
      // Initialize variables display
      const initialVars = {};
      analysis.variables.forEach(varName => {
        initialVars[varName] = { value: 'undefined', type: 'undefined', line: 0 };
      });
      setVariables(initialVars);
    } catch (error) {
      console.error('Code analysis error:', error);
    }
  };

  const extractVariables = (code) => {
    const varRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const matches = [];
    let match;
    while ((match = varRegex.exec(code)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)];
  };

  const extractFunctions = (code) => {
    const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const matches = [];
    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  const extractLoops = (code) => {
    const forLoops = (code.match(/for\s*\(/g) || []).length;
    const whileLoops = (code.match(/while\s*\(/g) || []).length;
    return { for: forLoops, while: whileLoops };
  };

  const startDryRun = () => {
    setIsRunning(true);
    setCurrentLine(0);
    setOutput([]);
    setExecutionStack([{ scope: 'global', line: 0 }]);
    
    const lines = code.split('\n').filter(line => line.trim());
    let lineIndex = 0;

    intervalRef.current = setInterval(() => {
      if (lineIndex >= lines.length) {
        stopDryRun();
        return;
      }

      const line = lines[lineIndex].trim();
      setCurrentLine(lineIndex);
      
      // Simulate execution
      executeLine(line, lineIndex);
      
      lineIndex++;
    }, speed);
  };

  const executeLine = (line, lineNum) => {
    // Variable declaration
    if (line.match(/(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/)) {
      const match = line.match(/(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/);
      const varName = match[1];
      const value = match[2].replace(/;/g, '').trim();
      
      setVariables(prev => ({
        ...prev,
        [varName]: {
          value: evaluateValue(value),
          type: typeof evaluateValue(value),
          line: lineNum
        }
      }));
    }

    // Variable update
    if (line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/) && !line.includes('let') && !line.includes('const') && !line.includes('var')) {
      const match = line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/);
      const varName = match[1];
      const value = match[2].replace(/;/g, '').trim();
      
      setVariables(prev => ({
        ...prev,
        [varName]: {
          ...prev[varName],
          value: evaluateValue(value, prev),
          line: lineNum
        }
      }));
    }

    // Console.log
    if (line.includes('console.log')) {
      const match = line.match(/console\.log\((.+)\)/);
      if (match) {
        const content = match[1].replace(/['"]/g, '');
        setOutput(prev => [...prev, { line: lineNum, content, type: 'log' }]);
      }
    }

    // Function call
    if (line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/)) {
      const match = line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      const funcName = match[1];
      if (funcName !== 'console') {
        setExecutionStack(prev => [...prev, { scope: funcName, line: lineNum }]);
      }
    }

    // Return statement
    if (line.includes('return')) {
      setExecutionStack(prev => prev.slice(0, -1));
    }
  };

  const evaluateValue = (expr, vars = {}) => {
    try {
      // Simple evaluation for demo
      if (expr.match(/^\d+$/)) return parseInt(expr);
      if (expr.match(/^\d+\.\d+$/)) return parseFloat(expr);
      if (expr.match(/^["'].*["']$/)) return expr.replace(/["']/g, '');
      if (expr === 'true') return true;
      if (expr === 'false') return false;
      if (expr === 'null') return null;
      
      // Variable reference
      if (vars[expr]) return vars[expr].value;
      
      // Simple arithmetic
      if (expr.match(/[\+\-\*\/]/)) {
        const parts = expr.split(/[\+\-\*\/]/);
        const operator = expr.match(/[\+\-\*\/]/)[0];
        const left = evaluateValue(parts[0].trim(), vars);
        const right = evaluateValue(parts[1].trim(), vars);
        
        switch (operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          default: return expr;
        }
      }
      
      return expr;
    } catch {
      return expr;
    }
  };

  const stopDryRun = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetDryRun = () => {
    stopDryRun();
    setCurrentLine(0);
    setVariables({});
    setExecutionStack([]);
    setOutput([]);
    analyzeCode(code);
  };

  const toggleScope = (scope) => {
    setExpandedScopes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scope)) {
        newSet.delete(scope);
      } else {
        newSet.add(scope);
      }
      return newSet;
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'number': return 'text-blue-400';
      case 'string': return 'text-green-400';
      case 'boolean': return 'text-purple-400';
      case 'object': return 'text-orange-400';
      case 'undefined': return 'text-gray-400';
      default: return 'text-gray-300';
    }
  };

  const lines = code ? code.split('\n') : [];

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Real-Time Dry Run</h3>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            Live Execution
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? stopDryRun : startDryRun}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run
              </>
            )}
          </button>

          <button
            onClick={resetDryRun}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Speed Control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Left: Code with Execution Pointer */}
        <div className="flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Code Execution</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 py-1 px-2 rounded transition-all ${
                  index === currentLine && isRunning
                    ? 'bg-yellow-500/20 border-l-4 border-yellow-500'
                    : index < currentLine && isRunning
                    ? 'bg-green-500/10'
                    : ''
                }`}
              >
                <span className="text-gray-500 w-8 text-right">{index + 1}</span>
                {index === currentLine && isRunning && (
                  <ChevronRight className="w-4 h-4 text-yellow-400 animate-pulse" />
                )}
                <code className="text-gray-300">{line || ' '}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Variables & Output */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Execution Stack */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Call Stack</span>
            </div>
            <div className="p-4 space-y-2">
              {executionStack.length > 0 ? (
                executionStack.map((frame, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-300 font-medium">{frame.scope}</span>
                    <span className="text-gray-400 text-xs ml-auto">Line {frame.line + 1}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No active calls</p>
              )}
            </div>
          </div>

          {/* Variables */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <button
              onClick={() => toggleScope('global')}
              className="w-full flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors"
            >
              {expandedScopes.has('global') ? (
                <ChevronDown className="w-4 h-4 text-blue-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm font-medium text-gray-300">Variables</span>
              <span className="ml-auto text-xs text-gray-500">
                {Object.keys(variables).length} items
              </span>
            </button>
            {expandedScopes.has('global') && (
              <div className="p-4 space-y-2">
                {Object.keys(variables).length > 0 ? (
                  Object.entries(variables).map(([name, data]) => (
                    <div
                      key={name}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        data.line === currentLine && isRunning
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300 font-medium">{name}</span>
                        <span className="text-gray-500 text-xs">:</span>
                        <span className={`text-xs ${getTypeColor(data.type)}`}>
                          {data.type}
                        </span>
                      </div>
                      <span className="text-gray-300 font-mono text-sm">
                        {typeof data.value === 'string' ? `"${data.value}"` : String(data.value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No variables yet</p>
                )}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Console Output</span>
            </div>
            <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
              {output.length > 0 ? (
                output.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 px-3 py-2 bg-gray-700/50 rounded font-mono text-sm"
                  >
                    <span className="text-gray-500">›</span>
                    <span className="text-green-300">{log.content}</span>
                    <span className="text-gray-500 text-xs ml-auto">L{log.line + 1}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No output yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDryRun;
