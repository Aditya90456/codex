import { useState, useEffect, useRef } from 'react';

export function useAuthTimer() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setEndTime(null);
    setDuration(null);
    setIsTracking(true);
    
    // Update duration every 100ms for real-time display
    intervalRef.current = setInterval(() => {
      setDuration(Date.now() - now);
    }, 100);
  };

  const stopTimer = () => {
    const now = Date.now();
    setEndTime(now);
    setIsTracking(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (startTime) {
      const finalDuration = now - startTime;
      setDuration(finalDuration);
      return finalDuration;
    }
    return null;
  };

  const resetTimer = () => {
    setStartTime(null);
    setEndTime(null);
    setDuration(null);
    setIsTracking(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (ms) => {
    if (!ms) return '0.0s';
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getSpeedRating = (ms) => {
    if (!ms) return null;
    if (ms < 2000) return { rating: 'Lightning Fast', color: 'text-green-400', emoji: '⚡' };
    if (ms < 5000) return { rating: 'Fast', color: 'text-blue-400', emoji: '🚀' };
    if (ms < 10000) return { rating: 'Good', color: 'text-yellow-400', emoji: '👍' };
    return { rating: 'Slow', color: 'text-red-400', emoji: '🐌' };
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startTimer,
    stopTimer,
    resetTimer,
    duration,
    isTracking,
    formatTime,
    getSpeedRating,
    startTime,
    endTime
  };
}