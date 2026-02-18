/**
 * Mobile Detection Utility
 * Comprehensive mobile device and browser detection
 */

/**
 * Check if device is mobile based on user agent
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

/**
 * Check if device is iOS
 */
export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Check if device is Android
 */
export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
};

/**
 * Check if device is tablet
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isTabletUA = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
  
  return isTabletUA;
};

/**
 * Check if device is phone
 */
export const isPhone = () => {
  return isMobileDevice() && !isTablet();
};

/**
 * Check if device has touch support
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get device type
 */
export const getDeviceType = () => {
  if (isPhone()) return 'phone';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * Check if viewport is mobile size
 */
export const isMobileViewport = () => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth < 768;
};

/**
 * Check if viewport is tablet size
 */
export const isTabletViewport = () => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if viewport is desktop size
 */
export const isDesktopViewport = () => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth >= 1024;
};

/**
 * Get viewport size category
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 640) return 'mobile';
  if (width < 768) return 'mobile-large';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'desktop';
  if (width < 1536) return 'desktop-large';
  return 'desktop-xl';
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false;
  
  return window.innerWidth > window.innerHeight;
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return false;
  
  return window.innerHeight > window.innerWidth;
};

/**
 * Get device orientation
 */
export const getOrientation = () => {
  return isLandscape() ? 'landscape' : 'portrait';
};

/**
 * Check if browser is Safari
 */
export const isSafari = () => {
  if (typeof window === 'undefined') return false;
  
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Check if browser is Chrome
 */
export const isChrome = () => {
  if (typeof window === 'undefined') return false;
  
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
};

/**
 * Check if browser is Firefox
 */
export const isFirefox = () => {
  if (typeof window === 'undefined') return false;
  
  return /Firefox/.test(navigator.userAgent);
};

/**
 * Check if browser is Edge
 */
export const isEdge = () => {
  if (typeof window === 'undefined') return false;
  
  return /Edg/.test(navigator.userAgent);
};

/**
 * Get browser name
 */
export const getBrowserName = () => {
  if (isEdge()) return 'edge';
  if (isChrome()) return 'chrome';
  if (isSafari()) return 'safari';
  if (isFirefox()) return 'firefox';
  return 'unknown';
};

/**
 * Check if device supports hover
 */
export const supportsHover = () => {
  if (typeof window === 'undefined') return true;
  
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Check if device is standalone (PWA)
 */
export const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

/**
 * Get device pixel ratio
 */
export const getPixelRatio = () => {
  if (typeof window === 'undefined') return 1;
  
  return window.devicePixelRatio || 1;
};

/**
 * Check if device has high DPI
 */
export const isHighDPI = () => {
  return getPixelRatio() > 1;
};

/**
 * Get device memory (if available)
 */
export const getDeviceMemory = () => {
  if (typeof navigator === 'undefined') return null;
  
  return navigator.deviceMemory || null;
};

/**
 * Get hardware concurrency (CPU cores)
 */
export const getHardwareConcurrency = () => {
  if (typeof navigator === 'undefined') return null;
  
  return navigator.hardwareConcurrency || null;
};

/**
 * Check if device is low-end
 */
export const isLowEndDevice = () => {
  const memory = getDeviceMemory();
  const cores = getHardwareConcurrency();
  
  if (memory !== null && memory <= 4) return true;
  if (cores !== null && cores <= 2) return true;
  
  return false;
};

/**
 * Get connection type
 */
export const getConnectionType = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return null;
  
  return navigator.connection.effectiveType || null;
};

/**
 * Check if connection is slow
 */
export const isSlowConnection = () => {
  const connection = getConnectionType();
  
  if (!connection) return false;
  
  return connection === 'slow-2g' || connection === '2g';
};

/**
 * Check if data saver is enabled
 */
export const isDataSaverEnabled = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  
  return navigator.connection.saveData === true;
};

/**
 * Get comprehensive device info
 */
export const getDeviceInfo = () => {
  return {
    // Device type
    isMobile: isMobileDevice(),
    isPhone: isPhone(),
    isTablet: isTablet(),
    isDesktop: !isMobileDevice(),
    deviceType: getDeviceType(),
    
    // Operating system
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    
    // Viewport
    isMobileViewport: isMobileViewport(),
    isTabletViewport: isTabletViewport(),
    isDesktopViewport: isDesktopViewport(),
    viewportSize: getViewportSize(),
    
    // Orientation
    isLandscape: isLandscape(),
    isPortrait: isPortrait(),
    orientation: getOrientation(),
    
    // Browser
    browser: getBrowserName(),
    isSafari: isSafari(),
    isChrome: isChrome(),
    isFirefox: isFirefox(),
    isEdge: isEdge(),
    
    // Capabilities
    isTouchDevice: isTouchDevice(),
    supportsHover: supportsHover(),
    isStandalone: isStandalone(),
    
    // Performance
    pixelRatio: getPixelRatio(),
    isHighDPI: isHighDPI(),
    deviceMemory: getDeviceMemory(),
    hardwareConcurrency: getHardwareConcurrency(),
    isLowEndDevice: isLowEndDevice(),
    
    // Network
    connectionType: getConnectionType(),
    isSlowConnection: isSlowConnection(),
    isDataSaverEnabled: isDataSaverEnabled(),
    
    // Dimensions
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0
  };
};

/**
 * Add device classes to body
 */
export const addDeviceClasses = () => {
  if (typeof document === 'undefined') return;
  
  const info = getDeviceInfo();
  const classes = [];
  
  // Device type
  classes.push(`device-${info.deviceType}`);
  
  // OS
  if (info.isIOS) classes.push('os-ios');
  if (info.isAndroid) classes.push('os-android');
  
  // Viewport
  classes.push(`viewport-${info.viewportSize}`);
  
  // Orientation
  classes.push(`orientation-${info.orientation}`);
  
  // Browser
  classes.push(`browser-${info.browser}`);
  
  // Capabilities
  if (info.isTouchDevice) classes.push('touch-device');
  if (!info.supportsHover) classes.push('no-hover');
  if (info.isStandalone) classes.push('standalone');
  
  // Performance
  if (info.isLowEndDevice) classes.push('low-end-device');
  if (info.isHighDPI) classes.push('high-dpi');
  
  // Network
  if (info.isSlowConnection) classes.push('slow-connection');
  if (info.isDataSaverEnabled) classes.push('data-saver');
  
  // Add classes to body
  document.body.classList.add(...classes);
};

/**
 * Initialize mobile detection
 */
export const initMobileDetection = () => {
  if (typeof window === 'undefined') return;
  
  // Add device classes
  addDeviceClasses();
  
  // Update on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Remove old classes
      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('viewport-') && !c.startsWith('orientation-'))
        .join(' ');
      
      // Add new classes
      const info = getDeviceInfo();
      document.body.classList.add(`viewport-${info.viewportSize}`);
      document.body.classList.add(`orientation-${info.orientation}`);
    }, 100);
  });
  
  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const info = getDeviceInfo();
      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('orientation-'))
        .join(' ');
      document.body.classList.add(`orientation-${info.orientation}`);
    }, 100);
  });
};

export default {
  isMobileDevice,
  isIOS,
  isAndroid,
  isTablet,
  isPhone,
  isTouchDevice,
  getDeviceType,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  getViewportSize,
  isLandscape,
  isPortrait,
  getOrientation,
  isSafari,
  isChrome,
  isFirefox,
  isEdge,
  getBrowserName,
  supportsHover,
  isStandalone,
  getPixelRatio,
  isHighDPI,
  getDeviceMemory,
  getHardwareConcurrency,
  isLowEndDevice,
  getConnectionType,
  isSlowConnection,
  isDataSaverEnabled,
  getDeviceInfo,
  addDeviceClasses,
  initMobileDetection
};
