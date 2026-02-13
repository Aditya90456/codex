import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Users, 
  Plus, 
  Search, 
  Lock, 
  Globe, 
  Trophy,
  MessageCircle,
  TrendingUp,
  Calendar,
  Target,
  Crown,
  Star,
  Send,
  X,
  Check,
  UserPlus,
  LogOut,
  Settings,
  Award,
  Zap,
  BookOpen,
  Code
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const StudyGroups = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('discover'); // discover, myGroups, create
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const categories = ['All', 'DSA', 'Web Dev', 'Mobile', 'AI/ML', 'Interview Prep', 'Competitive'];

  useEffect(() => {
    if (activeTab === 'discover') {
      fetchPublicGroups();
    } else if (activeTab === 'myGroups' && user) {
      fetchMyGroups();
    }
  }, [activeTab, user, searchQuery, selectedCategory]);

  const fetchPublicGroups = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      
      const response = await fetch(`${API_URL}/api/study-groups/discover?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Fetch groups error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/study-groups/user/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setMyGroups(data.groups);
      }
    } catch (error) {
      console.error('Fetch my groups error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Study Groups
            </h1>
            <p className="text-slate-400">Learn together, grow together</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Group
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Discover
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('myGroups')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'myGroups'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Groups ({myGroups.length})
            </div>
          </button>
        </div>

        {/* Search and Filters */}
        {activeTab === 'discover' && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading groups...</p>
          </div>
        ) : activeTab === 'discover' ? (
          <DiscoverGroups groups={groups} onSelectGroup={(g) => { setSelectedGroup(g); setShowGroupModal(true); }} />
        ) : (
          <MyGroupsList groups={myGroups} onSelectGroup={(g) => { setSelectedGroup(g); setShowGroupModal(true); }} />
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onCreated={fetchMyGroups} />}
      {showGroupModal && selectedGroup && (
        <GroupDetailsModal 
          group={selectedGroup} 
          onClose={() => { setShowGroupModal(false); setSelectedGroup(null); }}
          onUpdate={activeTab === 'myGroups' ? fetchMyGroups : fetchPublicGroups}
        />
      )}
    </div>
  );
};

// Component continues in next part...
export default StudyGroups;


// Discover Groups Component
const DiscoverGroups = ({ groups, onSelectGroup }) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No groups found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map(group => (
        <div
          key={group.id}
          onClick={() => onSelectGroup(group)}
          className="group relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer transform hover:scale-105"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{group.description}</p>
              </div>
              <div className="ml-2">
                {group.isPrivate ? (
                  <Lock className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Globe className="w-5 h-5 text-green-400" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                {group.category}
              </span>
              {group.tags && group.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{group.stats.totalMembers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{group.stats.totalProblems}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                by {group.creatorName}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// My Groups List Component
const MyGroupsList = ({ groups, onSelectGroup }) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">You haven't joined any groups yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div
          key={group.id}
          onClick={() => onSelectGroup(group)}
          className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{group.name}</h3>
                {group.isPrivate && <Lock className="w-4 h-4 text-yellow-400" />}
              </div>
              <p className="text-sm text-slate-400 mb-4">{group.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{group.stats.totalMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>{group.stats.totalProblems} problems solved</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{group.messages?.length || 0} messages</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {group.stats.averageProgress}
              </div>
              <div className="text-xs text-slate-500">Avg Progress</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Create Group Modal Component
const CreateGroupModal = ({ onClose, onCreated }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'DSA',
    isPrivate: false,
    maxMembers: 50,
    tags: ''
  });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${API_URL}/api/study-groups/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          creatorId: user.id,
          creatorName: user.firstName || user.username || 'User'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Group created! ${data.group.isPrivate ? `Invite code: ${data.group.inviteCode}` : ''}`);
        onCreated();
        onClose();
      }
    } catch (error) {
      console.error('Create group error:', error);
      alert('Failed to create group');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Create Study Group</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Group Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., DSA Masters 2026"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What's your group about?"
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="DSA">DSA</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Mobile">Mobile</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Competitive">Competitive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Members</label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                min="2"
                max="100"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="e.g., arrays, graphs, dynamic-programming"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
              className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="text-sm text-slate-300">
              Make this group private (requires invite code to join)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl transition-all"
            >
              {creating ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Group Details Modal - Part 1
const GroupDetailsModal = ({ group, onClose, onUpdate }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (group && user) {
      setIsMember(group.members?.some(m => m.userId === user.id));
    }
  }, [group, user]);

  const handleJoin = async () => {
    if (!user) return;

    if (group.isPrivate && !inviteCode) {
      alert('Please enter the invite code');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/study-groups/${group.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.firstName || user.username || 'User',
          inviteCode: group.isPrivate ? inviteCode : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Joined group successfully!');
        onUpdate();
        onClose();
      } else {
        alert(data.error || 'Failed to join group');
      }
    } catch (error) {
      console.error('Join error:', error);
      alert('Failed to join group');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch(`${API_URL}/api/study-groups/${group.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.firstName || user.username || 'User',
          message: newMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        onUpdate();
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{group.name}</h2>
              {group.isPrivate && <Lock className="w-5 h-5 text-yellow-400" />}
            </div>
            <p className="text-slate-400">{group.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white ml-4">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-slate-700">
          {['overview', 'members', 'chat', 'challenges'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && <OverviewTab group={group} />}
          {activeTab === 'members' && <MembersTab members={group.members} />}
          {activeTab === 'chat' && (
            <ChatTab 
              messages={group.messages || []} 
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSend={handleSendMessage}
              isMember={isMember}
            />
          )}
          {activeTab === 'challenges' && <ChallengesTab challenges={group.challenges || []} />}
        </div>

        {/* Footer */}
        {!isMember && (
          <div className="p-6 border-t border-slate-700">
            {group.isPrivate && (
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none mb-3"
              />
            )}
            <button
              onClick={handleJoin}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all"
            >
              Join Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ group }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{group.stats.totalMembers}</div>
        <div className="text-xs text-slate-400">Members</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{group.stats.totalProblems}</div>
        <div className="text-xs text-slate-400">Problems Solved</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{group.stats.averageProgress}</div>
        <div className="text-xs text-slate-400">Avg Progress</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{group.stats.activeMembers}</div>
        <div className="text-xs text-slate-400">Active</div>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold mb-3">About</h3>
      <p className="text-slate-400">{group.description || 'No description provided.'}</p>
    </div>

    {group.tags && group.tags.length > 0 && (
      <div>
        <h3 className="text-lg font-bold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {group.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const MembersTab = ({ members }) => (
  <div className="space-y-3">
    {members.map(member => (
      <div key={member.userId} className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
            {member.userName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{member.userName}</span>
              {member.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            <div className="text-xs text-slate-400">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">{member.problemsSolved}</div>
          <div className="text-xs text-slate-400">Problems</div>
        </div>
      </div>
    ))}
  </div>
);

const ChatTab = ({ messages, newMessage, setNewMessage, onSend, isMember }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map(msg => (
          <div key={msg.id} className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{msg.userName}</span>
              <span className="text-xs text-slate-500">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-300">{msg.message}</p>
          </div>
        ))
      )}
    </div>
    
    {isMember && (
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={onSend}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    )}
  </div>
);

const ChallengesTab = ({ challenges }) => (
  <div className="space-y-4">
    {challenges.length === 0 ? (
      <div className="text-center py-8 text-slate-400">
        No challenges yet. Create one to get started!
      </div>
    ) : (
      challenges.map(challenge => (
        <div key={challenge.id} className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-lg">{challenge.title}</h4>
              <p className="text-sm text-slate-400">{challenge.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              challenge.status === 'active' 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-700 text-slate-400'
            }`}>
              {challenge.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span>{challenge.problemIds?.length || 0} problems</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);
