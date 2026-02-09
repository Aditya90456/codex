import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  PenSquare, Heart, MessageCircle, Eye, Share2, Bookmark,
  TrendingUp, Users, Tag, Search, Filter, Plus, X, Edit,
  Trash2, ThumbsDown, Send, UserPlus, UserMinus, Home,
  Clock, ArrowUp, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const BlogPlatform = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('feed');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [userProfile, setUserProfile] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    tags: [],
    coverImage: ''
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadTags();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'feed') {
      loadFeed();
    } else if (activeTab === 'explore') {
      loadAllBlogs();
    } else if (activeTab === 'trending') {
      loadTrending();
    } else if (activeTab === 'myblogs') {
      loadMyBlogs();
    }
  }, [activeTab, searchQuery, selectedTag, sortBy]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/user/${user.id}/profile`);
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    }
  };

  const loadFeed = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blogs/feed/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Load feed error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag && { tag: selectedTag })
      });
      const response = await fetch(`${API_URL}/api/blogs/all?${params}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Load blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blogs/trending/all?limit=20`);
      const data = await response.json();
      if (data.success) {
        setTrendingBlogs(data.blogs);
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Load trending error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyBlogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/blogs/all?userId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Load my blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/tags/all`);
      const data = await response.json();
      if (data.success) {
        setAllTags(data.tags);
      }
    } catch (error) {
      console.error('Load tags error:', error);
    }
  };

  const createBlog = async () => {
    if (!user || !blogForm.title || !blogForm.content) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/blogs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.username,
          userAvatar: user.imageUrl,
          ...blogForm
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setBlogForm({ title: '', content: '', tags: [], coverImage: '' });
        loadMyBlogs();
        alert('Blog created successfully!');
      }
    } catch (error) {
      console.error('Create blog error:', error);
      alert('Failed to create blog');
    }
  };

  const handleLike = async (blogId) => {
    if (!user) {
      alert('Please sign in to like');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setBlogs(blogs.map(blog =>
          blog.id === blogId
            ? { ...blog, likes: data.isLiked ? [...blog.likes, user.id] : blog.likes.filter(id => id !== user.id), dislikes: blog.dislikes.filter(id => id !== user.id) }
            : blog
        ));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleDislike = async (blogId) => {
    if (!user) {
      alert('Please sign in to dislike');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/blogs/${blogId}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.map(blog =>
          blog.id === blogId
            ? { ...blog, dislikes: data.isDisliked ? [...blog.dislikes, user.id] : blog.dislikes.filter(id => id !== user.id), likes: blog.likes.filter(id => id !== user.id) }
            : blog
        ));
      }
    } catch (error) {
      console.error('Dislike error:', error);
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!user) {
      alert('Please sign in to follow');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/blogs/follow/${targetUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();
      if (data.success) {
        loadUserProfile();
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const deleteBlog = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`${API_URL}/api/blogs/${blogId}?userId=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        alert('Blog deleted successfully');
      }
    } catch (error) {
      console.error('Delete blog error:', error);
      alert('Failed to delete blog');
    }
  };

  const BlogCard = ({ blog }) => {
    const isLiked = user && blog.likes.includes(user.id);
    const isDisliked = user && blog.dislikes.includes(user.id);
    const isFollowing = userProfile && userProfile.following.includes(blog.userId);
    const isOwnBlog = user && blog.userId === user.id;

    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700">
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-48 object-cover" />
        )}
        
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={blog.userAvatar || 'https://via.placeholder.com/40'}
                alt={blog.userName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-white">{blog.userName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {!isOwnBlog && user && (
              <button
                onClick={() => handleFollow(blog.userId)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                  isFollowing
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {/* Title & Content */}
          <h2 className="text-2xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer"
              onClick={() => setSelectedBlog(blog)}>
            {blog.title}
          </h2>
          
          <p className="text-gray-300 mb-4 line-clamp-3">
            {blog.content.substring(0, 200)}...
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedTag(tag)}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-600/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(blog.id)}
                className={`flex items-center gap-2 transition-all ${
                  isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{blog.likes.length}</span>
              </button>

              <button
                onClick={() => handleDislike(blog.id)}
                className={`flex items-center gap-2 transition-all ${
                  isDisliked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                }`}
              >
                <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                <span>{blog.dislikes.length}</span>
              </button>

              <button
                onClick={() => setSelectedBlog(blog)}
                className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{blog.comments?.length || 0}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="w-5 h-5" />
                <span>{blog.views}</span>
              </div>
            </div>

            {isOwnBlog && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PenSquare className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Blog Platform
              </h1>
            </div>

            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Blog
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-300">Navigation</h3>
              <div className="space-y-2">
                {[
                  { id: 'feed', label: 'My Feed', icon: Home },
                  { id: 'explore', label: 'Explore', icon: Search },
                  { id: 'trending', label: 'Trending', icon: TrendingUp },
                  { id: 'myblogs', label: 'My Blogs', icon: PenSquare }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Stats */}
            {user && userProfile && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-4 text-gray-300">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Blogs</span>
                    <span className="font-bold text-blue-400">{userProfile.blogsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Followers</span>
                    <span className="font-bold text-green-400">{userProfile.followersCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Following</span>
                    <span className="font-bold text-purple-400">{userProfile.followingCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Tags */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-300">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map((tagObj, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTag(tagObj.tag);
                      setActiveTab('explore');
                    }}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm hover:bg-blue-600/30 transition-all"
                  >
                    #{tagObj.tag} ({tagObj.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Filters */}
            {activeTab === 'explore' && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="views">Most Viewed</option>
                  </select>

                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag('')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      #{selectedTag}
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Blogs Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                <PenSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No blogs found</h3>
                <p className="text-gray-500">
                  {activeTab === 'feed' ? 'Follow users to see their blogs here' : 'Be the first to create a blog!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {blogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create New Blog</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Title</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="Enter blog title..."
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Cover Image URL (optional)</label>
                <input
                  type="text"
                  value={blogForm.coverImage}
                  onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Content</label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write your blog content..."
                  rows="12"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={blogForm.tags.join(', ')}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="javascript, react, tutorial"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {blogForm.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={createBlog}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all"
                >
                  Publish Blog
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <BlogDetailModal
          blog={selectedBlog}
          user={user}
          onClose={() => setSelectedBlog(null)}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </div>
  );
};

// Blog Detail Modal Component
const BlogDetailModal = ({ blog, user, onClose, onLike, onDislike }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(blog.comments || []);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const addComment = async () => {
    if (!user || !comment.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/blogs/${blog.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.username,
          userAvatar: user.imageUrl,
          content: comment
        })
      });

      const data = await response.json();
      if (data.success) {
        setComments([...comments, data.comment]);
        setComment('');
      }
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${blog.id}/comment/${commentId}?userId=${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  const isLiked = user && blog.likes.includes(user.id);
  const isDisliked = user && blog.dislikes.includes(user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-auto">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={blog.userAvatar || 'https://via.placeholder.com/40'}
              alt={blog.userName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{blog.userName}</p>
              <p className="text-xs text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {blog.coverImage && (
            <img src={blog.coverImage} alt={blog.title} className="w-full h-64 object-cover rounded-xl" />
          )}

          <h1 className="text-3xl font-bold">{blog.title}</h1>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">{blog.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
            <button
              onClick={() => onLike(blog.id)}
              className={`flex items-center gap-2 transition-all ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{blog.likes.length}</span>
            </button>

            <button
              onClick={() => onDislike(blog.id)}
              className={`flex items-center gap-2 transition-all ${
                isDisliked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              <ThumbsDown className={`w-6 h-6 ${isDisliked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{blog.dislikes.length}</span>
            </button>

            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">{comments.length}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-6 h-6" />
              <span className="font-semibold">{blog.views}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

            {/* Add Comment */}
            {user && (
              <div className="flex gap-3 mb-6">
                <img
                  src={user.imageUrl || 'https://via.placeholder.com/40'}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={addComment}
                    disabled={!comment.trim()}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-3 p-4 bg-gray-700/50 rounded-lg">
                    <img
                      src={c.userAvatar || 'https://via.placeholder.com/40'}
                      alt={c.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold">{c.userName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                          {user && c.userId === user.id && (
                            <button
                              onClick={() => deleteComment(c.id)}
                              className="text-red-400 hover:text-red-300 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPlatform;
