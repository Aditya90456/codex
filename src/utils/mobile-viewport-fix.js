/**
 * Mobile Viewport Height Fix
 * Handles viewport height issues on iOS and Android
 * Especially useful for address bar hiding/showing
 * Now supports ultra-small screens (240px+)
 */

export function initMobileViewportFix() {
  // Only run on mobile devices
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return;
  }

  // Set CSS variable for viewport height
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Add class for ultra-small screens (240px and below)
    if (window.innerWidth <= 240) {
      document.documentElement.classList.add('ultra-small-screen');
      document.body.classList.add('ultra-small-screen');
    } else {
      document.documentElement.classList.remove('ultra-small-screen');
      document.body.classList.remove('ultra-small-screen');
    }
    
    // Add class for very small screens (320px and below)
    if (window.innerWidth <= 320) {
      document.documentElement.classList.add('very-small-screen');
      document.body.classList.add('very-small-screen');
    } else {
      document.documentElement.classList.remove('very-small-screen');
      document.body.classList.remove('very-small-screen');
    }
  }

  // Initial set
  setViewportHeight();

  // Update on resize (throttled)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setViewportHeight();
    }, 100);
  });

  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
  });

  // Android-specific: Update on scroll (for address bar)
  if (/Android/i.test(navigator.userAgent)) {
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setViewportHeight();
      }, 200);
    }, { passive: true });
  }
}

/**
 * Detect if running in Android WebView
 */
export function isAndroidWebView() {
  const ua = navigator.userAgent.toLowerCase();
  return /android/i.test(ua) && /wv|version\/\d+\.\d+/i.test(ua);
}

/**
 * Detect if running in iOS WebView
 */
export function isIOSWebView() {
  const ua = navigator.userAgent.toLowerCase();
  return /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua);
}

/**
 * Detect if running as PWA
 */
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Get device type
 */
export function getDeviceType() {
  const ua = navigator.userAgent;
  
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'ios';
  } else if (/Android/.test(ua)) {
    return 'android';
  } else if (/Windows Phone/.test(ua)) {
    return 'windows-phone';
  }
  
  return 'desktop';
}

/**
 * Prevent iOS rubber band scrolling
 */
export function preventIOSRubberBand() {
  if (getDeviceType() !== 'ios') return;

  let startY = 0;
  
  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].pageY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Prevent pull-to-refresh at top
    if (scrollTop === 0 && y > startY) {
      e.preventDefault();
    }

    // Prevent overscroll at bottom
    if (scrollTop + clientHeight >= scrollHeight && y < startY) {
      e.preventDefault();
    }
  }, { passive: false });
}

/**
 * Fix Android keyboard resize issues
 */
export function fixAndroidKeyboard() {
  if (getDeviceType() !== 'android') return;

  const originalHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    
    // Keyboard is likely open if height decreased significantly
    if (currentHeight < originalHeight * 0.75) {
      document.body.classList.add('keyboard-open');
    } else {
      document.body.classList.remove('keyboard-open');
    }
  });
}

/**
 * Disable pinch zoom on mobile
 */
export function disablePinchZoom() {
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  });

  document.addEventListener('gestureend', (e) => {
    e.preventDefault();
  });
}

/**
 * Initialize all mobile fixes
 */
export function initAllMobileFixes() {
  initMobileViewportFix();
  
  if (getDeviceType() === 'ios') {
    preventIOSRubberBand();
  }
  
  if (getDeviceType() === 'android') {
    fixAndroidKeyboard();
  }
}

export default {
  initMobileViewportFix,
  isAndroidWebView,
  isIOSWebView,
  isPWA,
  getDeviceType,
  preventIOSRubberBand,
  fixAndroidKeyboard,
  disablePinchZoom,
  initAllMobileFixes
};
