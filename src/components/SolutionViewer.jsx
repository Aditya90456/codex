import { useState } from 'react';
import { Eye, EyeOff, Lightbulb, Code, BookOpen, Copy, Check } from 'lucide-react';
import { dsaSolutions } from '../data/dsaSolutions';

const SolutionViewer = ({ problemId, language, onUseSolution }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  const solution = dsaSolutions.getSolution(problemId, language);
  
  if (!solution) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-gray-400">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">Solution not available yet for this problem</span>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(solution.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseSolution = () => {
    if (onUseSolution) {
      onUseSolution(solution.code);
    }
  };

  return (
    <div className="space-y-3">
      {/* Solution Toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">Solution Available</span>
        </div>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
        >
          {showSolution ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Solution
            </>
          ) : (
            <>      
              <Eye className="w-4 h-4" />
              View Solution
            </>
          )}
        </button>
      </div>

      {/* Explanation */}
      {showSolution && (
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Approach & Complexity</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {solution.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Solution Code */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50 border-b border-slate-600">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Optimal Solution ({language})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleUseSolution}
                  className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded transition-colors"
                >
                  Use This Solution
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-gray-300 font-mono">
                {solution.code}
              </code>
            </pre>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-300">
              💡 <strong>Learning Tip:</strong> Try solving the problem yourself first! 
              Solutions are here to help you learn, not to copy directly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionViewer;
