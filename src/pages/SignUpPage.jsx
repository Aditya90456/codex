import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Sparkles, Users, Shield, Zap, Code, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SignUpPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef(null);
  const [userCount, setUserCount] = useState(1247892);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setShowScrollHint(progress < 5);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Animate user count
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll to form
  const scrollToForm = () => {
    const formElement = document.getElementById('signup-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-y-auto scroll-smooth"
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Join Codex Playground
            </h1>
            <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Start your coding journey with thousands of developers
          </p>
          
          {/* Live Stats */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">{userCount.toLocaleString()}</span>
            <span className="text-gray-400">developers already joined</span>
            <TrendingUp className="w-4 h-4 text-green-400 animate-pulse" />
          </div>

          {/* Scroll Hint */}
          {showScrollHint && (
            <button
              onClick={scrollToForm}
              className="animate-bounce text-gray-400 hover:text-white transition-colors"
            >
              <ChevronDown size={32} />
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Sign up in seconds and start coding immediately</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">Your data is encrypted and protected</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full Access</h3>
            <p className="text-gray-400">All features unlocked from day one</p>
          </div>
        </div>

        {/* Sign Up Form */}
        <div id="signup-form" className="max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-400">
                Join {userCount.toLocaleString()}+ developers
              </p>
            </div>

            <div className="max-h-[500px] overflow-y-auto scroll-smooth pr-2 custom-scrollbar">
              <SignUp 
                appearance={{
                  baseTheme: 'dark',
                  variables: {
                    colorPrimary: '#7C3AED',
                    colorBackground: 'transparent',
                    colorInputBackground: '#1E293B',
                    colorInputText: '#F1F5F9',
                    borderRadius: '0.75rem',
                  },
                  elements: {
                    formButtonPrimary: {
                      backgroundColor: '#7C3AED',
                      '&:hover': { backgroundColor: '#6D28D9' },
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 24px',
                      borderRadius: '12px',
                    },
                    card: {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                    },
                    headerTitle: { display: 'none' },
                    headerSubtitle: { display: 'none' },
                    socialButtonsBlockButton: {
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      '&:hover': { backgroundColor: '#4B5563' },
                    },
                    formFieldInput: {
                      backgroundColor: '#1E293B',
                      border: '1px solid #4B5563',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      '&:focus': { borderColor: '#7C3AED' },
                    },
                    formFieldLabel: { color: '#D1D5DB', fontSize: '14px' },
                    footerActionLink: { color: '#A855F7' },
                  },
                }}
                redirectUrl="/dashboard"
                signInUrl="/sign-in"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-3">Trusted by developers at</p>
            <div className="flex items-center justify-center gap-6 text-gray-600">
              <span className="text-sm">Google</span>
              <span className="text-sm">Microsoft</span>
              <span className="text-sm">Amazon</span>
              <span className="text-sm">Meta</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1E293B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7C3AED;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6D28D9;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default SignUpPage;