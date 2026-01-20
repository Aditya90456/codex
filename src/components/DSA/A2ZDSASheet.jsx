import React, { useState, useEffect } from 'react';
import { a2zDSASheet, getA2ZStats } from '../../data/a2zDSASheet';
import { CheckCircle, Circle, ChevronDown, ChevronRight, Trophy, Target, Zap } from 'lucide-react';

const A2ZDSASheet = () => {
  const [expandedSteps, setExpandedSteps] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [problemStatus, setProblemStatus] = useState({});
  const [stats, setStats] = useState({ totalProblems: 0, solvedProblems: 0, percentage: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('a2z-dsa-progress');
    if (saved) {
      setProblemStatus(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('a2z-dsa-progress', JSON.stringify(problemStatus));
    setStats(getA2ZStats());
  }, [problemStatus]);

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const toggleProblem = (stepId, topicId, problemIndex) => {
    const key = `${stepId}-${topicId}-${problemIndex}`;
    setProblemStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStepProgress = (step) => {
    let total = 0, solved = 0;
    step.topics.forEach(topic => {
      topic.problems.forEach((problem, idx) => {
        const count = problem.count || 1;
        total += count;
        if (problemStatus[`${step.id}-${topic.id}-${idx}`]) solved += count;
      });
    });
    return { total, solved, percentage: total > 0 ? ((solved / total) * 100).toFixed(0) : 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Striver's A2Z DSA Sheet
          </h1>
          <p className="text-gray-400 text-lg">Complete DSA Learning Path - From Basics to Advanced</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total Problems</p>
                <p className="text-4xl font-bold">{stats.totalProblems}</p>
              </div>
              <Target className="w-12 h-12 text-purple-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Solved</p>
                <p className="text-4xl font-bold">{stats.solvedProblems}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm">Progress</p>
                <p className="text-4xl font-bold">{stats.percentage}%</p>
              </div>
              <Trophy className="w-12 h-12 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="max-w-7xl mx-auto space-y-4">
        {a2zDSASheet.map((step) => {
          const progress = getStepProgress(step);
          const isExpanded = expandedSteps[step.id];

          return (
            <div key={step.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
              {/* Step Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-750 transition-all"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    <div>
                      <h2 className="text-2xl font-bold">{step.step}: {step.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {progress.solved} / {progress.total} problems solved
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-400">{progress.percentage}%</p>
                    </div>
                    <div className="w-24 h-24 relative">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress.percentage / 100)}`}
                          className="text-purple-500 transition-all duration-500"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-3">
                  {step.topics.map((topic) => {
                    const isTopicExpanded = expandedTopics[topic.id];
                    
                    return (
                      <div key={topic.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-850 transition-all flex items-center justify-between"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {isTopicExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            <h3 className="text-lg font-semibold text-purple-300">{topic.name}</h3>
                            <span className="text-sm text-gray-500">({topic.problems.length} problems)</span>
                          </div>
                        </div>

                        {/* Problems */}
                        {isTopicExpanded && (
                          <div className="p-4 space-y-2">
                            {topic.problems.map((problem, idx) => {
                              const key = `${step.id}-${topic.id}-${idx}`;
                              const isSolved = problemStatus[key];

                              return (
                                <div 
                                  key={idx}
                                  className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                                    isSolved ? 'bg-green-900/30 border border-green-700' : 'bg-gray-800 border border-gray-700 hover:border-purple-500'
                                  }`}
                                  onClick={() => toggleProblem(step.id, topic.id, idx)}
                                >
                                  <div className="flex items-center space-x-3">
                                    {isSolved ? (
                                      <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-gray-500" />
                                    )}
                                    <span className={isSolved ? 'line-through text-gray-400' : 'text-white'}>
                                      {problem.name}
                                    </span>
                                    {problem.count && (
                                      <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                                        {problem.count} problems
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-2xl">
          <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
          <h3 className="text-2xl font-bold mb-2">Keep Going! 🚀</h3>
          <p className="text-purple-100">
            Master DSA step by step with Striver's comprehensive A2Z sheet
          </p>
        </div>
      </div>
    </div>
  );
};

export default A2ZDSASheet;
