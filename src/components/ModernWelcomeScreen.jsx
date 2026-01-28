import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  MessageCircle,
  Brain,
  Wand2,
  Target,
  Flame,
  Award,
  Loader2
} from 'lucide-react';

const ModernWelcomeScreen = ({ onCreateNew, onShowWebEditor, onShowAdvancedWebEditor, onShowAndroidEditor, onShowAICreator }) => {
  const { user, isLoaded } = useUser();
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    streak: 0,
    rank: 'Bronze',
    loading: true
  });

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
      title: "AI Creator",
      description: "Generate apps with AI - web, mobile, APIs & more",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-purple-500 via-pink-500 to-orange-500",
      action: () => onShowAICreator?.(),
      badge: "NEW"
    },
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

  // Fetch user stats from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user || !isLoaded) {
        setUserStats(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const token = await user.getToken();
        
        const response = await fetch(`${API_URL}/progress/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const data = result.data;
            const points = data.user.points || 0;
            let rank = 'Bronze';
            if (points >= 500) rank = 'Diamond';
            else if (points >= 300) rank = 'Platinum';
            else if (points >= 150) rank = 'Gold';
            else if (points >= 50) rank = 'Silver';
            
            setUserStats({
              problemsSolved: data.progress.solvedProblems || 0,
              streak: data.user.streak || 0,
              rank: rank,
              loading: false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setUserStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserStats();
  }, [user, isLoaded]);

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
            {user && isLoaded ? (
              <>
                <div className="mb-4">
                  <p className="text-2xl text-purple-300 mb-2">Welcome back,</p>
                  <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    {user.firstName || user.username || 'Developer'}!
                  </h1>
                </div>
                <p className="text-xl md:text-2xl text-gray-300 mb-4">
                  Ready to continue your coding journey?
                </p>
                {userStats.streak > 0 && !userStats.loading && (
                  <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full mb-4">
                    <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                    <span className="text-white font-semibold">
                      {userStats.streak} day streak - Keep it going! 🔥
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
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
            {user && isLoaded ? (
              <>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  {userStats.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="text-white font-semibold">{userStats.problemsSolved} Problems Solved</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  {userStats.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="text-white font-semibold">{userStats.streak} Day Streak</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  {userStats.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="text-white font-semibold">{userStats.rank} Rank</span>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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

      {/* AI Universal Creator Section - NEW */}
      <div className="relative z-10 py-20 px-6 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-orange-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-purple-300">NEW FEATURE</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              AI Universal Creator
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate complete applications with AI - from web apps to mobile apps, APIs, and data analysis scripts. Just describe what you want to build.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Main AI Creator Card */}
            <div className="lg:col-span-2">
              <button
                onClick={() => onShowAICreator?.()}
                className="group relative w-full p-12 bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-orange-900/40 backdrop-blur-sm rounded-3xl border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 hover:transform hover:scale-[1.02] text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                  <div className="flex-1 mb-6 md:mb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-1">AI Universal Creator</h3>
                        <div className="flex items-center space-x-2">
                          <Wand2 className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 text-sm">Powered by Advanced AI</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg mb-6">
                      Transform your ideas into reality. Describe what you want to build, and our AI will generate production-ready code instantly.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
                        🌐 Web Apps
                      </span>
                      <span className="px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300">
                        📱 Mobile Apps
                      </span>
                      <span className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm text-orange-300">
                        🔌 REST APIs
                      </span>
                      <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300">
                        📊 Data Scripts
                      </span>
                      <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-300">
                        📄 Documentation
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                      <Sparkles className="w-16 h-16 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-2 text-white font-semibold">
                      <span>Try AI Creator</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* AI Features Grid */}
            <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Instant Generation</h4>
              </div>
              <p className="text-gray-400">
                Get production-ready code in seconds. No more boilerplate or setup time.
              </p>
            </div>

            <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Multi-Platform</h4>
              </div>
              <p className="text-gray-400">
                Generate code for web, mobile, backend APIs, and data analysis - all from one prompt.
              </p>
            </div>

            <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Live Preview</h4>
              </div>
              <p className="text-gray-400">
                See your generated apps running live instantly. Toggle between code and preview.
              </p>
            </div>

            <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Export & Download</h4>
              </div>
              <p className="text-gray-400">
                Download your generated code as files and use them in your own projects.
              </p>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Try these example prompts:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => onShowAICreator?.()}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              >
                "A todo list app with dark mode"
              </button>
              <button 
                onClick={() => onShowAICreator?.()}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              >
                "Weather forecast mobile app"
              </button>
              <button 
                onClick={() => onShowAICreator?.()}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              >
                "REST API for blog posts"
              </button>
              <button 
                onClick={() => onShowAICreator?.()}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              >
                "Data analysis dashboard"
              </button>
            </div>
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
                {item.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
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