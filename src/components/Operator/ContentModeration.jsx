import { useState } from 'react';
import { useOperator, PERMISSIONS } from '../../contexts/OperatorContext';
import { AlertTriangle, CheckCircle, XCircle, Eye, Trash2, Flag } from 'lucide-react';

const ContentModeration = () => {
  const { hasPermission } = useOperator();
  const [filter, setFilter] = useState('pending');

  const flaggedContent = [
    {
      id: 1,
      type: 'comment',
      content: 'This is a test comment that was flagged...',
      author: 'user123',
      reason: 'Spam',
      status: 'pending',
      reportedBy: 'moderator1',
      date: '2024-02-20',
    },
    {
      id: 2,
      type: 'solution',
      content: 'Solution code with inappropriate content...',
      author: 'coder456',
      reason: 'Inappropriate',
      status: 'pending',
      reportedBy: 'user789',
      date: '2024-02-21',
    },
    {
      id: 3,
      type: 'comment',
      content: 'Resolved flagged content...',
      author: 'user999',
      reason: 'Harassment',
      status: 'approved',
      reportedBy: 'moderator2',
      date: '2024-02-19',
    },
  ];

  const filteredContent = flaggedContent.filter(item => 
    filter === 'all' || item.status === filter
  );

  const handleApprove = (id) => {
    if (!hasPermission(PERMISSIONS.MODERATE_CONTENT)) {
      alert('You do not have permission to moderate content');
      return;
    }
    console.log('Approving content:', id);
  };

  const handleReject = (id) => {
    if (!hasPermission(PERMISSIONS.MODERATE_CONTENT)) {
      alert('You do not have permission to moderate content');
      return;
    }
    console.log('Rejecting content:', id);
  };

  const handleDelete = (id) => {
    if (!hasPermission(PERMISSIONS.DELETE_CONTENT)) {
      alert('You do not have permission to delete content');
      return;
    }
    if (confirm('Are you sure you want to delete this content?')) {
      console.log('Deleting content:', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Moderation</h2>
        <div className="flex items-center gap-3">
          <span className="text-gray-400">{filteredContent.length} items</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-all ${
              filter === status
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContent.map(item => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-red-400" />
                <div>
                  <span className="inline-block px-2 py-1 bg-gray-700 rounded text-xs font-medium text-gray-300 mr-2">
                    {item.type}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                    item.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-400">{item.date}</span>
            </div>

            <div className="mb-4">
              <p className="text-white mb-2">{item.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Author: <span className="text-gray-300">{item.author}</span></span>
                <span>Reason: <span className="text-red-400">{item.reason}</span></span>
                <span>Reported by: <span className="text-gray-300">{item.reportedBy}</span></span>
              </div>
            </div>

            {item.status === 'pending' && (
              <div className="flex items-center gap-2">
                {hasPermission(PERMISSIONS.MODERATE_CONTENT) && (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {hasPermission(PERMISSIONS.DELETE_CONTENT) && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModeration;
