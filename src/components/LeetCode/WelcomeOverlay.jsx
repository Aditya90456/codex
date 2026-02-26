import React from 'react';
import { X, Brain, Camera, Zap, CheckCircle } from 'lucide-react';

const WelcomeOverlay = ({ onDismiss, onStartTour }) => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <button onClick={onDismiss} className="welcome-close">
          <X size={24} />
        </button>

        <div className="welcome-header">
          <Brain size={48} className="welcome-icon" />
          <h2>Welcome to the Redesigned LeetCode Editor!</h2>
          <p>Your AI-powered coding companion with advanced features</p>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#8b5cf6' }}>
              <Brain size={24} />
            </div>
            <h3>Mind Control</h3>
            <p>Capture your thinking process in real-time as you solve problems</p>
            <div className="feature-status">
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span>Auto-enabled</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#3b82f6' }}>
              <Camera size={24} />
            </div>
            <h3>Emotion Detection</h3>
            <p>AI analyzes your facial expressions to understand your state</p>
            <div className="feature-status">
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span>Ready to activate</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#f59e0b' }}>
              <Zap size={24} />
            </div>
            <h3>Auto-Detection</h3>
            <p>Real-time code analysis with algorithm detection and suggestions</p>
            <div className="feature-status">
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span>Auto-enabled</span>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button onClick={onDismiss} className="btn-primary">
            Get Started
          </button>
          <button onClick={onStartTour} className="btn-secondary">
            Take a Tour
          </button>
        </div>

        <div className="welcome-footer">
          <label className="dont-show-again">
            <input 
              type="checkbox" 
              onChange={(e) => {
                if (e.target.checked) {
                  localStorage.setItem('leetcode-welcome-seen', 'true');
                }
              }}
            />
            Don't show this again
          </label>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
