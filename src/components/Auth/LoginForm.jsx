import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';

const LoginForm = ({ onLogin, onSwitchToSignup, isLoading }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.login.trim()) {
      newErrors.login = 'Username or email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onLogin(formData);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue your coding journey</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.login 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your username or email"
                disabled={isLoading}
              />
            </div>
            {errors.login && (
              <p className="mt-1 text-sm text-red-400">{errors.login}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <Github className="w-5 h-5 text-gray-300" />
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <Chrome className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;