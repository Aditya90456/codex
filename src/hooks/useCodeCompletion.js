import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for AI-powered code completion
 * Provides intelligent code suggestions as you type
 */
export const useCodeCompletion = (language = 'javascript', enabled = true) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inlineCompletion, setInlineCompletion] = useState('');
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // Fetch code completions
  const fetchCompletions = useCallback(async (code, cursorPosition, context = '') => {
    if (!enabled || !code) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/code-completion/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cursorPosition,
          language,
          context,
          maxSuggestions: 5
        }),
        signal: abortController.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completions');
      }

      const data = await response.json();
      
      console.log('[AI Completion] Response received:', {
        success: data.success,
        suggestionsCount: data.suggestions?.length || 0,
        suggestions: data.suggestions
      });
      
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        console.log('[AI Completion] No suggestions or error:', data.error);
        setSuggestions([]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Code completion error:', error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, language, enabled]);

  // Debounced completion fetch
  const requestCompletions = useCallback((code, cursorPosition, context = '', delay = 500) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchCompletions(code, cursorPosition, context);
    }, delay);
  }, [fetchCompletions]);

  // Fetch inline completion (ghost text)
  const fetchInlineCompletion = useCallback(async (code, cursorPosition) => {
    if (!enabled || !code) {
      setInlineCompletion('');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/code-completion/inline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cursorPosition,
          language
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.completion) {
          setInlineCompletion(data.completion);
        } else {
          setInlineCompletion('');
        }
      }
    } catch (error) {
      console.error('Inline completion error:', error);
      setInlineCompletion('');
    }
  }, [API_URL, language, enabled]);

  // Request inline completion with debounce
  const requestInlineCompletion = useCallback((code, cursorPosition, delay = 800) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchInlineCompletion(code, cursorPosition);
    }, delay);
  }, [fetchInlineCompletion]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setInlineCompletion('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (abortController.current) {
      abortController.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    inlineCompletion,
    requestCompletions,
    requestInlineCompletion,
    clearSuggestions,
    fetchCompletions
  };
};

export default useCodeCompletion;
