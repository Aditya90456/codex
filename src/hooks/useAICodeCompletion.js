// Hook for AI Code Completion
import { useState, useEffect, useCallback, useRef } from 'react';
import aiCodeCompletionService from '../services/aiCodeCompletion';

export const useAICodeCompletion = (options = {}) => {
  const {
    enabled = true,
    language = 'javascript',
    problemContext = null,
    debounceDelay = 500,
    autoAcceptDelay = 3000, // Auto-hide suggestion after 3s
  } = options;

  const [completion, setCompletion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const autoHideTimer = useRef(null);
  const lastRequestRef = useRef(null);

  // Initialize service
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey && !isInitialized) {
      const success = aiCodeCompletionService.initialize(apiKey);
      setIsInitialized(success);
      if (!success) {
        console.warn('AI Code Completion: Failed to initialize');
      }
    }
  }, [isInitialized]);

  // Clear auto-hide timer
  const clearAutoHide = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  }, []);

  // Set auto-hide timer
  const setAutoHide = useCallback(() => {
    clearAutoHide();
    if (autoAcceptDelay > 0) {
      autoHideTimer.current = setTimeout(() => {
        setCompletion(null);
      }, autoAcceptDelay);
    }
  }, [autoAcceptDelay, clearAutoHide]);

  // Request completion
  const requestCompletion = useCallback(async (code, cursorPosition) => {
    if (!enabled || !isInitialized || !code) {
      return;
    }

    // Cancel previous request
    if (lastRequestRef.current) {
      clearTimeout(lastRequestRef.current);
    }

    setIsLoading(true);
    clearAutoHide();

    try {
      const requestId = Date.now();
      lastRequestRef.current = requestId;

      const result = await aiCodeCompletionService.getCompletionDebounced(
        code,
        cursorPosition,
        language,
        problemContext,
        (comp) => {
          // Only update if this is still the latest request
          if (lastRequestRef.current === requestId) {
            setCompletion(comp);
            setIsLoading(false);
            if (comp) {
              setAutoHide();
            }
          }
        }
      );

      // Fallback if callback wasn't called
      if (lastRequestRef.current === requestId && result !== undefined) {
        setCompletion(result);
        setIsLoading(false);
        if (result) {
          setAutoHide();
        }
      }
    } catch (error) {
      console.error('Completion request error:', error);
      setIsLoading(false);
      setCompletion(null);
    }
  }, [enabled, isInitialized, language, problemContext, clearAutoHide, setAutoHide]);

  // Accept completion
  const acceptCompletion = useCallback(() => {
    clearAutoHide();
    const currentCompletion = completion;
    setCompletion(null);
    return currentCompletion;
  }, [completion, clearAutoHide]);

  // Reject/dismiss completion
  const dismissCompletion = useCallback(() => {
    clearAutoHide();
    setCompletion(null);
  }, [clearAutoHide]);

  // Clear cache
  const clearCache = useCallback(() => {
    aiCodeCompletionService.clearCache();
  }, []);

  // Update settings
  const updateSettings = useCallback((settings) => {
    aiCodeCompletionService.updateSettings(settings);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoHide();
    };
  }, [clearAutoHide]);

  return {
    completion,
    isLoading,
    isInitialized,
    requestCompletion,
    acceptCompletion,
    dismissCompletion,
    clearCache,
    updateSettings,
  };
};

export default useAICodeCompletion;
