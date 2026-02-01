import { UserProfile, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Shield, Bell, Key, 
  Mail, Smartphone, Globe, Award, Sparkles, ArrowUp, ChevronDown, Home
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const ProfilePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const containerRef = useRef(null);
  const settingsRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Calculate account age
  const getAccountAge = () => {
    if (!user?.createdAt) return 'New';
    const created = new Date(user.createdAt);
    const now = new Date();
    const months = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30));
    if (months === 0) return 'New';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return years === 1 ? '1 year' : `${years} years`;
  };

  // Calculate security score
  const getSecurityScore = () => {
    if (!user) return 0;
    let score = 50; // Base score
    if (user.emailAddresses?.length > 0) score += 20;
    if (user.phoneNumbers?.length > 0) score += 15;
    if (user.twoFactorEnabled) score += 15;
    return Math.min(score, 100);
  };

  const quickStats = [
    { label: 'Account Age', value: getAccountAge(), icon: Award, color: 'text-blue-400' },
    { label: 'Security Score', value: `${getSecurityScore()}%`, icon: Shield, color: getSecurityScore() >= 80 ? 'text-green-400' : 'text-yellow-400' },
    { label: 'Connected Apps', value: user?.externalAccounts?.length || 0, icon: Smartphone, color: 'text-purple-400' },
  ];

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 500);
      setShowScrollHint(scrollTop < 100);
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

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 animate-in slide-in-from-bottom"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-auto scroll-smooth"
      >
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="flex items-center gap-4 mb-8">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group animate-fade-in-up"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <Home size={18} />
                <span className="font-semibold">Home</span>
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full px-6 py-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Profile Settings</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Manage Your Account
                </span>
              </h1>
              <p className="text-xl text-slate-400 mb-8">
                Update your profile, security settings, and preferences
              </p>

              {/* Scroll Down Indicator */}
              {showScrollHint && (
                <button
                  onClick={scrollToSettings}
                  className="flex flex-col items-center space-y-2 text-slate-400 hover:text-white transition-colors group mx-auto"
                >
                  <span className="text-sm font-medium">View Settings</span>
                  <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-purple-400" />
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Main Content */}
            <div 
              ref={settingsRef}
              className="grid lg:grid-cols-4 gap-8 scroll-mt-24"
            >
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 sticky top-24">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
                  Settings
                </h3>
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'security', label: 'Security', icon: Shield },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'api', label: 'API Keys', icon: Key },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Help Section */}
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
                  <h4 className="text-sm font-bold text-white mb-2">Need Help?</h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Check our documentation or contact support
                  </p>
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-xs text-white font-semibold transition-all">
                    Get Support
                  </button>
                </div>
              </div>
            </div>

            {/* Main Profile Content */}
            <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                {/* Clerk User Profile Component */}
                <UserProfile 
                  appearance={{
                    baseTheme: 'dark',
                    variables: {
                      colorPrimary: '#8B5CF6',
                      colorBackground: 'transparent',
                      colorInputBackground: '#1E293B',
                      colorInputText: '#F1F5F9',
                      borderRadius: '0.75rem',
                    },
                    elements: {
                      card: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        border: 'none',
                      },
                      headerTitle: {
                        color: '#FFFFFF',
                        fontSize: '24px',
                        fontWeight: '700',
                      },
                      headerSubtitle: {
                        color: '#94A3B8',
                        fontSize: '14px',
                      },
                      formButtonPrimary: {
                        backgroundColor: '#8B5CF6',
                        '&:hover': {
                          backgroundColor: '#7C3AED',
                        },
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '12px 24px',
                        borderRadius: '12px',
                      },
                      formFieldInput: {
                        backgroundColor: '#1E293B',
                        border: '1px solid #475569',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        '&:focus': {
                          borderColor: '#8B5CF6',
                        },
                      },
                      formFieldLabel: {
                        color: '#CBD5E1',
                        fontSize: '14px',
                        fontWeight: '500',
                      },
                      profileSectionTitle: {
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontWeight: '600',
                      },
                      profileSectionContent: {
                        color: '#CBD5E1',
                      },
                      breadcrumbsItem: {
                        color: '#94A3B8',
                      },
                      breadcrumbsItemDivider: {
                        color: '#475569',
                      },
                      navbarButton: {
                        color: '#CBD5E1',
                        '&:hover': {
                          color: '#FFFFFF',
                        },
                      },
                      pageScrollBox: {
                        backgroundColor: '#0F172A',
                      },
                      socialButtonsBlockButton: {
                        backgroundColor: '#334155',
                        border: '1px solid #475569',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        '&:hover': {
                          backgroundColor: '#475569',
                        },
                      },
                      footerActionLink: {
                        color: '#A78BFA',
                        '&:hover': {
                          color: '#8B5CF6',
                        },
                      },
                      badge: {
                        backgroundColor: '#8B5CF6',
                        color: '#FFFFFF',
                      },
                      avatarBox: {
                        border: '2px solid #8B5CF6',
                      },
                    },
                  }}
                />
              </div>

              {/* Additional Info Cards */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Security Status</h3>
                      <p className="text-sm text-green-400">
                        {getSecurityScore() >= 80 ? 'Excellent security' : 'Good security'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    {user?.twoFactorEnabled 
                      ? 'Your account is protected with 2FA and secure authentication'
                      : 'Consider enabling 2FA for enhanced security'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Connected Apps</h3>
                      <p className="text-sm text-blue-400">
                        {user?.externalAccounts?.length || 0} active connection{user?.externalAccounts?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">
                    Manage your connected applications and integrations
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
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

export default ProfilePage;