import React from 'react';
import { Lightbulb, Code, Zap, FileCode } from 'lucide-react';

/**
 * Code Completion Panel Component
 * Displays AI-powered code suggestions
 */
const CodeCompletionPanel = ({ 
  suggestions = [], 
  isLoading = false,
  onSelect,
  position = { top: 0, left: 0 },
  visible = false
}) => {
  console.log('[CodeCompletionPanel] Render:', {
    visible,
    isLoading,
    suggestionsCount: suggestions.length,
    position
  });
  
  if (!visible || (!isLoading && suggestions.length === 0)) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'function':
        return <Code className="w-4 h-4 text-blue-400" />;
      case 'variable':
        return <FileCode className="w-4 h-4 text-green-400" />;
      case 'keyword':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Lightbulb className="w-4 h-4 text-purple-400" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div 
      className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: '400px',
        maxHeight: '300px'
      }}
    >
      {/* Header */}
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
        <Lightbulb className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">AI Suggestions</span>
        {isLoading && (
          <div className="ml-auto">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="overflow-y-auto max-h-64">
        {isLoading && suggestions.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Generating suggestions...</span>
            </div>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect && onSelect(suggestion)}
              className="w-full px-4 py-3 hover:bg-gray-700 transition-colors text-left border-b border-gray-700 last:border-b-0 focus:outline-none focus:bg-gray-700"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <code className="text-sm font-mono text-white truncate">
                      {suggestion.text}
                    </code>
                    {suggestion.confidence && (
                      <div className="flex-shrink-0">
                        <div 
                          className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence)}`}
                          title={`Confidence: ${Math.round(suggestion.confidence * 100)}%`}
                        ></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {suggestion.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500 font-mono">
                  {index + 1}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="bg-gray-900 px-4 py-2 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-300">Tab</kbd> or click to insert
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeCompletionPanel;
