import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  TrendingUp, 
  Filter,
  Search,
  Trash2,
  ExternalLink,
  BarChart3,
  Calendar,
  Tag,
  ArrowUpRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BookmarksDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBookmarks();
      fetchStats();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/bookmarks/user/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/bookmarks/stats/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const removeBookmark = async (articleId) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/bookmarks/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          articleId
        })
      });

      const data = await response.json();
      if (data.success) {
        setBookmarks(data.bookmarks);
        fetchStats();
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getFilteredBookmarks = () => {
    let filtered = [...bookmarks];

    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(b => b.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(b => b.difficulty === difficultyFilter);
    }

    return filtered;
  };

  const filteredBookmarks = getFilteredBookmarks();

  const categories = stats?.byCategory ? Object.keys(stats.byCategory) : [];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                My Bookmarks
              </h1>
              <p className="text-gray-400">Your saved articles and learning resources</p>
            </div>
            <button
              onClick={() => navigate('/articles')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all hover:scale-105"
            >
              Browse Articles
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-600/20">
                <div className="flex items-center justify-between mb-2">
                  <BookmarkCheck className="w-8 h-8 text-blue-400" />
                  <span className="text-3xl font-bold text-blue-400">{stats.total}</span>
                </div>
                <p className="text-sm text-gray-400">Total Bookmarks</p>
              </div>

              <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-600/20">
                <div className="flex items-center justify-between mb-2">
                  <Tag className="w-8 h-8 text-green-400" />
                  <span className="text-3xl font-bold text-green-400">{Object.keys(stats.byCategory).length}</span>
                </div>
                <p className="text-sm text-gray-400">Categories</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-600/20">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                  <span className="text-3xl font-bold text-purple-400">
                    {stats.byDifficulty.Beginner || 0}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Beginner Level</p>
              </div>

              <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 backdrop-blur-sm rounded-xl p-6 border border-orange-600/20">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                  <span className="text-3xl font-bold text-orange-400">
                    {stats.byDifficulty.Advanced || 0}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Advanced Level</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark, index) => (
              <div
                key={bookmark.articleId}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{bookmark.thumbnail}</div>
                  <button
                    onClick={() => removeBookmark(bookmark.articleId)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all hover:scale-110"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                  {bookmark.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {bookmark.summary}
                </p>

                <div className="flex items-center gap-3 mb-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    bookmark.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                    bookmark.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {bookmark.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {bookmark.readTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => navigate('/articles')}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-all hover:gap-2"
                  >
                    Read
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {bookmark.tags && bookmark.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-wrap gap-2">
                    {bookmark.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-400">
              {bookmarks.length === 0 ? 'No bookmarks yet' : 'No bookmarks found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {bookmarks.length === 0 
                ? 'Start bookmarking articles to build your learning library'
                : 'Try adjusting your search or filters'}
            </p>
            <button
              onClick={() => navigate('/articles')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all hover:scale-105"
            >
              Browse Articles
            </button>
          </div>
        )}

        {/* Category Breakdown */}
        {stats && stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
          <div className="mt-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Bookmarks by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{count}</div>
                  <div className="text-sm text-gray-400">{category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksDashboard;
