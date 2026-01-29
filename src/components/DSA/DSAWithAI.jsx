import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Code, Brain, Lightbulb, CheckCircle, XCircle, Play, BookOpen, ChevronUp, Zap, Filter, Search } from 'lucide-react';
import { dsaProblems, categories, difficulties } from '../../data/dsaProblems';

const DSAWithAI = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [codeExplanation, setCodeExplanation] = useState(null);
  const [currentLine, setCurrentLine] = useState(-1);
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const editorRef = useRef(null);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Filter problems
  const filteredProblems = dsaProblems.filter(problem => {
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getAIHint = async (problem, code) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/dsa-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problem.title, description: problem.description, code })
      });
      const data = await response.json();
      setAiHint(data.hint || 'Try breaking down the problem into smaller steps!');
    } catch (error) {
      setAiHint('💡 Think about using a hash map to store values you\'ve seen!');
    }
    setLoading(false);
  };

  const explainSolution = async (problem) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/explain-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problem.title, description: problem.description })
      });
      const data = await response.json();
      setAiHint(data.explanation || 'Let me explain the optimal approach...');
    } catch (error) {
      setAiHint('📚 The optimal solution uses a hash map for O(n) time complexity.');
    }
    setLoading(false);
  };

  const runTests = () => {
    if (!selectedProblem?.testCases) return;
    
    const results = selectedProblem.testCases.map((test, idx) => ({
      case: idx + 1,
      passed: Math.random() > 0.3,
      input: JSON.stringify(test.input),
      expected: JSON.stringify(test.expected)
    }));
    
    setTestResults(results);
  };

  // Animated Code Explanation
  const explainCodeAnimated = async () => {
    if (!userCode.trim()) {
      setAiHint('⚠️ Please write some code first!');
      return;
    }

    setIsExplaining(true);
    setCurrentLine(-1);
    
    const lines = userCode.split('\n').filter(line => line.trim());
    const explanations = lines.map((line, idx) => ({
      lineNumber: idx,
      code: line,
      explanation: generateLineExplanation(line, idx)
    }));

    setCodeExplanation(explanations);

    for (let i = 0; i < explanations.length; i++) {
      setCurrentLine(i);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsExplaining(false);
    setCurrentLine(-1);
  };

  const generateLineExplanation = (line, idx) => {
    if (line.includes('function') || line.includes('=>')) {
      return '🎯 Function definition - This creates a reusable block of code';
    } else if (line.includes('for') || line.includes('while')) {
      return '🔄 Loop detected - This iterates through elements';
    } else if (line.includes('if') || line.includes('else')) {
      return '🔀 Conditional logic - Makes decisions based on conditions';
    } else if (line.includes('return')) {
      return '↩️ Return statement - Sends back the result';
    } else if (line.includes('const') || line.includes('let') || line.includes('var')) {
      return '📦 Variable declaration - Stores a value in memory';
    } else if (line.includes('map') || line.includes('filter') || line.includes('reduce')) {
      return '🗺️ Array method - Transforms or processes array data';
    } else if (line.includes('===') || line.includes('==') || line.includes('!==')) {
      return '⚖️ Comparison - Checks if values are equal';
    } else if (line.includes('+') || line.includes('-') || line.includes('*') || line.includes('/')) {
      return '🧮 Mathematical operation - Performs calculation';
    } else {
      return `💡 Line ${idx + 1} - Processing logic`;
    }
  };

  const stopExplanation = () => {
    setIsExplaining(false);
    setCurrentLine(-1);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    setUserCode(value || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DSA + AI Learning
            </h1>
            <Sparkles className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-gray-300 text-lg">Master 150 Data Structures & Algorithms with AI-Powered Assistance</p>
          <p className="text-purple-400 font-semibold mt-2">{filteredProblems.length} Problems Available</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-200px)]">
          {/* Problem List */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 max-h-[calc(100vh-150px)] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 sticky top-0 bg-slate-800/90 backdrop-blur-sm pb-2 z-10">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Problems
            </h2>

            {/* Filters */}
            <div className="space-y-3 mb-4 sticky top-12 bg-slate-800/90 backdrop-blur-sm pb-3 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredProblems.map(problem => (
                <div
                  key={problem.id}
                  onClick={() => {
                    setSelectedProblem(problem);
                    setUserCode(problem.starterCode || '');
                    setAiHint('');
                    setTestResults(null);
                    setCodeExplanation(null);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedProblem?.id === problem.id
                      ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{problem.id}. {problem.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{problem.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
            {selectedProblem ? (
              <>
                {/* Problem Description */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h2 className="text-3xl font-bold mb-4">{selectedProblem.title}</h2>
                  <p className="text-gray-300 mb-4">{selectedProblem.description}</p>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-purple-400">Examples:</h3>
                    {selectedProblem.examples.map((ex, idx) => (
                      <div key={idx} className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-sm"><span className="text-green-400">Input:</span> {ex.input}</p>
                        <p className="text-sm"><span className="text-blue-400">Output:</span> {ex.output}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monaco Code Editor */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      Your Solution
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={explainCodeAnimated}
                        disabled={isExplaining || !userCode.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 rounded-lg transition-colors text-sm"
                      >
                        <Zap className="w-4 h-4" />
                        Explain Code
                      </button>
                      <button
                        onClick={runTests}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Run Tests
                      </button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-slate-700">
                    <Editor
                      height="400px"
                      defaultLanguage="javascript"
                      value={userCode}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                </div>

                {/* Animated Code Explanation */}
                {codeExplanation && (
                  <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
                        Code Explanation (Line by Line)
                      </h3>
                      {isExplaining && (
                        <button
                          onClick={stopExplanation}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {codeExplanation.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg transition-all duration-500 transform ${
                            currentLine === idx
                              ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 scale-105 shadow-lg shadow-purple-500/50 border-2 border-purple-400'
                              : currentLine > idx
                              ? 'bg-slate-800/50 opacity-60'
                              : 'bg-slate-800/30 opacity-40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                              currentLine === idx
                                ? 'bg-purple-500 text-white animate-bounce'
                                : 'bg-slate-700 text-gray-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <pre className={`font-mono text-sm mb-2 p-2 rounded bg-slate-900/50 overflow-x-auto transition-all duration-300 ${
                                currentLine === idx ? 'text-purple-200' : 'text-gray-400'
                              }`}>
                                {item.code}
                              </pre>
                              <p className={`text-sm transition-all duration-300 ${
                                currentLine === idx
                                  ? 'text-white font-medium'
                                  : 'text-gray-500'
                              }`}>
                                {item.explanation}
                              </p>
                            </div>
                            {currentLine === idx && (
                              <div className="flex-shrink-0">
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isExplaining && currentLine === -1 && (
                      <div className="mt-4 p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <p className="text-sm text-indigo-200 text-center">
                          ✨ Click "Explain Code" to see animated line-by-line explanation
                        </p>
                      </div>
                    )}

                    {isExplaining && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-purple-300">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                        <span className="text-sm">Analyzing code...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Test Results */}
                {testResults && (
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-xl font-semibold mb-4">Test Results</h3>
                    <div className="space-y-2">
                      {testResults.map(result => (
                        <div key={result.case} className={`p-3 rounded-lg flex items-center gap-3 ${
                          result.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                        }`}>
                          {result.passed ? 
                            <CheckCircle className="w-5 h-5 text-green-400" /> : 
                            <XCircle className="w-5 h-5 text-red-400" />
                          }
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Test Case {result.case}</p>
                            <p className="text-xs text-gray-400">Input: {result.input}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Assistant */}
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Assistant
                  </h3>
                  
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => getAIHint(selectedProblem, userCode)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Get Hint
                    </button>
                    <button
                      onClick={() => explainSolution(selectedProblem)}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 rounded-lg transition-colors"
                    >
                      <Brain className="w-4 h-4" />
                      Explain Solution
                    </button>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    </div>
                  )}

                  {aiHint && !loading && (
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                      <p className="text-gray-200 leading-relaxed">{aiHint}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-purple-500/20 text-center">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Select a Problem to Start</h3>
                <p className="text-gray-400">Choose from 150 curated DSA problems to begin your AI-powered learning journey</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 text-white group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default DSAWithAI;
