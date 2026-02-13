import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const AuthContext = createContext({});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded, signOut } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (userLoaded && authLoaded) {
      setIsReady(true);
    } else {
      // Fallback: if Clerk doesn't load within 5 seconds, mark as ready anyway
      const timeout = setTimeout(() => {
        console.warn('Clerk loading timeout - marking as ready');
        setIsReady(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [userLoaded, authLoaded]);

  // Register user for stats tracking when they sign in
  useEffect(() => {
    const registerUser = async () => {
      if (user && isSignedIn) {
        try {
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
          await fetch(`${BACKEND_URL}/api/stats/register-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              userName: user.firstName || user.username || 'User',
              email: user.primaryEmailAddress?.emailAddress || ''
            })
          });
          console.log('✅ User registered for stats tracking');
        } catch (error) {
          console.error('Failed to register user for stats:', error);
        }
      }
    };

    registerUser();
  }, [user, isSignedIn]);

  const value = {
    user,
    isSignedIn: !!isSignedIn,
    isLoaded: isReady,
    signOut,
    // User info helpers
    userName: user?.firstName || user?.username || 'User',
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userImage: user?.imageUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};