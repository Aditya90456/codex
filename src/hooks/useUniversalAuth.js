import { useAuth as useSimpleAuth } from '../contexts/SimpleClerkAuth';

// Universal auth hook - now using simple, working auth
export const useUniversalAuth = () => {
  try {
    const auth = useSimpleAuth();
    return {
      ...auth,
      authInitialized: !auth.loading,
      isReady: !auth.loading,
      authType: 'clerk'
    };
  } catch (error) {
    console.error('Auth error:', error);
    // Fallback - no auth available
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      authInitialized: true,
      isReady: true,
      login: () => console.log('Auth required'),
      logout: () => console.log('Auth required'),
      register: () => console.log('Auth required'),
      updateUser: () => console.log('Auth required'),
      authType: 'none'
    };
  }
};