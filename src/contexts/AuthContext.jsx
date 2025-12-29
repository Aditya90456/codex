import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      try {
        const token = apiService.getToken();
        if (token) {
          try {
            const userData = await apiService.getCurrentUser();
            // Enhance user object with additional properties
            const enhancedUser = {
              ...userData.user,
              email: userData.user.email || `${userData.user.username}@example.com`,
              rating: userData.user.rating || 1200,
              solvedProblems: userData.user.solvedProblems || 0,
              joinDate: userData.user.joinDate || new Date().toISOString(),
            };
            setUser(enhancedUser);
            setIsAuthenticated(true);
          } catch (apiError) {
            console.error('API call failed during auth init:', apiError);
            // Clear invalid token and continue without auth
            apiService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't throw error - just continue without auth
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent flash of loading screen
    const timer = setTimeout(() => {
      initAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      // Enhance user object with additional properties
      const enhancedUser = {
        ...response.user,
        email: response.user.email || `${response.user.username}@example.com`,
        rating: response.user.rating || 1200,
        solvedProblems: response.user.solvedProblems || 0,
        joinDate: response.user.joinDate || new Date().toISOString(),
      };
      setUser(enhancedUser);
      setIsAuthenticated(true);
      return { ...response, user: enhancedUser };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      // Enhance user object with additional properties
      const enhancedUser = {
        ...response.user,
        email: response.user.email || userData.email,
        rating: response.user.rating || 1200,
        solvedProblems: response.user.solvedProblems || 0,
        joinDate: response.user.joinDate || new Date().toISOString(),
      };
      setUser(enhancedUser);
      setIsAuthenticated(true);
      return { ...response, user: enhancedUser };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <LoadingScreen message="Loading Codex..." />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;