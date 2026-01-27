import { UserProfile } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard Link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* User Profile Component */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
          <UserProfile 
            appearance={{
              elements: {
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-white text-xl',
                headerSubtitle: 'text-gray-300',
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                formFieldInput: 'bg-gray-700 border-gray-600 text-white',
                formFieldLabel: 'text-gray-300',
                profileSectionTitle: 'text-white',
                profileSectionContent: 'text-gray-300',
                breadcrumbsItem: 'text-gray-400',
                breadcrumbsItemDivider: 'text-gray-600',
                navbarButton: 'text-gray-300 hover:text-white',
                pageScrollBox: 'bg-gray-900',
                socialButtonsBlockButton: 'border-gray-600 text-white hover:bg-gray-700',
                footerActionLink: 'text-blue-400 hover:text-blue-300',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;