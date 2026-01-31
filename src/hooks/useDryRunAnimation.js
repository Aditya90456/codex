import { useState, useCallback, useRef } from 'react';

export const useDryRunAnimation = (code, language, selectedProblem) => {
  const [dryRunData, setDryRunData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Manual trigger function
  const triggerDryRun = useCallback(() => {
    if (!code || !selectedProblem) return;
    
    const codeStr = typeof code === 'string' ? code : String(code || '');
    if (!codeStr.trim()) return;

    setIsAnalyzing(true);
    setShowAnimation(true);
    performAutoDryRun(codeStr, language, selectedProblem);
  }, [code, language, selectedProblem]);

  const performAutoDryRun = async (userCode, lang, problem) => {
    try {
      // Parse and analyze the code
      const analysis = analyzeCodeStructure(userCode, lang, problem);
      
      // Generate visualization data
      const visualizationData = generateVisualizationData(analysis, problem);
      
      setDryRunData(visualizationData);
      setShowAnimation(true);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Dry run analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const analyzeCodeStructure = (code, language, problem) => {
    // Ensure code is a string
    const codeStr = typeof code === 'string' ? code : String(code || '');
    
    // Detect data structures being used
    const hasArray = /\[|\]|array|Array/.test(codeStr);
    const hasTree = /TreeNode|tree|left|right|root/.test(codeStr);
    const hasGraph = /graph|Graph|adjacency|edges/.test(codeStr);
    const hasHashMap = /Map|map|HashMap|dict|dictionary/.test(codeStr);
    const hasStack = /stack|Stack|push|pop/.test(codeStr);
    const hasQueue = /queue|Queue|enqueue|dequeue/.test(codeStr);

    // Detect loops and iterations
    const hasForLoop = /for\s*\(/.test(codeStr);
    const hasWhileLoop = /while\s*\(/.test(codeStr);
    const hasRecursion = detectRecursion(codeStr);

    // Extract variables
    const variables = extractVariables(codeStr, language);

    return {
      dataStructures: {
        array: hasArray,
        tree: hasTree,
        graph: hasGraph,
        hashMap: hasHashMap,
        stack: hasStack,
        queue: hasQueue
      },
      patterns: {
        forLoop: hasForLoop,
        whileLoop: hasWhileLoop,
        recursion: hasRecursion
      },
      variables,
      problem
    };
  };

  const detectRecursion = (code) => {
    // Simple recursion detection
    const functionNames = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/g);
    if (!functionNames) return false;

    for (const funcDef of functionNames) {
      const funcName = funcDef.match(/\w+$/)?.[0];
      if (funcName && code.includes(`${funcName}(`)) {
        const regex = new RegExp(`${funcName}\\s*\\(`, 'g');
        const matches = code.match(regex);
        if (matches && matches.length > 1) return true;
      }
    }
    return false;
  };

  const extractVariables = (code, language) => {
    const variables = [];
    
    // Extract variable declarations
    const patterns = {
      javascript: /(?:let|const|var)\s+(\w+)/g,
      python: /(\w+)\s*=/g,
      java: /(?:int|String|boolean|double|float)\s+(\w+)/g,
      cpp: /(?:int|string|bool|double|float)\s+(\w+)/g
    };

    const pattern = patterns[language] || patterns.javascript;
    let match;
    
    while ((match = pattern.exec(code)) !== null) {
      if (match[1] && !variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  };

  const generateVisualizationData = (analysis, problem) => {
    const visualizations = [];

    // Generate array visualization if arrays are detected
    if (analysis.dataStructures.array) {
      visualizations.push({
        type: 'array',
        data: generateArraySteps(problem),
        title: 'Array Traversal'
      });
    }

    // Generate tree visualization if trees are detected
    if (analysis.dataStructures.tree) {
      visualizations.push({
        type: 'tree',
        data: generateTreeSteps(problem),
        title: 'Tree Traversal'
      });
    }

    // Generate execution steps
    const executionSteps = generateExecutionSteps(analysis, problem);

    return {
      visualizations,
      executionSteps,
      variables: analysis.variables,
      complexity: estimateComplexity(analysis)
    };
  };

  const generateArraySteps = (problem) => {
    // Generate sample array operations based on problem
    const sampleInput = problem.examples?.[0]?.input;
    let array = [];

    // Try to extract array from input
    if (typeof sampleInput === 'object') {
      array = sampleInput.nums || sampleInput.arr || [1, 2, 3, 4, 5];
    } else {
      array = [1, 2, 3, 4, 5];
    }

    const steps = [];
    
    // Simulate array traversal
    for (let i = 0; i < Math.min(array.length, 5); i++) {
      steps.push({
        array: [...array],
        highlights: [i],
        pointers: [{ index: i, label: 'i' }],
        description: `Checking element at index ${i}: ${array[i]}`,
        code: `arr[${i}] = ${array[i]}`
      });
    }

    return { array, steps };
  };

  const generateTreeSteps = (problem) => {
    // Generate sample tree structure
    const tree = {
      value: 1,
      left: { value: 2, left: { value: 4 }, right: { value: 5 } },
      right: { value: 3, left: { value: 6 }, right: { value: 7 } }
    };

    const steps = [
      { node: tree, description: 'Start at root node: 1', highlight: [1] },
      { node: tree.left, description: 'Visit left child: 2', highlight: [2] },
      { node: tree.left.left, description: 'Visit left child: 4', highlight: [4] },
      { node: tree.left.right, description: 'Visit right child: 5', highlight: [5] },
      { node: tree.right, description: 'Visit right child: 3', highlight: [3] }
    ];

    return { tree, steps };
  };

  const generateExecutionSteps = (analysis, problem) => {
    const steps = [];
    let stepNumber = 1;

    // Initialize variables
    steps.push({
      step: stepNumber++,
      action: 'Initialize',
      description: 'Initialize variables and data structures',
      variables: analysis.variables.reduce((acc, v) => ({ ...acc, [v]: 'undefined' }), {})
    });

    // Add loop steps if detected
    if (analysis.patterns.forLoop || analysis.patterns.whileLoop) {
      steps.push({
        step: stepNumber++,
        action: 'Loop Start',
        description: 'Begin iteration through data',
        variables: {}
      });

      for (let i = 0; i < 3; i++) {
        steps.push({
          step: stepNumber++,
          action: `Iteration ${i + 1}`,
          description: `Processing element at position ${i}`,
          variables: { i }
        });
      }
    }

    // Add recursion steps if detected
    if (analysis.patterns.recursion) {
      steps.push({
        step: stepNumber++,
        action: 'Recursive Call',
        description: 'Function calls itself with modified parameters',
        variables: {}
      });
    }

    // Return result
    steps.push({
      step: stepNumber++,
      action: 'Return',
      description: 'Return final result',
      variables: { result: 'computed value' }
    });

    return steps;
  };

  const estimateComplexity = (analysis) => {
    let timeComplexity = 'O(1)';
    let spaceComplexity = 'O(1)';

    // Estimate time complexity
    if (analysis.patterns.recursion) {
      timeComplexity = 'O(2^n)';
    } else if (analysis.patterns.forLoop && analysis.patterns.whileLoop) {
      timeComplexity = 'O(n^2)';
    } else if (analysis.patterns.forLoop || analysis.patterns.whileLoop) {
      timeComplexity = 'O(n)';
    }

    // Estimate space complexity
    if (analysis.dataStructures.array || analysis.dataStructures.hashMap) {
      spaceComplexity = 'O(n)';
    } else if (analysis.patterns.recursion) {
      spaceComplexity = 'O(n)';
    }

    return { timeComplexity, spaceComplexity };
  };

  const closeDryRun = useCallback(() => {
    setShowAnimation(false);
  }, []);

  return {
    dryRunData,
    isAnalyzing,
    showAnimation,
    closeDryRun,
    triggerDryRun
  };
};
