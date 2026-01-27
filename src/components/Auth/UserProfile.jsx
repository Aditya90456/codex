import { useAuthContext } from '../../contexts/AuthContext';
import { User, Mail, Calendar, LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, userName, userEmail, signOut, isSignedIn } = useAuthContext();

  if (!isSignedIn) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Please sign in to view your profile</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-4 mb-6">
        {user?.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={userName}
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        )}
        
        <div>
          <h2 className="text-xl font-bold text-white">{userName}</h2>
          <p className="text-gray-400">{userEmail}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-300">
          <Mail className="w-5 h-5 text-blue-400" />
          <span>{userEmail || 'No email provided'}</span>
        </div>
        
        {user?.createdAt && (
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;