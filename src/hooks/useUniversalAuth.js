import { useAuth as useClerkAuth } from '../contexts/ClerkAuthContext';

// Universal auth hook - now Clerk only for faster authentication
export const useUniversalAuth = () => {
  try {
    const clerkAuth = useClerkAuth();
    return {
      ...clerkAuth,
      authType: 'clerk'
    };
  } catch (error) {
    console.error('Clerk authentication error:', error);
    // Fallback - no auth available
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      authInitialized: true,
      isReady: true,
      login: () => console.log('Clerk authentication required'),
      logout: () => console.log('Clerk authentication required'),
      register: () => console.log('Clerk authentication required'),
      updateUser: () => console.log('Clerk authentication required'),
      authType: 'none'
    };
  }
};