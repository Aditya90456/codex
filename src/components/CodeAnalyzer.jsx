import { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertTriangle, Info, Zap, Target } from 'lucide-react';

const CodeAnalyzer = ({ files, activeFile }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(Date.now());

  // Real-time analysis when files change
  useEffect(() => {
    setLastAnalyzed(Date.now());
    analyzeCode();
  }, [files, activeFile]);

  // Also analyze when file content changes
  useEffect(() => {
    if (files[activeFile]?.content) {
      analyzeCode();
    }
  }, [files[activeFile]?.content]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    // Faster analysis for better responsiveness
    setTimeout(() => {
      const result = performAnalysis();
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 200); // Reduced from 800ms to 200ms
  };

  const performAnalysis = () => {
    const currentFile = files[activeFile];
    if (!currentFile) return null;

    const content = currentFile.content;
    const lines = content.split('\n').length;
    
    // Basic analysis
    const analysis = {
      complexity: lines > 100 ? 'High' : lines > 50 ? 'Medium' : 'Low',
      quality: calculateQuality(content),
      suggestions: generateSuggestions(content, activeFile),
      metrics: {
        lines,
        methods: (content.match(/public|private|protected.*\(/g) || []).length,
        classes: (content.match(/class\s+\w+/g) || []).length,
        comments: (content.match(/\/\/|\/\*/g) || []).length
      },
      issues: findIssues(content, activeFile)
    };

    return analysis;
  };

  const calculateQuality = (content) => {
    let score = 70;
    
    // Check for good practices
    if (content.includes('//') || content.includes('/*')) score += 10;
    if (content.includes('try') || content.includes('catch')) score += 10;
    if (content.includes('!= null')) score += 5;
    if (content.includes('Log.')) score += 5;
    
    return Math.min(score, 100);
  };

  const generateSuggestions = (content, fileName) => {
    const suggestions = [];

    if (fileName.endsWith('.java')) {
      if (!content.includes('Log.') && content.includes('System.out.println')) {
        suggestions.push({
          type: 'improvement',
          message: 'Use Android Log instead of System.out.println',
          priority: 'medium'
        });
      }

      if (!content.includes('try') && content.includes('findViewById')) {
        suggestions.push({
          type: 'safety',
          message: 'Add null checks for findViewById results',
          priority: 'high'
        });
      }

      if (content.includes('AsyncTask')) {
        suggestions.push({
          type: 'modernization',
          message: 'AsyncTask is deprecated, use ExecutorService or Coroutines',
          priority: 'high'
        });
      }
    }

    if (fileName.endsWith('.xml')) {
      if (!content.includes('contentDescription') && content.includes('ImageView')) {
        suggestions.push({
          type: 'accessibility',
          message: 'Add contentDescription for ImageViews',
          priority: 'medium'
        });
      }
    }

    return suggestions;
  };

  const findIssues = (content, fileName) => {
    const issues = [];

    // Check for potential issues
    if (content.includes('findViewById') && !content.includes('!= null')) {
      issues.push({
        type: 'warning',
        message: 'Potential null pointer exception with findViewById',
        line: content.split('\n').findIndex(line => line.includes('findViewById')) + 1
      });
    }

    if (fileName.endsWith('.xml') && content.includes('LinearLayout') && !content.includes('android:orientation')) {
      issues.push({
        type: 'error',
        message: 'LinearLayout missing orientation attribute',
        line: content.split('\n').findIndex(line => line.includes('LinearLayout')) + 1
      });
    }

    return issues;
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-pulse text-purple-500 mx-auto mb-2" />
          <p className="text-gray-600">Analyzing code...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No analysis available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* Real-time analysis indicator */}
      <div className="bg-white p-3 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700">Real-time Analysis</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Live Updates</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Last analyzed: {new Date(lastAnalyzed).toLocaleTimeString()}
        </p>
      </div>

      {/* Quality Score */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-700">Code Quality</h4>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-lg">{analysis.quality}%</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              analysis.quality >= 80 ? 'bg-green-500' :
              analysis.quality >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.quality}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-gray-700 mb-3">Code Metrics</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Lines:</span>
            <span className="font-semibold ml-2">{analysis.metrics.lines}</span>
          </div>
          <div>
            <span className="text-gray-600">Methods:</span>
            <span className="font-semibold ml-2">{analysis.metrics.methods}</span>
          </div>
          <div>
            <span className="text-gray-600">Classes:</span>
            <span className="font-semibold ml-2">{analysis.metrics.classes}</span>
          </div>
          <div>
            <span className="text-gray-600">Comments:</span>
            <span className="font-semibold ml-2">{analysis.metrics.comments}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Complexity:</span>
            <span className={`text-sm font-semibold ${
              analysis.complexity === 'Low' ? 'text-green-600' :
              analysis.complexity === 'Medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.complexity}
            </span>
          </div>
        </div>
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700 mb-3">Issues Found</h4>
          <div className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded border-l-2 border-red-500">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800">{issue.message}</p>
                  <p className="text-xs text-red-600">Line {issue.line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700 mb-3">Suggestions</h4>
          <div className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className={`flex items-start space-x-2 p-2 rounded border-l-2 ${
                suggestion.priority === 'high' ? 'bg-orange-50 border-orange-500' :
                suggestion.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <Info className={`w-4 h-4 mt-0.5 ${
                  suggestion.priority === 'high' ? 'text-orange-500' :
                  suggestion.priority === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm ${
                    suggestion.priority === 'high' ? 'text-orange-800' :
                    suggestion.priority === 'medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {suggestion.message}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">{suggestion.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Issues */}
      {analysis.issues.length === 0 && analysis.suggestions.length === 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">No issues found!</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Your code looks good.</p>
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;