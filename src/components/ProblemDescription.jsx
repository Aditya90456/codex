import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Play, 
  BookOpen, 
  Code, 
  Clock, 
  Zap, 
  Building2,
  Target,
  CheckCircle,
  Languages
} from 'lucide-react';

const ProblemDescription = ({ problem }) => {
  // Set default active tab based on available links
  const getDefaultTab = () => {
    if (problem?.leetcodeUrl) return 'leetcode';
    if (problem?.gfgUrl) return 'gfg';
    if (problem?.codeforcesUrl) return 'codeforces';
    return 'leetcode';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  // Update active tab when problem changes
  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [problem]);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a problem from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  // Check if this is a DSA pattern problem (has pattern field) or regular problem
  const isDSAPatternProblem = problem.pattern && problem.timeComplexity && problem.spaceComplexity;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-700/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
          <Code className="w-6 h-6 text-blue-400" />
          Problem: {problem.title}
        </h3>
        
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          
          {problem.pattern && (
            <div className="flex items-center gap-2 text-gray-300">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Pattern: {problem.pattern}</span>
            </div>
          )}
          
          {problem.category && (
            <div className="flex items-center gap-2 text-gray-300">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Category: {problem.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* Complexity Info - Only for DSA Pattern problems */}
      {isDSAPatternProblem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-blue-400">Time Complexity</span>
            </div>
            <p className="text-lg font-mono text-white">{problem.timeComplexity}</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="font-medium text-green-400">Space Complexity</span>
            </div>
            <p className="text-lg font-mono text-white">{problem.spaceComplexity}</p>
          </div>
        </div>
      )}

      {/* Problem Description */}
      {problem.description && (
        <div className="mb-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{problem.description}</p>
          </div>
        </div>
      )}

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            Examples
          </h4>
          {problem.examples.map((example, idx) => (
            <div key={idx} className="mb-4 p-4 bg-slate-800 rounded-lg border border-gray-700/30">
              <p className="text-sm mb-2">
                <span className="font-semibold text-gray-400">Example {idx + 1}:</span>
              </p>
              <div className="space-y-1 text-sm font-mono">
                <p><span className="text-gray-400">Input:</span> <span className="text-white">{example.input}</span></p>
                <p><span className="text-gray-400">Output:</span> <span className="text-white">{example.output}</span></p>
                {example.explanation && (
                  <p><span className="text-gray-400">Explanation:</span> <span className="text-gray-300">{example.explanation}</span></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Companies - Only for DSA Pattern problems */}
      {problem.companies && problem.companies.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-orange-400" />
            <h4 className="font-semibold text-orange-400">Companies</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.companies.map((company, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-orange-400/10 text-orange-300 rounded-lg text-sm border border-orange-400/20"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Practice Links - Only for DSA Pattern problems */}
      {isDSAPatternProblem && (problem.leetcodeUrl || problem.gfgUrl || problem.codeforcesUrl) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-cyan-400">Practice Links</h4>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700/50 mb-4">
            {problem.leetcodeUrl && (
              <button
                onClick={() => setActiveTab('leetcode')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'leetcode'
                    ? 'text-orange-400 border-orange-400 bg-orange-400/5'
                    : 'text-gray-400 border-transparent hover:text-orange-300 hover:border-orange-300/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  LeetCode
                </div>
              </button>
            )}
            
            {problem.gfgUrl && (
              <button
                onClick={() => setActiveTab('gfg')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'gfg'
                    ? 'text-green-400 border-green-400 bg-green-400/5'
                    : 'text-gray-400 border-transparent hover:text-green-300 hover:border-green-300/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  GeeksforGeeks
                </div>
              </button>
            )}
            
            {problem.codeforcesUrl && (
              <button
                onClick={() => setActiveTab('codeforces')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'codeforces'
                    ? 'text-blue-400 border-blue-400 bg-blue-400/5'
                    : 'text-gray-400 border-transparent hover:text-blue-300 hover:border-blue-300/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Codeforces
                </div>
              </button>
            )}
          </div>
          
          {/* Tab Content */}
          <div className="min-h-[120px]">
            {activeTab === 'leetcode' && problem.leetcodeUrl && (
              <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-orange-300 mb-1">LeetCode Problem</h5>
                    <p className="text-sm text-orange-200/80">
                      Practice on the world's most popular coding interview platform
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-orange-400" />
                </div>
                <div className="space-y-2 text-sm text-orange-200/90 mb-4">
                  <p>• Interactive coding environment</p>
                  <p>• Real-time test case validation</p>
                  <p>• Discussion forum and solutions</p>
                  <p>• Interview simulation experience</p>
                </div>
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Solve on LeetCode
                </a>
              </div>
            )}
            
            {activeTab === 'gfg' && problem.gfgUrl && (
              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-green-300 mb-1">GeeksforGeeks Article</h5>
                    <p className="text-sm text-green-200/80">
                      Comprehensive tutorials and detailed explanations
                    </p>
                  </div>
                  <BookOpen className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm text-green-200/90 mb-4">
                  <p>• Step-by-step algorithm explanation</p>
                  <p>• Multiple approach comparisons</p>
                  <p>• Time and space complexity analysis</p>
                  <p>• Code examples in multiple languages</p>
                </div>
                <a
                  href={problem.gfgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  Read on GeeksforGeeks
                </a>
              </div>
            )}
            
            {activeTab === 'codeforces' && problem.codeforcesUrl && (
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-blue-300 mb-1">Codeforces Problem</h5>
                    <p className="text-sm text-blue-200/80">
                      Competitive programming challenges and contests
                    </p>
                  </div>
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <div className="space-y-2 text-sm text-blue-200/90 mb-4">
                  <p>• Contest-style problem format</p>
                  <p>• Advanced test cases and edge cases</p>
                  <p>• Performance optimization focus</p>
                  <p>• Community solutions and editorials</p>
                </div>
                <a
                  href={problem.codeforcesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Code className="w-4 h-4" />
                  Solve on Codeforces
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Solutions - Simplified */}
      {(problem.videoUrl || problem.hindiVideoUrl) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-red-400" />
            <h4 className="font-semibold text-red-400">Video Solutions</h4>
          </div>
          
          <div className="space-y-2">
            {problem.videoUrl && (
              <a
                href={problem.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-700/50 transition-colors group"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Striver</div>
                  <div className="text-gray-400 text-sm">English explanation</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            )}
            
            {problem.hindiVideoUrl && (
              <a
                href={problem.hindiVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg border border-gray-700/50 transition-colors group"
              >
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <Languages className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Love Babbar</div>
                  <div className="text-gray-400 text-sm">Hindi explanation</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="mt-3 flex gap-2 text-xs">
            <a
              href="https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              Striver's A2Z Course →
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://youtube.com/c/CodeHelp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-400 transition-colors"
            >
              Love Babbar Channel →
            </a>
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-3">Constraints</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Start Solving CTA - Only for DSA Pattern problems */}
      {isDSAPatternProblem && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-blue-500/30 rounded-lg p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Start Solve Now</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">
                  150 Curated DSA Problems
                </h4>
                <p className="text-gray-300 text-sm mb-1">
                  Beginner → Advanced with Aditya Bakshi
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>Resolution: 100</span>
                  <span>•</span>
                  <span>Pattern: {problem.pattern}</span>
                  <span>•</span>
                  <span>Difficulty: {problem.difficulty}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {/* Primary Action Button - Enhanced */}
                <button className="group w-full relative overflow-hidden flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-purple-500/25 font-bold text-xl">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute bottom-3 left-6 w-1 h-1 bg-white rounded-full opacity-40 animate-ping"></div>
                  
                  <Target className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Start Solving Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                {/* Platform Buttons - Improved */}
                <div className="grid grid-cols-3 gap-3">
                  {problem.leetcodeUrl && (
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 px-4 py-3 bg-orange-600/10 hover:bg-orange-600/20 text-orange-300 border border-orange-600/30 hover:border-orange-500/50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10 font-medium"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>LeetCode</span>
                    </a>
                  )}
                  
                  {problem.gfgUrl && (
                    <a
                      href={problem.gfgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 px-4 py-3 bg-green-600/10 hover:bg-green-600/20 text-green-300 border border-green-600/30 hover:border-green-500/50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10 font-medium"
                    >
                      <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>GFG</span>
                    </a>
                  )}
                  
                  {problem.codeforcesUrl && (
                    <a
                      href={problem.codeforcesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-600/30 hover:border-blue-500/50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 font-medium"
                    >
                      <Code className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Codeforces</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Time: {problem.timeComplexity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{problem.companies?.length || 0} Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up for Easy problems */}
      {problem.difficulty === 'Easy' && !isDSAPatternProblem && (
        <div className="mt-4 p-4 bg-yellow-600/10 border border-yellow-400/20 rounded-lg">
          <p className="text-yellow-300 font-medium mb-1">Follow-up Challenge:</p>
          <p className="text-yellow-200 text-sm">
            Can you come up with an algorithm that is less than O(n²) time complexity?
          </p>
        </div>
      )}

      {/* Pattern-Based Problem Note - Small footer for DSA problems */}
      {isDSAPatternProblem && (
        <div className="mt-4 p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg">
          <p className="text-gray-400 text-xs text-center">
            Part of DSA 150 collection • Practice on multiple platforms to master the <strong className="text-gray-300">{problem.pattern}</strong> pattern
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;