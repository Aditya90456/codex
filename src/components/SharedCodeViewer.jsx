import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Editor from '@monaco-editor/react';
import { 
  Code, 
  User, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Globe, 
  Lock,
  Copy,
  Check,
  Send,
  ArrowLeft
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const SharedCodeViewer = () => {
  const { shareId } = useParams();
  const { user } = useUser();
  const [sharedCode, setSharedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (shareId) {
      fetchSharedCode();
    }
  }, [shareId]);

  const fetchSharedCode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/code/share/${shareId}`);
      const data = await response.json();

      if (data.success) {
        setSharedCode(data.data);
      } else {
        setError(data.error || 'Failed to load shared code');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load shared code');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked) return;

    try {
      const response = await fetch(`${API_URL}/api/code/share/${shareId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setSharedCode(prev => ({ ...prev, likes: data.likes }));
        setLiked(true);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`${API_URL}/api/code/share/${shareId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          userName: user?.firstName || user?.username || 'Anonymous'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSharedCode(prev => ({
          ...prev,
          comments: [...prev.comments, data.comment]
        }));
        setNewComment('');
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sharedCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading shared code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Code Not Found</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {sharedCode.problemTitle}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{sharedCode.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(sharedCode.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span className="capitalize">{sharedCode.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sharedCode.isPublic ? (
                      <>
                        <Globe className="w-4 h-4 text-green-400" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-yellow-400" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{sharedCode.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{sharedCode.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{sharedCode.comments.length}</span>
                </div>
              </div>
            </div>

            {sharedCode.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
                <p className="text-gray-400 leading-relaxed">{sharedCode.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="font-medium text-white">Code Solution</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 capitalize">{sharedCode.language}</span>
                </div>
              </div>
              <div className="h-96">
                <Editor
                  height="100%"
                  language={sharedCode.language === 'cpp' ? 'cpp' : sharedCode.language}
                  value={sharedCode.code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="font-medium text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    liked
                      ? 'bg-red-600 text-white cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Liked!' : 'Like'} ({sharedCode.likes})
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="font-medium text-white mb-4">
                Comments ({sharedCode.comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {submittingComment ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sharedCode.comments.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  sharedCode.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCodeViewer;