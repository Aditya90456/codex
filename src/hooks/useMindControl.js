import { useState, useEffect, useCallback } from 'react';

export const useMindControl = (problemId) => {
  const [thoughts, setThoughts] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`mind-control-${problemId}`);
    if (saved) {
      try {
        setThoughts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load thoughts:', e);
      }
    }
  }, [problemId]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setSessionStart(Date.now());
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const addThought = useCallback((thought) => {
    const newThought = {
      ...thought,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      sessionTime: sessionStart ? Date.now() - sessionStart : 0
    };

    setThoughts(prev => {
      const updated = [...prev, newThought];
      localStorage.setItem(`mind-control-${problemId}`, JSON.stringify(updated));
      return updated;
    });
  }, [problemId, sessionStart]);

  const deleteThought = useCallback((id) => {
    setThoughts(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(`mind-control-${problemId}`, JSON.stringify(updated));
      return updated;
    });
  }, [problemId]);

  const clearThoughts = useCallback(() => {
    setThoughts([]);
    localStorage.removeItem(`mind-control-${problemId}`);
  }, [problemId]);

  const exportThoughts = useCallback(() => {
    return {
      problemId,
      thoughts,
      totalThoughts: thoughts.length,
      modesUsed: [...new Set(thoughts.map(t => t.mode))],
      exportDate: new Date().toISOString()
    };
  }, [problemId, thoughts]);

  return {
    thoughts,
    isTracking,
    startTracking,
    stopTracking,
    addThought,
    deleteThought,
    clearThoughts,
    exportThoughts
  };
};
