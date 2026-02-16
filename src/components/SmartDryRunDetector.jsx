import { useState, useEffect, useRef } from 'react';
import { 
  Zap, Eye, Code, Play, Settings, Lightbulb, 
  ChevronUp, ChevronDown, Minimize2, Maximize2
} from 'lucide-react';
import RealTimeDryRun from './RealTimeDryRun';

const SmartDryRunDetector = ({ code, language = 'javascript', onCodeChange }) => {
  const [showDebugger, setShowDebugger] = useState(false);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);
  const [debuggerSize, setDebuggerSize] = useState('normal'); // mini, normal, full
  const [detectionTriggers, setDetectionTriggers] = useState({
    variables: true,
    loops: true,
    functions: true,
    conditionals: true,
    complexity: true
  });
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const debounceRef = useRef(null);
  const previousCodeRef = useRef('');

  // Auto-detection patterns
  const detectionPatterns = {
    variables: /(?:let|const|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g,
    loops: /(?:for|while)\s*\(/g,
    functions: /(?:function\s+[a-zA-Z_$][a-zA-Z0-9_$]*|const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*=>\s*{))/g,
    conditionals: /(?:if|else|switch)\s*\(/g,
    complexity: /(?:for.*for|while.*while|if.*if.*else)/g,
    debugging: /(?:console\.log|debugger|alert)\s*\(/g,
    algorithms: /(?:sort|filter|map|reduce|find|binary|search|tree|graph|dp|dynamic)/gi,
    dataStructures: /(?:array|object|map|set|stack|queue|heap|tree|graph)/gi
  };

  // Analyze code and determine if debugger should be shown
  const analyzeCode = (currentCode) => {
    if (!currentCode || currentCode.trim().length < 10) {
      return { shouldShow: false, confidence: 0, reasons: [] };
    }

    const analysis = {
      shouldShow: false,
      confidence: 0,
      reasons: [],
      metrics: {
        lines: currentCode.split('\n').filter(line => line.trim()).length,
        variables: 0,
        loops: 0,
        functions: 0,
        conditionals: 0,
        complexity: 0
      }
    };

    let score = 0;
    const reasons = [];

    // Count pattern matches
    Object.entries(detectionPatterns).forEach(([pattern, regex]) => {
      const matches = (currentCode.match(regex) || []).length;
      analysis.metrics[pattern] = matches;

      if (detectionTriggers[pattern] && matches > 0) {
        switch (pattern) {
          case 'variables':
            if (matches >= 2) {
              score += matches * 10;
              reasons.push(`${matches} variables detected - good for tracking state`);
            }
            break;
          case 'loops':
            if (matches >= 1) {
              score += matches * 25;
              reasons.push(`${matches} loop(s) detected - excellent for step-by-step execution`);
            }
            break;
          case 'functions':
            if (matches >= 1) {
              score += matches * 20;
              reasons.push(`${matches} function(s) detected - great for call stack visualization`);
            }
            break;
          case 'conditionals':
            if (matches >= 1) {
              score += matches * 15;
              reasons.push(`${matches} conditional(s) detected - useful for flow control tracking`);
            }
            break;
          case 'complexity':
            if (matches >= 1) {
              score += matches * 30;
              reasons.push(`Complex logic detected - debugger highly recommended`);
            }
            break;
          case 'algorithms':
            if (matches >= 1) {
              score += matches * 20;
              reasons.push(`Algorithm patterns detected - perfect for visualization`);
            }
            break;
          case 'dataStructures':
            if (matches >= 1) {
              score += matches * 15;
              reasons.push(`Data structures detected - memory tracking available`);
            }
            break;
        }
      }
    });

    // Bonus points for code complexity
    if (analysis.metrics.lines > 10) {
      score += Math.min((analysis.metrics.lines - 10) * 2, 20);
      reasons.push(`${analysis.metrics.lines} lines of code - debugger can help navigate`);
    }

    // Check for recent changes that suggest debugging need
    const previousCode = previousCodeRef.current;
    if (previousCode && currentCode !== previousCode) {
      const newLines = currentCode.split('\n').length - previousCode.split('\n').length;
      if (newLines > 0) {
        score += newLines * 5;
        reasons.push(`Code expanded by ${newLines} lines - debugging support available`);
      }
    }

    // Calculate confidence (0-100)
    analysis.confidence = Math.min(score, 100);
    analysis.shouldShow = analysis.confidence >= 40; // Threshold for auto-showing
    analysis.reasons = reasons;

    return analysis;
  };

  // Debounced code analysis
  useEffect(() => {
    if (!autoDetectEnabled || !code) return;

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce analysis to avoid excessive computation
    debounceRef.current = setTimeout(() => {
      const analysis = analyzeCode(code);
      setLastAnalysis(analysis);
      setConfidence(analysis.confidence);

      // Auto-show debugger if confidence is high enough
      if (analysis.shouldShow && !showDebugger) {
        setShowDebugger(true);
        
        // Optional: Show notification
        if (analysis.confidence > 70) {
          console.log('🔍 Smart Debugger: High complexity detected, debugger activated!');
        }
      }

      // Update previous code reference
      previousCodeRef.current = code;
    }, 1000); // 1 second debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, autoDetectEnabled, showDebugger]);

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    if (conf >= 40) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getDebuggerHeight = () => {
    switch (debuggerSize) {
      case 'mini': return 'h-64';
      case 'normal': return 'h-96';
      case 'full': return 'h-screen';
      default: return 'h-96';
    }
  };

  return (
    <div className="relative">
      {/* Smart Detection Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Smart Debugger</h3>
            </div>
            
            {/* Confidence Indicator */}
            {lastAnalysis && (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      confidence >= 80 ? 'bg-green-500' :
                      confidence >= 60 ? 'bg-yellow-500' :
                      confidence >= 40 ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                  {confidence}%
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-detect Toggle */}
            <button
              onClick={() => setAutoDetectEnabled(!autoDetectEnabled)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                autoDetectEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Auto-Detect
            </button>

            {/* Manual Toggle */}
            <button
              onClick={() => setShowDebugger(!showDebugger)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showDebugger
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {showDebugger ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Debugger
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Show Debugger
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {lastAnalysis && lastAnalysis.reasons.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lightbulb className="w-4 h-4" />
              <span>Detection Analysis:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lastAnalysis.reasons.slice(0, 4).map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
            
            {/* Code Metrics */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>Lines: {lastAnalysis.metrics.lines}</span>
              <span>Variables: {lastAnalysis.metrics.variables}</span>
              <span>Loops: {lastAnalysis.metrics.loops}</span>
              <span>Functions: {lastAnalysis.metrics.functions}</span>
              {lastAnalysis.metrics.complexity > 0 && (
                <span className="text-orange-400">Complex Logic: {lastAnalysis.metrics.complexity}</span>
              )}
            </div>
          </div>
        )}

        {/* Quick Recommendations */}
        {lastAnalysis && lastAnalysis.confidence >= 40 && !showDebugger && (
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
              <Eye className="w-4 h-4" />
              Recommendation
            </div>
            <p className="text-sm text-blue-300">
              Your code has {lastAnalysis.confidence >= 80 ? 'high' : 'moderate'} complexity. 
              The debugger can help you visualize execution flow, track variables, and understand performance.
            </p>
          </div>
        )}
      </div>

      {/* Debugger Panel */}
      {showDebugger && (
        <div className={`bg-gray-900 rounded-lg border border-gray-700 ${getDebuggerHeight()} transition-all duration-300`}>
          {/* Debugger Controls */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Real-Time Debugger</span>
              {confidence > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                  confidence >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {confidence >= 80 ? 'Highly Recommended' :
                   confidence >= 60 ? 'Recommended' :
                   'Suggested'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Size Controls */}
              <select
                value={debuggerSize}
                onChange={(e) => setDebuggerSize(e.target.value)}
                className="px-2 py-1 bg-gray-700 text-white rounded text-xs border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="mini">Mini</option>
                <option value="normal">Normal</option>
                <option value="full">Full Screen</option>
              </select>

              {/* Minimize/Maximize */}
              <button
                onClick={() => setDebuggerSize(debuggerSize === 'mini' ? 'normal' : 'mini')}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                {debuggerSize === 'mini' ? 
                  <Maximize2 className="w-4 h-4 text-gray-400" /> : 
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Close */}
              <button
                onClick={() => setShowDebugger(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Debugger Content */}
          <div className="h-full">
            <RealTimeDryRun 
              code={code} 
              language={language}
              autoStart={confidence >= 80}
              showAdvanced={confidence >= 60}
            />
          </div>
        </div>
      )}

      {/* Detection Settings Panel */}
      {autoDetectEnabled && (
        <div className="mt-4">
          <details className="bg-gray-800/30 rounded-lg border border-gray-700/30">
            <summary className="p-3 cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Detection Settings
              </div>
            </summary>
            <div className="p-4 border-t border-gray-700/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(detectionTriggers).map(([trigger, enabled]) => (
                  <label key={trigger} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setDetectionTriggers(prev => ({
                        ...prev,
                        [trigger]: e.target.checked
                      }))}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-300 capitalize">{trigger}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Customize which code patterns trigger automatic debugger activation
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default SmartDryRunDetector;