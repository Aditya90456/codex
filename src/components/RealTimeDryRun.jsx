import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronDown, Zap, Eye, Code, Terminal,
  Bookmark, Clock, BarChart3, AlertTriangle, CheckCircle, XCircle, Info,
  Layers, GitBranch, Activity, Cpu, HardDrive, Timer, Target, Bug, Lightbulb,
  FastForward, Rewind, SkipForward, SkipBack, Volume2, VolumeX, Settings
} from 'lucide-react';

const RealTimeDryRun = ({ code, language = 'javascript' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [variables, setVariables] = useState({});
  const [executionStack, setExecutionStack] = useState([]);
  const [output, setOutput] = useState([]);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [expandedScopes, setExpandedScopes] = useState(new Set(['global']));
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [watchExpressions, setWatchExpressions] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState({ heap: 0, stack: 0 });
  const [performanceMetrics, setPerformanceMetrics] = useState({ 
    executionTime: 0, 
    operationsCount: 0,
    complexityAnalysis: { time: 'O(1)', space: 'O(1)' }
  });
  const [debugMode, setDebugMode] = useState('step'); // step, continuous, breakpoint
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

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
    setErrorState(null);
    setSuggestions([]);
    setExecutionHistory([]);
    setMemoryUsage({ heap: 0, stack: 0 });
    setPerformanceMetrics({ 
      executionTime: 0, 
      operationsCount: 0,
      complexityAnalysis: { time: 'O(1)', space: 'O(1)' }
    });
    startTimeRef.current = performance.now();
    
    const lines = code.split('\n').filter(line => line.trim());
    let lineIndex = 0;

    const executeStep = () => {
      if (lineIndex >= lines.length) {
        stopDryRun();
        return;
      }

      const line = lines[lineIndex].trim();
      setCurrentLine(lineIndex);
      
      // Check for breakpoints
      if (breakpoints.has(lineIndex) && debugMode === 'breakpoint') {
        setIsRunning(false);
        if (voiceEnabled) {
          speak('Breakpoint reached');
        }
        return;
      }
      
      // Execute line
      executeLine(line, lineIndex);
      
      // Update watch expressions
      setWatchExpressions(prev => prev.map(watch => ({
        ...watch,
        value: evaluateValue(watch.expression, variables)
      })));
      
      lineIndex++;
      
      // Continue execution based on mode
      if (debugMode === 'continuous' && isRunning) {
        setTimeout(executeStep, speed);
      }
    };

    if (debugMode === 'continuous') {
      intervalRef.current = setInterval(executeStep, speed);
    } else {
      executeStep();
    }
  };

  // Enhanced execution with performance tracking and error handling
  const executeLine = (line, lineNum) => {
    const startTime = performance.now();
    
    try {
      // Track execution history
      setExecutionHistory(prev => [...prev, {
        line: lineNum,
        code: line,
        timestamp: Date.now(),
        variables: { ...variables }
      }]);

      // Increment operations count
      setPerformanceMetrics(prev => ({
        ...prev,
        operationsCount: prev.operationsCount + 1
      }));

      // Variable declaration with enhanced tracking
      if (line.match(/(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/)) {
        const match = line.match(/(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/);
        const varName = match[1];
        const value = match[2].replace(/;/g, '').trim();
        const evaluatedValue = evaluateValue(value);
        
        setVariables(prev => ({
          ...prev,
          [varName]: {
            value: evaluatedValue,
            type: typeof evaluatedValue,
            line: lineNum,
            scope: 'local',
            memorySize: calculateMemorySize(evaluatedValue),
            accessCount: 0,
            lastAccessed: Date.now()
          }
        }));

        // Update memory usage
        setMemoryUsage(prev => ({
          ...prev,
          heap: prev.heap + calculateMemorySize(evaluatedValue)
        }));

        // Voice narration
        if (voiceEnabled) {
          speak(`Variable ${varName} assigned value ${evaluatedValue}`);
        }
      }

      // Variable update with access tracking
      if (line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/) && !line.includes('let') && !line.includes('const') && !line.includes('var')) {
        const match = line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)/);
        const varName = match[1];
        const value = match[2].replace(/;/g, '').trim();
        
        setVariables(prev => ({
          ...prev,
          [varName]: {
            ...prev[varName],
            value: evaluateValue(value, prev),
            line: lineNum,
            accessCount: (prev[varName]?.accessCount || 0) + 1,
            lastAccessed: Date.now()
          }
        }));
      }

      // Enhanced console.log with formatting
      if (line.includes('console.log')) {
        const match = line.match(/console\.log\((.+)\)/);
        if (match) {
          const content = match[1].replace(/['"]/g, '');
          const evaluatedContent = evaluateValue(content, variables);
          setOutput(prev => [...prev, { 
            line: lineNum, 
            content: evaluatedContent, 
            type: 'log',
            timestamp: Date.now()
          }]);
          
          if (voiceEnabled) {
            speak(`Output: ${evaluatedContent}`);
          }
        }
      }

      // Loop detection and complexity analysis
      if (line.includes('for') || line.includes('while')) {
        setPerformanceMetrics(prev => ({
          ...prev,
          complexityAnalysis: {
            ...prev.complexityAnalysis,
            time: detectTimeComplexity(line)
          }
        }));
        
        if (voiceEnabled) {
          speak('Entering loop structure');
        }
      }

      // Function call tracking
      if (line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/)) {
        const match = line.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
        const funcName = match[1];
        if (funcName !== 'console') {
          setExecutionStack(prev => [...prev, { 
            scope: funcName, 
            line: lineNum,
            timestamp: Date.now(),
            parameters: extractParameters(line)
          }]);
          
          setMemoryUsage(prev => ({
            ...prev,
            stack: prev.stack + 1
          }));
        }
      }

      // Return statement
      if (line.includes('return')) {
        setExecutionStack(prev => prev.slice(0, -1));
        setMemoryUsage(prev => ({
          ...prev,
          stack: Math.max(0, prev.stack - 1)
        }));
        
        if (voiceEnabled) {
          speak('Returning from function');
        }
      }

      // Error detection
      if (line.includes('throw') || line.includes('Error')) {
        setErrorState({
          line: lineNum,
          message: 'Runtime error detected',
          type: 'error'
        });
        
        if (voiceEnabled) {
          speak('Error detected in code execution');
        }
      }

      // Performance suggestions
      generateSuggestions(line, lineNum);

    } catch (error) {
      setErrorState({
        line: lineNum,
        message: error.message,
        type: 'syntax'
      });
      
      if (voiceEnabled) {
        speak('Syntax error encountered');
      }
    }

    // Update execution time
    const endTime = performance.now();
    setPerformanceMetrics(prev => ({
      ...prev,
      executionTime: prev.executionTime + (endTime - startTime)
    }));
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

  // New utility functions
  const calculateMemorySize = (value) => {
    if (typeof value === 'string') return value.length * 2;
    if (typeof value === 'number') return 8;
    if (typeof value === 'boolean') return 1;
    if (Array.isArray(value)) return value.length * 8;
    if (typeof value === 'object') return Object.keys(value).length * 16;
    return 4;
  };

  const detectTimeComplexity = (line) => {
    if (line.includes('for') && line.includes('for')) return 'O(n²)';
    if (line.includes('for')) return 'O(n)';
    if (line.includes('while')) return 'O(n)';
    return 'O(1)';
  };

  const extractParameters = (line) => {
    const match = line.match(/\(([^)]*)\)/);
    return match ? match[1].split(',').map(p => p.trim()) : [];
  };

  const generateSuggestions = (line, lineNum) => {
    const newSuggestions = [];
    
    // Performance suggestions
    if (line.includes('for') && line.includes('for')) {
      newSuggestions.push({
        type: 'performance',
        message: 'Nested loops detected - consider optimizing for better time complexity',
        line: lineNum,
        severity: 'warning'
      });
    }
    
    // Memory suggestions
    if (line.includes('new Array') && line.includes('1000')) {
      newSuggestions.push({
        type: 'memory',
        message: 'Large array allocation - consider using more memory-efficient data structures',
        line: lineNum,
        severity: 'info'
      });
    }
    
    // Best practices
    if (line.includes('var ')) {
      newSuggestions.push({
        type: 'best-practice',
        message: 'Consider using let or const instead of var for better scoping',
        line: lineNum,
        severity: 'info'
      });
    }
    
    if (newSuggestions.length > 0) {
      setSuggestions(prev => [...prev, ...newSuggestions]);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleBreakpoint = (lineNum) => {
    setBreakpoints(prev => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(lineNum)) {
        newBreakpoints.delete(lineNum);
      } else {
        newBreakpoints.add(lineNum);
      }
      return newBreakpoints;
    });
  };

  const addWatchExpression = (expression) => {
    setWatchExpressions(prev => [...prev, {
      id: Date.now(),
      expression,
      value: evaluateValue(expression, variables)
    }]);
  };

  const removeWatchExpression = (id) => {
    setWatchExpressions(prev => prev.filter(w => w.id !== id));
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
          <h3 className="font-semibold text-white">Real-Time Dry Run Debugger</h3>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
            Enhanced Mode
          </span>
          {errorState && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Error on line {errorState.line + 1}</span>
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="flex items-center gap-2">
          {/* Debug Mode Selector */}
          <select
            value={debugMode}
            onChange={(e) => setDebugMode(e.target.value)}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="step">Step Mode</option>
            <option value="continuous">Continuous</option>
            <option value="breakpoint">Breakpoints</option>
          </select>

          {/* Voice Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Voice Narration"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Advanced Panel Toggle */}
          <button
            onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
            className={`p-2 rounded-lg transition-colors ${
              showAdvancedPanel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Advanced Panel"
          >
            <Settings className="w-4 h-4" />
          </button>

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
        {/* Left: Code with Execution Pointer and Breakpoints */}
        <div className="flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Code Execution</span>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
              <Timer className="w-3 h-3" />
              {performanceMetrics.executionTime.toFixed(2)}ms
              <Activity className="w-3 h-3" />
              {performanceMetrics.operationsCount} ops
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 py-1 px-2 rounded transition-all group ${
                  index === currentLine && isRunning
                    ? 'bg-yellow-500/20 border-l-4 border-yellow-500'
                    : index < currentLine && isRunning
                    ? 'bg-green-500/10'
                    : errorState?.line === index
                    ? 'bg-red-500/20 border-l-4 border-red-500'
                    : ''
                }`}
              >
                {/* Breakpoint Toggle */}
                <button
                  onClick={() => toggleBreakpoint(index)}
                  className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    breakpoints.has(index)
                      ? 'bg-red-500 border-red-500'
                      : 'border-gray-600 hover:border-red-400 opacity-0 group-hover:opacity-100'
                  }`}
                  title="Toggle Breakpoint"
                />
                
                <span className="text-gray-500 w-8 text-right">{index + 1}</span>
                
                {/* Execution Indicator */}
                {index === currentLine && isRunning && (
                  <ChevronRight className="w-4 h-4 text-yellow-400 animate-pulse" />
                )}
                
                {/* Error Indicator */}
                {errorState?.line === index && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                
                <code className="text-gray-300 flex-1">{line || ' '}</code>
                
                {/* Performance Indicators */}
                {suggestions.some(s => s.line === index) && (
                  <div className="flex items-center gap-1">
                    {suggestions.filter(s => s.line === index).map((suggestion, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          suggestion.severity === 'error' ? 'bg-red-400' :
                          suggestion.severity === 'warning' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`}
                        title={suggestion.message}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Enhanced Debug Panels */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Performance Metrics */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Performance</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{performanceMetrics.executionTime.toFixed(2)}ms</div>
                <div className="text-xs text-gray-400">Execution Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{performanceMetrics.operationsCount}</div>
                <div className="text-xs text-gray-400">Operations</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{performanceMetrics.complexityAnalysis.time}</div>
                <div className="text-xs text-gray-400">Time Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">{memoryUsage.heap + memoryUsage.stack}</div>
                <div className="text-xs text-gray-400">Memory (bytes)</div>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Memory Usage</span>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Heap</span>
                  <span className="text-purple-400">{memoryUsage.heap} bytes</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((memoryUsage.heap / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Stack</span>
                  <span className="text-orange-400">{memoryUsage.stack} frames</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((memoryUsage.stack / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Execution Stack */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Call Stack</span>
            </div>
            <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
              {executionStack.length > 0 ? (
                executionStack.map((frame, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 font-medium">{frame.scope}</span>
                    <span className="text-gray-400 text-xs ml-auto">Line {frame.line + 1}</span>
                    {frame.parameters && frame.parameters.length > 0 && (
                      <span className="text-gray-500 text-xs">({frame.parameters.join(', ')})</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No active calls</p>
              )}
            </div>
          </div>

          {/* Enhanced Variables */}
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
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
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
                        {data.memorySize && (
                          <span className="text-xs text-gray-500">
                            ({data.memorySize}b)
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-gray-300 font-mono text-sm">
                          {typeof data.value === 'string' ? `"${data.value}"` : String(data.value)}
                        </span>
                        {data.accessCount > 0 && (
                          <div className="text-xs text-gray-500">
                            accessed {data.accessCount}x
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No variables yet</p>
                )}
              </div>
            )}
          </div>

          {/* Watch Expressions */}
          {showAdvancedPanel && (
            <div className="bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Watch</span>
                <button
                  onClick={() => {
                    const expr = prompt('Enter expression to watch:');
                    if (expr) addWatchExpression(expr);
                  }}
                  className="ml-auto p-1 hover:bg-gray-700 rounded"
                >
                  <Plus className="w-3 h-3 text-green-400" />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
                {watchExpressions.length > 0 ? (
                  watchExpressions.map((watch) => (
                    <div key={watch.id} className="flex items-center justify-between px-3 py-2 bg-gray-700/50 rounded-lg">
                      <span className="text-green-300 font-mono text-sm">{watch.expression}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm">{String(watch.value)}</span>
                        <button
                          onClick={() => removeWatchExpression(watch.id)}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No watch expressions</p>
                )}
              </div>
            </div>
          )}

          {/* Suggestions Panel */}
          {suggestions.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Suggestions</span>
                <button
                  onClick={() => setSuggestions([])}
                  className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-32 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${
                    suggestion.severity === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                    suggestion.severity === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    'bg-blue-500/10 border border-blue-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      suggestion.severity === 'error' ? 'bg-red-400' :
                      suggestion.severity === 'warning' ? 'bg-yellow-400' :
                      'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{suggestion.message}</p>
                      <p className="text-xs text-gray-500">Line {suggestion.line + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Output */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700 bg-gray-800">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Console Output</span>
              <button
                onClick={() => setOutput([])}
                className="ml-auto p-1 hover:bg-gray-700 rounded text-gray-400"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
              {output.length > 0 ? (
                output.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 px-3 py-2 bg-gray-700/50 rounded font-mono text-sm"
                  >
                    <span className="text-gray-500">›</span>
                    <span className="text-green-300 flex-1">{log.content}</span>
                    <div className="text-right">
                      <span className="text-gray-500 text-xs">L{log.line + 1}</span>
                      {log.timestamp && (
                        <div className="text-gray-600 text-xs">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
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
