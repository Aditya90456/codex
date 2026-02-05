import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import UserProfileSetup from './UserProfileSetup';
import ManualResumeEditor from './ManualResumeEditor';

const MLResumeCreator = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [customizations, setCustomizations] = useState({
    includeProjects: true,
    includeSkills: true,
    includeAchievements: true,
    includeCertifications: true,
    focusArea: 'fullstack',
    template: 'professional'
  });
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });
  const [generatedResume, setGeneratedResume] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [aiTemplates, setAiTemplates] = useState([]);
  const [selectedAiTemplate, setSelectedAiTemplate] = useState(null);
  const [generatingAiTemplate, setGeneratingAiTemplate] = useState(false);
  const [showAiTemplates, setShowAiTemplates] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [showManualEditor, setShowManualEditor] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchResumeHistory();
      fetchAiTemplates();
      fetchUserProfile();
      fetchUserPreferences();
      setPersonalInfo(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Update customizations when template changes
  useEffect(() => {
    setCustomizations(prev => ({ ...prev, template: selectedTemplate }));
  }, [selectedTemplate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/leetcode-ml/dashboard/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeHistory = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume-creator/history/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setResumeHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching resume history:', error);
    }
  };

  const fetchAiTemplates = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume-creator/ai-templates/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAiTemplates(data.data);
      }
    } catch (error) {
      console.error('Error fetching AI templates:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume-creator/user-profile/${user.id}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setUserProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/resume-creator/user-preferences/${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserPreferences(data.data);
        // Update customizations based on preferences
        setCustomizations(prev => ({
          ...prev,
          focusArea: data.data.industryFocus === 'technology' ? 'fullstack' : prev.focusArea,
          includeProjects: data.data.emphasizeProjects,
          template: data.data.preferredTemplateStyle || prev.template
        }));
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const generateUserBasedAiTemplate = async () => {
    if (!userData || !personalInfo.name) {
      alert('Please fill in your personal information first');
      return;
    }

    setGeneratingAiTemplate(true);
    try {
      const response = await fetch('/api/resume-creator/generate-user-based-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          personalInfo,
          focusArea: customizations.focusArea
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSelectedAiTemplate(data.data);
        setAiTemplates(prev => [data.data, ...prev]);
        alert(`✨ Personalized AI Template Generated!\n\n"${data.data.displayName}"\n\n${data.data.description}\n\nPersonalized for: ${data.data.personalizedFor?.uniqueValue || 'your coding journey'}`);
      } else {
        throw new Error(data.error || 'Failed to generate user-based template');
      }
    } catch (error) {
      console.error('Error generating user-based template:', error);
      alert('Failed to generate personalized template. Please try again.');
    } finally {
      setGeneratingAiTemplate(false);
    }
  };

  const generateResumeWithAiTemplate = async () => {
    if (!userData || !personalInfo.name || !selectedAiTemplate) {
      alert('Please select an AI template first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/resume-creator/generate-with-ai-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          personalInfo,
          aiTemplate: selectedAiTemplate,
          customizations
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedResume(data.data);
        setShowPreview(true);
        fetchResumeHistory();
      } else {
        throw new Error(data.error || 'Failed to generate resume with AI template');
      }
    } catch (error) {
      console.error('Error generating resume with AI template:', error);
      alert('Failed to generate resume with AI template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateResume = async () => {
    if (!userData || !personalInfo.name) {
      alert('Please fill in your personal information first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/resume-creator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          personalInfo,
          customizations: {
            ...customizations,
            template: selectedTemplate
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedResume(data.data);
        setShowPreview(true);
        // Refresh history
        fetchResumeHistory();
      } else {
        throw new Error(data.error || 'Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (format = 'txt') => {
    if (!generatedResume) return;
    
    if (format === 'pdf') {
      setDownloadingPdf(true);
    }
    
    try {
      const response = await fetch('/api/resume-creator/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: generatedResume,
          format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (format === 'pdf') {
          // Show success message for PDF
          alert('✅ PDF resume downloaded successfully!');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export resume');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to download ${format.toUpperCase()} resume. Please try again.`);
    } finally {
      if (format === 'pdf') {
        setDownloadingPdf(false);
      }
    }
  };

  const loadResumeFromHistory = (resume) => {
    setGeneratedResume(resume);
    setPersonalInfo(resume.personalInfo);
    setSelectedTemplate(resume.template || 'professional');
    setShowPreview(true);
    setShowHistory(false);
  };

  const templates = {
    professional: {
      name: 'Professional',
      description: 'Clean, ATS-friendly format perfect for corporate applications',
      color: '#2563eb'
    },
    creative: {
      name: 'Creative',
      description: 'Modern design with visual elements for creative roles',
      color: '#7c3aed'
    },
    technical: {
      name: 'Technical',
      description: 'Code-focused layout highlighting technical achievements',
      color: '#059669'
    },
    minimal: {
      name: 'Minimal',
      description: 'Simple, elegant design focusing on content',
      color: '#dc2626'
    }
  };

  if (showManualEditor) {
    return (
      <ManualResumeEditor
        onComplete={(resumeData) => {
          setGeneratedResume(resumeData);
          setShowManualEditor(false);
          setShowPreview(true);
          fetchResumeHistory();
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
          fetchUserProfile();
          fetchUserPreferences();
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
          <p className="text-gray-600">Generating your AI-powered resume...</p>
        </div>
      </div>
    );
  }

  if (showAiTemplates) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI-Generated Templates</h2>
                  <p className="text-gray-600">Personalized templates created by Gemini 2.5 Flash</p>
                </div>
                <button
                  onClick={() => setShowAiTemplates(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Creator
                </button>
              </div>
              
              <div className="mb-6 space-y-4">
                {!userProfile && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-800">Get More Personalized Templates</h4>
                        <p className="text-sm text-yellow-700">Complete your profile to unlock highly personalized AI templates based on your experience and goals.</p>
                      </div>
                      <button
                        onClick={() => setShowProfileSetup(true)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Setup Profile
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={generateUserBasedAiTemplate}
                    disabled={generatingAiTemplate || !personalInfo.name}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                  >
                    {generatingAiTemplate ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Generating Personalized Template...
                      </>
                    ) : (
                      <>
                        ✨ Generate {userProfile ? 'Personalized' : 'AI'} Template
                      </>
                    )}
                  </button>
                  
                  {userProfile && (
                    <button
                      onClick={() => setShowProfileSetup(true)}
                      className="px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-2"
                    >
                      ⚙️ Update Profile
                    </button>
                  )}
                </div>
              </div>
              
              {aiTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-gray-500 mb-4">No AI templates generated yet.</p>
                  <p className="text-sm text-gray-400">Click "Generate New AI Template" to create your first personalized template!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                  {aiTemplates.map((template, index) => (
                    <div 
                      key={template.templateName || index} 
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedAiTemplate?.templateName === template.templateName
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAiTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{template.displayName}</h3>
                          <p className="text-sm text-gray-600">{template.targetRole}</p>
                          {template.personalizedFor && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                👤 Personalized for {template.personalizedFor.userName}
                              </span>
                            </div>
                          )}
                        </div>
                        <div 
                          className="w-8 h-8 rounded-full border-2"
                          style={{ 
                            backgroundColor: template.styles?.primaryColor || '#2563eb',
                            borderColor: template.styles?.secondaryColor || '#1e40af'
                          }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{template.description}</p>
                      
                      {template.personalizedFor && (
                        <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                          <p className="font-medium text-blue-800">Key Strengths:</p>
                          <p className="text-blue-700">{template.personalizedFor.keyStrengths?.join(', ')}</p>
                          <p className="font-medium text-blue-800 mt-1">Career Stage:</p>
                          <p className="text-blue-700 capitalize">{template.personalizedFor.careerStage}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {template.styles?.layout || 'traditional'}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {template.styles?.spacing || 'normal'}
                        </span>
                        {template.customizations?.technicalFocus && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Technical
                          </span>
                        )}
                        {template.personalizedFor && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            User-Based
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Generated: {new Date(template.generatedAt).toLocaleDateString()}
                      </div>
                      
                      {template.aiRecommendations && template.aiRecommendations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-1">AI Recommendations:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {template.aiRecommendations.slice(0, 2).map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-purple-500">•</span>
                                <span className="line-clamp-1">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {selectedAiTemplate && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-purple-800">Selected: {selectedAiTemplate.displayName}</h4>
                      <p className="text-sm text-purple-600">{selectedAiTemplate.description}</p>
                    </div>
                    <button
                      onClick={generateResumeWithAiTemplate}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Generating...' : 'Generate Resume'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Resume History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Creator
                </button>
              </div>
              
              {resumeHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No resumes generated yet. Create your first AI-powered resume!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {resumeHistory.map((resume, index) => (
                    <div key={resume.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{resume.personalInfo.name}</h3>
                          <p className="text-sm text-gray-600">{resume.template} template</p>
                          <p className="text-xs text-gray-500">
                            Generated: {new Date(resume.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => loadResumeFromHistory(resume)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview && generatedResume) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => downloadResume('txt')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download TXT
              </button>
              <button
                onClick={() => downloadResume('pdf')}
                disabled={downloadingPdf}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {downloadingPdf ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    📄 Download PDF
                  </>
                )}
              </button>
              <button
                onClick={() => downloadResume('json')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download JSON
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 resume-scroll">
          <div className="max-w-4xl mx-auto">
            <div className="resume-preview bg-white border border-gray-200 p-8 rounded-lg shadow-lg">
              {/* Resume Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{generatedResume.personalInfo.name}</h1>
                <div className="text-gray-600 space-y-1">
                  <p>{generatedResume.personalInfo.email} | {generatedResume.personalInfo.phone}</p>
                  <p>{generatedResume.personalInfo.location}</p>
                  {generatedResume.personalInfo.linkedin && (
                    <p>LinkedIn: {generatedResume.personalInfo.linkedin}</p>
                  )}
                  {generatedResume.personalInfo.github && (
                    <p>GitHub: {generatedResume.personalInfo.github}</p>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{generatedResume.summary}</p>
              </div>

              {/* Technical Skills */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                  Technical Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Programming Languages</h3>
                    <p className="text-gray-600">{generatedResume.skills.programming.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Algorithms & Data Structures</h3>
                    <p className="text-gray-600">{generatedResume.skills.algorithms.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Tools & Technologies</h3>
                    <p className="text-gray-600">{generatedResume.skills.tools.join(', ')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Core Competencies</h3>
                    <p className="text-gray-600">{generatedResume.skills.soft.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              {generatedResume.experience && generatedResume.experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Professional Experience
                  </h2>
                  {generatedResume.experience.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-semibold text-gray-800 text-lg">{exp.title} - {exp.company}</h3>
                      <p className="text-gray-600 mb-2">{exp.duration} | {exp.location}</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {generatedResume.projects && generatedResume.projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Projects
                  </h2>
                  {generatedResume.projects.map((project, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="font-semibold text-gray-800 text-lg">{project.name}</h3>
                      <p className="text-gray-600 mb-2">{project.description}</p>
                      <p className="text-sm text-blue-600 mb-2">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {generatedResume.achievements && generatedResume.achievements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Achievements
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {generatedResume.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {generatedResume.certifications && generatedResume.certifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {generatedResume.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Coding Statistics */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                  Coding Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{generatedResume.stats.totalProblems}</div>
                    <div className="text-sm text-gray-600">Problems Solved</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{generatedResume.stats.streak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{generatedResume.stats.level}</div>
                    <div className="text-sm text-gray-600">Coding Level</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{generatedResume.stats.addictionScore}</div>
                    <div className="text-sm text-gray-600">Engagement Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Resume Creator</h1>
          <p className="text-gray-600">Generate a professional resume based on your LeetCode progress and coding achievements</p>
          
          {userProfile && (
            <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✅ Profile Complete - Personalized templates available
            </div>
          )}
          
          <div className="flex gap-4 justify-center mt-4">
            {resumeHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                View Resume History ({resumeHistory.length})
              </button>
            )}
            
            <button
              onClick={() => setShowAiTemplates(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            >
              🤖 {userProfile ? 'Personalized' : 'AI'} Templates ({aiTemplates.length})
            </button>
            
            <button
              onClick={() => setShowManualEditor(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              ✏️ Write Your Own Resume
            </button>
            
            {!userProfile && (
              <button
                onClick={() => setShowProfileSetup(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
              >
                👤 Setup Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 resume-scroll">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">

          {/* Resume Creation Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Resume Creation Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="font-semibold text-gray-800 mb-2">AI-Generated</h3>
                  <p className="text-sm text-gray-600 mb-4">Let AI create your resume based on your coding stats and preferences</p>
                  <button
                    onClick={() => setShowAiTemplates(true)}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Use AI Templates
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <div className="text-center">
                  <div className="text-3xl mb-2">✏️</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Write Your Own</h3>
                  <p className="text-sm text-gray-600 mb-4">Manually write your experience, skills, and projects with AI assistance</p>
                  <button
                    onClick={() => setShowManualEditor(true)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Manual Editor
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quick Generate</h3>
                  <p className="text-sm text-gray-600 mb-4">Fast resume generation using default templates and your coding data</p>
                  <button
                    onClick={generateResume}
                    disabled={loading || !personalInfo.name || !personalInfo.email}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Quick Generate'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                  type="url"
                  value={personalInfo.github}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/johndoe"
                />
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-full h-20 rounded mb-3"
                    style={{ backgroundColor: template.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                <select
                  value={customizations.focusArea}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, focusArea: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fullstack">Full-Stack Development</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="ai">AI/ML Engineering</option>
                  <option value="devops">DevOps Engineering</option>
                  <option value="data">Data Engineering</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(customizations).filter(([key]) => key !== 'focusArea' && key !== 'template').map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setCustomizations(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* User Stats Preview */}
          {userData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Coding Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{userData.user.totalProblems}</div>
                  <div className="text-sm text-gray-600">Problems Solved</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{userData.user.streak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{userData.user.level}</div>
                  <div className="text-sm text-gray-600">Coding Level</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{userData.user.addictionScore}</div>
                  <div className="text-sm text-gray-600">Engagement</div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="text-center pb-8">
            <p className="text-sm text-gray-500 mb-4">
              Or fill out your personal information below and use Quick Generate
            </p>
            <button
              onClick={generateResume}
              disabled={loading || !personalInfo.name || !personalInfo.email}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Generating...' : 'Generate AI Resume'}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Your resume will be generated based on your LeetCode progress and coding patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLResumeCreator;