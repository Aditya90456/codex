import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import AuthButton from './Auth/AuthButton';
import FeatureHighlight from './Auth/FeatureHighlight';
import { 
  Code, 
  Zap, 
  Users,
  Target,
  ArrowRight,
  Play,
  BookOpen,
  Trophy,
  CheckCircle,
  Rocket,
  Globe,
  Shield,
  Cpu,
  Brain,
  Terminal,
  Box,
  Flame,
  TrendingUp,
  GraduationCap,
  Video,
  FileText,
  Award,
  Heart,
  GitBranch,
  Lightbulb,
  Layers,
  Sparkles,
  Smartphone,
  Command,
  Save,
  Download,
  Share2,
  Copy,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  FolderOpen,
  FileCode,
  Settings as SettingsIcon,
  ChevronUp,
  ChevronDown,
  UserPlus,
  Loader2,
  PenSquare,
  MessageCircle,
  ThumbsUp,
  Eye
} from 'lucide-react';

const WelcomeScreenModern = () => {
  const { user, isSignedIn, isLoaded } = useAuthContext();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [showEditorToolbar, setShowEditorToolbar] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [editorMode, setEditorMode] = useState('standard');
  const [userStats, setUserStats] = useState({
    problemsSolved: 0,
    streak: 0,
    rank: 'Bronze',
    loading: true
  });
  const [userActivity, setUserActivity] = useState({
    blogs: 0,
    studyGroups: 0,
    dsaProgress: 0,
    blogsRead: 0,
    blogsLiked: 0,
    loading: true
  });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Fetch user activity (blogs, study groups, DSA progress)
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!user || !isLoaded) {
        setUserActivity(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        
        // Fetch actual counts from backend
        const [blogsRes, readRes, likedRes, groupsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/blogs/all?userId=${user.id}`).catch(() => null),
          fetch(`${BACKEND_URL}/api/blogs/user/${user.id}/read`).catch(() => null),
          fetch(`${BACKEND_URL}/api/blogs/user/${user.id}/liked`).catch(() => null),
          fetch(`${BACKEND_URL}/api/study-groups/my-groups?userId=${user.id}`).catch(() => null)
        ]);

        const blogsData = blogsRes?.ok ? await blogsRes.json() : { blogs: [] };
        const readData = readRes?.ok ? await readRes.json() : { count: 0 };
        const likedData = likedRes?.ok ? await likedRes.json() : { count: 0 };
        const groupsData = groupsRes?.ok ? await groupsRes.json() : { groups: [] };
        
        // Calculate DSA progress (out of 150 problems)
        const solvedProblems = user?.publicMetadata?.solvedProblems || 0;
        const dsaProgress = Math.min(Math.round((solvedProblems / 150) * 100), 100);
        
        setUserActivity({
          blogs: blogsData.blogs?.length || blogsData.total || 0,
          blogsRead: readData.count || 0,
          blogsLiked: likedData.count || 0,
          studyGroups: groupsData.groups?.length || 0,
          dsaProgress: dsaProgress,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching user activity:', error);
        setUserActivity(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserActivity();
  }, [user, isLoaded]);

  // Safe navigation with authentication check
  const safeNavigate = (path) => {
    // Allow /learn route without authentication
    if (path === '/learn') {
      try {
        navigate(path);
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = path;
      }
      return;
    }
    
    if (!isSignedIn) {
      // User will see Clerk sign in modal from navigation
      return;
    }
    
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location for external links
      if (path.startsWith('http')) {
        window.open(path, '_blank');
      } else {
        window.location.href = path;
      }
    }
  };

  // Protected action wrapper - requires authentication
  const protectedAction = (action) => {
    if (!isSignedIn) {
      // User will see Clerk sign in modal
      return;
    }
    action();
  };

  const languages = [
    { name: 'JavaScript', code: 'console.log("Hello, World!");', color: 'from-yellow-400 to-orange-500', icon: '🟨' },
    { name: 'Python', code: 'print("Hello, World!")', color: 'from-green-400 to-blue-500', icon: '🐍' },
    { name: 'Java', code: 'System.out.println("Hello, World!");', color: 'from-red-400 to-pink-500', icon: '☕' },
    { name: 'C++', code: 'cout << "Hello, World!" << endl;', color: 'from-blue-400 to-purple-500', icon: '⚡' }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "CP-AI Code Generator",
      description: "Generate complete apps instantly with Gemini AI",
      color: "from-purple-500 to-pink-500",
      badge: "🔥 NEW",
      highlight: true,
      action: () => protectedAction(() => navigate('/ai'))
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Web Dev Studio",
      description: "Build websites with AI assistance - React, Vue, Tailwind & more",
      color: "from-green-500 to-emerald-500",
      badge: "✨ AI-Powered",
      highlight: true,
      action: () => protectedAction(() => navigate('/web-studio'))
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Multi-Language IDE",
      description: "Code in 15+ languages with intelligent autocomplete",
      color: "from-blue-500 to-cyan-500",
      badge: "Popular",
      action: () => protectedAction(() => navigate('/editor'))
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "DSA Learning Hub",
      description: "Master algorithms with 250+ problems & AI explanations",
      color: "from-purple-500 to-indigo-500",
      badge: "Learn",
      action: () => protectedAction(() => navigate('/playground'))
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant code execution with real-time output",
      color: "from-yellow-500 to-orange-500",
      badge: "Fast",
      action: () => protectedAction(() => navigate('/editor'))
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI Resume Builder",
      description: "Create professional resumes with ML-powered suggestions",
      color: "from-pink-500 to-rose-500",
      badge: "Career",
      action: () => protectedAction(() => navigate('/resume'))
    }
  ];

  const quickStart = [
    { name: 'JavaScript', ext: 'js', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500', action: () => protectedAction(() => navigate('/editor')) },
    { name: 'Python', ext: 'py', color: 'bg-green-500', gradient: 'from-green-500 to-blue-500', action: () => protectedAction(() => navigate('/editor')) },
    { name: 'Java', ext: 'java', color: 'bg-red-500', gradient: 'from-red-500 to-pink-500', action: () => protectedAction(() => navigate('/editor')) },
    { name: 'C++', ext: 'cpp', color: 'bg-blue-500', gradient: 'from-blue-500 to-purple-500', action: () => protectedAction(() => navigate('/editor')) }
  ];

  // Editor Actions
  const handleSaveProject = () => {
    console.log('Saving project...');
    // Implement save logic
  };

  const handleDownloadProject = () => {
    console.log('Downloading project...');
    // Implement download logic
  };

  const handleShareProject = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert('Project URL copied to clipboard!');
  };

  const handleCopyCode = () => {
    console.log('Copying code...');
    // Implement copy logic
  };

  const handleToggleFullscreen = () => {
    setEditorMode(editorMode === 'fullscreen' ? 'standard' : 'fullscreen');
  };

  const handleResetEditor = () => {
    if (confirm('Reset editor to default state?')) {
      console.log('Resetting editor...');
      // Implement reset logic
    }
  };

  const handleOpenCommandPalette = () => {
    setShowCommandPalette(true);
  };

  // Recent projects mock data
  const recentProjects = [
    { name: 'React Todo App', language: 'JavaScript', lastModified: '2 hours ago', icon: '⚛️' },
    { name: 'Python Calculator', language: 'Python', lastModified: '1 day ago', icon: '🐍' },
    { name: 'Java Sorting', language: 'Java', lastModified: '3 days ago', icon: '☕' }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K for command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenCommandPalette();
      }
      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveProject();
      }
      // Ctrl/Cmd + Shift + S for share
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's') {
        e.preventDefault();
        handleShareProject();
      }
      // ESC to close command palette
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editorMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative h-screen overflow-y-auto">
        {/* Modern Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Codex
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">Playground</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => protectedAction(() => navigate('/editor'))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600/10 to-amber-600/10 hover:from-orange-600/20 hover:to-amber-600/20 border border-orange-500/20 hover:border-orange-500/40 rounded-xl transition-all duration-200 transform hover:scale-105 text-orange-400 hover:text-orange-300"
                >
                  <Code className="w-4 h-4" />
                  <span className="font-medium">Playground</span>
                </button>
                <button
                  onClick={() => protectedAction(() => navigate('/blogs'))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600/10 to-purple-600/10 hover:from-pink-600/20 hover:to-purple-600/20 border border-pink-500/20 hover:border-pink-500/40 rounded-xl transition-all duration-200 transform hover:scale-105 text-pink-400 hover:text-pink-300"
                >
                  <PenSquare className="w-4 h-4" />
                  <span className="font-medium">Blog</span>
                </button>
                <button
                  onClick={() => protectedAction(() => navigate('/study-groups'))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all duration-200 transform hover:scale-105 text-blue-400 hover:text-blue-300"
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Study Groups</span>
                </button>
                <button
                  onClick={() => protectedAction(() => navigate('/leetcode'))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600/10 to-emerald-600/10 hover:from-green-600/20 hover:to-emerald-600/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all duration-200 transform hover:scale-105 text-green-400 hover:text-green-300"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">DSA Progress</span>
                </button>
              </div>
              
              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {user ? (
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-400 border border-green-500/20 mb-6">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Welcome back, {user?.firstName || user?.username || 'User'}!
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                      Let's
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Build Today
                      </span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                      Continue your coding journey. Your workspace is ready.
                    </p>

                    {/* DSA Progress Bar */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">DSA Progress</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {userActivity.dsaProgress}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${userActivity.dsaProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {user?.publicMetadata?.solvedProblems || 0} / 150 problems solved
                      </div>
                    </div>

                    {/* User Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                          {userActivity.blogs}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Blogs Written</div>
                      </div>
                      <div className="text-center border-x border-slate-700">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          {userActivity.studyGroups}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Groups</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {user?.publicMetadata?.streak || 0}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">Day Streak</div>
                      </div>
                    </div>

                    {/* Blog Activity Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-10 p-6 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Eye className="w-5 h-5 text-orange-400" />
                          <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            {userActivity.blogsRead}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">Blogs Read</div>
                      </div>
                      <div className="text-center border-l border-slate-700">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Heart className="w-5 h-5 text-red-400" />
                          <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                            {userActivity.blogsLiked}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">Blogs Liked</div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => protectedAction(() => navigate('/editor'))}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Code className="w-6 h-6" />
                          <span>Start Coding</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 mb-6">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI-Powered Code Assistant
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                      Code Like
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Never Before
                      </span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                      The most powerful online IDE. Write, run, and deploy code in seconds. 
                      No setup required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <button
                        onClick={() => protectedAction(() => navigate('/editor'))}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Play className="w-6 h-6" />
                          <span>Start Coding Free</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                      
                      <button className="bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700 hover:border-slate-600 px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3">
                        <BookOpen className="w-6 h-6" />
                        <span>View Examples</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Start Languages */}
                <div>
                  <p className="text-sm text-slate-400 mb-4 font-medium">Quick start with:</p>
                  <div className="flex flex-wrap gap-3">
                    {quickStart.map((lang, index) => (
                      <button
                        key={index}
                        onClick={lang.action}
                        className={`group relative overflow-hidden bg-gradient-to-r ${lang.gradient} hover:opacity-90 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{lang.name}</span>
                          <span className="text-xs opacity-75">.{lang.ext}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Modern Code Preview */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>
                  
                  {/* Code Editor */}
                  <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{languages[activeLanguage].icon}</span>
                          <span className="text-sm text-slate-400 font-mono">
                            main.{languages[activeLanguage].name.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${languages[activeLanguage].color} animate-pulse`}></div>
                        <span className="text-sm font-bold text-slate-300">{languages[activeLanguage].name}</span>
                      </div>
                      
                      <div className="bg-slate-950/50 rounded-2xl p-6 font-mono text-base border border-slate-800">
                        <div className="flex">
                          <div className="text-slate-600 mr-6 select-none">1</div>
                          <div className="text-green-400 flex-1">{languages[activeLanguage].code}</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-5 bg-slate-950/30 rounded-2xl border-l-4 border-green-500">
                        <div className="flex items-center space-x-3 text-green-400 text-sm font-mono">
                          <CheckCircle className="w-5 h-5" />
                          <span>Output: Hello, World!</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-2 font-mono">Executed in 0.02s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlight Section - Only for non-authenticated users */}
        {!user && (
          <div className="relative py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <FeatureHighlight />
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="relative py-24 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <Flame className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-5xl font-black mb-6">
                Everything You Need
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  In One Place
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Professional-grade tools for developers of all levels
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group relative ${feature.action ? 'cursor-pointer' : ''}`}
                  onClick={feature.action}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur ${feature.highlight ? 'opacity-50 group-hover:opacity-75' : 'opacity-0 group-hover:opacity-30'} transition duration-500`}></div>
                  <div className={`relative bg-slate-800/50 backdrop-blur border ${feature.highlight ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-slate-700/50'} rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 h-full ${feature.highlight ? 'transform scale-105' : ''}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl text-white ${feature.highlight ? 'animate-pulse' : ''}`}>
                        {feature.icon}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    {feature.highlight && (
                      <div className="mt-4 flex items-center space-x-2 text-purple-400 text-sm font-semibold">
                        <span>Click to try →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur border border-slate-700/50 rounded-3xl p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-blue-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">50K+</div>
                  <div className="text-sm text-slate-400 font-medium">Active Developers</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-purple-400">
                    <Play className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">1M+</div>
                  <div className="text-sm text-slate-400 font-medium">Code Executions</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-pink-400">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">500K+</div>
                  <div className="text-sm text-slate-400 font-medium">Problems Solved</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-3 text-green-400">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">95%</div>
                  <div className="text-sm text-slate-400 font-medium">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article AI Animation Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-indigo-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Interactive Learning Hub
              </div>
              <h2 className="text-5xl font-black mb-6">
                Learn • Practice • Master
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  All in One Place
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Explore articles, track progress, and get AI assistance with beautiful animations
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Articles Preview */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Articles</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Browse curated learning content with difficulty levels and read times
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-blue-400">
                        <span>View Articles</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Preview */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">AI Assistant</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Generate code explanations with typing animation effects
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-orange-400">
                        <span>Try AI</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <button
                    onClick={() => safeNavigate('/learn')}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Sparkles className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Explore Learning Hub</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              {[
                { icon: '📖', label: 'Curated Articles', color: 'from-blue-500 to-cyan-500' },
                { icon: '🤖', label: 'AI Code Gen', color: 'from-orange-500 to-red-500' },
                { icon: '✨', label: 'Smooth Animations', color: 'from-green-500 to-emerald-500' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gradient-to-r ${feature.color} p-4 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  <div className="relative flex items-center space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-bold">{feature.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LeetCode-Style Editor Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-green-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border border-green-500/20 mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                Competitive Programming
              </div>
              <h2 className="text-5xl font-black mb-6">
                LeetCode-Style
                <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Problem Solving
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Practice with 150 curated problems in a professional LeetCode-inspired environment
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 hover:border-green-500/50 transition-all duration-300">
                
                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Split Panel Layout */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Split Panel Design</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Problem description on left, Monaco code editor on right - just like LeetCode
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Professional Layout</span>
                        </div>
                        <button 
                          onClick={() => navigate('/leetcode')}
                          className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Try Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 150 Problems */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">150 Problems</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Arrays, Strings, Trees, Graphs, DP and more - all difficulty levels
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Curated Collection</span>
                        </div>
                        <button 
                          onClick={() => navigate('/problems')}
                          className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Test & Submit */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Run & Submit</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Test with custom inputs, submit solutions, see runtime and memory stats
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-purple-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Real-time Feedback</span>
                        </div>
                        <button 
                          onClick={() => navigate('/leetcode')}
                          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Test Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Feature Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  {/* AI Assistant */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-3">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">AI Assistant</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Get hints, explanations, and code suggestions
                      </p>
                      <button 
                        onClick={() => navigate('/leetcode')}
                        className="w-full px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded text-orange-400 text-xs font-medium transition-all duration-200"
                      >
                        Try AI Help
                      </button>
                    </div>
                  </div>

                  {/* Whiteboard */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-teal-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">AI Whiteboard</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Visual algorithm explanations and drawings
                      </p>
                      <button 
                        onClick={() => navigate('/leetcode')}
                        className="w-full px-2 py-1 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded text-teal-400 text-xs font-medium transition-all duration-200"
                      >
                        Visualize
                      </button>
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Certificates</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Earn certificates for completing challenges
                      </p>
                      <button 
                        onClick={() => navigate('/certificates')}
                        className="w-full px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-400 text-xs font-medium transition-all duration-200"
                      >
                        View Certs
                      </button>
                    </div>
                  </div>

                  {/* Multi-Language */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Multi-Language</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        JavaScript, Python, Java, C++, and more
                      </p>
                      <button 
                        onClick={() => navigate('/leetcode')}
                        className="w-full px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded text-indigo-400 text-xs font-medium transition-all duration-200"
                      >
                        Code Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Screenshot/Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 mb-8">
                  <div className="bg-slate-900 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-sm text-slate-400">LeetCode Editor</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-green-400 mb-2">Problem Description</div>
                        <div className="space-y-2">
                          <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                          <div className="h-2 bg-slate-700 rounded w-full"></div>
                          <div className="h-2 bg-slate-700 rounded w-5/6"></div>
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-blue-400 mb-2">Code Editor</div>
                        <div className="space-y-2 font-mono text-xs">
                          <div className="h-2 bg-blue-500/20 rounded w-2/3"></div>
                          <div className="h-2 bg-purple-500/20 rounded w-full"></div>
                          <div className="h-2 bg-green-500/20 rounded w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <button
                    onClick={() => safeNavigate('/leetcode')}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Trophy className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Start Solving Problems</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-700/50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">150+</div>
                    <div className="text-sm text-slate-400">Problems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">15+</div>
                    <div className="text-sm text-slate-400">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">3</div>
                    <div className="text-sm text-slate-400">Difficulty Levels</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-purple-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/20 mb-6">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Development
              </div>
              <h2 className="text-5xl font-black mb-6">
                Build with
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Generate complete applications instantly with our advanced AI code generators
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* AI Universal Creator Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-purple-500/50 rounded-2xl p-8 hover:border-purple-400/70 transition-all duration-300 h-full ring-2 ring-purple-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black animate-bounce">
                        🔥 HOT
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        NEW
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Universal Creator</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Generate complete web applications, mobile apps, and more with natural language prompts. 
                    Powered by Google's Gemini AI for lightning-fast results.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Complete Web Applications</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-pink-400" />
                      <span>Mobile App Components</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                      <span>API & Backend Code</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Documentation & Guides</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => safeNavigate('/ai')}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Brain className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Try AI Creator</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  </button>
                </div>
              </div>

              {/* React AI Generator Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      REACT
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">React AI Generator</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Specialized React.js code generator for modern applications. Create components, hooks, 
                    and complete React projects with advanced patterns.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Modern React Hooks</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span>TypeScript Support</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Styled Components</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span>Complete Projects</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => safeNavigate('/react-ai')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40"
                  >
                    <Code className="w-6 h-6" />
                    <span>Generate React Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { name: 'Web Apps', icon: '🌐', color: 'from-blue-500 to-purple-500' },
                { name: 'Mobile Apps', icon: '📱', color: 'from-purple-500 to-pink-500' },
                { name: 'APIs', icon: '🔗', color: 'from-pink-500 to-orange-500' },
                { name: 'Databases', icon: '🗄️', color: 'from-orange-500 to-red-500' },
                { name: 'React Components', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
                { name: 'Vue.js', icon: '💚', color: 'from-green-500 to-emerald-500' },
                { name: 'Python Scripts', icon: '🐍', color: 'from-yellow-500 to-orange-500' },
                { name: 'Documentation', icon: '📚', color: 'from-indigo-500 to-purple-500' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gradient-to-r ${feature.color} p-4 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  <div className="relative flex items-center space-x-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-bold">{feature.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur border border-purple-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-purple-400 mb-2">10K+</div>
                <div className="text-slate-400 font-medium">Apps Generated</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur border border-blue-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">50M+</div>
                <div className="text-slate-400 font-medium">Lines of Code</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur border border-orange-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-orange-400 mb-2">99.9%</div>
                <div className="text-slate-400 font-medium">Success Rate</div>
              </div>
            </div>

            {/* AI CTA */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-4">
                <button
                  onClick={() => safeNavigate('/ai')}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Brain className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Start Building with AI</span>
                  <ArrowRight className="w-6 h-6 relative z-10" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full animate-bounce">🔥</span>
                </button>
                
                <button
                  onClick={() => safeNavigate('/react-ai')}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
                >
                  <Code className="w-6 h-6" />
                  <span>React AI Generator</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Platform Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-pink-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-400 border border-pink-500/20 mb-6">
                <PenSquare className="w-4 h-4 mr-2" />
                Community Blogging Platform
              </div>
              <h2 className="text-5xl font-black mb-6">
                Share Your
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Coding Journey
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Write technical blogs, share knowledge, and connect with developers worldwide
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300">
                
                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Create & Share */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <PenSquare className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Create & Share</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Write technical blogs with rich text editor, add cover images, and tag your content
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-pink-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Easy Publishing</span>
                        </div>
                        <button 
                          onClick={() => protectedAction(() => navigate('/blogs'))}
                          className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg text-pink-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Write Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Social Features */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Social Features</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Like, comment, follow authors, and build your developer community
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-purple-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Engage & Connect</span>
                        </div>
                        <button 
                          onClick={() => protectedAction(() => navigate('/blogs'))}
                          className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trending & Discovery */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">Trending & Discovery</h3>
                      <p className="text-slate-400 text-sm mb-4">
                        Discover trending blogs, search by tags, and get personalized feed
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Smart Discovery</span>
                        </div>
                        <button 
                          onClick={() => protectedAction(() => navigate('/blogs'))}
                          className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-medium transition-all duration-200 hover:scale-105"
                        >
                          Discover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Features Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  {/* Like/Dislike */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-red-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                        <ThumbsUp className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Like & React</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Show appreciation with likes and reactions
                      </p>
                      <button 
                        onClick={() => protectedAction(() => navigate('/blogs'))}
                        className="w-full px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 text-xs font-medium transition-all duration-200"
                      >
                        Try It
                      </button>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Comments</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Engage in discussions and share insights
                      </p>
                      <button 
                        onClick={() => protectedAction(() => navigate('/blogs'))}
                        className="w-full px-2 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded text-green-400 text-xs font-medium transition-all duration-200"
                      >
                        Comment
                      </button>
                    </div>
                  </div>

                  {/* Follow System */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-3">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Follow Authors</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Build your network and get personalized feed
                      </p>
                      <button 
                        onClick={() => protectedAction(() => navigate('/blogs'))}
                        className="w-full px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded text-orange-400 text-xs font-medium transition-all duration-200"
                      >
                        Follow
                      </button>
                    </div>
                  </div>

                  {/* Tags & Search */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 h-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-white">Tags & Search</h4>
                      <p className="text-slate-400 text-xs mb-3">
                        Find content by tags and keywords
                      </p>
                      <button 
                        onClick={() => protectedAction(() => navigate('/blogs'))}
                        className="w-full px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded text-indigo-400 text-xs font-medium transition-all duration-200"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {/* Blog Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 mb-8">
                  <div className="bg-slate-900 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-sm text-slate-400">Blog Platform</span>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                        <div>
                          <div className="h-3 bg-slate-700 rounded w-24 mb-2"></div>
                          <div className="h-2 bg-slate-700 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-pink-500/20 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-700 rounded w-full"></div>
                        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>42</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>156</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <button
                    onClick={() => protectedAction(() => navigate('/blogs'))}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:shadow-pink-500/40 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <PenSquare className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Start Blogging</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-700/50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">1000+</div>
                    <div className="text-sm text-slate-400">Blogs Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">500+</div>
                    <div className="text-sm text-slate-400">Active Writers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">5K+</div>
                    <div className="text-sm text-slate-400">Comments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GSoC Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-green-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border border-green-500/20 mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                Google Summer of Code 2026
              </div>
              <h2 className="text-5xl font-black mb-6">
                Join GSoC
                <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Contribute & Get Paid
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Work on real open source projects, get mentored by experts, and receive a stipend from Google
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* GSoC Card 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Open Source Projects</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Contribute to Codex and other exciting projects. Build features used by thousands of developers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>AI-Powered Features</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Real-time Collaboration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Mobile Development</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GSoC Card 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Expert Mentorship</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Get guidance from experienced developers throughout your 12-week journey.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Weekly Check-ins</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Code Reviews</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Career Guidance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GSoC Card 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Stipend & Recognition</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    Receive a stipend from Google and gain recognition in the open source community.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>$1,500 - $3,000 Stipend</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Certificate from Google</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Portfolio Boost</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GSoC CTA */}
            <div className="text-center">
              <button
                onClick={() => safeNavigate('/gsoc')}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105"
              >
                <Trophy className="w-6 h-6" />
                <span>Explore GSoC 2026</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Open Source Section */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-blue-900/5 to-slate-900/0">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 border border-blue-500/20 mb-6">
                <GitBranch className="w-4 h-4 mr-2" />
                Open Source Contribution
              </div>
              <h2 className="text-5xl font-black mb-6">
                Start Contributing
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  To Open Source
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Learn how to contribute to open source projects and build your developer portfolio
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {/* Step 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Learn Git & GitHub</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Master version control basics, branching, and pull requests
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Find Projects</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Discover beginner-friendly issues and choose projects you're passionate about
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-teal-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Make Contributions</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Submit your first PR, get feedback, and iterate on your code
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 font-bold text-xl text-white">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Build Portfolio</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Showcase your contributions and grow your developer reputation
                  </p>
                </div>
              </div>
            </div>

            {/* Open Source Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-blue-400 mb-2">2.5K+</div>
                <div className="text-slate-400 font-medium">GitHub Stars</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2">180+</div>
                <div className="text-slate-400 font-medium">Contributors</div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-black text-green-400 mb-2">1.2K+</div>
                <div className="text-slate-400 font-medium">Pull Requests</div>
              </div>
            </div>

            {/* Open Source CTA */}
            <div className="text-center">
              <button
                onClick={() => safeNavigate('/opensource')}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105"
              >
                <GitBranch className="w-6 h-6" />
                <span>Start Contributing</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mentorship CTA */}
        <div className="relative py-24 bg-gradient-to-b from-slate-900/0 via-orange-900/5 to-slate-900/0">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur border border-orange-500/20 rounded-3xl p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                      <Users className="w-4 h-4 mr-2" />
                      1-on-1 Mentorship
                    </div>
                    
                    <h2 className="text-4xl font-black mb-4 text-white">
                      Learn From an Expert
                    </h2>
                    
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      Get personalized guidance from <span className="text-orange-400 font-bold">Aditya Bakshi</span>, 
                      an experienced developer ready to accelerate your coding journey.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Code className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-slate-300 font-medium">Code Editors & Tools</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Layers className="w-5 h-5 text-pink-400" />
                        </div>
                        <span className="text-slate-300 font-medium">Full Stack Development</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-slate-300 font-medium">Career & Interview Prep</span>
                      </div>
                    </div>

                    <a
                      href="https://topmate.io/aditya_bakshi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-105"
                    >
                      <Users className="w-5 h-5" />
                      <span>Book a Session</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: <Lightbulb className="w-6 h-6" />, title: "Personalized Learning", desc: "Tailored guidance for your goals", color: "from-orange-500 to-pink-500" },
                      { icon: <Rocket className="w-6 h-6" />, title: "Career Acceleration", desc: "Fast-track your development", color: "from-pink-500 to-purple-500" },
                      { icon: <Trophy className="w-6 h-6" />, title: "Interview Success", desc: "Ace technical interviews", color: "from-purple-500 to-blue-500" }
                    ].map((item, index) => (
                      <div key={index} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-black mb-6">Ready to Start?</h2>
            <p className="text-xl text-slate-300 mb-12">
              Join thousands of developers building amazing projects
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              <button
                onClick={() => protectedAction(() => navigate('/editor'))}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Rocket className="w-6 h-6" />
                <span>Launch Editor</span>
              </button>
              
              <button
                onClick={() => protectedAction(() => navigate('/ai'))}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 flex items-center justify-center space-x-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Brain className="w-6 h-6 relative z-10" />
                <span className="relative z-10">CP-AI</span>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold rounded-full">🔥</span>
              </button>
              
              <button
                onClick={() => safeNavigate('/learn')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Trophy className="w-6 h-6" />
                <span>Start Learning</span>
              </button>
              
              <button
                onClick={() => safeNavigate('/web-editor')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Zap className="w-6 h-6" />
                <span>Web IDE</span>
              </button>
              
              <button
                onClick={() => safeNavigate('/vscode')}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-700 hover:border-slate-600 px-8 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <FolderOpen className="w-6 h-6" />
                <span>VS Code</span>
              </button>

              <button
                onClick={() => safeNavigate('/android')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-8 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Smartphone className="w-6 h-6" />
                <span>Android</span>
              </button>
            </div>

            <div className="flex justify-center items-center space-x-12 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="font-medium">100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="font-medium">No Installation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="font-medium">High Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative bg-slate-900/50 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Codex
                  </span>
                  <span className="text-slate-400 text-sm ml-2">Playground</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-slate-400">
                <a href="#" className="hover:text-white transition-colors font-medium">Privacy</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Terms</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Support</a>
                <a href="#" className="hover:text-white transition-colors font-medium">Docs</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
              <p>© 2026 Codex Playground. Built with ❤️ for developers worldwide.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Editor Toolbar */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowEditorToolbar(!showEditorToolbar)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 hover:rotate-90"
        >
          <Command className="w-8 h-8" />
        </button>

        {showEditorToolbar && (
          <div className="absolute bottom-20 right-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 w-80 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h3 className="text-white font-bold flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <span>Quick Actions</span>
              </h3>
              <button
                onClick={() => setShowEditorToolbar(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {/* Save Button */}
              <button
                onClick={handleSaveProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Save className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Save Project</div>
                  <div className="text-xs text-slate-400">Ctrl+S</div>
                </div>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownloadProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Download</div>
                  <div className="text-xs text-slate-400">Export files</div>
                </div>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareProject}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Share2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Share</div>
                  <div className="text-xs text-slate-400">Ctrl+Shift+S</div>
                </div>
              </button>

              {/* Copy Code Button */}
              <button
                onClick={handleCopyCode}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <Copy className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Copy Code</div>
                  <div className="text-xs text-slate-400">To clipboard</div>
                </div>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                {editorMode === 'fullscreen' ? (
                  <Minimize2 className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                )}
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">
                    {editorMode === 'fullscreen' ? 'Exit Fullscreen' : 'Fullscreen'}
                  </div>
                  <div className="text-xs text-slate-400">F11</div>
                </div>
              </button>

              {/* Reset Button */}
              <button
                onClick={handleResetEditor}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 hover:bg-red-900/30 rounded-xl transition-all group"
              >
                <RotateCcw className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Reset</div>
                  <div className="text-xs text-slate-400">Clear all</div>
                </div>
              </button>

              {/* Command Palette */}
              <button
                onClick={handleOpenCommandPalette}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 rounded-xl transition-all group"
              >
                <Command className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="text-white font-medium">Command Palette</div>
                  <div className="text-xs text-slate-400">Ctrl+K</div>
                </div>
              </button>
            </div>

            {/* Recent Projects */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 mb-3">Recent Projects</h4>
              <div className="space-y-2">
                {recentProjects.map((project, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-3 px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all group"
                  >
                    <span className="text-2xl">{project.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">{project.name}</div>
                      <div className="text-xs text-slate-400">{project.language} • {project.lastModified}</div>
                    </div>
                    <FileCode className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-32 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-in slide-in-from-top">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-900 rounded-xl">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
                  autoFocus
                />
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">ESC</kbd>
              </div>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { icon: <Code />, label: 'New File', shortcut: 'Ctrl+N', action: () => navigate('/editor') },
                  { icon: <FolderOpen />, label: 'Open Project', shortcut: 'Ctrl+O' },
                  { icon: <Save />, label: 'Save', shortcut: 'Ctrl+S', action: handleSaveProject },
                  { icon: <Share2 />, label: 'Share Project', shortcut: 'Ctrl+Shift+S', action: handleShareProject },
                  { icon: <Download />, label: 'Download', shortcut: 'Ctrl+D', action: handleDownloadProject },
                  { icon: <Play />, label: 'Run Code', shortcut: 'Ctrl+Enter' },
                  { icon: <Terminal />, label: 'Toggle Terminal', shortcut: 'Ctrl+`' },
                  { icon: <GitBranch />, label: 'Git: Commit', shortcut: 'Ctrl+Shift+G' },
                  { icon: <SettingsIcon />, label: 'Settings', shortcut: 'Ctrl+,' },
                  { icon: <Maximize2 />, label: 'Toggle Fullscreen', shortcut: 'F11', action: handleToggleFullscreen }
                ].map((command, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (command.action) command.action();
                      setShowCommandPalette(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400 group-hover:scale-110 transition-transform">
                        {command.icon}
                      </div>
                      <span className="text-white font-medium">{command.label}</span>
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreenModern;
