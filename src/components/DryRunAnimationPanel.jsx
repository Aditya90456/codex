import { useState } from 'react';
import { X, Play, Pause, RotateCcw, Zap, Code, Activity, TrendingUp } from 'lucide-react';
import ArrayVisualizer from './Visualizations/ArrayVisualizer';

const DryRunAnimationPanel = ({ dryRunData, onClose, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('visualization');

  if (!dryRunData && !isAnalyzing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-purple-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Live Code Analysis</h2>
                <p className="text-sm text-white/80">Real-time execution visualization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-white font-medium">Analyzing your code...</p>
              <p className="text-gray-400 text-sm mt-2">Generating visualizations</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isAnalyzing && dryRunData && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-800">
              <button
                onClick={() => setActiveTab('visualization')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'visualization'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Visualization
                </div>
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'steps'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Execution Steps
                </div>
              </button>
              <button
                onClick={() => setActiveTab('complexity')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'complexity'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Complexity
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Visualization Tab */}
              {activeTab === 'visualization' && (
                <div className="space-y-6">
                  {dryRunData.visualizations.map((viz, index) => (
                    <div key={index}>
                      {viz.type === 'array' && (
                        <ArrayVisualizer
                          array={viz.data.array}
                          highlights={[]}
                          pointers={[]}
                          operations={viz.data.steps}
                        />
                      )}
                      {viz.type === 'tree' && (
                        <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
                          <h3 className="text-xl font-bold text-white mb-4">{viz.title}</h3>
                          <div className="text-gray-400">Tree visualization coming soon...</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {dryRunData.visualizations.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No visualizations available for this code</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Try using arrays, trees, or other data structures
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Execution Steps Tab */}
              {activeTab === 'steps' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Execution Flow</h3>
                  {dryRunData.executionSteps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                              {step.action}
                            </span>
                          </div>
                          <p className="text-white font-medium mb-2">{step.description}</p>
                          {Object.keys(step.variables).length > 0 && (
                            <div className="bg-slate-900/50 rounded p-2 mt-2">
                              <p className="text-xs text-gray-400 mb-1">Variables:</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(step.variables).map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="text-xs bg-slate-700 px-2 py-1 rounded text-gray-300"
                                  >
                                    {key}: <span className="text-blue-400">{JSON.stringify(value)}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Complexity Tab */}
              {activeTab === 'complexity' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
                    <h3 className="text-xl font-bold text-white mb-4">Algorithm Complexity</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-2">Time Complexity</p>
                        <p className="text-3xl font-bold text-purple-400">
                          {dryRunData.complexity.timeComplexity}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-2">Space Complexity</p>
                        <p className="text-3xl font-bold text-blue-400">
                          {dryRunData.complexity.spaceComplexity}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Detected Patterns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dryRunData.variables.map((variable, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                          >
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-purple-500/20">
                    <h4 className="font-semibold text-white mb-3">Performance Tips:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Consider using hash maps for O(1) lookups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Two-pointer technique can reduce time complexity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">!</span>
                        <span>Watch out for nested loops - they increase complexity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>💡 Tip: Animations update automatically as you code</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DryRunAnimationPanel;
