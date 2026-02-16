import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Code, Zap, Users, Target, ArrowRight, Play, BookOpen, Trophy,
  TrendingUp, Flame, Heart, MessageCircle, Eye, Clock, Calendar,
  Star, Award, GitBranch, Cpu, Brain, Sparkles, Rocket, Globe,
  Filter, Search, Plus, ChevronRight, Bookmark, Share2, MoreVertical
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WelcomeScreenFeeds = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('for-you'); // for-you, trending, following, blogs
  const [feeds, setFeeds] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [trendingProblems, setTrendingProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    streak: 0,
    blogsWritten: 0,
    followers: 0
  });

  // Fetch feeds data
  useEffect(() => {
    fetchFeeds();
    fetchBlogs();
    fetchTrendingProblems();
    if (user) {
      fetchUserStats();
    }
  }, [user, activeTab]);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      // Simulate feed data - in production, this would come from backend
      const mockFeeds = [
        {
          id: 1,
          type: 'achievement',
          user: { name: 'Sarah Chen', avatar: '👩‍💻' },
          content: 'Completed 50 DSA problems and earned the Algorithm Expert badge!',
          timestamp: '2 hours ago',
          likes: 24,
          comments: 5,
          badge: 'Algorithm Expert'
        },
        {
          id: 2,
          type: 'blog',
          user: { name: 'Alex Kumar', avatar: '👨‍💻' },
          content: 'Just published: "Mastering Dynamic Programming - A Complete Guide"',
          timestamp: '4 hours ago',
          likes: 156,
          comments: 23,
          views: 1240,
          tags: ['DP', 'Tutorial', 'Advanced']
        },
        {
          id: 3,
          type: 'streak',
          user: { name: 'Emma Wilson', avatar: '👩‍🎓' },
          content: 'Maintained a 30-day coding streak! 🔥',
          timestamp: '6 hours ago',
          likes: 89,
          comments: 12,
          streak: 30
        },
        {
          id: 4,
          type: 'problem',
          user: { name: 'Michael Zhang', avatar: '👨‍🔬' },
          content: 'Solved "Two Sum" in O(n) time using HashMap approach',
          timestamp: '8 hours ago',
          likes: 45,
          comments: 8,
          difficulty: 'Easy',
          language: 'Python'
        }
      ];
      setFeeds(mockFeeds);
    } catch (error) {
      console.error('Fetch feeds error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/trending/all?limit=5`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
    }
  };

  const fetchTrendingProblems = async () => {
    // Mock trending problems
    const mockProblems = [
      { id: 1, title: 'Two Sum', difficulty: 'Easy', solvedBy: 2340, category: 'Arrays' },
      { id: 2, title: 'Longest Substring', difficulty: 'Medium', solvedBy: 1890, category: 'Strings' },
      { id: 3, title: 'Binary Tree Traversal', difficulty: 'Medium', solvedBy: 1560, category: 'Trees' },
      { id: 4, title: 'Graph DFS', difficulty: 'Hard', solvedBy: 890, category: 'Graphs' },
      { id: 5, title: 'Coin Change', difficulty: 'Medium', solvedBy: 1230, category: 'DP' }
    ];
    setTrendingProblems(mockProblems);
  };

  const fetchUserStats = async () => {
    // Mock user stats - integrate with your Clerk progress system
    setUserStats({
      problemsSolved: 42,
      streak: 7,
      blogsWritten: 3,
      followers: 156
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const FeedCard = ({ feed }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all">
      {/* User Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
            {feed.user.avatar}
          </div>
          <div>
            <h4 className="font-semibold text-white">{feed.user.name}</h4>
            <p className="text-sm text-gray-400">{feed.timestamp}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-200 mb-4">{feed.content}</p>

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-4">
        {feed.badge && (
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-sm text-yellow-400 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {feed.badge}
          </span>
        )}
        {feed.difficulty && (
          <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(feed.difficulty)}`}>
            {feed.difficulty}
          </span>
        )}
        {feed.language && (
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-400">
            {feed.language}
          </span>
        )}
        {feed.streak && (
          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm text-orange-400 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            {feed.streak} days
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-700/50">
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-sm">{feed.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{feed.comments}</span>
        </button>
        {feed.views && (
          <div className="flex items-center gap-2 text-gray-400">
            <Eye className="w-5 h-5" />
            <span className="text-sm">{feed.views}</span>
          </div>
        )}
        <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors ml-auto">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const BlogCard = ({ blog }) => (
    <div 
      onClick={() => navigate(`/blogs/${blog.id}`)}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-all cursor-pointer group"
    >
      {blog.coverImage && (
        <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 overflow-hidden">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{blog.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.content?.substring(0, 150)}...</p>
      
      <div className="flex items-center gap-2 mb-4">
        {blog.tags?.slice(0, 3).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {blog.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {blog.comments?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views || 0}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  const TrendingProblemCard = ({ problem }) => (
    <div 
      onClick={() => navigate('/leetcode')}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{problem.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{problem.category}</span>
        <span className="text-gray-400 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {problem.solvedBy} solved
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to Codex
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your personalized coding journey starts here
            </p>

            {/* Quick Stats */}
            {isSignedIn && (
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-blue-400">{userStats.problemsSolved}</div>
                  <div className="text-sm text-gray-400">Problems Solved</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                    <Flame className="w-6 h-6" />
                    {userStats.streak}
                  </div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-green-400">{userStats.blogsWritten}</div>
                  <div className="text-sm text-gray-400">Blogs Written</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-purple-400">{userStats.followers}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/leetcode')}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Code className="w-5 h-5" />
                Start Coding
              </button>
              <button
                onClick={() => navigate('/blogs')}
                className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold transition-all"
              >
                <BookOpen className="w-5 h-5" />
                Explore Blogs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Trending Problems */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  Trending Problems
                </h3>
                <div className="space-y-3">
                  {trendingProblems.map(problem => (
                    <TrendingProblemCard key={problem.id} problem={problem} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/leetcode')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <Code className="w-5 h-5 text-blue-400" />
                    <span>Solve Problems</span>
                  </button>
                  <button
                    onClick={() => navigate('/blogs')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <Plus className="w-5 h-5 text-green-400" />
                    <span>Write Blog</span>
                  </button>
                  <button
                    onClick={() => navigate('/learn')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>Learn DSA</span>
                  </button>
                  <button
                    onClick={() => navigate('/web-studio')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <Globe className="w-5 h-5 text-pink-400" />
                    <span>Web Studio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Feeds */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-2">
              {[
                { id: 'for-you', label: 'For You', icon: Sparkles },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'following', label: 'Following', icon: Users },
                { id: 'blogs', label: 'Blogs', icon: BookOpen }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Feed Content */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading feeds...</p>
                </div>
              ) : activeTab === 'blogs' ? (
                blogs.length > 0 ? (
                  blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No blogs yet. Be the first to write!</p>
                  </div>
                )
              ) : (
                feeds.map(feed => <FeedCard key={feed.id} feed={feed} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreenFeeds;
