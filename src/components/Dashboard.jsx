import { useAuthContext } from '../contexts/AuthContext';
import UserProfile from './Auth/UserProfile';
import { Code, Database, Cpu, Globe, BookOpen, Zap } from 'lucide-react';

const Dashboard = () => {
  const { userName, isSignedIn } = useAuthContext();

  const features = [
    {
      icon: Code,
      title: 'Code Editor',
      description: 'Advanced code editing with syntax highlighting',
      path: '/editor',
      color: 'text-blue-400'
    },
    {
      icon: Globe,
      title: 'Web Editor',
      description: 'Build and preview web applications',
      path: '/web',
      color: 'text-green-400'
    },
    {
      icon: Database,
      title: 'DSA Practice',
      description: 'Data structures and algorithms problems',
      path: '/dsa',
      color: 'text-purple-400'
    },
    {
      icon: Cpu,
      title: 'AI Assistant',
      description: 'AI-powered code generation and help',
      path: '/ai',
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xl text-gray-400">
            Your coding playground is ready
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Available Tools</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all cursor-pointer group"
                    onClick={() => window.location.href = feature.path}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Fast & Secure</h3>
            <p className="text-gray-400 text-sm">
              Lightning-fast authentication with Clerk
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Learn & Practice</h3>
            <p className="text-gray-400 text-sm">
              Comprehensive coding practice platform
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <Cpu className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-400 text-sm">
              Smart assistance for better coding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;