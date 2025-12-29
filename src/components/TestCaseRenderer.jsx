import { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Zap
} from 'lucide-react';

const TestCaseRenderer = ({ problem, userCode, language = 'javascript', onRunTests }) => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showExpected, setShowExpected] = useState({});
  const [expandedCases, setExpandedCases] = useState({});

  if (!problem || !problem.testCases) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No test cases available for this problem</p>
      </div>
    );
  }

  const runTestCases = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      const results = [];
      
      for (let i = 0; i < problem.testCases.length; i++) {
        const testCase = problem.testCases[i];
        const startTime = Date.now();
        
        try {
          let result;
          let passed = false;
          let error = null;
          
          if (language === 'javascript') {
            // Create a safe execution environment
            const func = new Function('testCase', `
              ${userCode}
              
              // Extract the function name from the code
              const functionMatch = \`${userCode}\`.match(/(?:var|let|const|function)\\s+(\\w+)\\s*[=\\(]/);
              const functionName = functionMatch ? functionMatch[1] : 'solution';
              
              // Try to find and execute the function
              if (typeof eval(functionName) === 'function') {
                const args = Object.values(testCase.input);
                return eval(functionName)(...args);
              } else {
                throw new Error('Function not found or not properly defined');
              }
            `);
            
            result = func(testCase);
            
            // Compare result with expected
            passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
          } else {
            // For other languages, we'll simulate the execution
            // In a real implementation, you'd send this to a backend service
            result = "Execution not supported in demo";
            passed = false;
            error = "Language execution not implemented in frontend demo";
          }
          
          const executionTime = Date.now() - startTime;
          
          results.push({
            index: i,
            input: testCase.input,
            expected: testCase.expected,
            actual: result,
            passed,
            executionTime,
            error
          });
          
        } catch (err) {
          const executionTime = Date.now() - startTime;
          results.push({
            index: i,
            input: testCase.input,
            expected: testCase.expected,
            actual: null,
            passed: false,
            executionTime,
            error: err.message
          });
        }
      }
      
      setTestResults(results);
      
      // Call the parent callback if provided
      if (onRunTests) {
        onRunTests(results);
      }
      
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleExpected = (index) => {
    setShowExpected(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleExpanded = (index) => {
    setExpandedCases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatValue = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (Array.isArray(value)) return `[${value.join(', ')}]`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getStatusIcon = (result) => {
    if (result.passed) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (result.error) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (result) => {
    if (result.passed) return 'border-green-500 bg-green-900/20';
    if (result.error) return 'border-red-500 bg-red-900/20';
    return 'border-red-500 bg-red-900/20';
  };

  const passedCount = testResults.filter(r => r.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Test Cases</h3>
            {testResults.length > 0 && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                passedCount === totalCount 
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {passedCount}/{totalCount} Passed
              </span>
            )}
          </div>
          
          <button
            onClick={runTestCases}
            disabled={isRunning || !userCode.trim()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isRunning || !userCode.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
            }`}
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Tests</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Cases */}
      <div className="p-6">
        {problem.testCases.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No test cases defined for this problem</p>
          </div>
        ) : (
          <div className="space-y-4">
            {problem.testCases.map((testCase, index) => {
              const result = testResults.find(r => r.index === index);
              const isExpanded = expandedCases[index];
              
              return (
                <div
                  key={index}
                  className={`border rounded-lg transition-all duration-200 ${
                    result ? getStatusColor(result) : 'border-gray-600 bg-gray-700/30'
                  }`}
                >
                  {/* Test Case Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-700/20 transition-colors"
                    onClick={() => toggleExpanded(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-white">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <span className="font-medium text-white">Test Case {index + 1}</span>
                        {result && getStatusIcon(result)}
                      </div>
                      
                      {result && (
                        <div className="flex items-center space-x-4 text-sm">
                          {result.executionTime !== undefined && (
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Clock size={14} />
                              <span>{result.executionTime}ms</span>
                            </div>
                          )}
                          {result.passed && (
                            <span className="text-green-400 font-medium">✓ Passed</span>
                          )}
                          {!result.passed && (
                            <span className="text-red-400 font-medium">✗ Failed</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Test Case Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-600 p-4 space-y-4">
                      {/* Input */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Input:</h4>
                        <div className="bg-gray-900 rounded p-3 font-mono text-sm">
                          {Object.entries(testCase.input).map(([key, value]) => (
                            <div key={key} className="text-blue-300">
                              <span className="text-gray-400">{key} = </span>
                              <span className="text-yellow-300">{formatValue(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Output */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-300">Expected Output:</h4>
                          <button
                            onClick={() => toggleExpected(index)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            {showExpected[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span>{showExpected[index] ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        {showExpected[index] && (
                          <div className="bg-gray-900 rounded p-3 font-mono text-sm text-green-300">
                            {formatValue(testCase.expected)}
                          </div>
                        )}
                      </div>

                      {/* Actual Output (if test was run) */}
                      {result && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Your Output:</h4>
                          <div className={`bg-gray-900 rounded p-3 font-mono text-sm ${
                            result.passed ? 'text-green-300' : 'text-red-300'
                          }`}>
                            {result.error ? (
                              <div className="text-red-400">
                                <div className="font-semibold mb-1">Error:</div>
                                <div>{result.error}</div>
                              </div>
                            ) : (
                              formatValue(result.actual)
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {testResults.length > 0 && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Test Summary</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">{passedCount} Passed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{totalCount - passedCount} Failed</span>
                </div>
                <div className="text-gray-400">
                  Total: {totalCount}
                </div>
              </div>
            </div>
            
            {passedCount === totalCount && totalCount > 0 && (
              <div className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">All tests passed! 🎉</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseRenderer;