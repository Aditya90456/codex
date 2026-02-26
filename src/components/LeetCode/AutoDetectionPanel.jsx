import React, { useState, useEffect } from 'react';
import { 
  Brain, Zap, Clock, TrendingUp, AlertCircle, 
  CheckCircle, Lightbulb, Target, Activity 
} from 'lucide-react';

const AutoDetectionPanel = ({ analysis, emotionData }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (analysis) {
      const newInsights = {
        algorithm: analysis.algorithms[0]?.algorithm || 'Analyzing...',
        confidence: analysis.algorithms[0]?.confidence || 0,
        complexity: analysis.complexity,
        typingSpeed: analysis.typingPattern?.speed || 'normal',
        codingConfidence: analysis.typingPattern?.confidence || 'medium',
        predictions: analysis.predictions,
        suggestions: analysis.suggestions,
        issues: analysis.issues
      };
      setInsights(newInsights);
    } else {
      // Show default state when no analysis yet
      setInsights({
        algorithm: 'Start typing to analyze...',
        confidence: 0,
        complexity: { timeComplexity: 'O(?)', spaceComplexity: 'O(?)' },
        typingSpeed: 'normal',
        codingConfidence: 'medium',
        predictions: [],
        suggestions: [],
        issues: []
      });
    }
  }, [analysis]);

  if (!isVisible) return null;

  // Ensure insights exists
  if (!insights) return null;

  const getComplexityColor = (complexity) => {
    if (complexity.includes('O(1)') || complexity.includes('O(log')) return '#10b981';
    if (complexity.includes('O(n)')) return '#f59e0b';
    return '#ef4444';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 'high') return '#10b981';
    if (confidence === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="auto-detection-panel">
      <div className="detection-header">
        <div className="header-left">
          <Activity className="pulse-icon" />
          <h4>AI Auto-Detection</h4>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="close-btn"
          title="Hide panel"
        >
          ×
        </button>
      </div>

      <div className="detection-grid">
        {/* Algorithm Detection */}
        <div className="detection-card">
          <div className="card-header">
            <Brain size={18} style={{ color: '#8b5cf6' }} />
            <span>Algorithm Detected</span>
          </div>
          <div className="card-content">
            <div className="algorithm-name">{insights.algorithm}</div>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ 
                  width: `${(insights.confidence * 100)}%`,
                  backgroundColor: '#8b5cf6'
                }}
              />
            </div>
            <span className="confidence-text">
              {Math.round(insights.confidence * 100)}% confidence
            </span>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="detection-card">
          <div className="card-header">
            <TrendingUp size={18} style={{ color: getComplexityColor(insights.complexity.timeComplexity) }} />
            <span>Complexity</span>
          </div>
          <div className="card-content">
            <div className="complexity-row">
              <span className="label">Time:</span>
              <span 
                className="value"
                style={{ color: getComplexityColor(insights.complexity.timeComplexity) }}
              >
                {insights.complexity.timeComplexity}
              </span>
            </div>
            <div className="complexity-row">
              <span className="label">Space:</span>
              <span 
                className="value"
                style={{ color: getComplexityColor(insights.complexity.spaceComplexity) }}
              >
                {insights.complexity.spaceComplexity}
              </span>
            </div>
          </div>
        </div>

        {/* Typing Analysis */}
        <div className="detection-card">
          <div className="card-header">
            <Clock size={18} style={{ color: '#3b82f6' }} />
            <span>Coding Pattern</span>
          </div>
          <div className="card-content">
            <div className="pattern-row">
              <span className="label">Speed:</span>
              <span className="value">{insights.typingSpeed}</span>
            </div>
            <div className="pattern-row">
              <span className="label">Confidence:</span>
              <span 
                className="value"
                style={{ color: getConfidenceColor(insights.codingConfidence) }}
              >
                {insights.codingConfidence}
              </span>
            </div>
          </div>
        </div>

        {/* Emotion + Prediction */}
        {emotionData && (
          <div className="detection-card">
            <div className="card-header">
              <Target size={18} style={{ color: '#f59e0b' }} />
              <span>Current State</span>
            </div>
            <div className="card-content">
              <div className="state-row">
                <span className="label">Emotion:</span>
                <span className="value">{emotionData.emotion}</span>
              </div>
              <div className="state-row">
                <span className="label">Focus:</span>
                <span className="value">{emotionData.focus}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predictions */}
      {insights.predictions && insights.predictions.length > 0 && (
        <div className="predictions-section">
          <div className="section-header">
            <Zap size={16} />
            <span>AI Predictions</span>
          </div>
          <div className="predictions-list">
            {insights.predictions.slice(0, 3).map((pred, idx) => (
              <div key={idx} className="prediction-item">
                <div className="prediction-bar">
                  <div 
                    className="prediction-fill"
                    style={{ width: `${pred.confidence * 100}%` }}
                  />
                </div>
                <span className="prediction-text">
                  {pred.action.replace(/_/g, ' ')}
                </span>
                <span className="prediction-confidence">
                  {Math.round(pred.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {insights.suggestions && insights.suggestions.length > 0 && (
        <div className="suggestions-section">
          <div className="section-header">
            <Lightbulb size={16} />
            <span>AI Suggestions</span>
          </div>
          <div className="suggestions-list">
            {insights.suggestions.map((sug, idx) => (
              <div key={idx} className={`suggestion-item ${sug.priority}`}>
                <CheckCircle size={14} />
                <span>{sug.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {insights.issues && insights.issues.length > 0 && (
        <div className="issues-section">
          <div className="section-header">
            <AlertCircle size={16} />
            <span>Code Issues</span>
          </div>
          <div className="issues-list">
            {insights.issues.map((issue, idx) => (
              <div key={idx} className={`issue-item ${issue.type}`}>
                <span className="issue-type">{issue.type}</span>
                <span className="issue-message">{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoDetectionPanel;
