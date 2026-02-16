import { useState, useEffect } from 'react';
import { Brain, X, ChevronRight, Lightbulb, Zap } from 'lucide-react';

const SmartDebugNotification = ({ 
  show, 
  confidence, 
  reasons, 
  onAccept, 
  onDismiss, 
  onViewDetails 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  if (!isVisible) return null;

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'from-red-500 to-orange-500';
    if (confidence >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  const getConfidenceText = () => {
    if (confidence >= 80) return 'High Complexity Detected';
    if (confidence >= 60) return 'Moderate Complexity Detected';
    return 'Code Analysis Available';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl max-w-sm">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getConfidenceColor()} p-4 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{getConfidenceText()}</h3>
                <p className="text-white/80 text-xs">Smart Debugger Ready</p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Confidence Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Analysis Confidence</span>
              <span className="font-medium">{confidence}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceColor()} transition-all duration-500`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Top Reasons */}
          <div className="space-y-2 mb-4">
            {reasons.slice(0, 2).map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-300">{reason.description}</span>
              </div>
            ))}
            {reasons.length > 2 && (
              <div className="text-xs text-gray-500">
                +{reasons.length - 2} more insights available
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              Debug Now
            </button>
            <button
              onClick={onViewDetails}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium text-sm transition-all"
            >
              Details
            </button>
          </div>

          {/* Quick Tips */}
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
              <Lightbulb className="w-3 h-3" />
              Quick Tip
            </div>
            <p className="text-xs text-blue-300">
              {confidence >= 80 
                ? "Your code has complex logic that would benefit from step-by-step visualization."
                : confidence >= 60
                ? "The debugger can help you understand the execution flow better."
                : "Use the debugger to track variables and understand your algorithm."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDebugNotification;