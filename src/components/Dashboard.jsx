import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Database, Cpu, Globe, BookOpen, Zap, 
  TrendingUp, Award, Target, Flame, ChevronRight,
  Clock, CheckCircle, Star, Sparkles, ArrowUp, ChevronDown, Loader2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Dashboard = () => {
  const { userName, user } = useAuthContext();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const featuresRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    problemsSolved: 0,
    streak: 0,
    totalTime: 0,
    rank: 'Bronze',
    points: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch user stats from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // Get user token from Clerk
        const token = await user.getToken();
        
        // Fetch progress stats
        const response = await fetch(`${API_URL}/progress/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            const data = result.data;
            
            // Calculate rank based on points
            const points = data.user.points || 0;
            let rank = 'Bronze';
            if (points >= 500) rank = 'Diamond';
            else if (points >= 300) rank = 'Platinum';
            else if (points >= 150) rank = 'Gold';
            else if (points >= 50) rank = 'Silver';
            
            setStats({
              problemsSolved: data.progress.solvedProblems || 0,
              streak: data.user.streak || 0,
              totalTime: Math.round((data.progress.totalTimeSpent || 0) / 60), // Convert to hours
              rank: rank,
              points: points
            });

            // Format recent activity
            if (data.recentActivity && data.recentActivity.length > 0) {
              const formattedActivity = data.recentActivity.slice(0, 3).map(activity => {
                const timeAgo = getTimeAgo(new Date(activity.lastAttemptAt));
                return {
                  title: activity.status === 'solved' 
                    ? `Solved ${activity.problemId?.title || 'Problem'}` 
                    : `Attempted ${activity.problemId?.title || 'Problem'}`,
                  time: timeAgo,
                  icon: activity.status === 'solved' ? CheckCircle : BookOpen,
                  color: activity.status === 'solved' ? 'text-green-400' : 'text-blue-400'
                };
              });
              setRecentActivity(formattedActivity);
            } else {
              // Default activity if no data
              setRecentActivity([
                { title: 'Start your coding journey!', time: 'Now', icon: Sparkles, color: 'text-purple-400' },
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Use default values on error
        setRecentActivity([
          { title: 'Welcome to CodexPro!', time: 'Now', icon: Sparkles, color: 'text-purple-400' },
          { title: 'Explore DSA Problems', time: 'Start now', icon: BookOpen, color: 'text-blue-400' },
          { title: 'Try AI Assistant', time: 'Available', icon: Sparkles, color: 'text-purple-400' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 500);
      setShowScrollHint(scrollTop < 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    {
      icon: Code,
      title: 'Code Editor',
      description: 'Advanced Monaco editor with multi-language support',
      path: '/editor',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-600/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      stats: '15+ Languages'
    },
    {
      icon: Globe,
      title: 'Web Editor',
      description: 'Build and preview HTML, CSS, JS in real-time',
      path: '/web',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-600/10 to-emerald-600/10',
      borderColor: 'border-green-500/30',
      stats: 'Live Preview'
    },
    {
      icon: Database,
      title: 'DSA Practice',
      description: '250+ curated problems with detailed solutions',
      path: '/dsa',
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-600/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      stats: '250+ Problems'
    },
    {
      icon: BookOpen,
      title: 'My Bookmarks',
      description: 'Your saved articles and learning resources',
      path: '/bookmarks',
      gradient: 'from-yellow-600 to-orange-600',
      bgGradient: 'from-yellow-600/10 to-orange-600/10',
      borderColor: 'border-yellow-500/30',
      stats: 'Quick Access'
    },
    {
      icon: Cpu,
      title: 'AI Assistant',
      description: 'Generate code, debug, and get instant help',
      path: '/ai',
      gradient: 'from-orange-600 to-red-600',
      bgGradient: 'from-orange-600/10 to-red-600/10',
      borderColor: 'border-orange-500/30',
      stats: 'AI Powered'
    }
  ];

  const recentActivityDefault = [
    { title: 'Solved Two Sum', time: '2 hours ago', icon: CheckCircle, color: 'text-green-400' },
    { title: 'Completed React Tutorial', time: '5 hours ago', icon: BookOpen, color: 'text-blue-400' },
    { title: 'Used AI Assistant', time: '1 day ago', icon: Sparkles, color: 'text-purple-400' },
  ];

  const displayActivity = recentActivity.length > 0 ? recentActivity : recentActivityDefault;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 animate-in slide-in-from-bottom"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="text-white font-semibold">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : stats.streak > 0 ? (
                    `${stats.streak} Day Streak!`
                  ) : (
                    'Start Your Streak Today!'
                  )}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome back, {userName}!
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Your coding journey continues 🚀
              </p>

              {/* Scroll Down Indicator */}
              {showScrollHint && (
                <button
                  onClick={scrollToFeatures}
                  className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group mx-auto"
                >
                  <span className="text-sm font-medium">Explore Your Tools</span>
                  <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-blue-400" />
                </button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-blue-400" />
                  {!loading && stats.problemsSolved > 0 && <TrendingUp className="w-5 h-5 text-green-400" />}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.problemsSolved}
                </div>
                <div className="text-sm text-slate-400">Problems Solved</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-8 h-8 text-orange-400" />
                  {!loading && stats.streak > 0 && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Hot</span>}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.streak}
                </div>
                <div className="text-sm text-slate-400">Day Streak</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-purple-400" />
                  {!loading && stats.totalTime > 0 && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">+{Math.round(stats.totalTime * 0.1)}h</span>}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : `${stats.totalTime}h`}
                </div>
                <div className="text-sm text-slate-400">Total Time</div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.rank}
                </div>
                <div className="text-sm text-slate-400">Current Rank</div>
              </div>
            </div>

            <div 
              ref={featuresRef}
              className="grid lg:grid-cols-3 gap-8 scroll-mt-24"
            >
            {/* Main Features */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Tools</h2>
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur border ${feature.borderColor} rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer overflow-hidden animate-fade-in-up`}
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                      onClick={() => navigate(feature.path)}
                    >
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs text-slate-400 font-semibold">{feature.stats}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all">
                          {feature.title}
                        </h3>
                        
                        <p className="text-slate-400 text-sm mb-4">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-sm font-semibold text-white group-hover:gap-2 transition-all">
                          <span>Launch</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Activity */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Activity
                </h3>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                          <Icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{activity.title}</div>
                            <div className="text-xs text-slate-400">{activity.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <h3 className="text-lg font-bold text-white mb-4">Quick Start</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dsa')}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Practice DSA</span>
                      <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate('/ai')}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Ask AI</span>
                      <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Dashboard;