import { useState } from 'react';
import { X, User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const ClerkAuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleDemoAuth = (e) => {
    e.preventDefault();
    
    // Create demo user
    const demoUser = {
      id: Date.now().toString(),
      email: email || 'demo@codex.dev',
      username: name || email?.split('@')[0] || 'developer',
      firstName: name || 'Developer',
      lastName: '',
      createdAt: new Date().toISOString(),
      demo: true
    };

    // Store in localStorage
    localStorage.setItem('codex_user', JSON.stringify(demoUser));
    localStorage.setItem('codex_auth_token', 'demo_token_' + Date.now());
    
    console.log('✅ Demo authentication successful:', demoUser.username);
    
    // Close modal and refresh page to trigger auth state update
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md w-full relative border border-gray-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${currentMode === 'sign-up' ? 'from-purple-600 to-blue-600' : 'from-blue-600 to-purple-600'} rounded-xl flex items-center justify-center`}>
              {currentMode === 'sign-up' ? <UserPlus className="w-5 h-5 text-white" /> : <LogIn className="w-5 h-5 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {currentMode === 'sign-up' ? 'Join Codex Playground' : 'Welcome Back'}
            </h2>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            {currentMode === 'sign-up' ? '🚀 Create your account and start coding' : '⚡ Sign in and start coding instantly'}
          </p>
        </div>

        {/* Demo Form */}
        <form onSubmit={handleDemoAuth} className="px-6 pb-6 scroll-smooth">
          {currentMode === 'sign-up' && (
            <div className="mb-4 animate-fade-in-up">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 scroll-smooth"
                />
              </div>
            </div>
          )}

          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address (optional)"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 scroll-smooth"
              />
            </div>
          </div>

          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (optional)"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none transition-all duration-200 scroll-smooth"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r ${currentMode === 'sign-up' ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} p-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 animate-fade-in-up hover:scale-105 transform`}
            style={{ animationDelay: '0.3s' }}
          >
            {currentMode === 'sign-up' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{currentMode === 'sign-up' ? 'Create Account' : 'Sign In'}</span>
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Demo mode • No verification required • Instant access
          </p>
        </form>

        {/* Switch Mode */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {currentMode === 'sign-up' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setCurrentMode(currentMode === 'sign-up' ? 'sign-in' : 'sign-up')}
                className={`${currentMode === 'sign-up' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-300'} font-medium transition-colors`}
              >
                {currentMode === 'sign-up' ? 'Sign in here' : 'Create one now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuthModal;