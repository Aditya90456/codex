/**
 * Responsive Utilities
 * Comprehensive utilities for responsive design and theming
 */

// Breakpoint definitions (matching Tailwind config)
export const breakpoints = {
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

// Device type detection
export const getDeviceType = (width) => ({
  isMobile: width < breakpoints.md,
  isSmallMobile: width < breakpoints.xsm,
  isMediumMobile: width >= breakpoints.xsm && width < breakpoints.sm,
  isTablet: width >= breakpoints.md && width < breakpoints.lg,
  isDesktop: width >= breakpoints.lg && width < breakpoints['2xl'],
  isLargeDesktop: width >= breakpoints['2xl']
});

// Responsive class generator
export const generateResponsiveClasses = (baseClasses, mobileClasses, tabletClasses, desktopClasses) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const device = getDeviceType(width);
  
  let classes = baseClasses;
  
  if (device.isMobile && mobileClasses) {
    classes
 += ` ${mobileClasses}`;  
 
  } else if (device.isTablet && tabletClasses) {

    classes += ` ${tabletClasses}`;

  } else if (device.isDesktop && desktopClasses) {

    classes += ` ${desktopClasses}`;

  } 
  
  return classes;

  