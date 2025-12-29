import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Github, Chrome } from 'lucide-react';

const SignupForm = ({ onSignup, onSwitchToLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be less than 50 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be less than 50 characters';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await onSignup(signupData);
    } catch (error) {
      setErrors({ general: error.message || 'Signup failed' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Join Codex
          </h2>
          <p className="text-gray-400">Create your account and start coding</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.firstName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="John"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.lastName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Doe"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.username 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="johndoe"
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
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
                placeholder="Create a strong password"
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </label>
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
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
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

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;