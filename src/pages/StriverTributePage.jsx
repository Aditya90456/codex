import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Youtube, ExternalLink, Star, Sparkles, Trophy, 
  Users, BookOpen, Code, Zap, Award, ArrowUp, ChevronDown,
  Play, Globe, MessageCircle
} from 'lucide-react';

const StriverTributePage = ({ onBack }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const playlistsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollY = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowScrollTop(scrollY > 500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToPlaylists = () => {
    playlistsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const playlists = [
    {
      title: "A2Z DSA Course",
      description: "Complete coverage of all DSA topics from basics to advanced",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Striver's SDE Sheet",
      description: "180 Most Important Problems for interview preparation",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma",
      icon: Trophy,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Graph Series",
      description: "Complete Graph Algorithms from basics to advanced",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn",
      icon: Code,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Dynamic Programming",
      description: "Master DP Step by Step - All patterns covered",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY",
      icon: Zap,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Binary Search",
      description: "Complete Binary Search - All variations explained",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF",
      icon: Award,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Recursion & Backtracking",
      description: "Master Recursion with pattern-wise approach",
      url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500"
    }
  ];

  const achievements = [
    { icon: Users, label: "600K+ Subscribers", color: "text-blue-400" },
    { icon: Trophy, label: "Millions Helped", color: "text-purple-400" },
    { icon: Star, label: "100% Free Content", color: "text-yellow-400" },
    { icon: Heart, label: "Community Driven", color: "text-pink-400" }
  ];

  const companies = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", 
    "Netflix", "Adobe", "Uber", "LinkedIn", "Twitter"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Quick Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-3 hidden lg:block">
        <button
          onClick={scrollToTop}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-purple-500 rounded-full transition-all"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Top
          </span>
        </button>
        <button
          onClick={scrollToPlaylists}
          className="group relative w-3 h-3 bg-slate-700 hover:bg-pink-500 rounded-full transition-all"
        >
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Playlists
          </span>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
                <span>Back to Home</span>
              </button>
            )}

            {/* Main Title */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl">
                  <Heart className="w-20 h-20 text-white fill-white" />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Tribute to Striver
              </h1>
              
              <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-bold">
                Raj Vikramaditya
              </p>
              
              <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
                The legend who made DSA accessible to millions through free, high-quality education
              </p>

              {/* Main Channel Link */}
              <a
                href="https://www.youtube.com/@takeUforward"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-red-500/50"
              >
                <Youtube className="w-8 h-8" />
                <span>Take U Forward</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all text-center">
                    <achievement.icon className={`w-12 h-12 ${achievement.color} mx-auto mb-3`} />
                    <p className="text-white font-bold">{achievement.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Down Indicator */}
            <div className="flex justify-center mt-12">
              <button
                onClick={scrollToPlaylists}
                className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group"
              >
                <span className="text-sm font-medium">Explore Playlists</span>
                <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-purple-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Why Striver is Special */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Striver is Special
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Free Quality Education</h3>
              <p className="text-slate-400">
                All content is 100% FREE with no paywalls or hidden costs. Accessible to everyone worldwide.
              </p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Structured Approach</h3>
              <p className="text-slate-400">
                A2Z Coverage with pattern-based learning and progressive difficulty from basics to advanced.
              </p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Community Impact</h3>
              <p className="text-slate-400">
                Millions of students helped with countless success stories in FAANG companies.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Playlists */}
        <div ref={playlistsRef} className="max-w-7xl mx-auto px-6 py-16 scroll-mt-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Essential Playlists
          </h2>
          <p className="text-center text-slate-400 mb-12 text-lg">
            Curated learning paths to master Data Structures & Algorithms
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, idx) => (
              <a
                key={idx}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-r ${playlist.color} rounded-xl flex items-center justify-center mb-4`}>
                    <playlist.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                    {playlist.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4">
                    {playlist.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-red-400 font-semibold">
                    <Play className="w-4 h-4" />
                    <span>Watch Playlist</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Official Website */}
          <div className="mt-12 text-center">
            <a
              href="https://takeuforward.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              <Globe className="w-6 h-6" />
              <span>Visit Take U Forward</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Success Stories */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Success Stories
          </h2>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8">
            <p className="text-xl text-slate-300 text-center mb-6">
              Thousands of students have cracked interviews at top companies:
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {companies.map((company, idx) => (
                <div
                  key={idx}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl font-bold text-white"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-slate-900/60 backdrop-blur-xl border border-purple-500/50 rounded-3xl p-12 text-center">
              <Heart className="w-20 h-20 text-pink-400 fill-pink-400 mx-auto mb-6 animate-pulse" />
              
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Thank You, Striver!
              </h2>
              
              <div className="space-y-4 text-lg text-slate-300 max-w-3xl mx-auto mb-8">
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Making DSA accessible to everyone</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Creating structured learning paths</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Providing free, quality education</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Inspiring millions to learn and grow</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Building a supportive community</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span>Changing lives through education</span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6 mb-8">
                <p className="text-2xl font-bold text-white italic">
                  "Consistency is the key. Keep practicing, keep learning, and success will follow!"
                </p>
                <p className="text-slate-400 mt-2">- Striver</p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                <Trophy className="w-8 h-8 text-purple-400" />
                <Star className="w-8 h-8 text-pink-400 fill-pink-400" />
                <Heart className="w-8 h-8 text-red-400 fill-red-400" />
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800">
          <div className="text-center text-slate-400">
            <p className="mb-4">
              <strong className="text-white">Original Content Creator:</strong> Striver (Raj Vikramaditya)
            </p>
            <p className="mb-4">
              <strong className="text-white">Official Website:</strong>{' '}
              <a 
                href="https://takeuforward.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                takeuforward.org
              </a>
            </p>
            <p className="text-sm">
              This tribute page is built with ❤️ Love for DSA, 🙏 Respect for Striver's work, 
              🎓 Passion for learning, and 🤝 Community spirit
            </p>
            <p className="mt-6 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Keep coding, keep learning! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StriverTributePage;
