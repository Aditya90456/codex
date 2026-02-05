import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserProfileSetup = ({ onComplete, onSkip }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    yearsOfExperience: '',
    educationLevel: '',
    specializations: [],
    achievements: [],
    workStyle: '',
    hasLeadershipExperience: false,
    careerGoals: [],
    industryFocus: 'technology',
    preferredLanguages: [],
    currentRole: '',
    dreamRole: '',
    strengths: [],
    learningGoals: []
  });

  const [preferences, setPreferences] = useState({
    preferredTemplateStyle: 'modern',
    colorScheme: 'professional',
    showCodingStats: true,
    emphasizeProjects: true,
    includeGitHubActivity: true,
    experienceLevel: 'intermediate'
  });

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-1 years)' },
    { value: 'junior', label: 'Junior (1-3 years)' },
    { value: 'mid', label: 'Mid-Level (3-5 years)' },
    { value: 'senior', label: 'Senior (5-8 years)' },
    { value: 'expert', label: 'Expert/Lead (8+ years)' }
  ];

  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Bootcamp Graduate',
    'Self-Taught'
  ];

  const specializationOptions = [
    'Frontend Development',
    'Backend Development',
    'Full-Stack Development',
    'Mobile Development',
    'DevOps/Infrastructure',
    'Data Science/Analytics',
    'Machine Learning/AI',
    'Cybersecurity',
    'Cloud Computing',
    'Game Development',
    'Blockchain',
    'UI/UX Design'
  ];

  const languageOptions = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'Go', 'Rust',
    'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'SQL'
  ];

  const careerGoalOptions = [
    'Technical Leadership',
    'Product Management',
    'Startup Founder',
    'Senior Engineer',
    'Architect',
    'Consultant',
    'Open Source Contributor',
    'Technical Writer',
    'Mentor/Teacher',
    'Research & Development'
  ];

  const workStyleOptions = [
    'Collaborative Team Player',
    'Independent Problem Solver',
    'Creative Innovator',
    'Detail-Oriented Perfectionist',
    'Fast-Paced Executor',
    'Strategic Thinker',
    'Continuous Learner',
    'Mentor & Guide'
  ];

  const handleArrayToggle = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save profile data
      const profileResponse = await fetch('/api/resume-creator/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          profileData
        })
      });

      // Save preferences
      const preferencesResponse = await fetch('/api/resume-creator/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          preferences
        })
      });

      if (profileResponse.ok && preferencesResponse.ok) {
        onComplete && onComplete();
      } else {
        throw new Error('Failed to save profile data');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">This helps us create a personalized resume template just for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
          <select
            value={profileData.yearsOfExperience}
            onChange={(e) => setProfileData(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
          <select
            value={profileData.educationLevel}
            onChange={(e) => setProfileData(prev => ({ ...prev, educationLevel: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select education level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
          <input
            type="text"
            value={profileData.currentRole}
            onChange={(e) => setProfileData(prev => ({ ...prev, currentRole: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Software Engineer, Student, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dream Role</label>
          <input
            type="text"
            value={profileData.dreamRole}
            onChange={(e) => setProfileData(prev => ({ ...prev, dreamRole: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Senior Full-Stack Developer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
        <select
          value={profileData.workStyle}
          onChange={(e) => setProfileData(prev => ({ ...prev, workStyle: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your work style</option>
          {workStyleOptions.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={profileData.hasLeadershipExperience}
            onChange={(e) => setProfileData(prev => ({ ...prev, hasLeadershipExperience: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">I have leadership or mentoring experience</span>
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Skills & Interests</h2>
        <p className="text-gray-600">Help us understand your technical background and aspirations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Specializations (select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specializationOptions.map(spec => (
            <label key={spec} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData.specializations.includes(spec)}
                onChange={() => handleArrayToggle(
                  profileData.specializations,
                  (newArray) => setProfileData(prev => ({ ...prev, specializations: newArray })),
                  spec
                )}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{spec}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Programming Languages</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {languageOptions.map(lang => (
            <label key={lang} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData.preferredLanguages.includes(lang)}
                onChange={() => handleArrayToggle(
                  profileData.preferredLanguages,
                  (newArray) => setProfileData(prev => ({ ...prev, preferredLanguages: newArray })),
                  lang
                )}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Career Goals</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {careerGoalOptions.map(goal => (
            <label key={goal} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData.careerGoals.includes(goal)}
                onChange={() => handleArrayToggle(
                  profileData.careerGoals,
                  (newArray) => setProfileData(prev => ({ ...prev, careerGoals: newArray })),
                  goal
                )}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Preferences</h2>
        <p className="text-gray-600">Customize how your resume looks and what it emphasizes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template Style</label>
          <select
            value={preferences.preferredTemplateStyle}
            onChange={(e) => setPreferences(prev => ({ ...prev, preferredTemplateStyle: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="modern">Modern</option>
            <option value="traditional">Traditional</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
          <select
            value={preferences.colorScheme}
            onChange={(e) => setPreferences(prev => ({ ...prev, colorScheme: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.showCodingStats}
            onChange={(e) => setPreferences(prev => ({ ...prev, showCodingStats: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show coding statistics (problems solved, streaks, etc.)</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.emphasizeProjects}
            onChange={(e) => setPreferences(prev => ({ ...prev, emphasizeProjects: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Emphasize projects and technical achievements</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.includeGitHubActivity}
            onChange={(e) => setPreferences(prev => ({ ...prev, includeGitHubActivity: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Include GitHub activity and contributions</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip Setup
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={saveProfile}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetup;