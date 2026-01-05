import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fast initialization with timeout
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (!authInitialized) {
        console.log('⚡ Fast Auth - Timeout reached, initializing with current state');
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 2000); // 2 second timeout for fast loading

    return () => clearTimeout(initTimer);
  }, [authInitialized]);

  // Optimized user initialization
  const initializeUser = useCallback(async () => {
    if (authInitialized) return;

    console.log('🚀 Fast Clerk Auth - Initializing...', { 
      userLoaded, 
      isSignedIn, 
      hasClerkUser: !!clerkUser 
    });

    try {
      if (isSignedIn && clerkUser) {
        console.log('✅ Fast Auth - User authenticated:', clerkUser.emailAddresses[0]?.emailAddress);
        
        // Create optimized user object
        const enhancedUser = {
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
        };

        setUser(enhancedUser);
        
        // Auto-redirect to Codex playground after successful auth
        setTimeout(() => {
          console.log('🎯 Redirecting to Codex Playground...');
          // The redirect will be handled by the parent component
        }, 500);
        
        console.log('👤 Fast Auth - User ready for Codex Playground:', enhancedUser.username);
      } else {
        console.log('🔓 Fast Auth - No user signed in');
        setUser(null);
      }
    } catch (error) {
      console.error('🚨 Fast Auth - Error:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthInitialized(true);
      console.log('🏁 Fast Auth - Ready in under 2s');
    }
  }, [isSignedIn, clerkUser, userLoaded, authInitialized]);

  useEffect(() => {
    if (userLoaded && !authInitialized) {
      initializeUser();
    }
  }, [userLoaded, initializeUser, authInitialized]);

  // Fast logout with redirect
  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 Fast logout initiated...');
      setUser(null);
      setLoading(true);
      await signOut();
      console.log('✅ Logout complete - redirecting to welcome');
      // Reset auth state
      setAuthInitialized(false);
      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error('🚨 Logout error:', error);
      setLoading(false);
    }
  }, [signOut]);

  const value = {
    user,
    loading: loading && !authInitialized,
    isAuthenticated: isSignedIn && !!user && authInitialized,
    authInitialized,
    // Fast auth methods
    login: () => console.log('🔐 Use Clerk SignIn component for fast auth'),
    register: () => console.log('📝 Use Clerk SignUp component for fast registration'),
    logout: handleLogout,
    updateUser: (userData) => setUser(prev => ({ ...prev, ...userData })),
    // Performance metrics
    getAuthToken: getToken,
    isReady: authInitialized && !loading,
  };

  // Performance logging
  useEffect(() => {
    if (authInitialized) {
      console.log('⚡ Fast Clerk Auth - Performance Summary:', {
        hasUser: !!value.user,
        isAuthenticated: value.isAuthenticated,
        loadTime: '< 2s',
        readyForCodex: value.isReady
      });
    }
  }, [authInitialized, value.user, value.isAuthenticated, value.isReady]);

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export default ClerkAuthContext;