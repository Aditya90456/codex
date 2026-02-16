import { useState } from 'react';
import { Eye, EyeOff, Lightbulb, Code, BookOpen, Copy, Check, X, Zap, Brain } from 'lucide-react';
import { dsaSolutions } from '../data/dsaSolutions';

const SolutionViewer = ({ problem, language, onClose, onUseSolution }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'javascript');

  const problemId = problem?.id;
  const solution = dsaSolutions.getSolution(problemId, selectedLanguage);
  
  if (!problem) {
    return null;
  }

  const handleCopy = () => {
    if (solution?.code) {
      navigator.clipboard.writeText(solution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseSolution = () => {
    if (onUseSolution && solution?.code) {
      onUseSolution(solution.code);
      onClose?.();
    }
  };

  const languages = ['javascript', 'python', 'java', 'cpp', 'typescript'];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Solution Viewer</h2>
                <p className="text-white/80 text-sm mt-1">{problem.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!solution ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Solution Not Available</h3>
              <p className="text-gray-400 mb-6">
                Solution for this problem in {selectedLanguage} is coming soon!
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-500">Try another language:</span>
                <div className="flex gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        selectedLanguage === lang
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Select Language:</span>
                </div>
                <div className="flex gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        selectedLanguage === lang
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approach */}
              {solution.approach && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Approach
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{solution.approach}</p>
                </div>
              )}

              {/* Complexity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Time Complexity</div>
                  <div className="text-xl font-bold text-green-400">{solution.timeComplexity || 'N/A'}</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Space Complexity</div>
                  <div className="text-xl font-bold text-blue-400">{solution.spaceComplexity || 'N/A'}</div>
                </div>
              </div>

              {/* Solution Toggle */}
              <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-white">Solution Code</span>
                  </div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-all text-sm font-semibold shadow-lg"
                  >
                    {showSolution ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide Solution
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show Solution
                      </>
                    )}
                  </button>
                </div>

                {showSolution && (
                  <div className="space-y-4">
                    {/* Code Block */}
                    <div className="relative">
                      <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700 max-h-96">
                        <code className="text-sm text-gray-300 font-mono">{solution.code}</code>
                      </pre>
                      <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Explanation */}
                    {solution.explanation && (
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          Explanation
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{solution.explanation}</p>
                      </div>
                    )}

                    {/* Warning */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-sm text-yellow-300">
                        💡 <strong>Learning Tip:</strong> Try solving the problem yourself first! 
                        Solutions are here to help you learn, not to copy directly.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {onUseSolution && (
                      <button
                        onClick={handleUseSolution}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all font-semibold shadow-lg"
                      >
                        <Zap className="w-5 h-5" />
                        Use This Solution
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionViewer;
