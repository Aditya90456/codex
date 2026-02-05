import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import UserProfileSetup from './UserProfileSetup';
import ManualResumeEditor from './ManualResumeEditor';

const MLResumeCreator = () => {
  const { user } = useUser();
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loading, setLoading] = useState(false);

  if (showManualEditor) {
    return (
      <ManualResumeEditor
        onComplete={(resumeData) => {
          console.log('Resume completed:', resumeData);
          setShowManualEditor(false);
        }}
        onCancel={() => setShowManualEditor(false)}
      />
    );
  }

  if (showProfileSetup) {
    return (
      <UserProfileSetup
        onComplete={() => {
          setShowProfileSetup(false);
        }}
        onSkip={() => setShowProfileSetup(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            AI-Powered Resume Creator
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Manual Editor</h3>
              <p className="text-sm text-gray-600 mb-4">
                Write your own resume with AI assistance
              </p>
              <button
                onClick={() => setShowManualEditor(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Start Manual Editor
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="font-semibold text-gray-800 mb-2">Setup Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your profile for personalized templates
              </p>
              <button
                onClick={() => setShowProfileSetup(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Setup Profile
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Templates</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate AI-powered resume templates
              </p>
              <button
                onClick={() => setLoading(true)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLResumeCreator;