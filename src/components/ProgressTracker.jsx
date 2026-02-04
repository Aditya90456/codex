import { useState, useEffect } from 'react';
import { useClerkProgress } from '../hooks/useClerkProgress';
import { 
  Trophy, 
  Target, 
  Flame, 
  Clock, 
  Code, 
  Award, 
  TrendingUp,
  Calendar,
  BarChart3,
  Star,
  CheckCircle,
  Zap,
  Crown,
  Medal,
  Activity,
  Users,
  BookOpen,
  Brain
} from 'lucide-react';

const ProgressTracker = ({ className = "" }) => {
  const { progress, loading, getProgressStats } = useClerkProgress();
  const [stats, setStats] = useState({});
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (!loading) {
      setStats(getProgressStats());
    }
  }, [progress, loading]);

  if (loading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded"></div>
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Grandmaster': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Master': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Expert': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Advanced': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Beginner': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Progress Tracker</h3>
            <p className="text-sm text-gray-400">Your coding journey</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-xl text-sm font-bold border ${getRankColor(stats.rank)}`}>
          {stats.rank}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-gray-400">SOLVED</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalProblems}</div>
          <div className="text-xs text-gray-400">Problems</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-semibold text-gray-400">STREAK</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
          <div className="text-xs text-gray-400">Days</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-gray-400">ACCURACY</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.acceptanceRate}%</div>
          <div className="text-xs text-gray-400">Accepted</div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-gray-400">TIME</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(stats.totalCodeTime)}</div>
          <div className="text-xs text-gray-400">Coding</div>
        </div>
      </div>

      {/* Difficulty Progress */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Difficulty Progress
        </h4>
        <div className="space-y-3">
          {Object.entries(progress.difficultyStats).map(([difficulty, stats]) => {
            const percentage = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
            const colors = {
              easy: 'bg-green-500',
              medium: 'bg-yellow-500', 
              hard: 'bg-red-500'
            };
            
            return (
              <div key={difficulty} className="flex items-center gap-3">
                <div className="w-16 text-xs font-semibold text-gray-400 capitalize">
                  {difficulty}
                </div>
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${colors[difficulty]} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs font-semibold text-gray-300 w-12">
                  {stats.solved}/{stats.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Language Stats */}
      {Object.keys(progress.languageStats).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Language Usage
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(progress.languageStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([language, count]) => (
                <div key={language} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm font-semibold text-white capitalize">{language}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {progress.achievements.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Recent Achievements
            </h4>
            <button 
              onClick={() => setShowAchievements(!showAchievements)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showAchievements ? 'Hide' : 'View All'}
            </button>
          </div>
          
          <div className="space-y-2">
            {progress.achievements
              .slice(-3)
              .reverse()
              .map((achievement, index) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{achievement.name}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>

          {showAchievements && progress.achievements.length > 3 && (
            <div className="mt-3 space-y-2">
              {progress.achievements
                .slice(0, -3)
                .reverse()
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-white/3 rounded-lg">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div className="flex-1">
                      <span className="text-sm text-white">{achievement.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{achievement.description}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Certificates */}
      {progress.certificates.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Certificates ({progress.certificates.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {progress.certificates.slice(-4).map((cert, index) => (
              <div key={cert.id} className="p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/20">
                <div className="text-sm font-semibold text-blue-300">{cert.name}</div>
                <div className="text-xs text-gray-400">{new Date(cert.earnedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.totalProblems === 0 && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 mb-2">Start your coding journey!</p>
          <p className="text-sm text-gray-500">Solve your first problem to begin tracking progress</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;