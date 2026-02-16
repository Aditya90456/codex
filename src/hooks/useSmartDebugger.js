import { useState, useEffect, useRef, useCallback } from 'react';

export const useSmartDebugger = (initialCode = '', options = {}) => {
  const {
    autoDetectEnabled = true,
    detectionThreshold = 40,
    debounceDelay = 1000,
    enableVoiceNotifications = false,
    language = 'javascript'
  } = options;

  const [code, setCode] = useState(initialCode);
  const [shouldShowDebugger, setShouldShowDebugger] = useState(false);
  const [debuggerVisible, setDebuggerVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  
  const debounceRef = useRef(null);
  const previousAnalysisRef = useRef(null);
  const notificationShownRef = useRef(false);

  // Advanced code analysis patterns
  const analysisPatterns = {
    // Basic patterns
    variables: {
      regex: /(?:let|const|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/g,
      weight: 10,
      description: 'Variable declarations'
    },
    loops: {
      regex: /(?:for|while)\s*\(/g,
      weight: 25,
      description: 'Loop structures'
    },
    functions: {
      regex: /(?:function\s+[a-zA-Z_$][a-zA-Z0-9_$]*|const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*=>\s*{))/g,
      weight: 20,
      description: 'Function definitions'
    },
    conditionals: {
      regex: /(?:if|else|switch)\s*\(/g,
      weight: 15,
      description: 'Conditional statements'
    },
    
    // Advanced patterns
    nestedLoops: {
      regex: /for\s*\([^}]*for\s*\(|while\s*\([^}]*while\s*\(/g,
      weight: 40,
      description: 'Nested loops (O(n²) complexity)'
    },
    recursion: {
      regex: /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)[^}]*\1\s*\(/g,
      weight: 35,
      description: 'Recursive functions'
    },
    arrayMethods: {
      regex: /\.(?:map|filter|reduce|forEach|find|some|every)\s*\(/g,
      weight: 15,
      description: 'Array manipulation methods'
    },
    asyncCode: {
      regex: /(?:async|await|Promise|\.then|\.catch)/g,
      weight: 20,
      description: 'Asynchronous code patterns'
    },
    
    // Algorithm patterns
    sorting: {
      regex: /(?:sort|bubble|quick|merge|heap|insertion|selection)/gi,
      weight: 30,
      description: 'Sorting algorithms'
    },
    searching: {
      regex: /(?:binary.*search|linear.*search|bfs|dfs|breadth|depth)/gi,
      weight: 30,
      description: 'Search algorithms'
    },
    dynamicProgramming: {
      regex: /(?:dp|memo|memoization|tabulation|fibonacci|knapsack)/gi,
      weight: 35,
      description: 'Dynamic programming patterns'
    },
    
    // Data structures
    dataStructures: {
      regex: /(?:stack|queue|heap|tree|graph|linked.*list|hash.*table|trie)/gi,
      weight: 25,
      description: 'Data structure implementations'
    },
    
    // Debugging indicators
    debugging: {
      regex: /(?:console\.log|debugger|alert|print)\s*\(/g,
      weight: 5,
      description: 'Debugging statements'
    },
    errorHandling: {
      regex: /(?:try|catch|throw|finally|Error)/g,
      weight: 15,
      description: 'Error handling'
    }
  };

  // Analyze code complexity and determine debugger necessity
  const analyzeCode = useCallback((currentCode) => {
    if (!currentCode || currentCode.trim().length < 5) {
      return {
        shouldShow: false,
        confidence: 0,
        reasons: [],
        metrics: {},
        complexity: 'low'
      };
    }

    const analysis = {
      shouldShow: false,
      confidence: 0,
      reasons: [],
      metrics: {},
      complexity: 'low',
      timestamp: Date.now()
    };

    let totalScore = 0;
    const reasons = [];
    const metrics = {};

    // Analyze each pattern
    Object.entries(analysisPatterns).forEach(([patternName, pattern]) => {
      const matches = (currentCode.match(pattern.regex) || []).length;
      metrics[patternName] = matches;

      if (matches > 0) {
        const score = matches * pattern.weight;
        totalScore += score;
        
        if (score >= 20) { // Only add significant reasons
          reasons.push({
            pattern: patternName,
            count: matches,
            score,
            description: pattern.description,
            suggestion: getPatternSuggestion(patternName, matches)
          });
        }
      }
    });

    // Additional complexity factors
    const lines = currentCode.split('\n').filter(line => line.trim()).length;
    const complexity = calculateComplexity(currentCode, metrics);
    
    // Line count bonus
    if (lines > 10) {
      const lineBonus = Math.min((lines - 10) * 2, 30);
      totalScore += lineBonus;
      if (lines > 20) {
        reasons.push({
          pattern: 'codeLength',
          count: lines,
          score: lineBonus,
          description: 'Code length',
          suggestion: 'Large codebase benefits from step-by-step debugging'
        });
      }
    }

    // Complexity bonus
    if (complexity === 'high') {
      totalScore += 25;
      reasons.push({
        pattern: 'complexity',
        count: 1,
        score: 25,
        description: 'High algorithmic complexity',
        suggestion: 'Complex algorithms are easier to understand with visualization'
      });
    } else if (complexity === 'medium') {
      totalScore += 10;
    }

    // Calculate final confidence (0-100)
    analysis.confidence = Math.min(totalScore, 100);
    analysis.shouldShow = analysis.confidence >= detectionThreshold;
    analysis.reasons = reasons.sort((a, b) => b.score - a.score);
    analysis.metrics = metrics;
    analysis.complexity = complexity;

    return analysis;
  }, [detectionThreshold]);

  // Get suggestion for specific patterns
  const getPatternSuggestion = (pattern, count) => {
    const suggestions = {
      variables: 'Track variable changes in real-time',
      loops: 'Visualize loop iterations and performance',
      functions: 'Monitor call stack and function parameters',
      conditionals: 'Follow branching logic paths',
      nestedLoops: 'Critical: Monitor O(n²) performance impact',
      recursion: 'Visualize recursive call stack depth',
      arrayMethods: 'Track array transformations step-by-step',
      asyncCode: 'Debug asynchronous execution flow',
      sorting: 'Visualize sorting algorithm steps',
      searching: 'Track search algorithm progress',
      dynamicProgramming: 'Monitor memoization and state transitions',
      dataStructures: 'Visualize data structure operations',
      debugging: 'Enhanced debugging with variable tracking',
      errorHandling: 'Monitor error propagation and handling'
    };
    
    return suggestions[pattern] || 'Debug this pattern for better understanding';
  };

  // Calculate overall code complexity
  const calculateComplexity = (code, metrics) => {
    let complexityScore = 0;
    
    // High complexity indicators
    if (metrics.nestedLoops > 0) complexityScore += 3;
    if (metrics.recursion > 0) complexityScore += 2;
    if (metrics.dynamicProgramming > 0) complexityScore += 3;
    if (metrics.loops > 2) complexityScore += 2;
    if (metrics.functions > 3) complexityScore += 1;
    if (metrics.conditionals > 5) complexityScore += 1;
    
    // Check for complex patterns
    if (code.includes('setTimeout') || code.includes('setInterval')) complexityScore += 1;
    if (code.match(/class\s+[A-Z]/)) complexityScore += 1;
    if (code.includes('prototype')) complexityScore += 1;
    
    if (complexityScore >= 5) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  };

  // Voice notification for high-confidence detections
  const announceDetection = useCallback((analysis) => {
    if (!enableVoiceNotifications || notificationShownRef.current) return;
    
    if (analysis.confidence >= 80) {
      const utterance = new SpeechSynthesisUtterance(
        `High complexity code detected. Debugger recommended for ${analysis.reasons[0]?.description || 'analysis'}.`
      );
      utterance.rate = 0.8;
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
      notificationShownRef.current = true;
      
      // Reset notification flag after 30 seconds
      setTimeout(() => {
        notificationShownRef.current = false;
      }, 30000);
    }
  }, [enableVoiceNotifications]);

  // Debounced analysis effect
  useEffect(() => {
    if (!autoDetectEnabled) return;

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce analysis
    debounceRef.current = setTimeout(() => {
      const analysis = analyzeCode(code);
      setAnalysisResult(analysis);
      
      // Update detection history
      setDetectionHistory(prev => [
        ...prev.slice(-9), // Keep last 10 entries
        {
          timestamp: Date.now(),
          confidence: analysis.confidence,
          complexity: analysis.complexity,
          codeLength: code.split('\n').length
        }
      ]);

      // Auto-show debugger if confidence is high enough
      if (analysis.shouldShow && !debuggerVisible) {
        setShouldShowDebugger(true);
        announceDetection(analysis);
      }

      // Auto-hide if confidence drops significantly
      if (!analysis.shouldShow && debuggerVisible && analysis.confidence < detectionThreshold - 20) {
        setShouldShowDebugger(false);
      }

      previousAnalysisRef.current = analysis;
    }, debounceDelay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, autoDetectEnabled, analyzeCode, debounceDelay, debuggerVisible, detectionThreshold, announceDetection]);

  // Public API
  const showDebugger = useCallback(() => {
    setDebuggerVisible(true);
    setShouldShowDebugger(true);
  }, []);

  const hideDebugger = useCallback(() => {
    setDebuggerVisible(false);
    setShouldShowDebugger(false);
  }, []);

  const toggleDebugger = useCallback(() => {
    if (debuggerVisible) {
      hideDebugger();
    } else {
      showDebugger();
    }
  }, [debuggerVisible, showDebugger, hideDebugger]);

  const updateCode = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  return {
    // State
    code,
    shouldShowDebugger,
    debuggerVisible,
    analysisResult,
    detectionHistory,
    
    // Actions
    updateCode,
    showDebugger,
    hideDebugger,
    toggleDebugger,
    
    // Utilities
    analyzeCode: (customCode) => analyzeCode(customCode || code),
    getComplexityLevel: () => analysisResult?.complexity || 'low',
    getConfidence: () => analysisResult?.confidence || 0,
    getRecommendations: () => analysisResult?.reasons || []
  };
};

export default useSmartDebugger;