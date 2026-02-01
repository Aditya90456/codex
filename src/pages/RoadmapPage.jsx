import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveRoadmap from '../components/Roadmap/InteractiveRoadmap';
import AnimatedProgressTracker from '../components/Roadmap/AnimatedProgressTracker';
import { roadmapStructure } from '../data/roadmapData';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Smartphone, 
  Database,
  Users,
  Award,
  Clock,
  Target,
  Home
} from 'lucide-react';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState('web');
  const [userProgress, setUserProgress] = useState({
    web: { completed: 12, total: 64, streak: 5 },
    android: { completed: 8, total: 48, streak: 3 },
    dsa: { completed: 25, total: 80, streak: 12 }
  });
  const [showStats, setShowStats] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('roadmap-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('roadmap-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const currentTrackData = roadmapStructure[selectedTrack];
  const currentProgress = userProgress[selectedTrack];

  const trackIcons = {
    web: Code,
    android: Smartphone,
    dsa: Database
  };

  const trackColors = {
    web: 'blue',
    android: 'green', 
    dsa: 'purple'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Back to Home"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
                title="Home"
              >
                <Home size={18} />
                <span className="hidden md:inline">Home</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">Learning Roadmaps</h1>
                <p className="text-gray-400 text-sm">
                  Structured paths to master your chosen technology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
              >
                <Target size={16} />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Track Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Choose Your Path
              </h3>
              
              <div className="space-y-3">
                {Object.entries(roadmapStructure).map(([key, track]) => {
                  const IconComponent = trackIcons[key];
                  const isSelected = selectedTrack === key;
                  const progress = userProgress[key];
                  const progressPercent = (progress.completed / progress.total) * 100;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTrack(key)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        isSelected 
                          ? `border-${trackColors[key]}-500 bg-${trackColors[key]}-500/20` 
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent 
                          size={20} 
                          className={isSelected ? `text-${trackColors[key]}-400` : 'text-gray-400'} 
                        />
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {track.title}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-2">
                        {progress.completed}/{progress.total} completed
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-full bg-${trackColors[key]}-500 rounded-full transition-all duration-300`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            {showStats && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Quick Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total Progress</span>
                    <span className="text-white font-medium">
                      {Object.values(userProgress).reduce((acc, curr) => acc + curr.completed, 0)} items
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Best Streak</span>
                    <span className="text-green-400 font-medium">
                      {Math.max(...Object.values(userProgress).map(p => p.streak))} days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Tracks Started</span>
                    <span className="text-blue-400 font-medium">
                      {Object.values(userProgress).filter(p => p.completed > 0).length}/3
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Tracker */}
            {showStats && (
              <div className="mb-8">
                <AnimatedProgressTracker
                  totalItems={currentProgress.total}
                  completedItems={currentProgress.completed}
                  currentStreak={currentProgress.streak}
                  weeklyGoal={7}
                  trackColor={trackColors[selectedTrack]}
                />
              </div>
            )}

            {/* Track Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentTrackData.title}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {currentTrackData.description}
                  </p>
                </div>
                
                <div className={`p-3 bg-${trackColors[selectedTrack]}-500/20 rounded-full`}>
                  {React.createElement(trackIcons[selectedTrack], {
                    size: 32,
                    className: `text-${trackColors[selectedTrack]}-400`
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Clock className="text-blue-400" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-white font-medium">{currentTrackData.estimatedTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Target className="text-green-400" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Difficulty</div>
                    <div className="text-white font-medium">{currentTrackData.difficulty}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Users className="text-purple-400" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Career Paths</div>
                    <div className="text-white font-medium">{currentTrackData.careerPaths.length} options</div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Prerequisites:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTrackData.prerequisites.map((prereq, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Career Opportunities:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTrackData.careerPaths.map((career, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 bg-${trackColors[selectedTrack]}-500/20 text-${trackColors[selectedTrack]}-300 rounded-full text-sm border border-${trackColors[selectedTrack]}-500/30`}
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Roadmap */}
            <InteractiveRoadmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;