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

  // Initialize auth state with timeout fallback
  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (!authInitialized && userLoaded) {
        console.log('⚡ Clerk Auth - Timeout fallback initialization');
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 2000); // 2 second timeout

    return () => clearTimeout(initTimer);
  }, [authInitialized, userLoaded]);

  // Real-time user state updates
  useEffect(() => {
    console.log('🔄 Clerk Auth - State change detected:', { 
      userLoaded, 
      isSignedIn, 
      hasClerkUser: !!clerkUser,
      authInitialized 
    });

    if (userLoaded) {
      if (isSignedIn && clerkUser) {
        console.log('✅ Clerk Auth - User authenticated:', clerkUser.emailAddresses[0]?.emailAddress);
        
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
          authType: 'clerk'
        };

        setUser(enhancedUser);
        setLoading(false);
        setAuthInitialized(true);
        
        // Clear any demo auth data that might exist
        localStorage.removeItem('codex_user');
        localStorage.removeItem('codex_auth_token');
        localStorage.removeItem('demo_current_user');
        localStorage.removeItem('demo_auth_token');
        
        console.log('👤 Clerk Auth - User updated:', enhancedUser.username);
      } else {
        console.log('🔓 Clerk Auth - No user signed in');
        setUser(null);
        setLoading(false);
        setAuthInitialized(true);
      }
    }
  }, [userLoaded, isSignedIn, clerkUser]);

  // Clerk logout with proper state reset
  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 Clerk logout initiated...');
      setUser(null);
      setLoading(true);
      setAuthInitialized(false);
      await signOut();
      console.log('✅ Clerk logout complete');
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('🚨 Clerk logout error:', error);
      setLoading(false);
      setAuthInitialized(true);
    }
  }, [signOut]);

  const value = {
    user,
    loading: loading && !authInitialized,
    isAuthenticated: isSignedIn && !!user && authInitialized,
    authInitialized,
    // Clerk auth methods
    login: () => console.log('🔐 Use Clerk SignIn component for authentication'),
    register: () => console.log('📝 Use Clerk SignUp component for registration'),
    logout: handleLogout,
    updateUser: (userData) => setUser(prev => ({ ...prev, ...userData })),
    // Clerk methods
    getAuthToken: getToken,
    isReady: authInitialized && !loading,
    authType: 'clerk'
  };

  // Performance logging
  useEffect(() => {
    if (authInitialized) {
      console.log('⚡ Clerk Auth - Performance Summary:', {
        hasUser: !!value.user,
        isAuthenticated: value.isAuthenticated,
        authType: 'clerk',
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