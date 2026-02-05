import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const ManualResumeEditor = ({ onComplete, onCancel }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    skills: {
      technical: [],
      programming: [],
      tools: [],
      soft: []
    },
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    customSections: []
  });

  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: ['']
  });

  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    technologies: [],
    startDate: '',
    endDate: '',
    githubUrl: '',
    liveUrl: '',
    highlights: ['']
  });

  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    institution: '',
    location: '',
    graduationDate: '',
    gpa: '',
    relevantCourses: [],
    honors: []
  });

  useEffect(() => {
    if (user) {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || ''
        }
      }));
    }
  }, [user]);

  const addExperience = () => {
    if (currentExperience.title && currentExperience.company) {
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...currentExperience, id: Date.now() }]
      }));
      setCurrentExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: ['']
      });
    }
  };

  const addProject = () => {
    if (currentProject.name && currentProject.description) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...currentProject, id: Date.now() }]
      }));
      setCurrentProject({
        name: '',
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
        githubUrl: '',
        liveUrl: '',
        highlights: ['']
      });
    }
  };

  const addEducation = () => {
    if (currentEducation.degree && currentEducation.institution) {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...currentEducation, id: Date.now() }]
      }));
      setCurrentEducation({
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
        relevantCourses: [],
        honors: []
      });
    }
  };

  const addArrayItem = (array, setArray, newItem = '') => {
    setArray([...array, newItem]);
  };

  const updateArrayItem = (array, setArray, index, value) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const removeArrayItem = (array, setArray, index) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category, index) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resume-creator/generate-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resumeData
        })
      });

      const data = await response.json();
      if (data.success) {
        onComplete(data.data);
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
    if (!resumeData.personalInfo.name || !resumeData.personalInfo.email) {
      alert('Please fill in at least your name and email before downloading.');
      return;
    }

    setLoading(true);
    try {
      // First generate the resume data
      const generateResponse = await fetch('/api/resume-creator/generate-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resumeData
        })
      });

      const generateData = await generateResponse.json();
      if (!generateData.success) {
        throw new Error(generateData.error || 'Failed to generate resume');
      }

      // Then export it in the requested format
      const response = await fetch('/api/resume-creator/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: generateData.data,
          format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (format === 'pdf') {
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
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={resumeData.personalInfo.name}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, name: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={resumeData.personalInfo.location}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
          <input
            type="url"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
          <input
            type="url"
            value={resumeData.personalInfo.github}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, github: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/johndoe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
          value={resumeData.personalInfo.summary}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, summary: e.target.value }
          }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
      </div>

      {/* Current Experience Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-4">Add New Experience</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              value={currentExperience.title}
              onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <input
              type="text"
              value={currentExperience.company}
              onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tech Company Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={currentExperience.location}
              onChange={(e) => setCurrentExperience(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="month"
              value={currentExperience.startDate}
              onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="month"
              value={currentExperience.endDate}
              onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
              disabled={currentExperience.current}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentExperience.current}
                onChange={(e) => setCurrentExperience(prev => ({ 
                  ...prev, 
                  current: e.target.checked,
                  endDate: e.target.checked ? '' : prev.endDate
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Current position</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
          <textarea
            value={currentExperience.description}
            onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the role and company..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities & Achievements</label>
          {currentExperience.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => updateArrayItem(
                  currentExperience.responsibilities,
                  (newArray) => setCurrentExperience(prev => ({ ...prev, responsibilities: newArray })),
                  index,
                  e.target.value
                )}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="• Developed and maintained web applications using React and Node.js"
              />
              <button
                onClick={() => removeArrayItem(
                  currentExperience.responsibilities,
                  (newArray) => setCurrentExperience(prev => ({ ...prev, responsibilities: newArray })),
                  index
                )}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem(
              currentExperience.responsibilities,
              (newArray) => setCurrentExperience(prev => ({ ...prev, responsibilities: newArray }))
            )}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add responsibility
          </button>
        </div>

        <button
          onClick={addExperience}
          disabled={!currentExperience.title || !currentExperience.company}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      {resumeData.experience.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Added Experiences</h4>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-gray-800">{exp.title} - {exp.company}</h5>
                    <p className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate} | {exp.location}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      {exp.responsibilities.filter(r => r.trim()).map((resp, idx) => (
                        <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setResumeData(prev => ({
                      ...prev,
                      experience: prev.experience.filter((_, i) => i !== index)
                    }))}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Skills</h3>

      {Object.entries({
        programming: 'Programming Languages',
        technical: 'Technical Skills',
        tools: 'Tools & Technologies',
        soft: 'Soft Skills'
      }).map(([category, label]) => (
        <div key={category}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {resumeData.skills[category].map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  onClick={() => removeSkill(category, index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Add ${label.toLowerCase()}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill(category, e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                addSkill(category, input.value);
                input.value = '';
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Projects</h3>

      {/* Current Project Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-4">Add New Project</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
            <input
              type="text"
              value={currentProject.name}
              onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
            <input
              type="url"
              value={currentProject.githubUrl}
              onChange={(e) => setCurrentProject(prev => ({ ...prev, githubUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
            <input
              type="url"
              value={currentProject.liveUrl}
              onChange={(e) => setCurrentProject(prev => ({ ...prev, liveUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://myproject.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                  setCurrentProject(prev => ({ ...prev, technologies: [...prev.technologies, ...techs] }));
                  e.target.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {currentProject.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-sm bg-green-100 text-green-800"
                >
                  {tech}
                  <button
                    onClick={() => setCurrentProject(prev => ({
                      ...prev,
                      technologies: prev.technologies.filter((_, i) => i !== index)
                    }))}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
          <textarea
            value={currentProject.description}
            onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what the project does and its purpose..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Features & Achievements</label>
          {currentProject.highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateArrayItem(
                  currentProject.highlights,
                  (newArray) => setCurrentProject(prev => ({ ...prev, highlights: newArray })),
                  index,
                  e.target.value
                )}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="• Implemented user authentication with JWT tokens"
              />
              <button
                onClick={() => removeArrayItem(
                  currentProject.highlights,
                  (newArray) => setCurrentProject(prev => ({ ...prev, highlights: newArray })),
                  index
                )}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem(
              currentProject.highlights,
              (newArray) => setCurrentProject(prev => ({ ...prev, highlights: newArray }))
            )}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add highlight
          </button>
        </div>

        <button
          onClick={addProject}
          disabled={!currentProject.name || !currentProject.description}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add Project
        </button>
      </div>

      {/* Projects List */}
      {resumeData.projects.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Added Projects</h4>
          <div className="space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-gray-800">{project.name}</h5>
                    <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      {project.highlights.filter(h => h.trim()).map((highlight, idx) => (
                        <li key={idx}>• {highlight}</li>
                      ))}
                    </ul>
                    <div className="flex gap-4 mt-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setResumeData(prev => ({
                      ...prev,
                      projects: prev.projects.filter((_, i) => i !== index)
                    }))}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const sections = [
    { id: 'personal', label: 'Personal Info', component: renderPersonalInfo },
    { id: 'experience', label: 'Experience', component: renderExperience },
    { id: 'skills', label: 'Skills', component: renderSkills },
    { id: 'projects', label: 'Projects', component: renderProjects }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resume Sections</h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentSection === section.id
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={generateResume}
            disabled={loading || !resumeData.personalInfo.name || !resumeData.personalInfo.email}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium mb-2"
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600 font-medium">Quick Download:</p>
            <button
              onClick={() => downloadResume('pdf')}
              disabled={loading || !resumeData.personalInfo.name || !resumeData.personalInfo.email}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
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
              onClick={() => downloadResume('txt')}
              disabled={loading || !resumeData.personalInfo.name || !resumeData.personalInfo.email}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              📝 Download TXT
            </button>
          </div>
          
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {sections.find(s => s.id === currentSection)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualResumeEditor;