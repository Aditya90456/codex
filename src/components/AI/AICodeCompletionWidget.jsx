// AI Code Completion Widget - Inline suggestion display
import { useEffect, useState } from 'react';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AICodeCompletionWidget = ({ 
  completion, 
  isLoading, 
  position, 
  onAccept, 
  onDismiss,
  editorRef 
}) => {
  const { theme } = useTheme();
  const [displayPosition, setDisplayPosition] = useState(null);

  useEffect(() => {
    if (!completion && !isLoading) {
      setDisplayPosition(null);
      return;
    }

    // Calculate position based on cursor
    if (editorRef?.current && position) {
      try {
        const editor = editorRef.current;
        const model = editor.getModel();
        
        if (model) {
          // Get cursor position in pixels
          const cursorPos = editor.getPosition();
          const coords = editor.getScrolledVisiblePosition(cursorPos);
          
          if (coords) {
            setDisplayPosition({
              top: coords.top + coords.height,
              left: coords.left,
            });
          }
        }
      } catch (error) {
        console.error('Position calculation error:', error);
      }
    }
  }, [completion, isLoading, position, editorRef]);

  if (!completion && !isLoading) return null;

  return (
    <>
      {/* Inline Ghost Text - Monaco Style */}
      {completion && displayPosition && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            top: `${displayPosition.top}px`,
            left: `${displayPosition.left}px`,
          }}
        >
          <span className="text-gray-500 italic font-mono text-sm opacity-60">
            {completion}
          </span>
        </div>
      )}

      {/* Floating Widget */}
      {(completion || isLoading) && (
        <div 
          className={`fixed bottom-20 right-6 bg-gradient-to-br ${theme.card} border-2 ${theme.border} rounded-xl shadow-2xl backdrop-blur-xl z-50 max-w-md animate-slideUp`}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-sm font-semibold text-purple-400">
                  AI Suggestion
                </span>
              </div>
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-white/10 rounded transition-all"
                title="Dismiss (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating suggestion...</span>
              </div>
            ) : completion ? (
              <>
                <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-white/5">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
                    {completion}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={onAccept}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition-all text-sm"
                    title="Accept (Tab)"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={onDismiss}
                    className={`px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-sm border ${theme.border}`}
                    title="Dismiss (Esc)"
                  >
                    Dismiss
                  </button>
                </div>

                {/* Keyboard Hints */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">Tab</kbd> Accept</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> Dismiss</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default AICodeCompletionWidget;
