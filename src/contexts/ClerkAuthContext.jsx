import { createContext, useContext, useEffect, useState } from 'react';
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
  const { isSignedIn, getToken } = useClerkAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      console.log('🔐 Clerk Auth - Initializing...', { 
        userLoaded, 
        isSignedIn, 
        hasClerkUser: !!clerkUser 
      });

      if (!userLoaded) {
        console.log('⏳ Clerk Auth - User not loaded yet');
        return;
      }

      try {
        if (isSignedIn && clerkUser) {
          console.log('✅ Clerk Auth - User signed in:', clerkUser.emailAddresses[0]?.emailAddress);
          
          // Create simple user object
          const enhancedUser = {
            id: clerkUser.id,
            username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0],
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            fullName: clerkUser.fullName,
            imageUrl: clerkUser.imageUrl,
          };

          setUser(enhancedUser);
          console.log('👤 Clerk Auth - User set:', enhancedUser);
        } else {
          console.log('❌ Clerk Auth - User not signed in');
          setUser(null);
        }
      } catch (error) {
        console.error('🚨 Clerk Auth - Error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('🏁 Clerk Auth - Initialization complete');
      }
    };

    initializeUser();
  }, [isSignedIn, clerkUser, userLoaded]);

  const value = {
    user,
    loading: loading || !userLoaded,
    isAuthenticated: isSignedIn && !!user,
    // Placeholder methods
    login: () => console.log('Use Clerk SignIn component'),
    register: () => console.log('Use Clerk SignUp component'),
    logout: () => console.log('Use Clerk UserButton component'),
    updateUser: (userData) => setUser(prev => ({ ...prev, ...userData })),
  };

  console.log('🔄 Clerk Auth - Context value:', {
    hasUser: !!value.user,
    loading: value.loading,
    isAuthenticated: value.isAuthenticated
  });

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export default ClerkAuthContext;