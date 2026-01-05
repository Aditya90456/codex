import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/ClerkAuthContext';
import PaymentModal from './PaymentModal';
import SubscriptionManager from './SubscriptionManager';
import {
  BarChart3,
  Code,
  Trophy,
  Plus,
  FolderOpen,
  Zap,
  Crown,
  Gift,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Play,
  Edit3,
  Trash2,
  Eye,
  CreditCard,
  Settings,
  Download,
  Upload,
  Globe,
  FileText,
  Folder
} from 'lucide-react';

const Dashboard = ({ onCreateProject, onOpenProject, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalLines: 0,
    streak: 0,
    rank: 'Beginner'
  });
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Check if user has projects in localStorage
    const savedProjects = localStorage.getItem(`codex_projects_${user?.id || 'guest'}`);
    let mockProjects = [];

    if (savedProjects) {
      try {
        mockProjects = JSON.parse(savedProjects);
      } catch (error) {
        console.error('Error parsing saved projects:', error);
      }
    }

    // If no saved projects, use default mock data
    if (mockProjects.length === 0) {
      mockProjects = [
        {
          id: 1,
          name: 'Todo App',
          description: 'A simple todo application with React',
          language: 'javascript',
          status: 'completed',
          createdAt: '2024-01-15',
          lastModified: '2024-01-20',
          linesOfCode: 450,
          tags: ['React', 'JavaScript', 'CSS'],
          code: `// Todo App - React Implementation
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="todo-app">
      <h1>My Todo List</h1>
      <div>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`
        },
        {
          id: 2,
          name: 'Weather Dashboard',
          description: 'Weather app with API integration',
          language: 'javascript',
          status: 'in-progress',
          createdAt: '2024-01-18',
          lastModified: '2024-01-22',
          linesOfCode: 320,
          tags: ['API', 'JavaScript', 'Charts'],
          code: `// Weather Dashboard
const API_KEY = 'your-api-key';

async function getWeather(city) {
  try {
    const response = await fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${API_KEY}&units=metric\`);
    const data = await response.json();
    
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

function displayWeather(weatherData) {
  if (!weatherData) {
    document.getElementById('weather').innerHTML = 'Weather data not available';
    return;
  }
  
  document.getElementById('weather').innerHTML = \`
    <h2>\${weatherData.city}</h2>
    <p>Temperature: \${weatherData.temperature}°C</p>
    <p>Description: \${weatherData.description}</p>
    <p>Humidity: \${weatherData.humidity}%</p>
    <p>Wind Speed: \${weatherData.windSpeed} m/s</p>
  \`;
}

// Usage
getWeather('London').then(displayWeather);`
        }
      ];
    }

    setProjects(mockProjects);
    
    const completedCount = mockProjects.filter(p => p.status === 'completed').length;
    const totalLines = mockProjects.reduce((sum, p) => sum + p.linesOfCode, 0);
    
    setStats({
      totalProjects: mockProjects.length,
      completedProjects: completedCount,
      totalLines,
      streak: 7,
      rank: completedCount >= 10 ? 'Expert' : completedCount >= 5 ? 'Intermediate' : 'Beginner'
    });

    // Show premium offer if user has 10+ projects
    if (completedCount >= 10) {
      setShowPremiumOffer(true);
    }

    // Mock user subscription - in real app, fetch from API
    setUserSubscription({
      planId: 'yearly',
      status: 'active',
      expiresAt: '2024-12-15',
      autoRenew: true
    });
  }, [user]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Created your first project',
      icon: '🎯',
      earned: true,
      progress: 100
    },
    {
      id: 2,
      name: 'Code Warrior',
      description: 'Complete 5 projects',
      icon: '⚔️',
      earned: stats.completedProjects >= 5,
      progress: Math.min((stats.completedProjects / 5) * 100, 100)
    },
    {
      id: 3,
      name: 'Master Builder',
      description: 'Complete 10 projects',
      icon: '🏗️',
      earned: stats.completedProjects >= 10,
      progress: Math.min((stats.completedProjects / 10) * 100, 100)
    },
    {
      id: 4,
      name: 'Code Lines Champion',
      description: 'Write 1000+ lines of code',
      icon: '📝',
      earned: stats.totalLines >= 1000,
      progress: Math.min((stats.totalLines / 1000) * 100, 100)
    },
    {
      id: 5,
      name: 'Streak Master',
      description: 'Code for 7 days straight',
      icon: '🔥',
      earned: stats.streak >= 7,
      progress: Math.min((stats.streak / 7) * 100, 100)
    }
  ];

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      html: '🌐',
      css: '🎨'
    };
    return icons[language] || '📄';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'in-progress': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'draft': return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const handleUpgradePlan = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    // Update user subscription
    setUserSubscription({
      planId: paymentData.plan.id || selectedPlan,
      status: 'active',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      autoRenew: true,
      transactionId: paymentData.transactionId
    });

    // Show success message
    alert(`Payment successful! Welcome to Codex Playground Premium. Transaction ID: ${paymentData.transactionId}`);
    
    // Close modals
    setShowPaymentModal(false);
    setShowPremiumOffer(false);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      setUserSubscription(prev => ({
        ...prev,
        status: 'cancelled',
        autoRenew: false
      }));
      alert('Subscription cancelled successfully. You will retain access until your current billing period ends.');
    }
  };

  const isUserPremium = () => {
    if (!userSubscription) return false;
    const now = new Date();
    const expiryDate = new Date(userSubscription.expiresAt);
    return userSubscription.status === 'active' && expiryDate > now;
  };

  const saveProjectsToStorage = (updatedProjects) => {
    try {
      localStorage.setItem(`codex_projects_${user?.id || 'guest'}`, JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const downloadProject = (project) => {
    const projectData = {
      ...project,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.username || 'Guest'
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_${project.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProjectCode = (project) => {
    if (!project.code) {
      alert('No code available for this project');
      return;
    }

    const fileExtensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css'
    };

    const extension = fileExtensions[project.language] || 'txt';
    const blob = new Blob([project.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveProjectToWebsite = async (project) => {
    try {
      // Simulate saving to website/cloud
      const response = await fetch('/api/projects/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...project,
          userId: user?.id,
          savedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Project saved to website successfully!');
      } else {
        throw new Error('Failed to save to website');
      }
    } catch (error) {
      console.error('Error saving to website:', error);
      // Fallback to local storage
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, savedToWebsite: true, lastSaved: new Date().toISOString() } : p
      );
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      alert('Project saved locally (website save failed)');
    }
  };

  const deleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      saveProjectsToStorage(updatedProjects);
      
      // Update stats
      const completedCount = updatedProjects.filter(p => p.status === 'completed').length;
      const totalLines = updatedProjects.reduce((sum, p) => sum + p.linesOfCode, 0);
      
      setStats(prev => ({
        ...prev,
        totalProjects: updatedProjects.length,
        completedProjects: completedCount,
        totalLines
      }));
    }
  };

  const PremiumOfferModal = () => {
    if (!showPremiumOffer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Congratulations!
            </h2>
            
            <p className="text-purple-200 mb-6">
              You've completed <span className="font-bold text-yellow-400">10 projects</span>! 
              As a reward, you've earned a <span className="font-bold text-yellow-400">FREE YEAR</span> of 
              Codex Playground Premium (worth $500)!
            </p>

            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Premium Features Unlocked:</h3>
              <ul className="text-sm text-purple-200 space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Unlimited private projects</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Advanced code analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Exclusive templates</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPremiumOffer(false)}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Claim Now!
              </button>
              <button
                onClick={() => setShowPremiumOffer(false)}
                className="px-4 py-3 text-purple-200 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.username}!</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {stats.completedProjects >= 10 && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Premium Unlocked!</span>
              </div>
            )}
            {isUserPremium() && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">Premium Active</span>
              </div>
            )}
            <button
              onClick={() => setShowSubscriptionManager(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Subscription</span>
            </button>
            <button
              onClick={onCreateProject}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 flex-shrink-0">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-white">{stats.completedProjects}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Lines of Code</p>
                    <p className="text-2xl font-bold text-white">{stats.totalLines.toLocaleString()}</p>
                  </div>
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <p className="text-2xl font-bold text-white">{stats.streak} days</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start your coding journey by creating your first project. Choose from various templates or start from scratch.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={onCreateProject}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Project</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Import Project</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getLanguageIcon(project.language)}</div>
                        <div>
                          <h3 className="font-medium text-white">{project.name}</h3>
                          <p className="text-sm text-gray-400">{project.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => downloadProject(project)}
                            className="text-gray-400 hover:text-blue-400 p-1 rounded transition-colors"
                            title="Download Project"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => saveProjectToWebsite(project)}
                            className="text-gray-400 hover:text-green-400 p-1 rounded transition-colors"
                            title="Save to Website"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenProject(project)}
                            className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                            title="Open Project"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress to Premium */}
            {stats.completedProjects < 10 && (
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Premium Progress</h3>
                  </div>
                  <span className="text-yellow-400 font-medium">
                    {stats.completedProjects}/10 projects
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.completedProjects / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-purple-200 text-sm">
                  Complete {10 - stats.completedProjects} more projects to unlock a 
                  <span className="font-bold text-yellow-400"> FREE YEAR </span>
                  of Premium (worth $500)!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Projects</h2>
              <div className="flex items-center space-x-3">
                <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600">
                  <option>All Projects</option>
                  <option>Completed</option>
                  <option>In Progress</option>
                  <option>Draft</option>
                </select>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
                <button
                  onClick={onCreateProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No Projects Found</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  You haven't created any projects yet. Start building something amazing today!
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={onCreateProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Project</span>
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Import Existing Project</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getLanguageIcon(project.language)}</div>
                        <div>
                          <h3 className="font-semibold text-white">{project.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => onOpenProject(project)}
                          className="text-gray-400 hover:text-blue-400 p-1 rounded transition-colors"
                          title="Open Project"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-green-400 p-1 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProject(project.id)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{project.linesOfCode} lines</span>
                      <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onOpenProject(project)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Open</span>
                      </button>
                      <button
                        onClick={() => downloadProject(project)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        title="Download Project"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => saveProjectToWebsite(project)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        title="Save to Website"
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadProjectCode(project)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        title="Download Code"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'bg-green-900/20 border-green-500/30'
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.earned ? 'text-green-300' : 'text-white'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.earned ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {Math.round(achievement.progress)}% complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Codex Playground Premium</h2>
              <p className="text-gray-400 text-lg">
                {isUserPremium() 
                  ? "You're enjoying Premium benefits!" 
                  : stats.completedProjects >= 10 
                    ? "Congratulations! You've unlocked Premium for FREE!" 
                    : "Complete 10 projects to unlock Premium for FREE!"}
              </p>
            </div>

            {isUserPremium() ? (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-lg p-8 text-center">
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Premium Active!</h3>
                <p className="text-green-200 mb-6">
                  You're enjoying all premium features. Your subscription is active until{' '}
                  {new Date(userSubscription.expiresAt).toLocaleDateString()}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Unlimited private projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Advanced code analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Exclusive templates</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={() => setShowSubscriptionManager(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Manage Subscription
                  </button>
                  <button
                    onClick={() => handleUpgradePlan('yearly')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            ) : stats.completedProjects >= 10 ? (
              <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-lg p-8 text-center">
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Premium Unlocked!</h3>
                <p className="text-green-200 mb-6">
                  You've earned a full year of Premium access worth $500. Claim it now or choose a different plan!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Unlimited private projects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Advanced code analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Exclusive templates</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleUpgradePlan('yearly')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Claim FREE Year</span>
                  </button>
                  <button
                    onClick={() => setShowSubscriptionManager(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    View All Plans
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Premium Plans */}
                <div className="grid gap-6 mb-8">
                  {[
                    {
                      id: 'monthly',
                      name: 'Premium Monthly',
                      price: 499,
                      originalPrice: 699,
                      duration: 'month',
                      features: ['Unlimited private projects', 'Advanced code analysis', 'Priority support', 'Exclusive templates'],
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      id: 'yearly',
                      name: 'Premium Yearly',
                      price: 4999,
                      originalPrice: 8388,
                      duration: 'year',
                      features: ['All monthly features', '2 months free', 'Advanced debugging tools', 'Custom themes', 'API access'],
                      color: 'from-purple-500 to-pink-500',
                      popular: true,
                      savings: '40% OFF'
                    },
                    {
                      id: 'lifetime',
                      name: 'Premium Lifetime',
                      price: 9999,
                      originalPrice: 19999,
                      duration: 'lifetime',
                      features: ['All yearly features', 'Lifetime updates', 'Priority feature requests', 'Direct developer access'],
                      color: 'from-yellow-500 to-orange-500',
                      savings: '50% OFF'
                    }
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative bg-gray-800 rounded-xl p-6 border-2 transition-all duration-200 ${
                        plan.popular ? 'border-purple-500' : 'border-gray-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-white">{plan.name}</h4>
                          <p className="text-gray-400">Billed per {plan.duration}</p>
                        </div>
                        {plan.savings && (
                          <span className="bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded-full">
                            {plan.savings}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline space-x-2 mb-6">
                        <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                        <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice}</span>
                      </div>

                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleUpgradePlan(plan.id)}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        Choose {plan.name}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Progress to Free Premium */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Free Premium Progress</h3>
                    </div>
                    <span className="text-yellow-400 font-medium">
                      {stats.completedProjects}/10 projects
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.completedProjects / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-sm">
                    Complete {10 - stats.completedProjects} more projects to unlock a 
                    <span className="font-bold text-yellow-400"> FREE YEAR </span>
                    of Premium (worth $500)!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Billing & Payments</h2>
                <p className="text-gray-400">Manage your subscription and payment methods</p>
              </div>
              <button
                onClick={() => setShowSubscriptionManager(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Manage Subscription</span>
              </button>
            </div>

            {/* Current Subscription Status */}
            {isUserPremium() ? (
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Premium Yearly</h3>
                      <p className="text-green-300">Active Subscription</p>
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-bold text-white">₹4,999</p>
                    <p className="text-sm text-gray-400">per year</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                    <p className="text-white font-medium">
                      {new Date(userSubscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                    <p className="text-white font-medium">•••• •••• •••• 1234</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Auto Renewal</p>
                    <p className="text-white font-medium">
                      {userSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Active Subscription</h3>
                <p className="text-gray-400 mb-4">
                  Upgrade to Premium to access advanced features and priority support.
                </p>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Premium Plans
                </button>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">Payment Methods</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm self-start sm:self-auto">
                  + Add Payment Method
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-gray-400">Expires 12/26</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                    <button className="text-gray-400 hover:text-white text-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
              
              <div className="space-y-3">
                {[
                  { date: '2024-01-15', amount: 4999, plan: 'Premium Yearly', status: 'Paid', invoice: 'INV-2024-001' },
                  { date: '2023-12-15', amount: 499, plan: 'Premium Monthly', status: 'Paid', invoice: 'INV-2023-012' },
                  { date: '2023-11-15', amount: 499, plan: 'Premium Monthly', status: 'Paid', invoice: 'INV-2023-011' },
                  { date: '2023-10-15', amount: 499, plan: 'Premium Monthly', status: 'Paid', invoice: 'INV-2023-010' },
                  { date: '2023-09-15', amount: 499, plan: 'Premium Monthly', status: 'Paid', invoice: 'INV-2023-009' },
                  { date: '2023-08-15', amount: 499, plan: 'Premium Monthly', status: 'Paid', invoice: 'INV-2023-008' }
                ].map((bill, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-medium">{bill.plan}</p>
                        <p className="text-sm text-gray-400">{new Date(bill.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="text-left sm:text-right">
                        <p className="text-white font-medium">₹{bill.amount}</p>
                        <p className="text-sm text-gray-400">{bill.invoice}</p>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm whitespace-nowrap">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show more button for pagination */}
              <div className="mt-6 text-center">
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Load More Transactions
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('premium')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Crown className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Upgrade Plan</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors">
                  <Download className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Download Invoice</span>
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors">
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Update Payment</span>
                </button>
                <button 
                  onClick={() => setShowSubscriptionManager(true)}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <Settings className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Manage Billing</span>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <PremiumOfferModal />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Subscription Manager */}
      <SubscriptionManager
        isOpen={showSubscriptionManager}
        onClose={() => setShowSubscriptionManager(false)}
        userSubscription={userSubscription}
        onUpgrade={handleUpgradePlan}
        onCancel={handleCancelSubscription}
      />
    </div>
  );
};

export default Dashboard;