import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, CheckCircle, Clock, TrendingUp, Award, Star, Zap,
  BookOpen, Code, Brain, ChevronRight, Calendar, Trophy,
  MapPin, Flag, ArrowRight, Sparkles, Building2, Users,
  Rocket, BarChart3, Play, Lock, CheckCheck, Lightbulb,
  ExternalLink, Code2, X
} from 'lucide-react';
import productCompanyRoadmap from '../data/productCompanyRoadmap';
import LeetCodeEditor from './LeetCodeEditor';

const ProductCompanyRoadmap = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [showProblemSheet, setShowProblemSheet] = useState(false);
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Convert problem name to LeetCode URL slug
  const getLeetCodeUrl = (problemName) => {
    const slug = problemName
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/\s+/g, '-')
      .replace(/'/g, '');
    return `https://leetcode.com/problems/${slug}/`;
  };

  const handlePracticeNow = () => {
    navigate('/leetcode');
  };

  const handlePracticeProblem = (problem, topic) => {
    setSelectedProblem({ problem, topic });
    setShowEditor(true);
  };

  const toggleProblemComplete = (problemName) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemName)) {
        newSet.delete(problemName);
      } else {
        newSet.add(problemName);
      }
      return newSet;
    });
  };

  // Get all problems from roadmap
  const getAllProblems = () => {
    const problems = [];
    productCompanyRoadmap.phases.forEach(phase => {
      phase.topics.forEach(topic => {
        topic.keyProblems.forEach(problem => {
          problems.push({
            problem,
            topic: topic.name,
            phase: phase.title,
            companies: topic.companies,
            difficulty: getDifficulty(problem)
          });
        });
      });
    });
    return problems;
  };

  const getDifficulty = (problemName) => {
    const easyProblems = ['Two Sum', 'Valid Anagram', 'Contains Duplicate', 'Reverse Integer', 'Palindrome Number'];
    const hardProblems = ['Median of Two Sorted Arrays', 'Trapping Rain Water', 'Word Ladder', 'Burst Balloons'];
    
    if (easyProblems.some(p => problemName.includes(p))) return 'Easy';
    if (hardProblems.some(p => problemName.includes(p))) return 'Hard';
    return 'Medium';
  };

  const phaseColors = {
    phase1: 'from-blue-500 to-cyan-500',
    phase2: 'from-green-500 to-emerald-500',
    phase3: 'from-purple-500 to-pink-500',
    phase4: 'from-orange-500 to-red-500',
    phase5: 'from-indigo-500 to-purple-500',
    phase6: 'from-pink-500 to-rose-500'
  };

  const companyLogos = {
    Google: '🔍',
    Amazon: '📦',
    Microsoft: '🪟',
    Meta: '👥',
    Apple: '🍎',
    Netflix: '🎬',
    Uber: '🚗',
    Adobe: '🎨'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      {/* Problem Sheet Modal */}
      {showProblemSheet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  Complete Problem Sheet
                </h2>
                <p className="text-white/80 mt-1">Track your progress across all 300+ problems</p>
              </div>
              <button
                onClick={() => setShowProblemSheet(false)}
                className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all"
              >
                <ChevronRight className="w-6 h-6 rotate-90" />
              </button>
            </div>

            {/* Stats */}
            <div className="p-6 border-b border-white/10">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30">
                  <div className="text-2xl font-bold text-green-400">{completedProblems.size}</div>
                  <div className="text-sm text-gray-300">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-400/30">
                  <div className="text-2xl font-bold text-blue-400">{getAllProblems().length - completedProblems.size}</div>
                  <div className="text-sm text-gray-300">Remaining</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((completedProblems.size / getAllProblems().length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-300">Progress</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
                  <div className="text-2xl font-bold text-yellow-400">{getAllProblems().length}</div>
                  <div className="text-sm text-gray-300">Total Problems</div>
                </div>
              </div>
            </div>

            {/* Problem List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {productCompanyRoadmap.phases.map((phase) => (
                  <div key={phase.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className={`bg-gradient-to-r ${phaseColors[phase.id]} p-4`}>
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <p className="text-white/80 text-sm">{phase.duration}</p>
                    </div>
                    <div className="p-4">
                      {phase.topics.map((topic) => (
                        <div key={topic.id} className="mb-4 last:mb-0">
                          <h4 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            {topic.name}
                          </h4>
                          <div className="space-y-2">
                            {topic.keyProblems.map((problem, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  completedProblems.has(problem)
                                    ? 'bg-green-500/10 border-green-400/30'
                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <button
                                    onClick={() => toggleProblemComplete(problem)}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                      completedProblems.has(problem)
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-400 hover:border-green-400'
                                    }`}
                                  >
                                    {completedProblems.has(problem) && (
                                      <CheckCheck className="w-4 h-4 text-white" />
                                    )}
                                  </button>
                                  <span className={completedProblems.has(problem) ? 'line-through text-gray-400' : ''}>
                                    {problem}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    getDifficulty(problem) === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                    getDifficulty(problem) === 'Hard' ? 'bg-red-500/20 text-red-300' :
                                    'bg-yellow-500/20 text-yellow-300'
                                  }`}>
                                    {getDifficulty(problem)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handlePracticeNow}
                                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm border border-blue-400/30 transition-all flex items-center gap-1"
                                  >
                                    <Code2 className="w-3 h-3" />
                                    Practice
                                  </button>
                                  <a
                                    href={getLeetCodeUrl(problem)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 rounded text-sm border border-orange-400/30 transition-all flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    LeetCode
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DSA Roadmap to FAANG
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">
            {productCompanyRoadmap.overview.description}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>{productCompanyRoadmap.overview.totalWeeks} Weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span>{productCompanyRoadmap.overview.estimatedHours}+ Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>300+ Problems</span>
            </div>
            <button
              onClick={() => setShowProblemSheet(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              View Problem Sheet
            </button>
          </div>
        </div>

        {/* Target Companies */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Target Companies</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {productCompanyRoadmap.overview.targetCompanies.map((company) => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCompany === company
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{companyLogos[company]}</span>
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Company-Specific Info */}
        {selectedCompany && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-400/30 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              {selectedCompany} Interview Focus
            </h3>
            {(() => {
              const companyKey = selectedCompany.toLowerCase().replace(/\s+/g, '');
              const info = productCompanyRoadmap.companyFocus[companyKey];
              return info ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {info.focusAreas.map((area) => (
                        <span key={area} className="px-3 py-1 bg-purple-500/30 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-2">Common Patterns:</p>
                    <div className="flex flex-wrap gap-2">
                      {info.commonPatterns.map((pattern) => (
                        <span key={pattern} className="px-3 py-1 bg-blue-500/30 rounded-full text-sm">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-300 mb-2">Interview Tips:</p>
                    <p className="text-white bg-white/10 p-3 rounded-lg">{info.tips}</p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Your Progress</h2>
            </div>
            <div className="text-sm text-gray-300">Week {currentWeek} of 24</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(currentWeek / 24) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">80</div>
              <div className="text-sm text-gray-300">Easy</div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-400">160</div>
              <div className="text-sm text-gray-300">Medium</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">60</div>
              <div className="text-sm text-gray-300">Hard</div>
            </div>
          </div>
        </div>

        {/* Phases Timeline */}
        <div className="space-y-6">
          {productCompanyRoadmap.phases.map((phase, index) => (
            <div
              key={phase.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all"
            >
              {/* Phase Header */}
              <div
                className={`bg-gradient-to-r ${phaseColors[phase.id]} p-6 cursor-pointer`}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{phase.title}</h3>
                      <p className="text-white/80">{phase.duration}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 transition-transform ${
                      selectedPhase === phase.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                <p className="mt-3 text-white/90">{phase.description}</p>
              </div>

              {/* Phase Content */}
              {selectedPhase === phase.id && (
                <div className="p-6 space-y-6 animate-fadeIn">
                  {/* Goals */}
                  <div>
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-400" />
                      Phase Goals
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {phase.goals.map((goal, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white/5 p-3 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Topics to Master
                    </h4>
                    <div className="space-y-4">
                      {phase.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all"
                        >
                          <div
                            className="p-4 cursor-pointer"
                            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-lg font-semibold flex items-center gap-2">
                                <Code className="w-5 h-5 text-purple-400" />
                                {topic.name}
                              </h5>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  topic.priority === 'High' ? 'bg-red-500/30 text-red-300' : 'bg-yellow-500/30 text-yellow-300'
                                }`}>
                                  {topic.priority} Priority
                                </span>
                                <ChevronRight
                                  className={`w-5 h-5 transition-transform ${
                                    expandedTopic === topic.id ? 'rotate-90' : ''
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {topic.estimatedDays} days
                              </span>
                              <span className="flex items-center gap-1">
                                <Code className="w-4 h-4" />
                                {topic.problems} problems
                              </span>
                            </div>
                          </div>

                          {expandedTopic === topic.id && (
                            <div className="px-4 pb-4 space-y-4 animate-fadeIn">
                              {/* Key Problems */}
                              <div>
                                <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  Key Problems:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {topic.keyProblems.map((problem, idx) => (
                                    <a
                                      key={idx}
                                      href={getLeetCodeUrl(problem)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 bg-blue-500/20 rounded-lg text-sm border border-blue-400/30 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all flex items-center gap-1 group"
                                    >
                                      {problem}
                                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Concepts */}
                              <div>
                                <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-400" />
                                  Concepts to Learn:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {topic.concepts.map((concept, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm"
                                    >
                                      {concept}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Companies */}
                              <div>
                                <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-green-400" />
                                  Asked by:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {topic.companies.map((company, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-green-500/20 rounded-lg text-sm font-semibold"
                                    >
                                      {companyLogos[company] || '🏢'} {company}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Practice Button */}
                              <div className="flex gap-3 pt-2">
                                <button
                                  onClick={handlePracticeNow}
                                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                  <Code2 className="w-4 h-4" />
                                  Practice on Our Platform
                                </button>
                                <a
                                  href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(topic.name)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Practice on LeetCode
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-red-400" />
                      Milestones
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {phase.milestones.map((milestone, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-400/30">
                          <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                          <p className="text-sm">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Schedule */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Weekly Practice Schedule
          </h2>
          <div className="grid md:grid-cols-7 gap-3">
            {Object.entries(productCompanyRoadmap.weeklySchedule).map(([day, schedule]) => (
              <div key={day} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="font-bold text-sm mb-2 capitalize text-purple-300">{day}</div>
                <div className="text-xs space-y-1">
                  <p className="text-gray-300">{schedule.focus}</p>
                  <p className="text-yellow-400">{schedule.problems} problems</p>
                  <p className="text-blue-400">{schedule.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Success Metrics
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">300+</div>
              <div className="text-sm text-gray-300">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">20+</div>
              <div className="text-sm text-gray-300">Mock Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">25+</div>
              <div className="text-sm text-gray-300">Patterns Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">10+</div>
              <div className="text-sm text-gray-300">Contests</div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Pro Tips for Success
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-300">Consistency is Key</h3>
              <p className="text-sm text-gray-300">Practice daily, even if it's just 1-2 problems. Regular practice builds muscle memory.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-green-300">Understand, Don't Memorize</h3>
              <p className="text-sm text-gray-300">Focus on understanding patterns and approaches rather than memorizing solutions.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-purple-300">Mock Interviews Matter</h3>
              <p className="text-sm text-gray-300">Practice with peers or use platforms like Pramp to simulate real interview pressure.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-yellow-300">Review Your Mistakes</h3>
              <p className="text-sm text-gray-300">Keep a journal of problems you struggled with and revisit them regularly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCompanyRoadmap;
