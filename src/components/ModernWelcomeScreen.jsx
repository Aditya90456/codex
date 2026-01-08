import { useState, useEffect } from 'react';
import { 
  Code2, 
  Zap, 
  Globe, 
  Smartphone, 
  Terminal, 
  Rocket,
  Play,
  ArrowRight,
  Sparkles,
  Coffee,
  Heart,
  Star,
  Users,
  TrendingUp,
  ChevronDown,
  Github,
  Twitter,
  MessageCircle
} from 'lucide-react';

const ModernWelcomeScreen = ({ onCreateNew, onShowWebEditor, onShowAdvancedWebEditor, onShowAndroidEditor }) => {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const languages = [
    { name: 'JavaScript', color: 'from-yellow-400 to-orange-500', icon: '🟨' },
    { name: 'Python', color: 'from-blue-400 to-green-500', icon: '🐍' },
    { name: 'TypeScript', color: 'from-blue-500 to-purple-500', icon: '🔷' },
    { name: 'Java', color: 'from-red-500 to-orange-600', icon: '☕' },
    { name: 'C++', color: 'from-purple-500 to-pink-500', icon: '⚡' }
  ];

  const features = [
    {
      title: "Instant Coding",
      description: "Start coding immediately without any setup or installation",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Multi-Language Support",
      description: "Code in JavaScript, Python, Java, C++, and more",
      icon: <Code2 className="w-6 h-6" />,
      color: "from-blue-400 to-purple-500"
    },
    {
      title: "Real-time Execution",
      description: "See your code results instantly with our fast execution engine",
      icon: <Play className="w-6 h-6" />,
      color: "from-green-400 to-teal-500"
    },
    {
      title: "Share & Collaborate",
      description: "Share your projects with a simple link, no account needed",
      icon: <Users className="w-6 h-6" />,
      color: "from-pink-400 to-red-500"
    }
  ];

  const quickStart = [
    {
      title: "Web Development",
      description: "Full-stack web development environment",
      icon: <Globe className="w-8 h-8" />,
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      action: () => onShowWebEditor()
    },
    {
      title: "Advanced IDE",
      description: "Professional development with terminal access",
      icon: <Terminal className="w-8 h-8" />,
      gradient: "from-green-500 via-teal-500 to-blue-500",
      action: () => onShowAdvancedWebEditor()
    },
    {
      title: "Mobile Development",
      description: "Android app development studio",
      icon: <Smartphone className="w-8 h-8" />,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      action: () => onShowAndroidEditor()
    },
    {
      title: "Quick Playground",
      description: "Simple coding environment for algorithms",
      icon: <Rocket className="w-8 h-8" />,
      gradient: "from-purple-500 via-blue-500 to-indigo-500",
      action: () => onCreateNew('javascript')
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Codex Playground</h1>
            <p className="text-xs text-gray-400">Modern Code Editor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Code
              <span className="inline-block mx-4">
                <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 animate-spin" />
              </span>
              Create
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              The most beautiful way to code online
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No setup, no downloads, no limits. Start coding in{' '}
              <span className={`font-bold bg-gradient-to-r ${languages[currentLanguage].color} bg-clip-text text-transparent transition-all duration-500`}>
                {languages[currentLanguage].name}
              </span>
              {' '}and 10+ other languages instantly.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => onCreateNew('javascript')}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Coding Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="px-8 py-4 border-2 border-gray-600 rounded-2xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-800/50 transition-all duration-300">
              <span className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>View Examples</span>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mb-16 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>50K+ Developers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>1M+ Projects</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Codex?</h2>
            <p className="text-xl text-gray-400">Everything you need to code, create, and collaborate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Environment</h2>
            <p className="text-xl text-gray-400">Pick the perfect setup for your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="group relative p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-105 text-left overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="mb-4 text-gray-300 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-gray-400">Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-gray-400">for developers worldwide</span>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <button className="hover:text-gray-300 transition-colors">Privacy</button>
            <button className="hover:text-gray-300 transition-colors">Terms</button>
            <button className="hover:text-gray-300 transition-colors">Support</button>
            <button className="hover:text-gray-300 transition-colors">API</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernWelcomeScreen;