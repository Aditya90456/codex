import { createContext, useContext, useEffect, useState } from 'react';

const DemoAuthContext = createContext();

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};

export const DemoAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('demo_current_user');
        const authToken = localStorage.getItem('demo_auth_token');
        
        if (storedUser && authToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Demo Auth - User restored from localStorage:', userData.email);
        } else {
          console.log('🔓 Demo Auth - No stored user found');
        }
      } catch (error) {
        console.error('❌ Demo Auth - Error loading stored user:', error);
        // Clear corrupted data
        localStorage.removeItem('demo_current_user');
        localStorage.removeItem('demo_auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('demo_current_user', JSON.stringify(userData));
      localStorage.setItem('demo_auth_token', `token_${userData.id}`);
      console.log('✅ Demo Auth - User logged in:', userData.email);
    } catch (error) {
      console.error('❌ Demo Auth - Login error:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('demo_current_user');
      localStorage.removeItem('demo_auth_token');
      console.log('🚪 Demo Auth - User logged out');
    } catch (error) {
      console.error('❌ Demo Auth - Logout error:', error);
    }
  };

  // Register function
  const register = (userData) => {
    try {
      // Add to users list
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('demo_users', JSON.stringify(existingUsers));
      
      // Log in the new user
      login(userData);
      console.log('✅ Demo Auth - User registered and logged in:', userData.email);
    } catch (error) {
      console.error('❌ Demo Auth - Registration error:', error);
    }
  };

  // Update user function
  const updateUser = (updates) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('demo_current_user', JSON.stringify(updatedUser));
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('demo_users', JSON.stringify(existingUsers));
      }
      
      console.log('✅ Demo Auth - User updated:', updatedUser.email);
    } catch (error) {
      console.error('❌ Demo Auth - Update error:', error);
    }
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('demo_auth_token');
  };

  // Check if user exists
  const userExists = (email) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      return existingUsers.some(u => u.email === email);
    } catch (error) {
      console.error('❌ Demo Auth - Error checking user existence:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    authInitialized: !loading,
    isReady: !loading,
    authType: 'demo',
    
    // Auth methods
    login,
    logout,
    register,
    updateUser,
    getAuthToken,
    userExists,
    
    // Utility methods
    clearAllData: () => {
      localStorage.removeItem('demo_current_user');
      localStorage.removeItem('demo_auth_token');
      localStorage.removeItem('demo_users');
      setUser(null);
      setIsAuthenticated(false);
      console.log('🗑️ Demo Auth - All data cleared');
    }
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export default DemoAuthContext;