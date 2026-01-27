import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Zap, Activity, Clock, Code, Rocket, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SignInPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const containerRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState(23847);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Animate active users count
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5));
      setCurrentTime(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll to form
  const scrollToForm = () => {
    const formElement = document.getElementById('signin-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-y-auto scroll-smooth"
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
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
            <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome Back
            </h1>
            <Rocket className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Continue your coding journey where you left off
          </p>
          
          {/* Live Activity Stats */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-full px-6 py-3">
              <Activity className="w-5 h-5 text-green-400 animate-pulse" />
              <span className="text-white font-semibold">{activeUsers.toLocaleString()}</span>
              <span className="text-gray-400">online now</span>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-full px-6 py-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">{currentTime.toLocaleTimeString()}</span>
            </div>
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

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">50K+</h3>
            <p className="text-gray-400">Problems Solved Today</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">1.2M+</h3>
            <p className="text-gray-400">Lines of Code Written</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{activeUsers.toLocaleString()}</h3>
            <p className="text-gray-400">Active Right Now</p>
          </div>
        </div>

        {/* Sign In Form */}
        <div id="signin-form" className="max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign In to Continue
              </h2>
              <p className="text-gray-400">
                Access your dashboard and projects
              </p>
            </div>

            <div className="max-h-[500px] overflow-y-auto scroll-smooth pr-2 custom-scrollbar">
              <SignIn 
                appearance={{
                  baseTheme: 'dark',
                  variables: {
                    colorPrimary: '#3B82F6',
                    colorBackground: 'transparent',
                    colorInputBackground: '#1E293B',
                    colorInputText: '#F1F5F9',
                    borderRadius: '0.75rem',
                  },
                  elements: {
                    formButtonPrimary: {
                      backgroundColor: '#3B82F6',
                      '&:hover': { backgroundColor: '#2563EB' },
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
                      '&:focus': { borderColor: '#3B82F6' },
                    },
                    formFieldLabel: { color: '#D1D5DB', fontSize: '14px' },
                    footerActionLink: { color: '#60A5FA' },
                  },
                }}
                redirectUrl="/dashboard"
                signUpUrl="/sign-up"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Secured with 256-bit encryption</span>
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
          background: #3B82F6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563EB;
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

export default SignInPage;