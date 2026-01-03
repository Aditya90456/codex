import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '../../contexts/ClerkAuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      await login(loginData);
      onClose();
    } catch (error) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (signupData) => {
    setIsLoading(true);
    try {
      await register(signupData);
      onClose();
    } catch (error) {
      throw new Error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full p-2"
        >
          <X size={20} />
        </button>
        
        {mode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setMode('signup')}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setMode('login')}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;