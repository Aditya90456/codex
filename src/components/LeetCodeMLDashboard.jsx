import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Star, 
  Zap, 
  Award, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Brain,
  Rocket,
  Crown,
  Timer,
  Gift
} from 'lucide-react';

const LeetCodeMLDashboard = ({ onProblemSelect }) => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadDashboard();
      // Set up periodic updates to maintain engagement
      const interval = setInterval(loadDashboard, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const loadDashboard = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/leetcode-ml/dashboard/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
        
        // Trigger pulse animation for urgent notifications
        if (data.data.metrics.urgencyFactors.length > 0) {
          setPulseAnimation(true);
          setTimeout(() => setPulseAnimation(false), 2000);
        }
      }
    } catch (error) {
      console.error('Failed to load ML dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSolved = async (problemData) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      await fetch(`${backendUrl}/api/leetcode-ml/progress/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...problemData,
          solved: true
        })
      });
      
      // Reload dashboard to show updated progress
      loadDashboard();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
        <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">AI Learning Engine</h3>
        <p className="text-gray-400">Start solving problems to unlock personalized recommendations!</p>
      </div>
    );
  }

  const { user: userData, recommendations, dailyChallenge, metrics } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Urgent Notifications */}
      {metrics.urgencyFactors.length > 0 && (
        <div className={`bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4 ${pulseAnimation ? 'animate-pulse' : ''}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400">Urgent!</h3>
              {metrics.urgencyFactors.map((factor, index) => (
                <p key={index} className="text-red-300 text-sm">
                  {factor.message}
                  {factor.timeLeft && (
                    <span className="ml-2 text-red-200">
                      ({Math.floor(factor.timeLeft)}h left)
                    </span>
                  )}
                </p>
              ))}
            </div>
            <button
              onClick={() => onProblemSelect && onProblemSelect(recommendations[0]?.problems[0])}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Solve Now!
            </button>
          </div>
        </div>
      )}

      {/* User Stats Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Level {userData.level}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${metrics.engagementLevel.color}`}>
                  {metrics.engagementLevel.emoji} {metrics.engagementLevel.level}
                </span>
                <div className="text-sm text-gray-400">
                  Addiction Score: {userData.addictionScore}/100
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-400">{userData.streak}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
            <div className="text-xs text-yellow-300">{metrics.streakMotivation}</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">XP Progress</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(userData.xp / (userData.level * 100)) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {userData.xp} / {userData.level * 100} XP
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Next Milestone</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.nextMilestone.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {metrics.nextMilestone.remaining} problems to {metrics.nextMilestone.title}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Weekly Goal</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.weeklyProgress.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              {metrics.weeklyProgress.completed} / {metrics.weeklyProgress.goal} this week
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{dailyChallenge.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  dailyChallenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  dailyChallenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {dailyChallenge.difficulty}
                </span>
                <span className="text-gray-400 text-sm">{dailyChallenge.category}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Gift className="w-4 h-4" />
              <span className="font-semibold">+{dailyChallenge.bonusXP} XP</span>
            </div>
            {dailyChallenge.streakBonus > 0 && (
              <div className="flex items-center gap-2 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-sm">+{dailyChallenge.streakBonus} Streak Bonus</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">{dailyChallenge.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Timer className="w-4 h-4" />
              <span className="text-sm">{dailyChallenge.timeLimit} min limit</span>
            </div>
            <div className="text-sm text-gray-400">
              {dailyChallenge.hints.length} hints available
            </div>
          </div>
          
          <button
            onClick={() => onProblemSelect && onProblemSelect(dailyChallenge)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Start Challenge
          </button>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                Personalized
              </span>
            </div>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${showRecommendations ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {showRecommendations && (
          <div className="p-6 space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        rec.priority >= 9 ? 'bg-red-400' :
                        rec.priority >= 7 ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}></div>
                      <h4 className="font-semibold text-white">{rec.title}</h4>
                      <span className="px-2 py-1 bg-slate-600 text-gray-300 rounded text-xs">
                        {rec.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                    <p className="text-blue-300 text-sm italic">"{rec.motivation}"</p>
                  </div>
                  
                  <div className="ml-4">
                    <div className="text-right mb-2">
                      <div className="text-lg font-bold text-yellow-400">
                        Priority {rec.priority}
                      </div>
                    </div>
                    <button
                      onClick={() => onProblemSelect && onProblemSelect(rec.problems[0])}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Start
                    </button>
                  </div>
                </div>
                
                {rec.problems && rec.problems.length > 0 && (
                  <div className="border-t border-slate-600 pt-3">
                    <div className="text-xs text-gray-400 mb-2">Recommended Problems:</div>
                    <div className="flex flex-wrap gap-2">
                      {rec.problems.slice(0, 3).map((problem, pIndex) => (
                        <button
                          key={pIndex}
                          onClick={() => onProblemSelect && onProblemSelect(problem)}
                          className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-gray-300 rounded text-xs transition-colors"
                        >
                          {problem.title}
                        </button>
                      ))}
                      {rec.problems.length > 3 && (
                        <span className="px-3 py-1 text-gray-400 text-xs">
                          +{rec.problems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-green-400">{userData.totalProblems}</div>
          <div className="text-sm text-gray-400">Total Solved</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-yellow-400">{userData.longestStreak}</div>
          <div className="text-sm text-gray-400">Best Streak</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-blue-400">{userData.level}</div>
          <div className="text-sm text-gray-400">Current Level</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-purple-400">{userData.achievements.length}</div>
          <div className="text-sm text-gray-400">Achievements</div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeMLDashboard;