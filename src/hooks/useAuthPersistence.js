import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

const useAuthPersistence = () => {
  const { isSignedIn, user, isLoaded } = useAuth();
  const [persistedUser, setPersistedUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const initRef = useRef(false);

  // Storage keys
  const USER_STORAGE_KEY = 'clerk_user_data';
  const AUTH_STATE_KEY = 'clerk_auth_state';

  // Save user data to localStorage
  const saveUserData = useCallback((userData) => {
    if (typeof window === 'undefined') return;
    
    try {
      if (userData) {
        const dataToStore = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailAddresses: userData.emailAddresses,
          imageUrl: userData.imageUrl,
          username: userData.username,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          lastSignInAt: userData.lastSignInAt,
          timestamp: Date.now()
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(dataToStore));
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify({
          isSignedIn: true,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.warn('Failed to save user data to localStorage:', error);
    }
  }, []);

  // Load user data from localStorage
  const loadUserData = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedAuthState = localStorage.getItem(AUTH_STATE_KEY);
      
      if (storedUser && storedAuthState) {
        const userData = JSON.parse(storedUser);
        const authState = JSON.parse(storedAuthState);
        
        // Check if data is not too old (24 hours)
        const isDataFresh = (Date.now() - userData.timestamp) < 24 * 60 * 60 * 1000;
        
        if (isDataFresh && authState.isSignedIn) {
          return userData;
        } else {
          // Clear expired data
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(AUTH_STATE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load user data from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(AUTH_STATE_KEY);
      } catch (e) {
        console.warn('Failed to clear corrupted data:', e);
      }
    }
    return null;
  }, []);

  // Clear stored data
  const clearUserData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(AUTH_STATE_KEY);
      setPersistedUser(null);
    } catch (error) {
      console.warn('Failed to clear user data from localStorage:', error);
    }
  }, []);

  // Initialize persisted data on mount
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      const storedData = loadUserData();
      if (storedData) {
        setPersistedUser(storedData);
      }
      setIsHydrated(true);
    }
  }, [loadUserData]);

  // Handle Clerk auth state changes
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // User is authenticated - save data and update state
      saveUserData(user);
      setPersistedUser(user);
      setAuthReady(true);
    } else if (!isSignedIn) {
      // User is not authenticated - clear data
      clearUserData();
      setAuthReady(true);
    }
  }, [isLoaded, isSignedIn, user, saveUserData, clearUserData]);

  // Get current user (prioritize live data over persisted)
  const getCurrentUser = useCallback(() => {
    if (isLoaded && isSignedIn && user) {
      return user;
    }
    return persistedUser;
  }, [isLoaded, isSignedIn, user, persistedUser]);

  // Check if user is authenticated (including persisted state)
  const isAuthenticated = useCallback(() => {
    if (isLoaded) {
      return isSignedIn;
    }
    // If not loaded yet, check persisted state
    return !!persistedUser;
  }, [isLoaded, isSignedIn, persistedUser]);

  // Get auth loading state
  const isAuthLoading = useCallback(() => {
    return !isLoaded || !isHydrated || !authReady;
  }, [isLoaded, isHydrated, authReady]);

  // Force refresh auth state
  const refreshAuth = useCallback(() => {
    const storedData = loadUserData();
    if (storedData) {
      setPersistedUser(storedData);
    } else {
      setPersistedUser(null);
    }
  }, [loadUserData]);

  return {
    // Current state
    user: getCurrentUser(),
    isSignedIn: isAuthenticated(),
    isLoaded: isLoaded && isHydrated && authReady,
    isLoading: isAuthLoading(),
    
    // Persisted data
    persistedUser,
    isHydrated,
    authReady,
    
    // Methods
    saveUserData,
    loadUserData,
    clearUserData,
    getCurrentUser,
    isAuthenticated,
    refreshAuth,
    
    // Raw Clerk state (for debugging)
    clerkState: {
      isSignedIn,
      user,
      isLoaded
    }
  };
};

export default useAuthPersistence;