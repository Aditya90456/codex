import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { isSignedIn, signOut } = useClerkAuth();
  const [user, setUser] = useState(null);
  const [authStartTime, setAuthStartTime] = useState(null);
  const [authDuration, setAuthDuration] = useState(null);

  // Track authentication timing
  useEffect(() => {
    if (!isLoaded && !authStartTime) {
      setAuthStartTime(Date.now());
    }
    
    if (isLoaded && authStartTime && !authDuration) {
      const duration = Date.now() - authStartTime;
      setAuthDuration(duration);
      console.log(`Authentication completed in ${(duration / 1000).toFixed(1)}s`);
    }
  }, [isLoaded, authStartTime, authDuration]);

  // Optimized auth state - single effect with faster processing
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        // Minimal user object for faster processing
        const simpleUser = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.firstName || clerkUser.username || 'User',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName
        };
        setUser(simpleUser);
      } else {
        setUser(null);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const logout = async () => {
    try {
      setUser(null); // Immediate UI update
      await signOut();
      // Reset timing for next auth
      setAuthStartTime(null);
      setAuthDuration(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Force logout even if there's an error
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading: !isLoaded,
    logout,
    authDuration,
    authStartTime
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;