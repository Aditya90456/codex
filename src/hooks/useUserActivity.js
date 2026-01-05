import { useState, useEffect, useCallback } from 'react';

export const useUserActivity = () => {
  const [userActivity, setUserActivity] = useState({
    isActive: true,
    lastActivity: Date.now(),
    currentPage: 'welcome',
    sessionDuration: 0,
    actions: [],
    mousePosition: { x: 0, y: 0 },
    keystrokes: 0,
    clicks: 0,
    scrollPosition: 0,
    isTyping: false,
    currentEditor: null,
    codeChanges: 0,
    filesOpened: 0,
    navigationHistory: []
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [performance, setPerformance] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkSpeed: 'unknown'
  });

  // Track user activity
  const trackActivity = useCallback((action, data = {}) => {
    const timestamp = Date.now();
    
    setUserActivity(prev => ({
      ...prev,
      isActive: true,
      lastActivity: timestamp,
      actions: [...prev.actions.slice(-49), { // Keep last 50 actions
        id: timestamp,
        action,
        data,
        timestamp,
        page: prev.currentPage
      }]
    }));
  }, []);

  // Track navigation
  const trackNavigation = useCallback((page, editor = null) => {
    setUserActivity(prev => ({
      ...prev,
      currentPage: page,
      currentEditor: editor,
      navigationHistory: [...prev.navigationHistory.slice(-19), { // Keep last 20 navigations
        page,
        editor,
        timestamp: Date.now()
      }]
    }));
    
    trackActivity('navigation', { page, editor });
  }, [trackActivity]);

  // Track code changes
  const trackCodeChange = useCallback((fileName, changeType = 'edit') => {
    setUserActivity(prev => ({
      ...prev,
      codeChanges: prev.codeChanges + 1,
      isTyping: changeType === 'edit'
    }));
    
    trackActivity('code_change', { fileName, changeType });
  }, [trackActivity]);

  // Track file operations
  const trackFileOperation = useCallback((operation, fileName) => {
    setUserActivity(prev => ({
      ...prev,
      filesOpened: operation === 'open' ? prev.filesOpened + 1 : prev.filesOpened
    }));
    
    trackActivity('file_operation', { operation, fileName });
  }, [trackActivity]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setUserActivity(prev => ({
        ...prev,
        mousePosition: { x: e.clientX, y: e.clientY },
        isActive: true,
        lastActivity: Date.now()
      }));
    };

    const handleClick = () => {
      setUserActivity(prev => ({
        ...prev,
        clicks: prev.clicks + 1,
        isActive: true,
        lastActivity: Date.now()
      }));
      trackActivity('click');
    };

    const handleScroll = () => {
      setUserActivity(prev => ({
        ...prev,
        scrollPosition: window.scrollY,
        isActive: true,
        lastActivity: Date.now()
      }));
    };

    const handleKeyPress = () => {
      setUserActivity(prev => ({
        ...prev,
        keystrokes: prev.keystrokes + 1,
        isActive: true,
        lastActivity: Date.now(),
        isTyping: true
      }));
      trackActivity('keypress');
    };

    // Stop typing indicator after 2 seconds
    const typingTimeout = setTimeout(() => {
      setUserActivity(prev => ({ ...prev, isTyping: false }));
    }, 2000);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keypress', handleKeyPress);
      clearTimeout(typingTimeout);
    };
  }, [trackActivity]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      trackActivity('online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      trackActivity('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [trackActivity]);

  // Session duration tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setUserActivity(prev => ({
        ...prev,
        sessionDuration: Date.now() - (prev.actions[0]?.timestamp || Date.now())
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Performance monitoring
  useEffect(() => {
    const measurePerformance = () => {
      if (performance.navigation && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const renderTime = performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart;
        
        setPerformance(prev => ({
          ...prev,
          loadTime,
          renderTime
        }));
      }

      // Memory usage (if available)
      if (performance.memory) {
        setPerformance(prev => ({
          ...prev,
          memoryUsage: performance.memory.usedJSHeapSize
        }));
      }
    };

    measurePerformance();
    const interval = setInterval(measurePerformance, 5000);

    return () => clearInterval(interval);
  }, []);

  // Inactivity detection
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - userActivity.lastActivity;
      
      if (timeSinceLastActivity > 30000) { // 30 seconds
        setUserActivity(prev => ({ ...prev, isActive: false }));
      }
    };

    const interval = setInterval(checkInactivity, 5000);
    return () => clearInterval(interval);
  }, [userActivity.lastActivity]);

  return {
    userActivity,
    isOnline,
    performance,
    trackActivity,
    trackNavigation,
    trackCodeChange,
    trackFileOperation,
    
    // Helper functions
    getActivitySummary: () => ({
      totalActions: userActivity.actions.length,
      sessionTime: Math.floor(userActivity.sessionDuration / 1000),
      isActiveUser: userActivity.isActive,
      productivity: {
        codeChanges: userActivity.codeChanges,
        filesOpened: userActivity.filesOpened,
        keystrokes: userActivity.keystrokes,
        clicks: userActivity.clicks
      }
    }),
    
    getRecentActivity: (limit = 10) => userActivity.actions.slice(-limit),
    
    getCurrentStatus: () => ({
      page: userActivity.currentPage,
      editor: userActivity.currentEditor,
      isTyping: userActivity.isTyping,
      isActive: userActivity.isActive,
      online: isOnline
    })
  };
};