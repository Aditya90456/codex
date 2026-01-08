import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const ClerkAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a ClerkAuthProvider');
  }
  return context;
};

export const ClerkAuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isSignedIn, getToken, signOut } = useClerkAuth();
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Single useEffect to handle all auth state changes - prevents loops
  useEffect(() => {
    console.log('🔄 Clerk Auth - State update:', { userLoaded, isSignedIn, hasUser: !!clerkUser });

    if (userLoaded) {
      // Mark as initialized immediately when Clerk finishes loading
      if (!authInitialized) {
        setAuthInitialized(true);
        console.log('✅ Clerk Auth - Initialized');
      }

      if (isSignedIn && clerkUser) {
        // Create user object only if it's different from current
        const newUser = {
          id: clerkUser.id,
          username: clerkUser.username || 
                   clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 
                   `user_${clerkUser.id.slice(-6)}`,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          firstName: clerkUser.firstName || 'Developer',
          lastName: clerkUser.lastName || '',
          fullName: clerkUser.fullName || clerkUser.username || 'Developer',
          imageUrl: clerkUser.imageUrl,
          createdAt: clerkUser.createdAt,
          lastSignInAt: clerkUser.lastSignInAt,
          authType: 'clerk'
        };

        // Only update if user has changed to prevent unnecessary re-renders
        setUser(prevUser => {
          if (!prevUser || prevUser.id !== newUser.id) {
            console.log('👤 Clerk Auth - User authenticated:', newUser.username);
            return newUser;
          }
          return prevUser;
        });
      } else {
        // Clear user if not signed in
        setUser(prevUser => {
          if (prevUser) {
            console.log('🔓 Clerk Auth - User signed out');
            return null;
          }
          return prevUser;
        });
      }
    }
  }, [userLoaded, isSignedIn, clerkUser?.id, authInitialized]);

  // Memoized logout function to prevent re-renders
  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 Clerk logout initiated...');
      setUser(null);
      setAuthInitialized(false);
      await signOut();
      console.log('✅ Clerk logout complete');
      // Simple redirect without timeout
      window.location.href = '/';
    } catch (error) {
      console.error('🚨 Clerk logout error:', error);
      // Reset state on error
      setAuthInitialized(true);
    }
  }, [signOut]);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading: !userLoaded || !authInitialized,
    isAuthenticated: !!(isSignedIn && user && authInitialized),
    authInitialized,
    // Auth methods
    login: () => console.log('🔐 Use Clerk SignIn component for authentication'),
    register: () => console.log('📝 Use Clerk SignUp component for registration'),
    logout: handleLogout,
    updateUser: (userData) => setUser(prev => prev ? { ...prev, ...userData } : null),
    // Clerk methods
    getAuthToken: getToken,
    isReady: !!(userLoaded && authInitialized),
    authType: 'clerk'
  }), [user, userLoaded, authInitialized, isSignedIn, handleLogout, getToken]);

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export default ClerkAuthContext;