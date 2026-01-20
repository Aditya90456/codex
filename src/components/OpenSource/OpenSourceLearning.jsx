/**
 * Open Source Learning Component
 * 
 * @license MIT
 * @copyright 2026 Codex Platform
 */

import React, { useState, useEffect } from 'react';
import { openSourceLearning, getLevelProgress } from '../../data/openSourceLearning';
import { 
  CheckCircle, Circle, ChevronDown, ChevronRight, Code, GitBranch, 
  Users, Star, Award, BookOpen, ExternalLink, Target, Zap,
  TrendingUp, Heart, Globe, Rocket, Trophy, Lightbulb
} from 'lucide-react';

const OpenSourceLearning = () => {
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [activeTab, setActiveTab] = useState('path');
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('osl-progress');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('osl-progress', JSON.stringify(completedTasks));
    updateBadges();
  }, [completedTasks]);

  const updateBadges = () => {
    const taskCount = Object.keys(completedTasks).length;
    const badges = [];
    
    if (taskCount >= 1) badges.push(openSourceLearning.badges[0]);
    if (taskCount >= 10) badges.push(openSourceLearning.badges[1]);
    if (taskCount >= 20) badges.push(openSourceLearning.badges[2]);
    if (taskCount >= 30) badges.push(openSourceLearning.badges[3]);
    
    setEarnedBadges(badges);
  };

  const toggleLevel = (levelId) => {
    setExpandedLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));
  };

  const toggleModule = (levelId, moduleId) => {
    const key = `${levelId}-${moduleId}`;
    setExpandedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTask = (levelId, moduleId, topicName, task) => {
    const key = `${levelId}-${moduleId}-${topicName}-${task}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getLevelColor = (color) => {
    const colors = {
      green: 'from-green-600 to-emerald-600',
      blue: 'from-blue-600 to-cyan-600',
      purple: 'from-purple-600 to-pink-600'
    };
    return colors[color] || colors.green;
  };

  const getTotalProgress = () => {
    let total = 0;
    let completed = 0;
    
    openSourceLearning.levels.forEach(level => {
      level.modules.forEach(module => {
        module.topics.forEach(topic => {
          topic.tasks.forEach(task => {
            total++;
            if (completedTasks[`${level.id}-${module.id}-${topic.name}-${task}`]) {
              completed++;
            }
          });
        });
      });
    });
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GitBranch className="w-16 h-16 text-white mr-4" />
              <h1 className="text-6xl font-bold">Open Source Learning</h1>
            </div>
            <p className="text-2xl text-blue-100 mb-4">
              {openSourceLearning.overview.tagline}
            </p>
            <p className="text-xl text-blue-200">
              {openSourceLearning.overview.description}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {openSourceLearning.overview.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center hover:bg-white/20 transition-all">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-300" />
                <p className="text-sm font-semibold">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <Target className="w-10 h-10 mx-auto mb-2 text-yellow-300" />
              <p className="text-3xl font-bold">{totalProgress.completed}/{totalProgress.total}</p>
              <p className="text-sm text-blue-200">Tasks Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 text-green-300" />
              <p className="text-3xl font-bold">{totalProgress.percentage}%</p>
              <p className="text-sm text-blue-200">Overall Progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-2 text-purple-300" />
              <p className="text-3xl font-bold">{earnedBadges.length}</p>
              <p className="text-sm text-blue-200">Badges Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex space-x-2 bg-gray-800 rounded-xl p-2">
          <button
            onClick={() => setActiveTab('path')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'path'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Rocket className="w-5 h-5 inline mr-2" />
            Learning Path
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-5 h-5 inline mr-2" />
            Project Ideas
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Resources
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Badges
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'path' && (
          <div className="space-y-6">
            {openSourceLearning.levels.map((level) => {
              const isExpanded = expandedLevels[level.id];
              const progress = getLevelProgress(level.id, completedTasks);

              return (
                <div key={level.id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Level Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-750 transition-all"
                    onClick={() => toggleLevel(level.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h2 className="text-3xl font-bold">{level.level}</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getLevelColor(level.color)} bg-opacity-20`}>
                              {level.duration}
                            </span>
                          </div>
                          <p className="text-xl text-gray-300 mb-2">{level.title}</p>
                          <p className="text-gray-400 text-sm">{level.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-cyan-400">{progress.percentage}%</p>
                        <p className="text-sm text-gray-400">{progress.completed}/{progress.total} tasks</p>
                      </div>
                    </div>

                    {/* Skills */}
                    {isExpanded && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {level.skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modules */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      {level.modules.map((module) => {
                        const isModuleExpanded = expandedModules[`${level.id}-${module.id}`];
                        
                        return (
                          <div key={module.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-850 transition-all flex items-center justify-between"
                              onClick={() => toggleModule(level.id, module.id)}
                            >
                              <div className="flex items-center space-x-3">
                                {isModuleExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                <BookOpen className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-semibold text-cyan-300">{module.title}</h3>
                              </div>
                            </div>

                            {/* Topics */}
                            {isModuleExpanded && (
                              <div className="p-4 space-y-4">
                                {module.topics.map((topic, idx) => (
                                  <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-lg font-semibold text-white mb-2">{topic.name}</h4>
                                    <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
                                    
                                    {/* Resources */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {topic.resources.map((resource, ridx) => (
                                        <span key={ridx} className="text-xs bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full">
                                          {resource}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-2">
                                      {topic.tasks.map((task, tidx) => {
                                        const key = `${level.id}-${module.id}-${topic.name}-${task}`;
                                        const isCompleted = completedTasks[key];

                                        return (
                                          <div 
                                            key={tidx}
                                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                                              isCompleted 
                                                ? 'bg-green-900/30 border border-green-700' 
                                                : 'bg-gray-900 border border-gray-700 hover:border-cyan-500'
                                            }`}
                                            onClick={() => toggleTask(level.id, module.id, topic.name, task)}
                                          >
                                            {isCompleted ? (
                                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                            ) : (
                                              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                            <span className={isCompleted ? 'line-through text-gray-400' : 'text-white'}>
                                              {task}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
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
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {openSourceLearning.projectIdeas.map((category, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Code className="w-6 h-6 mr-2 text-cyan-400" />
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.projects.map((project, pidx) => (
                    <div key={pidx} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h4 className="font-bold text-lg mb-2">{project.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{project.language}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.difficulty === 'Beginner' ? 'bg-green-600/30 text-green-300' :
                          project.difficulty === 'Intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            {Object.entries(openSourceLearning.resources).map(([category, links]) => (
              <div key={category} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 capitalize flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-blue-400" />
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-all border border-gray-700 hover:border-cyan-500"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{link.name}</h4>
                        <p className="text-sm text-gray-400">{link.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Your Achievements
              </h3>
              <p className="text-gray-300">Complete tasks to earn badges and track your progress!</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {openSourceLearning.badges.map((badge, idx) => {
                const isEarned = earnedBadges.some(b => b.name === badge.name);
                
                return (
                  <div 
                    key={idx}
                    className={`rounded-xl p-6 text-center transition-all ${
                      isEarned 
                        ? 'bg-gradient-to-br from-yellow-600 to-orange-600 border-2 border-yellow-400 shadow-xl' 
                        : 'bg-gray-800 border border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{badge.name}</h4>
                    <p className="text-sm text-gray-300">{badge.description}</p>
                    {isEarned && (
                      <div className="mt-3">
                        <Star className="w-5 h-5 inline text-yellow-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-8 border border-purple-700">
          <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <Lightbulb className="w-8 h-8 mr-3 text-yellow-400" />
            Pro Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openSourceLearning.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-white/10 backdrop-blur rounded-lg p-4">
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-200">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-8 text-center shadow-2xl">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-300" />
          <h3 className="text-3xl font-bold mb-3">Join the Open Source Movement!</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Start contributing today and make an impact on projects used by millions worldwide.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Find Your First Issue
            </button>
            <button className="bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all transform hover:scale-105 shadow-xl">
              Join Community
            </button>
          </div>
        </div>
      </div>

      {/* License Footer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">
            Open Source Learning Path • MIT Licensed • Free to use and share
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2026 Codex Platform • Made with ❤️ for the community
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceLearning;
          <p className="text-blue-100 mb-6 text-lg">
            Start contributing today and make an impact on projects used by millions worldwide.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
              Find Your First Issue
            </button>
            <button className="bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all transform hover:scale-105 shadow-xl">
              Join Community
            </button>
          </div>
        </div>
      </div>

      {/* License Footer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">
            Open Source Learning Path • MIT Licensed • Free to use and share
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2026 Codex Platform • Made with ❤️ for the community
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceLearning;
