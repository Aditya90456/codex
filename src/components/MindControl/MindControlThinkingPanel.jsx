import React, { useState, useEffect, useRef } from 'react';
import { Brain, Lightbulb, Target, Zap, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import CameraMindCapture from './CameraMindCapture';
import '../../styles/camera-mind-capture.css';

const MindControlThinkingPanel = ({ problemId, onThoughtsSave, onEmotionChange }) => {
  const [thoughts, setThoughts] = useState([]);
  const [currentThought, setCurrentThought] = useState('');
  const [thinkingMode, setThinkingMode] = useState('approach'); // approach, solution, optimization
  const [isVisible, setIsVisible] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const textareaRef = useRef(null);

  const thinkingModes = {
    approach: { icon: Brain, color: '#8b5cf6', label: 'Initial Approach' },
    solution: { icon: Lightbulb, color: '#f59e0b', label: 'Solution Thinking' },
    optimization: { icon: Zap, color: '#10b981', label: 'Optimization Ideas' },
    stuck: { icon: Target, color: '#ef4444', label: 'Stuck/Debug' }
  };

  useEffect(() => {
    // Load saved thoughts for this problem
    const saved = localStorage.getItem(`mind-control-${problemId}`);
    if (saved) {
      setThoughts(JSON.parse(saved));
    }
  }, [problemId]);

  useEffect(() => {
    if (autoSave && thoughts.length > 0) {
      localStorage.setItem(`mind-control-${problemId}`, JSON.stringify(thoughts));
      onThoughtsSave?.(thoughts);
    }
  }, [thoughts, autoSave, problemId, onThoughtsSave]);

  const addThought = () => {
    if (!currentThought.trim()) return;

    const newThought = {
      id: Date.now(),
      text: currentThought,
      mode: thinkingMode,
      timestamp: new Date().toISOString(),
      duration: 0
    };

    setThoughts([...thoughts, newThought]);
    setCurrentThought('');
    textareaRef.current?.focus();
  };

  const deleteThought = (id) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all thoughts? This cannot be undone.')) {
      setThoughts([]);
      localStorage.removeItem(`mind-control-${problemId}`);
    }
  };

  const handleEmotionDetected = (emotionData) => {
    // Auto-adjust thinking mode based on detected emotion
    if (emotionData.thinking && emotionData.thinking !== thinkingMode) {
      setThinkingMode(emotionData.thinking);
    }

    // Pass emotion data to parent
    onEmotionChange?.(emotionData);

    // Auto-add thought based on emotion change
    const emotionThought = `[AI Detected: ${emotionData.emotion}] Focus: ${emotionData.focus}%`;
    console.log('Emotion detected:', emotionThought);
  };

  const handleFocusChange = (focusLevel) => {
    // Track focus level changes
    console.log('Focus level:', focusLevel);
  };

  const ModeIcon = thinkingModes[thinkingMode].icon;

  return (
    <div className="mind-control-panel">
      <div className="mind-control-header">
        <div className="header-left">
          <Brain className="brain-icon" />
          <h3>Mind Control - Thinking Process</h3>
        </div>
        <div className="header-actions">
          <button 
            className="toggle-btn"
            onClick={() => setIsVisible(!isVisible)}
            title={isVisible ? 'Hide panel' : 'Show panel'}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {isVisible && (
        <>
          {/* Camera Mind Capture */}
          <CameraMindCapture 
            onEmotionDetected={handleEmotionDetected}
            onFocusChange={handleFocusChange}
          />

          <div className="thinking-input-section">
            <div className="mode-selector">
              {Object.entries(thinkingModes).map(([key, mode]) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={key}
                    className={`mode-btn ${thinkingMode === key ? 'active' : ''}`}
                    onClick={() => setThinkingMode(key)}
                    style={{ 
                      '--mode-color': mode.color,
                      borderColor: thinkingMode === key ? mode.color : 'transparent'
                    }}
                    title={mode.label}
                  >
                    <Icon size={16} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="input-container">
              <div className="input-header">
                <ModeIcon size={18} style={{ color: thinkingModes[thinkingMode].color }} />
                <span className="mode-label">{thinkingModes[thinkingMode].label}</span>
              </div>
              <textarea
                ref={textareaRef}
                value={currentThought}
                onChange={(e) => setCurrentThought(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addThought();
                  }
                }}
                placeholder="Type your thoughts as you solve... (Ctrl+Enter to add)"
                className="thought-input"
                rows={3}
              />
              <div className="input-actions">
                <button onClick={addThought} className="add-btn">
                  Add Thought
                </button>
                <label className="auto-save-toggle">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                  />
                  Auto-save
                </label>
              </div>
            </div>
          </div>

          <div className="thoughts-timeline">
            <div className="timeline-header">
              <h4>Your Thinking Timeline ({thoughts.length})</h4>
              {thoughts.length > 0 && (
                <button onClick={clearAll} className="clear-btn">
                  <Trash2 size={14} />
                  Clear All
                </button>
              )}
            </div>

            <div className="timeline-list">
              {thoughts.length === 0 ? (
                <div className="empty-state">
                  <Brain size={48} opacity={0.3} />
                  <p>Start typing your thoughts as you solve the problem</p>
                  <p className="hint">Capture your approach, ideas, and debugging process</p>
                </div>
              ) : (
                thoughts.map((thought, index) => {
                  const mode = thinkingModes[thought.mode];
                  const Icon = mode.icon;
                  return (
                    <div key={thought.id} className="thought-item">
                      <div className="thought-marker" style={{ backgroundColor: mode.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="thought-content">
                        <div className="thought-header">
                          <span className="thought-mode" style={{ color: mode.color }}>
                            {mode.label}
                          </span>
                          <span className="thought-time">
                            {new Date(thought.timestamp).toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => deleteThought(thought.id)}
                            className="delete-thought-btn"
                            title="Delete thought"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <p className="thought-text">{thought.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mind-control-footer">
            <div className="stats">
              <span>Total thoughts: {thoughts.length}</span>
              <span>•</span>
              <span>
                Modes used: {new Set(thoughts.map(t => t.mode)).size}
              </span>
            </div>
            <button className="export-btn" onClick={() => {
              const data = JSON.stringify(thoughts, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `thinking-process-${problemId}.json`;
              a.click();
            }}>
              <Save size={14} />
              Export Thoughts
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MindControlThinkingPanel;
