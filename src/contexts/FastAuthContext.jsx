import { createContext, useContext, useEffect, useState } from 'react';

const FastAuthContext = createContext();

export const useFastAuth = () => {
  const context = useContext(FastAuthContext);
  if (!context) {
    throw new Error('useFastAuth must be used within a FastAuthProvider');
  }
  return context;
};

export const FastAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false for instant loading

  useEffect(() => {
    // Ultra-fast initialization - no delays, no async operations
    const initAuth = () => {
      console.log('⚡ Fast auth initialization starting...');
      
      try {
        // Check for stored user immediately
        const storedUser = localStorage.getItem('codex_user');
        const storedToken = localStorage.getItem('codex_auth_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('⚡ Fast auth: User restored instantly -', userData.username);
        } else {
          console.log('⚡ Fast auth: No stored user found');
        }
      } catch (error) {
        console.error('Fast auth: Error parsing stored user:', error);
        localStorage.removeItem('codex_user');
        localStorage.removeItem('codex_auth_token');
      }
      
      console.log('⚡ Fast auth ready in 0ms');
    };

    initAuth();
  }, []);

  const login = (userData) => {
    console.log('⚡ Fast login:', userData.username || userData.email);
    setUser(userData);
    localStorage.setItem('codex_user', JSON.stringify(userData));
    localStorage.setItem('codex_auth_token', 'fast_token_' + Date.now());
  };

  const logout = () => {
    console.log('⚡ Fast logout');
    setUser(null);
    localStorage.removeItem('codex_user');
    localStorage.removeItem('codex_auth_token');
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('codex_user', JSON.stringify(updatedUser));
    console.log('⚡ Fast user update:', updates);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    authInitialized: true, // Always true for fast auth
    isReady: true, // Always ready
    login,
    logout,
    updateUser,
    register: login, // Same as login for fast auth
    authType: 'fast'
  };

  return (
    <FastAuthContext.Provider value={value}>
      {children}
    </FastAuthContext.Provider>
  );
};

export default FastAuthContext;