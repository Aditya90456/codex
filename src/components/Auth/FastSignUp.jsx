import { useState, useEffect } from 'react';
import { X, UserPlus, Zap, Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

const FastSignUp = ({ isOpen, onClose, onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [validationState, setValidationState] = useState({
    name: false,
    email: false,
    password: false
  });

  // Real-time validation
  useEffect(() => {
    setValidationState({
      name: formData.name.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: formData.password.length >= 6
    });
  }, [formData]);

  // Fast loading simulation
  const handleFastSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);

    // Ultra-fast progress simulation
    const progressSteps = [
      { progress: 25, message: 'Validating credentials...', delay: 100 },
      { progress: 50, message: 'Creating account...', delay: 150 },
      { progress: 75, message: 'Setting up profile...', delay: 100 },
      { progress: 100, message: 'Welcome to Codex!', delay: 200 }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setLoadingProgress(step.progress);
    }

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      name: formData.name || 'Developer',
      email: formData.email || `user${Date.now()}@codex.dev`,
      username: formData.name?.toLowerCase().replace(/\s+/g, '') || `user${Date.now()}`,
      createdAt: new Date().toISOString(),
      fastSignUp: true
    };

    // Store in localStorage for demo
    localStorage.setItem('codex_user', JSON.stringify(newUser));
    localStorage.setItem('codex_auth_token', `fast_token_${Date.now()}`);

    // Call parent callback
    if (onSignUp) {
      onSignUp(newUser);
    }

    setIsLoading(false);
    onClose();
    
    // Trigger page refresh to update auth state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md w-full relative border border-gray-700 shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-gray-800 rounded-full"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center animate-pulse">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Lightning Fast Sign Up</h2>
            <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
          <p className="text-gray-300 text-sm mb-4">
            ⚡ Create your account in under 3 seconds
          </p>

          {/* Progress Indicator */}
          {isLoading && (
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {loadingProgress < 25 ? 'Validating credentials...' :
                 loadingProgress < 50 ? 'Creating account...' :
                 loadingProgress < 75 ? 'Setting up profile...' :
                 'Welcome to Codex!'}
              </p>
            </div>
          )}
        </div>

        {/* Fast Sign Up Form */}
        <form onSubmit={handleFastSignUp} className="px-6 pb-6">
          {/* Name Field */}
          <div className="mb-4 animate-fade-in-up">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your name"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-12 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200"
                disabled={isLoading}
                autoComplete="name"
              />
              {validationState.name && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email address"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-12 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200"
                disabled={isLoading}
                autoComplete="email"
              />
              {validationState.email && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password (min 6 characters)"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-10 pr-20 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {validationState.password && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !Object.values(validationState).every(Boolean)}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 p-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 animate-fade-in-up ${
              !isLoading && Object.values(validationState).every(Boolean) ? 'hover:scale-105 transform' : ''
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Speed Indicator */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Lightning fast • No verification required • Instant access</span>
            </div>
          </div>
        </form>

        {/* Switch to Sign In */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">What you get instantly:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Code Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Problem Solving</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Multiple Languages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastSignUp;