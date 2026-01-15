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

  // Simple, single effect for auth state
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        const simpleUser = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.firstName || 'User'
        };
        setUser(simpleUser);
      } else {
        setUser(null);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser?.id]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading: !isLoaded,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;