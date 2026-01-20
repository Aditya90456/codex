/**
 * GSoC Mentor Plan Component
 * 
 * @license MIT
 * @copyright 2026 Codex Platform
 * 
 * This educational content is open source and free to use, modify, and share.
 * See GSOC_LICENSE.md for full license details.
 * 
 * Not officially affiliated with Google or the GSoC program.
 */

import React, { useState, useEffect } from 'react';
import { gsocMentorPlan, getPhaseProgress } from '../../data/gsocMentorPlan';
import { 
  CheckCircle, Circle, ChevronDown, ChevronRight, Trophy, Target, 
  Calendar, BookOpen, Users, Lightbulb, ExternalLink, Award,
  Clock, TrendingUp, Star, Zap, ArrowRight, Download
} from 'lucide-react';

const GSoCMentorPlan = () => {
  const [expandedPhases, setExpandedPhases] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [activeTab, setActiveTab] = useState('plan');

  useEffect(() => {
    const saved = localStorage.getItem('gsoc-mentor-progress');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gsoc-mentor-progress', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleWeek = (phaseId, weekNum) => {
    const key = `${phaseId}-${weekNum}`;
    setExpandedWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTask = (phaseId, weekNum, taskName) => {
    const key = `${phaseId}-${weekNum}-${taskName}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getPhaseColor = (color) => {
    const colors = {
      blue: 'from-blue-600 to-cyan-600',
      green: 'from-green-600 to-emerald-600',
      purple: 'from-purple-600 to-pink-600',
      orange: 'from-orange-600 to-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  const getTotalProgress = () => {
    let total = 0;
    let completed = 0;
    
    gsocMentorPlan.phases.forEach(phase => {
      phase.weeks_detail.forEach(week => {
        week.tasks.forEach(task => {
          total++;
          if (completedTasks[`${phase.id}-${week.week}-${task.name}`]) {
            completed++;
          }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-300 mr-4" />
            <h1 className="text-5xl font-bold">GSoC Mentor Plan</h1>
          </div>
          <p className="text-center text-xl text-purple-100 mb-6">
            {gsocMentorPlan.overview.description}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              <p className="text-2xl font-bold">{gsocMentorPlan.overview.duration}</p>
              <p className="text-sm text-purple-200">Duration</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <p className="text-2xl font-bold">{gsocMentorPlan.phases.length}</p>
              <p className="text-sm text-purple-200">Phases</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-2xl font-bold">{totalProgress.completed}/{totalProgress.total}</p>
              <p className="text-sm text-purple-200">Tasks Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-pink-300" />
              <p className="text-2xl font-bold">{totalProgress.percentage}%</p>
              <p className="text-sm text-purple-200">Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex space-x-2 bg-gray-800 rounded-xl p-2">
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'plan'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Learning Plan
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-5 h-5 inline mr-2" />
            Tips & Tricks
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-5 h-5 inline mr-2" />
            Resources
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Prerequisites */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                Prerequisites
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gsocMentorPlan.overview.prerequisites.map((prereq, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-200">{prereq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phases */}
            {gsocMentorPlan.phases.map((phase) => {
              const isExpanded = expandedPhases[phase.id];
              const progress = getPhaseProgress(phase.id, completedTasks);

              return (
                <div key={phase.id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Phase Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-750 transition-all"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        <div>
                          <h2 className="text-2xl font-bold">{phase.phase}</h2>
                          <p className="text-gray-400 text-sm mt-1">{phase.weeks} • {phase.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-3xl font-bold bg-gradient-to-r ${getPhaseColor(phase.color)} bg-clip-text text-transparent">
                            {progress.percentage}%
                          </p>
                          <p className="text-sm text-gray-400">{progress.completed}/{progress.total} tasks</p>
                        </div>
                        <div className="w-20 h-20 relative">
                          <svg className="transform -rotate-90 w-20 h-20">
                            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
                            <circle 
                              cx="40" cy="40" r="32" 
                              stroke="currentColor" 
                              strokeWidth="6" 
                              fill="transparent"
                              strokeDasharray={`${2 * Math.PI * 32}`}
                              strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress.percentage / 100)}`}
                              className={`bg-gradient-to-r ${getPhaseColor(phase.color)} transition-all duration-500`}
                              style={{ stroke: `url(#gradient-${phase.id})` }}
                            />
                          </svg>
                          <defs>
                            <linearGradient id={`gradient-${phase.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={phase.color === 'blue' ? '#3b82f6' : phase.color === 'green' ? '#10b981' : phase.color === 'purple' ? '#a855f7' : '#f97316'} />
                              <stop offset="100%" stopColor={phase.color === 'blue' ? '#06b6d4' : phase.color === 'green' ? '#34d399' : phase.color === 'purple' ? '#ec4899' : '#fbbf24'} />
                            </linearGradient>
                          </defs>
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    {isExpanded && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {phase.goals.map((goal, idx) => (
                          <div key={idx} className="flex items-start space-x-2 bg-gray-900/50 p-3 rounded-lg">
                            <Target className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weeks */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      {phase.weeks_detail.map((week) => {
                        const isWeekExpanded = expandedWeeks[`${phase.id}-${week.week}`];
                        
                        return (
                          <div key={week.week} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                            <div 
                              className="p-4 cursor-pointer hover:bg-gray-850 transition-all flex items-center justify-between"
                              onClick={() => toggleWeek(phase.id, week.week)}
                            >
                              <div className="flex items-center space-x-3">
                                {isWeekExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                <Clock className="w-5 h-5 text-blue-400" />
                                <div>
                                  <h3 className="text-lg font-semibold text-purple-300">Week {week.week}: {week.title}</h3>
                                  <p className="text-sm text-gray-500">{week.tasks.length} tasks</p>
                                </div>
                              </div>
                            </div>

                            {/* Tasks */}
                            {isWeekExpanded && (
                              <div className="p-4 space-y-3">
                                {week.tasks.map((task, idx) => {
                                  const key = `${phase.id}-${week.week}-${task.name}`;
                                  const isCompleted = completedTasks[key];

                                  return (
                                    <div 
                                      key={idx}
                                      className={`p-4 rounded-lg transition-all cursor-pointer ${
                                        isCompleted 
                                          ? 'bg-green-900/30 border border-green-700' 
                                          : 'bg-gray-800 border border-gray-700 hover:border-purple-500'
                                      }`}
                                      onClick={() => toggleTask(phase.id, week.week, task.name)}
                                    >
                                      <div className="flex items-start space-x-3">
                                        {isCompleted ? (
                                          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                        ) : (
                                          <Circle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                                        )}
                                        <div className="flex-1">
                                          <h4 className={`font-semibold mb-2 ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                                            {task.name}
                                          </h4>
                                          <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                                          <div className="flex flex-wrap gap-2">
                                            {task.resources.map((resource, ridx) => (
                                              <span key={ridx} className="text-xs bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full">
                                                {resource}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
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
        )}

        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gsocMentorPlan.tips.map((tipCategory, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
                  {tipCategory.category}
                </h3>
                <ul className="space-y-3">
                  {tipCategory.tips.map((tip, tidx) => (
                    <li key={tidx} className="flex items-start space-x-3">
                      <ArrowRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            {Object.entries(gsocMentorPlan.resources).map(([category, links]) => (
              <div key={category} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 capitalize flex items-center">
                  <ExternalLink className="w-6 h-6 mr-2 text-blue-400" />
                  {category} Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-all border border-gray-700 hover:border-purple-500"
                    >
                      <span className="text-white font-semibold">{link.name}</span>
                      <ExternalLink className="w-5 h-5 text-purple-400" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones Timeline */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 border border-indigo-700">
          <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
            <Award className="w-8 h-8 mr-3 text-yellow-400" />
            Key Milestones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {gsocMentorPlan.milestones.map((milestone, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-gray-900">W{milestone.week}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{milestone.title}</h4>
                <p className="text-sm text-purple-200">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center shadow-2xl">
          <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <h3 className="text-3xl font-bold mb-3">Ready to Start Your GSoC Journey?</h3>
          <p className="text-purple-100 mb-6 text-lg">
            Follow this plan, stay consistent, and you'll be well-prepared for Google Summer of Code!
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            Download Plan as PDF
            <Download className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      </div>

      {/* License & Attribution Footer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Open Source Educational Content</span>
            </div>
            <p className="text-gray-400 text-sm max-w-3xl mx-auto">
              This GSoC preparation guide is released under the MIT License. 
              Free to use, modify, and share for educational purposes. 
              Not officially affiliated with Google or the GSoC program.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <a 
                href="/GSOC_LICENSE.md" 
                target="_blank"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View License</span>
              </a>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">© 2026 Codex Platform</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">Version 1.0.0</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Made with ❤️ for the open source community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
