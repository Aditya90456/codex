import { createContext, useContext, useEffect, useState } from 'react';

const SimpleAuthContext = createContext();

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

export const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('codex_user');
    const storedToken = localStorage.getItem('codex_auth_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('codex_user');
        localStorage.removeItem('codex_auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('codex_user', JSON.stringify(userData));
    localStorage.setItem('codex_auth_token', 'simple_token_' + Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codex_user');
    localStorage.removeItem('codex_auth_token');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('codex_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    authInitialized: !loading,
    isReady: !loading,
    login,
    logout,
    updateUser,
    register: login, // Same as login for demo
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export default SimpleAuthContext;