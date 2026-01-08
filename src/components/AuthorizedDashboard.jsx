import { useState, useEffect } from 'react';
import { useUniversalAuth } from '../hooks/useUniversalAuth';
import { 
  Code2, 
  Zap, 
  Globe, 
  Smartphone, 
  Terminal, 
  User, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  Folder,
  Clock,
  Activity,
  BookOpen,
  Award,
  Target,
  Coffee,
  Lightbulb,
  ChevronRight,
  Play
} from 'lucide-react';

const AuthorizedDashboard = ({ 
  onShowWebEditor, 
  onShowAdvancedWebEditor, 
  onShowAndroidEditor
}) => {
  const { user, logout } = useUniversalAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats] = useState({
    projectsCompleted: 12,
    hoursSpent: 48,
    streakDays: 7,
    skillLevel: 'Advanced'
  });

  useEffect(() => {
    // Mock recent projects data
    setRecentProjects([
      { id: 1, name: 'Two Sum Algorithm', language: 'JavaScript', lastModified: '2 hours ago', status: 'completed' },
      { id: 2, name: 'React Todo App', language: 'TypeScript', lastModified: '1 day ago', status: 'in-progress' },
      { id: 3, name: 'Binary Search Tree', language: 'Python', lastModified: '3 days ago', status: 'completed' },
      { id: 4, name: 'Android Calculator', language: 'Java', lastModified: '1 week ago', status: 'draft' }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Web IDE',
      description: 'Full-stack web development environment',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      action: () => onShowWebEditor()
    },
    {
      title: 'Advanced IDE',
      description: 'Professional development with terminal',
      icon: <Terminal className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      action: () => onShowAdvancedWebEditor()
    },
    {
      title: 'Mobile Studio',
      description: 'Android app development platform',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'from-green-500 to-teal-500',
      action: () => onShowAndroidEditor()
    },
    {
      title: 'Code Playground',
      description: 'Quick coding and algorithm practice',
      icon: <Code2 className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      action: () => setActiveTab('playground')
    }
  ];

  const learningPaths = [
    { title: 'JavaScript Mastery', progress: 75, lessons: 24, icon: '🟨' },
    { title: 'React Development', progress: 60, lessons: 18, icon: '⚛️' },
    { title: 'Algorithm Design', progress: 45, lessons: 32, icon: '🧮' },
    { title: 'System Design', progress: 30, lessons: 16, icon: '🏗️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Codex Playground</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.name || 'Developer'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <button className="relative p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3 bg-gray-800 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{user?.name || 'Developer'}</span>
                <button 
                  onClick={logout}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects', icon: <Folder className="w-4 h-4" /> },
              { id: 'learning', label: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'playground', label: 'Playground', icon: <Code2 className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Projects</p>
                    <p className="text-2xl font-bold">{stats.projectsCompleted}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Hours Coded</p>
                    <p className="text-2xl font-bold">{stats.hoursSpent}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Streak</p>
                    <p className="text-2xl font-bold">{stats.streakDays} days</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Level</p>
                    <p className="text-2xl font-bold">{stats.skillLevel}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                    <ChevronRight className="w-5 h-5 mt-4 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Projects</h2>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                {recentProjects.map((project, index) => (
                  <div key={project.id} className={`p-6 ${index !== recentProjects.length - 1 ? 'border-b border-gray-700' : ''} hover:bg-gray-700/30 transition-colors`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-gray-400">{project.language} • {project.lastModified}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {project.status}
                        </span>
                        <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Learning Paths</h2>
              <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                <Lightbulb className="w-4 h-4" />
                <span>Explore More</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{path.icon}</span>
                    <div>
                      <h3 className="font-semibold">{path.title}</h3>
                      <p className="text-sm text-gray-400">{path.lessons} lessons</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm font-medium">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-colors">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="text-center py-16">
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Code Playground</h2>
            <p className="text-gray-400 mb-8">Quick coding environment for algorithms and experiments</p>
            <button 
              onClick={() => onShowWebEditor()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Start Coding
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorizedDashboard;