import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isSmallMobile: false,
    isMediumMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false
  });

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // Determine device type based on breakpoints
      setDeviceType({
        isMobile: width < 768,
        isSmallMobile: width < 375,
        isMediumMobile: width >= 375 && width < 640,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1536,
        isLargeDesktop: width >= 1536
      });

      // Determine orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility functions
  const isBreakpoint = (breakpoint) => {
    const breakpoints = {
      xxxs: 240,
      xxs: 250,
      xs: 320,
      xsm: 375,
      msm: 450,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };
    return windowSize.width >= breakpoints[breakpoint];
  };

  const isBetween = (min, max) => {
    return windowSize.width >= min && windowSize.width < max;
  };

  return {
    windowSize,
    deviceType,
    orientation,
    isBreakpoint,
    isBetween,
    // Convenience properties
    isMobile: deviceType.isMobile,
    isSmallMobile: deviceType.isSmallMobile,
    isMediumMobile: deviceType.isMediumMobile,
    isTablet: deviceType.isTablet,
    isDesktop: deviceType.isDesktop,
    isLargeDesktop: deviceType.isLargeDesktop,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    // Specific size checks
    is450px: windowSize.width >= 450 && windowSize.width < 640,
    isBelow450px: windowSize.width < 450
  };
};

export default useResponsive;
