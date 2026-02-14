import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Editor from '@monaco-editor/react';
import { 
  Code, Layers, Database, Server, Search, Zap, Trophy, 
  BookOpen, Filter, ChevronRight, Play, CheckCircle, Lock,
  Building2, TrendingUp, Users, Globe, Send, Settings,
  RotateCcw, Copy, Share2, Terminal, Loader2, ChevronDown
} from 'lucide-react';
import { lldProblems, lldCategories, lldCompanies } from '../data/lldProblems';

const LLDProblemsViewer = () => {
  const { user } = useUser();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(14);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleTab, setConsoleTab] = useState('console');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);

  const allProblems = [
    ...lldProblems.easy.map(p => ({ ...p, difficulty: 'Easy' })),
    ...lldProblems.medium.map(p => ({ ...p, difficulty: 'Medium' })),
    ...lldProblems.hard.map(p => ({ ...p, difficulty: 'Hard' }))
  ];

  const filteredProblems = allProblems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    const matchesCompany = selectedCompany === 'all' || problem.companies.includes(selectedCompany);
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesCompany && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'from-green-500 to-emerald-500',
      'Medium': 'from-yellow-500 to-orange-500',
      'Hard': 'from-red-500 to-purple-500'
    };
    return colors[difficulty] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Object-Oriented Design': <Code className="w-5 h-5" />,
      'Scalable Systems': <TrendingUp className="w-5 h-5" />,
      'Caching Systems': <Database className="w-5 h-5" />,
      'Distributed Systems': <Globe className="w-5 h-5" />,
      'Search Systems': <Search className="w-5 h-5" />,
      'Database Design': <Server className="w-5 h-5" />,
      'API Design': <Layers className="w-5 h-5" />
    };
    return icons[category] || <Code className="w-5 h-5" />;
  };

  const startProblem = (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode || '');
    setShowEditor(true);
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  if (showEditor && selectedProblem) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Modern Header */}
        <div className="h-16 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700 backdrop-blur-xl flex items-center justify-between px-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {selectedProblem.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${getDifficultyColor(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="text-xs text-gray-400">{selectedProblem.category}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEditor(false)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            ← Back to Problems
          </button>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Problem Description */}
          <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gradient-to-br from-gray-900/50 to-gray-800/30">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Problem Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProblem.description}</p>
                </div>
                
                {/* Requirements */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Requirements
                  </h4>
                  <ul className="space-y-3">
                    {selectedProblem.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Classes to Implement */}
                {selectedProblem.classes && (
                  <div>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      Classes to Implement
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProblem.classes.map((cls, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-semibold shadow-lg">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hints */}
                {selectedProblem.hints && (
                  <div>
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Hints
                    </h4>
                    <ul className="space-y-2">
                      {selectedProblem.hints.map((hint, idx) => (
                        <li key={idx} className="text-gray-400 text-sm bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
                          💡 {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Companies */}
                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    Asked by Companies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.companies.map((company, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-600 hover:border-cyan-500 transition-colors">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Editor Header */}
            <div className="h-14 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-blue-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600">
                  <span className="text-xs text-gray-400">Font:</span>
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-600 transition-colors text-gray-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono text-white w-8 text-center">{fontSize}</span>
                  <button
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-600 transition-colors text-gray-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={language}
                value={code || ''}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="h-16 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-t border-gray-700 flex items-center justify-between px-4 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    alert('Code copied!');
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  title="Share Code"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCode(selectedProblem.starterCode || '')}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  title="Reset Code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsRunning(true);
                    setConsoleTab('console');
                    setConsoleOutput([{ type: 'info', message: '⏳ Running code...' }]);
                    setTimeout(() => {
                      setConsoleOutput([
                        { type: 'success', message: '✓ Code executed successfully' },
                        { type: 'info', message: 'Output: Test passed' }
                      ]);
                      setIsRunning(false);
                    }, 1500);
                  }}
                  disabled={isRunning}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isRunning
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setConsoleTab('results');
                    setTimeout(() => {
                      setConsoleOutput([
                        { type: 'success', message: '✓ All test cases passed!' },
                        { type: 'success', message: '✓ Design is scalable' },
                        { type: 'success', message: '✓ Code quality: Excellent' }
                      ]);
                      setIsSubmitting(false);
                    }, 2000);
                  }}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Console/Output Panel */}
        <div className={`${isConsoleMinimized ? 'h-12' : 'h-64'} bg-gradient-to-br from-gray-800 to-gray-900 border-t-2 border-gray-700 flex flex-col shadow-2xl transition-all duration-300`}>
          <div className="flex items-center justify-between border-b border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-800/30">
            <div className="flex">
              <button
                onClick={() => setConsoleTab('console')}
                className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                  consoleTab === 'console'
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>Console</span>
                </div>
                {consoleTab === 'console' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
                )}
              </button>
              <button
                onClick={() => setConsoleTab('results')}
                className={`px-6 py-3 text-sm font-semibold transition-all duration-200 relative ${
                  consoleTab === 'results'
                    ? 'text-green-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Results</span>
                </div>
                {consoleTab === 'results' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
              className="mr-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
              title={isConsoleMinimized ? "Expand Console" : "Minimize Console"}
            >
              {isConsoleMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 rotate-180" />}
            </button>
          </div>

          {!isConsoleMinimized && (
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-900/80 to-gray-800/80 font-mono text-sm">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`py-1 ${
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'success' ? 'text-green-400' :
                      line.type === 'info' ? 'text-blue-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line.message}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Ready to run your code...</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Low-Level Design
              </h1>
              <p className="text-gray-400 text-lg">
                Master scalable system design with real-world problems
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Problems</span>
                <span className="text-2xl font-bold">{allProblems.length}</span>
              </div>
            </div>
            <div className="bg-green-600/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Easy</span>
                <span className="text-2xl font-bold text-green-400">{lldProblems.easy.length}</span>
              </div>
            </div>
            <div className="bg-yellow-600/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Medium</span>
                <span className="text-2xl font-bold text-yellow-400">{lldProblems.medium.length}</span>
              </div>
            </div>
            <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hard</span>
                <span className="text-2xl font-bold text-red-400">{lldProblems.hard.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {lldCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Companies</option>
                {lldCompanies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer hover:transform hover:scale-105"
              onClick={() => startProblem(problem)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(problem.category)}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                {problem.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {problem.description}
              </p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Companies:</p>
                <div className="flex flex-wrap gap-1">
                  {problem.companies.slice(0, 3).map((company, idx) => (
                    <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {company}
                    </span>
                  ))}
                  {problem.companies.length > 3 && (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      +{problem.companies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Problem
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No problems found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LLDProblemsViewer;
