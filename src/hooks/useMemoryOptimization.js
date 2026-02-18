import { useEffect, useCallback, useRef } from 'react';
import { cleanupMemory, monitorPerformance, isLowEndDevice } from '../utils/performance-optimizer';

/**
 * Hook for memory optimization on low-end devices
 */
const useMemoryOptimization = (options = {}) => {
  const {
    cleanupInterval = 60000, // 1 minute
    memoryThreshold = 80, // 80% memory usage
    enableMonitoring = true
  } = options;

  const cleanupTimerRef = useRef(null);
  const isLowEnd = isLowEndDevice();

  // Cleanup function
  const performCleanup = useCallback(() => {
    if (isLowEnd) {
      cleanupMemory();
      
      // Check memory after cleanup
      const memoryInfo = monitorPerformance();
      if (memoryInfo) {
        console.log('Memory after cleanup:', memoryInfo);
      }
    }
  }, [isLowEnd]);

  // Monitor memory usage
  useEffect(() => {
    if (!enableMonitoring || !isLowEnd) return;

    const checkMemory = () => {
      const memoryInfo = monitorPerformance();
      if (memoryInfo) {
        const usage = parseFloat(memoryInfo.percentage);
        
        if (usage > memoryThreshold) {
          console.warn('High memory usage detected:', memoryInfo);
          performCleanup();
        }
      }
    };

    // Set up periodic cleanup
    cleanupTimerRef.current = setInterval(checkMemory, cleanupInterval);

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, [enableMonitoring, isLowEnd, cleanupInterval, memoryThreshold, performCleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      performCleanup();
    };
  }, [performCleanup]);

  return {
    isLowEndDevice: isLowEnd,
    performCleanup,
    getMemoryInfo: monitorPerformance
  };
};

export default useMemoryOptimization;
