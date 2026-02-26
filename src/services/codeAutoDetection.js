// Intelligent code auto-detection service
// Analyzes code patterns, typing behavior, and thinking states

export class CodeAutoDetector {
  constructor() {
    this.typingPatterns = [];
    this.codePatterns = [];
    this.thinkingStates = [];
    this.lastAnalysis = null;
  }

  // Detect programming language from code
  detectLanguage(code) {
    const patterns = {
      javascript: [/function\s+\w+/, /const\s+\w+\s*=/, /let\s+\w+/, /=>\s*{/, /console\.log/],
      python: [/def\s+\w+/, /import\s+\w+/, /print\(/, /:\s*$/, /self\./],
      java: [/public\s+class/, /private\s+\w+/, /System\.out/, /void\s+\w+/, /new\s+\w+/],
      cpp: [/#include/, /std::/, /cout\s*<</, /int\s+main/, /namespace/],
      typescript: [/interface\s+\w+/, /type\s+\w+/, /:\s*\w+\s*=/, /<\w+>/]
    };

    const scores = {};
    for (const [lang, langPatterns] of Object.entries(patterns)) {
      scores[lang] = langPatterns.filter(pattern => pattern.test(code)).length;
    }

    const detected = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    return detected ? detected[0] : 'javascript';
  }

  // Detect algorithm/data structure being used
  detectAlgorithm(code) {
    const algorithms = {
      'Two Pointers': [/left.*right/, /i.*j/, /start.*end/, /while.*left.*<.*right/],
      'Sliding Window': [/window/, /left.*right/, /maxLen/, /minLen/],
      'Binary Search': [/mid\s*=/, /left.*right/, /while.*left.*<=.*right/, /binary/],
      'Dynamic Programming': [/dp\[/, /memo/, /cache/, /tabulation/],
      'Backtracking': [/backtrack/, /dfs/, /visited/, /path/],
      'Graph': [/graph/, /adjacency/, /bfs/, /dfs/, /visited/],
      'Tree': [/root/, /left.*right/, /TreeNode/, /inorder/, /preorder/],
      'Hash Map': [/Map/, /HashMap/, /dict/, /{}/, /new Map/],
      'Stack': [/stack/, /push/, /pop/, /Stack/],
      'Queue': [/queue/, /enqueue/, /dequeue/, /Queue/],
      'Heap': [/heap/, /priority/, /PriorityQueue/],
      'Greedy': [/greedy/, /max/, /min/, /sort/]
    };

    const detected = [];
    for (const [algo, patterns] of Object.entries(algorithms)) {
      const matches = patterns.filter(pattern => pattern.test(code)).length;
      if (matches > 0) {
        detected.push({ algorithm: algo, confidence: matches / patterns.length });
      }
    }

    return detected.sort((a, b) => b.confidence - a.confidence);
  }

  // Detect complexity patterns
  detectComplexity(code) {
    const lines = code.split('\n');
    let nestedLoops = 0;
    let loopDepth = 0;
    let maxDepth = 0;

    for (const line of lines) {
      if (/for|while/.test(line)) {
        loopDepth++;
        maxDepth = Math.max(maxDepth, loopDepth);
      }
      if (/}/.test(line)) {
        loopDepth = Math.max(0, loopDepth - 1);
      }
    }

    const timeComplexity = maxDepth === 0 ? 'O(1)' :
                          maxDepth === 1 ? 'O(n)' :
                          maxDepth === 2 ? 'O(n²)' :
                          `O(n^${maxDepth})`;

    const hasRecursion = /function.*\w+.*{[\s\S]*\1/.test(code);
    const hasHashMap = /Map|HashMap|{}|dict/.test(code);
    
    const spaceComplexity = hasRecursion ? 'O(n)' :
                           hasHashMap ? 'O(n)' :
                           'O(1)';

    return { timeComplexity, spaceComplexity, nestedLoops: maxDepth };
  }

  // Detect code quality issues
  detectCodeIssues(code) {
    const issues = [];

    // Check for common issues
    if (code.length < 10) {
      issues.push({ type: 'warning', message: 'Code seems too short' });
    }

    if (!/return/.test(code) && code.length > 50) {
      issues.push({ type: 'warning', message: 'Missing return statement' });
    }

    if ((code.match(/for|while/g) || []).length > 3) {
      issues.push({ type: 'info', message: 'Multiple loops detected - consider optimization' });
    }

    if (!/\/\/|\/\*/.test(code) && code.length > 100) {
      issues.push({ type: 'info', message: 'Consider adding comments' });
    }

    const longLines = code.split('\n').filter(line => line.length > 100);
    if (longLines.length > 0) {
      issues.push({ type: 'style', message: `${longLines.length} lines exceed 100 characters` });
    }

    return issues;
  }

  // Analyze typing patterns
  analyzeTypingPattern(keystrokes, timeWindow = 5000) {
    const now = Date.now();
    const recentKeystrokes = keystrokes.filter(k => now - k.timestamp < timeWindow);

    if (recentKeystrokes.length === 0) return null;

    const avgInterval = recentKeystrokes.reduce((sum, k, i, arr) => {
      if (i === 0) return 0;
      return sum + (k.timestamp - arr[i - 1].timestamp);
    }, 0) / (recentKeystrokes.length - 1);

    const deletions = recentKeystrokes.filter(k => k.key === 'Backspace' || k.key === 'Delete').length;
    const deletionRate = deletions / recentKeystrokes.length;

    const pauses = recentKeystrokes.filter((k, i, arr) => {
      if (i === 0) return false;
      return k.timestamp - arr[i - 1].timestamp > 2000;
    }).length;

    return {
      speed: avgInterval < 200 ? 'fast' : avgInterval < 500 ? 'normal' : 'slow',
      deletionRate,
      pauses,
      confidence: deletionRate < 0.1 ? 'high' : deletionRate < 0.3 ? 'medium' : 'low',
      thinking: pauses > 2 ? 'deep' : pauses > 0 ? 'moderate' : 'flowing'
    };
  }

  // Detect user's problem-solving approach
  detectApproach(codeHistory) {
    if (codeHistory.length < 2) return 'starting';

    const approaches = {
      'Top-Down': /function.*{[\s\S]*function/.test(codeHistory[codeHistory.length - 1]),
      'Bottom-Up': /for.*{[\s\S]*dp\[/.test(codeHistory[codeHistory.length - 1]),
      'Iterative': /for|while/.test(codeHistory[codeHistory.length - 1]),
      'Recursive': /function.*\w+.*{[\s\S]*\1/.test(codeHistory[codeHistory.length - 1]),
      'Brute Force': (codeHistory[codeHistory.length - 1].match(/for/g) || []).length > 2,
      'Optimized': /Map|Set|memo|cache/.test(codeHistory[codeHistory.length - 1])
    };

    const detected = Object.entries(approaches)
      .filter(([, matches]) => matches)
      .map(([approach]) => approach);

    return detected.length > 0 ? detected : ['exploring'];
  }

  // Predict next action based on patterns
  predictNextAction(code, typingPattern, emotionState) {
    const predictions = [];

    // Based on code state
    if (code.trim().length === 0) {
      predictions.push({ action: 'start_coding', confidence: 0.9 });
    } else if (!/return/.test(code) && code.length > 50) {
      predictions.push({ action: 'add_return', confidence: 0.7 });
    }

    // Based on typing pattern
    if (typingPattern?.deletionRate > 0.3) {
      predictions.push({ action: 'debugging', confidence: 0.8 });
    }

    if (typingPattern?.pauses > 2) {
      predictions.push({ action: 'thinking', confidence: 0.85 });
    }

    // Based on emotion
    if (emotionState === 'confused') {
      predictions.push({ action: 'need_hint', confidence: 0.75 });
    } else if (emotionState === 'excited') {
      predictions.push({ action: 'breakthrough', confidence: 0.9 });
    } else if (emotionState === 'frustrated') {
      predictions.push({ action: 'take_break', confidence: 0.7 });
    }

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  // Auto-suggest improvements
  suggestImprovements(code, algorithm) {
    const suggestions = [];

    // Time complexity improvements
    if ((code.match(/for/g) || []).length > 2) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider using a hash map to reduce nested loops',
        priority: 'high'
      });
    }

    // Space complexity improvements
    if (/new Array\(\d+\)/.test(code)) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider if you can solve this with O(1) space',
        priority: 'medium'
      });
    }

    // Algorithm-specific suggestions
    if (algorithm?.includes('Two Pointers') && !/sort/.test(code)) {
      suggestions.push({
        type: 'hint',
        message: 'Two pointers often work best on sorted arrays',
        priority: 'medium'
      });
    }

    if (algorithm?.includes('Dynamic Programming') && !/memo|cache/.test(code)) {
      suggestions.push({
        type: 'hint',
        message: 'Consider memoization to avoid redundant calculations',
        priority: 'high'
      });
    }

    return suggestions;
  }

  // Comprehensive analysis
  analyze(code, typingHistory, emotionData) {
    const analysis = {
      timestamp: Date.now(),
      language: this.detectLanguage(code),
      algorithms: this.detectAlgorithm(code),
      complexity: this.detectComplexity(code),
      issues: this.detectCodeIssues(code),
      typingPattern: this.analyzeTypingPattern(typingHistory),
      approach: this.detectApproach([code]),
      predictions: this.predictNextAction(code, this.analyzeTypingPattern(typingHistory), emotionData?.emotion),
      suggestions: this.suggestImprovements(code, this.detectAlgorithm(code)[0]?.algorithm)
    };

    this.lastAnalysis = analysis;
    return analysis;
  }

  // Get insights summary
  getInsights() {
    if (!this.lastAnalysis) return null;

    const { algorithms, complexity, typingPattern, predictions } = this.lastAnalysis;

    return {
      primaryAlgorithm: algorithms[0]?.algorithm || 'Unknown',
      complexity: `Time: ${complexity.timeComplexity}, Space: ${complexity.spaceComplexity}`,
      codingSpeed: typingPattern?.speed || 'unknown',
      confidence: typingPattern?.confidence || 'unknown',
      nextAction: predictions[0]?.action || 'continue',
      needsHelp: predictions.some(p => p.action === 'need_hint' && p.confidence > 0.7)
    };
  }
}

// Singleton instance
export const codeAutoDetector = new CodeAutoDetector();

// Helper function for real-time detection
export const startAutoDetection = (editor, onDetection) => {
  let typingHistory = [];
  let lastCode = '';

  const handleChange = (value) => {
    typingHistory.push({
      timestamp: Date.now(),
      key: 'typing',
      length: value.length
    });

    // Keep only last 100 keystrokes
    if (typingHistory.length > 100) {
      typingHistory = typingHistory.slice(-100);
    }

    lastCode = value;

    // Analyze every 2 seconds
    if (typingHistory.length % 10 === 0) {
      const analysis = codeAutoDetector.analyze(value, typingHistory, null);
      onDetection(analysis);
    }
  };

  return handleChange;
};
