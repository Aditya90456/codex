import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const DemoAuth = ({ isOpen, onClose, mode = 'signup', onAuth, onSwitchMode }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Reset form when mode changes
  useEffect(() => {
    setCurrentMode(mode);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setSuccess(false);
  }, [mode]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (currentMode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (currentMode === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (currentMode === 'signup') {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const userExists = existingUsers.find(u => u.email === formData.email);
        
        if (userExists) {
          setErrors({ email: 'User with this email already exists' });
          setIsLoading(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          username: formData.name.toLowerCase().replace(/\s+/g, ''),
          createdAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff`
        };
        
        // Save user
        existingUsers.push(newUser);
        localStorage.setItem('demo_users', JSON.stringify(existingUsers));
        localStorage.setItem('demo_current_user', JSON.stringify(newUser));
        localStorage.setItem('demo_auth_token', `token_${newUser.id}`);
        
        setSuccess(true);
        
        // Call parent callback
        if (onAuth) {
          onAuth(newUser);
        }
        
        // Close modal after success
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh to update auth state
        }, 1500);
        
      } else {
        // Login
        const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const user = existingUsers.find(u => u.email === formData.email);
        
        if (!user) {
          setErrors({ email: 'No account found with this email' });
          setIsLoading(false);
          return;
        }
        
        // In demo mode, any password works for existing users
        localStorage.setItem('demo_current_user', JSON.stringify(user));
        localStorage.setItem('demo_auth_token', `token_${user.id}`);
        
        setSuccess(true);
        
        // Call parent callback
        if (onAuth) {
          onAuth(user);
        }
        
        // Close modal after success
        setTimeout(() => {
          onClose();
          window.location.reload(); // Refresh to update auth state
        }, 1500);
      }
      
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setSuccess(false);
    if (onSwitchMode) {
      onSwitchMode(newMode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md w-full relative border border-gray-700 shadow-2xl">
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
            <div className={`w-12 h-12 bg-gradient-to-r ${
              currentMode === 'signup' 
                ? 'from-purple-600 to-pink-600' 
                : 'from-blue-600 to-purple-600'
            } rounded-xl flex items-center justify-center`}>
              {currentMode === 'signup' ? (
                <UserPlus className="w-6 h-6 text-white" />
              ) : (
                <LogIn className="w-6 h-6 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {currentMode === 'signup' ? 'Join Codex Playground' : 'Welcome Back'}
            </h2>
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-gray-300 text-sm mb-4">
            {currentMode === 'signup' 
              ? '🚀 Create your account and start coding instantly' 
              : '⚡ Sign in and continue your coding journey'
            }
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm font-medium">
                  {currentMode === 'signup' ? 'Account created successfully!' : 'Welcome back!'}
                </span>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{errors.general}</span>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="px-6 pb-6">
          {/* Name Field (Sign Up Only) */}
          {currentMode === 'signup' && (
            <div className="mb-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full bg-gray-800 border ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  } text-white rounded-xl pl-10 pr-4 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email address"
                className={`w-full bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } text-white rounded-xl pl-10 pr-4 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={currentMode === 'signup' ? 'Password (min 6 characters)' : 'Password'}
                className={`w-full bg-gray-800 border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } text-white rounded-xl pl-10 pr-12 py-3 focus:border-purple-500 focus:outline-none transition-all duration-200`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className={`w-full bg-gradient-to-r ${
              currentMode === 'signup' 
                ? 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } p-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{currentMode === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Success! Redirecting...</span>
              </>
            ) : (
              <>
                {currentMode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{currentMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>

          {/* Demo Notice */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Demo mode • Instant access • No verification required
          </p>
        </form>

        {/* Switch Mode */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => switchMode(currentMode === 'signup' ? 'login' : 'signup')}
                className={`${
                  currentMode === 'signup' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-400 hover:text-blue-300'
                } font-medium transition-colors`}
                disabled={isLoading}
              >
                {currentMode === 'signup' ? 'Sign in here' : 'Create one now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAuth;