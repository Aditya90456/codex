import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SimpleClerkAuth';
import TestCaseRenderer from './TestCaseRenderer';
import apiService from '../services/api';
import {
  BookOpen,
  Target,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Save,
  Send,
  Lightbulb,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Code2,
  Zap
} from 'lucide-react';

const ProblemViewer = ({ problemId, onBack, onCodeChange }) => {
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchProblem();
    }
  }, [problemId]);

  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setUserCode(problem.starterCode[language]);
    }
  }, [problem, language]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProblem(problemId);
      setProblem(response.problem || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch problem');
      console.error('Error fetching problem:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to submit solutions');
      return;
    }

    if (!userCode.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        problemId: problem.id,
        code: userCode,
        language: language
      };

      const response = await apiService.submitSolution(submissionData);
      setSubmissionStatus(response);
      
      // Show success message
      alert('Solution submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit solution: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-900/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'testcases', label: 'Test Cases', icon: Target },
    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
    { id: 'submissions', label: 'Submissions', icon: BarChart3 },
    { id: 'discuss', label: 'Discuss', icon: MessageSquare }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 text-lg mb-4">Error loading problem</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Problem not found</p>
          <button
            onClick={onBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-white">{problem.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{problem.category}</span>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Users size={14} />
                  <span>1.2k solved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
              <ThumbsUp size={18} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
              <ThumbsDown size={18} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700">
              <Star size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem Details */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 px-6">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'description' && (
              <div className="p-6 space-y-6">
                {/* Problem Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Problem Description</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </div>
                </div>

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Examples</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium text-blue-400 mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Input: </span>
                              <code className="text-yellow-300 bg-gray-900 px-2 py-1 rounded">
                                {example.input}
                              </code>
                            </div>
                            <div>
                              <span className="text-gray-400">Output: </span>
                              <code className="text-green-300 bg-gray-900 px-2 py-1 rounded">
                                {example.output}
                              </code>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="text-gray-400">Explanation: </span>
                                <span className="text-gray-300">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                    <ul className="space-y-1 text-gray-300">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <code className="text-sm bg-gray-800 px-2 py-1 rounded">{constraint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'testcases' && (
              <div className="p-6">
                <TestCaseRenderer
                  problem={problem}
                  userCode={userCode}
                  language={language}
                  onRunTests={(results) => {
                    console.log('Test results:', results);
                  }}
                />
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Solutions</h3>
                  <p className="text-gray-400">
                    Solutions will be available after you submit your code
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Your Submissions</h3>
                  <p className="text-gray-400">
                    {user ? 'No submissions yet' : 'Please log in to view submissions'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'discuss' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Discussion</h3>
                  <p className="text-gray-400">
                    Join the discussion about this problem
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Code2 size={14} />
                  <span>Auto-save enabled</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('testcases')}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Play size={16} />
                  <span>Run</span>
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !user}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSubmitting || !user
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-gray-900">
            <textarea
              value={userCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full bg-gray-900 text-white p-6 font-mono text-sm resize-none focus:outline-none"
              placeholder="Write your solution here..."
              spellCheck={false}
            />
          </div>

          {/* Status Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Lines: {userCode.split('\n').length}</span>
              <span>Characters: {userCode.length}</span>
              <span>Language: {language}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {submissionStatus && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Zap size={14} />
                  <span>Last submission: Accepted</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemViewer;