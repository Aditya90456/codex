import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  Eye,
  Heart,
  MessageCircle,
  Code,
  User,
  Calendar
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CodeShareModal = ({ 
  isOpen, 
  onClose, 
  code, 
  language, 
  problemId, 
  problemTitle 
}) => {
  const { user } = useUser();
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const response = await fetch(`${API_URL}/api/code/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          problemId,
          problemTitle: problemTitle || 'Code Solution',
          userId: user?.id,
          userName: user?.firstName || user?.username || 'Anonymous',
          description,
          isPublic
        })
      });

      const data = await response.json();

      if (data.success) {
        setShareResult(data);
      } else {
        throw new Error(data.error || 'Failed to share code');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share code. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareResult?.shareUrl) {
      try {
        await navigator.clipboard.writeText(shareResult.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  const handleClose = () => {
    setShareResult(null);
    setDescription('');
    setIsPublic(true);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Share Your Code</h2>
              <p className="text-sm text-gray-400">
                {problemTitle || 'Code Solution'} • {language}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!shareResult ? (
          /* Share Form */
          <div className="p-6 space-y-6">
            {/* Code Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Code Preview
              </label>
              <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {code}
                </pre>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your solution approach, time complexity, or any insights..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Privacy
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    <span className="text-white">Public</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Anyone with the link can view
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">Private</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Only people with the link can view
                  </span>
                </label>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing || !code.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSharing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share Code
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Share Success */
          <div className="p-6 space-y-6">
            {/* Success Message */}
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Code Shared Successfully!
              </h3>
              <p className="text-gray-400">
                Your solution is now available at the link below
              </p>
            </div>

            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Share Link
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm break-all">
                  {shareResult.shareUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>Share ID: {shareResult.shareId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>By: {user?.firstName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span>Shared: Just now</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  {isPublic ? (
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.open(shareResult.shareUrl, '_blank')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Shared Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeShareModal;