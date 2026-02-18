/**
 * Fix for mobile viewport height issues
 * Handles dynamic address bar on mobile browsers
 */

export const initViewportFix = () => {
  // Set CSS variable for actual viewport height
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Initial set
  setVH();

  // Update on resize
  window.addEventListener('resize', setVH);
  
  // Update on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  });

  // iOS specific fixes
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Prevent zoom on input focus
    const addMaximumScaleToMetaViewport = () => {
      const el = document.querySelector('meta[name=viewport]');
      if (el !== null) {
        let content = el.getAttribute('content');
        const re = /maximum-scale=[0-9.]+/g;
        if (re.test(content)) {
          content = content.replace(re, 'maximum-scale=1.0');
        } else {
          content = [content, 'maximum-scale=1.0'].join(', ');
        }
        el.setAttribute('content', content);
      }
    };

    const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

    // Check if device is in standalone mode
    const checkIsIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
    const checkIsStandalone = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    if (checkIsIOS() && !checkIsStandalone()) {
      disableIosTextFieldZoom();
    }
  }

  // Android specific fixes
  if (/Android/.test(navigator.userAgent)) {
    // Fix for Android keyboard
    const originalHeight = window.innerHeight;
    window.addEventListener('resize', () => {
      if (window.innerHeight < originalHeight) {
        // Keyboard is likely open
        document.body.classList.add('keyboard-open');
      } else {
        document.body.classList.remove('keyboard-open');
      }
    });
  }

  // Prevent pull-to-refresh on mobile
  document.body.style.overscrollBehavior = 'none';

  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
  };
};

/**
 * Get safe area insets for notched devices
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
  };
};

/**
 * Detect if device has a notch
 */
export const hasNotch = () => {
  const insets = getSafeAreaInsets();
  return insets.top > 0 || insets.bottom > 0;
};

/**
 * Lock scroll (useful for modals)
 */
export const lockScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};

/**
 * Unlock scroll
 */
export const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
};

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
