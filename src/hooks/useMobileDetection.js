import { useState, useEffect } from 'react';
import { getDeviceInfo, isMobileDevice, isMobileViewport } from '../utils/mobile-detection';

/**
 * React hook for mobile detection
 * Returns device information and updates on resize
 */
const useMobileDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => getDeviceInfo());

  useEffect(() => {
    // Update device info on resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return {
    ...deviceInfo,
    // Convenience properties
    isMobile: deviceInfo.isMobile || deviceInfo.isMobileViewport,
    isTablet: deviceInfo.isTablet || deviceInfo.isTabletViewport,
    isDesktop: deviceInfo.isDesktop && deviceInfo.isDesktopViewport
  };
};

export default useMobileDetection;
