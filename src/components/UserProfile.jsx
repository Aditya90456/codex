import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  Star,
  Edit3,
  Save,
  X,
  Award,
  TrendingUp,
  Code,
  Clock
} from 'lucide-react';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  if (!isOpen || !user) return null;

  const handleSave = () => {
    updateUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      username: user.username,
      email: user.email,
      bio: user.bio || '',
    });
    setIsEditing(false);
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Solved your first problem', icon: '🎯', earned: true },
    { id: 2, name: 'Problem Solver', description: 'Solved 10 problems', icon: '🏆', earned: true },
    { id: 3, name: 'Speed Demon', description: 'Solved a problem in under 5 minutes', icon: '⚡', earned: false },
    { id: 4, name: 'Consistency', description: 'Solved problems for 7 days straight', icon: '📅', earned: false },
  ];

  const stats = [
    { label: 'Problems Solved', value: user.solvedProblems || 0, icon: Target },
    { label: 'Current Rating', value: user.rating || 1200, icon: TrendingUp },
    { label: 'Languages Used', value: 5, icon: Code },
    { label: 'Days Active', value: 42, icon: Clock },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-full"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-full"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.username}</h3>
                  <p className="text-gray-400 flex items-center space-x-2">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </p>
                  <p className="text-gray-400 flex items-center space-x-2 mt-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center space-x-2"
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Bio</h4>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none w-full h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-300">
                {user.bio || 'No bio available. Click edit to add one!'}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg text-center">
                  <stat.icon size={24} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Achievements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    achievement.earned
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        achievement.earned ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {achievement.name}
                      </h5>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <Award size={20} className="text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Progress */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Rating Progress</h4>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Current Rating</span>
                <span className="text-blue-400 font-bold">{user.rating}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((user.rating / 2000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Beginner (0)</span>
                <span>Expert (2000+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;