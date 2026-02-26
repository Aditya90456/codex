import React, { useState, useEffect } from 'react';
import { Brain, Zap, Code, Sparkles, Save, Play, RefreshCw } from 'lucide-react';
import '../styles/mind-control-creator.css';

const MindControlProblemCreator = () => {
  const [mindState, setMindState] = useState({
    focus: 50,
    creativity: 50,
    complexity: 50,
    innovation: 50
  });

  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [problemType, setProblemType] = useState('algorithmic');
  const [difficulty, setDifficulty] = useState('medium');

  const problemTypes = [
    { id: 'algorithmic', name: 'Algorithmic', icon: '🧮' },
    { id: 'data-structures', name: 'Data Structures', icon: '🏗️' },
    { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🎯' },
    { id: 'graph-theory', name: 'Graph Theory', icon: '🕸️' },
    { id: 'string-manipulation', name: 'String Manipulation', icon: '📝' },
    { id: 'math-logic', name: 'Math & Logic', icon: '🔢' }
  ];

  const generateProblem = async () => {
    setIsGenerating(true);
    
    // Simulate mind-controlled generation with neural patterns
    await new Promise(resolve => setTimeout(resolve, 2000));

    const problem = {
      id: `mind-${Date.now()}`,
      title: generateTitle(),
      description: generateDescription(),
      difficulty: difficulty,
      type: problemType,
      constraints: generateConstraints(),
      examples: generateExamples(),
      starterCode: generateStarterCode(),
      testCases: generateTestCases(),
      hints: generateHints(),
      mindPattern: { ...mindState }
    };

    setGeneratedProblem(problem);
    setIsGenerating(false);
  };

  const generateTitle = () => {
    const titles = {
      algorithmic: ['Neural Path Finder', 'Mind Maze Navigator', 'Thought Pattern Optimizer'],
      'data-structures': ['Memory Palace Builder', 'Cognitive Tree Constructor', 'Neural Network Organizer'],
      'dynamic-programming': ['Decision Matrix Solver', 'Future State Predictor', 'Optimal Choice Calculator'],
      'graph-theory': ['Connection Mind Map', 'Neural Network Traversal', 'Synapse Path Finder'],
      'string-manipulation': ['Thought Stream Parser', 'Mental Text Processor', 'Consciousness String Decoder'],
      'math-logic': ['Logic Gate Simulator', 'Mathematical Mind Bender', 'Quantum Calculation Challenge']
    };
    
    const typeList = titles[problemType] || titles.algorithmic;
    return typeList[Math.floor(Math.random() * typeList.length)];
  };

  const generateDescription = () => {
    return `You are given a problem that requires ${problemType.replace('-', ' ')} thinking. 
    
Using your mental focus (${mindState.focus}%), creativity (${mindState.creativity}%), 
and innovative thinking (${mindState.innovation}%), solve this challenge.

The complexity level is set to ${mindState.complexity}% based on your mind control settings.`;
  };

  const generateConstraints = () => {
    return [
      `1 <= n <= ${Math.pow(10, Math.floor(mindState.complexity / 20) + 3)}`,
      `Time Complexity: O(n${mindState.complexity > 70 ? ' log n' : ''})`,
      `Space Complexity: O(${mindState.complexity > 50 ? 'n' : '1'})`
    ];
  };

  const generateExamples = () => {
    return [
      {
        input: 'nums = [1, 2, 3, 4, 5]',
        output: '15',
        explanation: 'Based on the mind control pattern, the optimal solution is calculated.'
      },
      {
        input: 'nums = [10, 20, 30]',
        output: '60',
        explanation: 'The neural algorithm processes the input efficiently.'
      }
    ];
  };

  const generateStarterCode = () => {
    return `function solveMindControlProblem(input) {
  // Your mind-controlled solution here
  // Focus: ${mindState.focus}%
  // Creativity: ${mindState.creativity}%
  
  return result;
}`;
  };

  const generateTestCases = () => {
    return [
      { input: '[1,2,3]', expected: '6', hidden: false },
      { input: '[10,20,30]', expected: '60', hidden: false },
      { input: '[100,200,300]', expected: '600', hidden: true }
    ];
  };

  const generateHints = () => {
    return [
      'Think about the neural pathways in your solution',
      'Consider using a mind-mapping approach',
      'Focus on the cognitive complexity of the algorithm'
    ];
  };

  const adjustMindState = (key, value) => {
    setMindState(prev => ({ ...prev, [key]: value }));
  };

  const saveProblem = () => {
    const problems = JSON.parse(localStorage.getItem('mindControlProblems') || '[]');
    problems.push(generatedProblem);
    localStorage.setItem('mindControlProblems', JSON.stringify(problems));
    alert('Problem saved successfully!');
  };

  return (
    <div className="mind-control-creator">
      <div className="creator-header">
        <Brain className="header-icon" />
        <h1>Mind Control Problem Creator</h1>
        <p>Generate LeetCode problems using neural mind control patterns</p>
      </div>

      <div className="creator-grid">
        {/* Mind Control Panel */}
        <div className="control-panel">
          <h2><Zap /> Mind Control Settings</h2>
          
          <div className="mind-controls">
            {Object.entries(mindState).map(([key, value]) => (
              <div key={key} className="control-item">
                <label>
                  <span className="control-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className="control-value">{value}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => adjustMindState(key, parseInt(e.target.value))}
                  className="mind-slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${value}%, #e5e7eb ${value}%)`
                  }}
                />
                <div className="neural-wave" style={{ width: `${value}%` }}></div>
              </div>
            ))}
          </div>

          <div className="problem-settings">
            <div className="setting-group">
              <label>Problem Type</label>
              <select 
                value={problemType} 
                onChange={(e) => setProblemType(e.target.value)}
                className="setting-select"
              >
                {problemTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label>Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="setting-select"
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>

          <button 
            onClick={generateProblem}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="spinning" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles />
                Generate Problem
              </>
            )}
          </button>
        </div>

        {/* Generated Problem Display */}
        <div className="problem-display">
          {generatedProblem ? (
            <>
              <div className="problem-header">
                <h2>{generatedProblem.title}</h2>
                <span className={`difficulty-badge ${generatedProblem.difficulty}`}>
                  {generatedProblem.difficulty}
                </span>
              </div>

              <div className="problem-content">
                <section>
                  <h3>Description</h3>
                  <p>{generatedProblem.description}</p>
                </section>

                <section>
                  <h3>Constraints</h3>
                  <ul>
                    {generatedProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>Examples</h3>
                  {generatedProblem.examples.map((ex, i) => (
                    <div key={i} className="example-box">
                      <div><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      <div><strong>Explanation:</strong> {ex.explanation}</div>
                    </div>
                  ))}
                </section>

                <section>
                  <h3>Starter Code</h3>
                  <pre className="code-block">{generatedProblem.starterCode}</pre>
                </section>

                <section>
                  <h3>Hints</h3>
                  <ul>
                    {generatedProblem.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="problem-actions">
                <button onClick={saveProblem} className="action-btn save">
                  <Save /> Save Problem
                </button>
                <button className="action-btn test">
                  <Play /> Test Solution
                </button>
                <button className="action-btn code">
                  <Code /> Open in Editor
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Brain size={64} />
              <h3>No Problem Generated Yet</h3>
              <p>Adjust your mind control settings and generate a problem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindControlProblemCreator;
