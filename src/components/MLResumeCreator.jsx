import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import ManualResumeEditor from './ManualResumeEditor';

const MLResumeCreator = () => {
  const { user } = useUser();
  const [showManualEditor, setShowManualEditor] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Resume Creator
          </h1>
          
          <div className="max-w-md mx-auto">
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-6xl mb-6">✏️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Manual Resume Editor</h3>
              <p className="text-gray-600 mb-6">
                Create your professional resume by filling out your experience, skills, projects, and education. 
                Download as PDF, TXT, or JSON format.
              </p>
              <button
                onClick={() => setShowManualEditor(true)}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
              >
                Start Creating Resume
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Fill out your information and download your resume in multiple formats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLResumeCreator;