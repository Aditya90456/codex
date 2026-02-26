import { useEffect, useState } from 'react';

/**
 * Hook to manage auto-open behavior for LeetCode editor features
 * Handles localStorage preferences and initial state
 */
export const useAutoOpen = (featureName, defaultOpen = true) => {
  const storageKey = `leetcode-auto-open-${featureName}`;
  
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? JSON.parse(saved) : defaultOpen;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isOpen));
  }, [isOpen, storageKey]);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, toggle, open, close, setIsOpen };
};

/**
 * Hook to auto-start features on component mount
 */
export const useAutoStart = (callback, delay = 1000, dependencies = []) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;

    const timer = setTimeout(() => {
      callback();
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasStarted, delay, ...dependencies]);

  return { hasStarted, restart: () => setHasStarted(false) };
};

/**
 * Hook to manage welcome/onboarding state
 */
export const useWelcomeState = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    const seen = localStorage.getItem('leetcode-welcome-seen');
    return !seen;
  });

  const dismissWelcome = () => {
    localStorage.setItem('leetcode-welcome-seen', 'true');
    setShowWelcome(false);
  };

  const resetWelcome = () => {
    localStorage.removeItem('leetcode-welcome-seen');
    setShowWelcome(true);
  };

  return { showWelcome, dismissWelcome, resetWelcome };
};
