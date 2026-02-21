import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useResponsive } from './useResponsive';

/**
 * Enhanced hook that combines responsive design with theming
 * Provides adaptive styling based on device type and current theme
 */
const useResponsiveTheme = () => {
  const { currentTheme, themes, applyTheme } = useTheme();
  const { deviceType, windowSize, orientation } = useResponsive();
  
  const [adaptiveStyles, setAdaptiveStyles] = useState({});

  useEffect(() => {
    const theme = themes[currentTheme];
    if (!theme) return;

    // Generate adaptive styles based on device and theme
    const styles = {
      // Container styles
      container: {
        padding: deviceType.isMobile ? '1rem' : deviceType.isTablet ? '1.5rem' : '2rem',
        maxWidth: deviceType.isMobile ? '100%' : deviceType.isTablet ? '768px' : '1400px',
        background: `linear-gradient(135deg, ${theme.background})`,
      },
      
      // Card styles
      card: {
        padding: deviceType.isMobile ? '1rem' : '1.5rem',
        borderRadius: deviceType.isMobile ? '0.75rem' : '1rem',
        background: `linear-gradient(135deg, ${theme.card})`,
        border: `1px solid ${theme.border}`,
        backdropFilter: 'blur(10px)',
      },
      
      // Button styles
      button: {
        minHeight: deviceType.isMobile ? '44px' : '48px',
        padding: deviceType.isMobile ? '0.75rem 1rem' : '0.875rem 1.5rem',
        fontSize: deviceType.isMobile ? '0.875rem' : '1rem',
        borderRadius: '0.75rem',
      },
      
      // Text styles
      text: {
        primary: theme.text,
        secondary: theme.textSecondary,
        fontSize: {
          xs: deviceType.isMobile ? '0.75rem' : '0.875rem',
          sm: deviceType.isMobile ? '0.875rem' : '1rem',
          base: deviceType.isMobile ? '1rem' : '1.125rem',
          lg: deviceType.isMobile ? '1.125rem' : '1.25rem',
          xl: deviceType.isMobile ? '1.25rem' : '1.5rem',
        }
      },
      
      // Grid styles
      grid: {
        columns: deviceType.isMobile ? 1 : deviceType.isTablet ? 2 : 3,
        gap: deviceType.isMobile ? '1rem' : '1.5rem',
      },
      
      // Modal styles
      modal: {
        width: deviceType.isMobile ? '95vw' : deviceType.isTablet ? '80vw' : '60vw',
        maxHeight: deviceType.isMobile ? '90vh' : '80vh',
        padding: deviceType.isMobile ? '1rem' : '2rem',
      },
      
      // Navigation styles
      navigation: {
        height: deviceType.isMobile ? '60px' : '80px',
        padding: deviceType.isMobile ? '0 1rem' : '0 2rem',
        position: deviceType.isMobile ? 'fixed' : 'sticky',
        bottom: deviceType.isMobile ? '0' : 'auto',
        top: deviceType.isMobile ? 'auto' : '0',
      }
    };

    setAdaptiveStyles(styles);
  }, [currentTheme, themes, deviceType, windowSize]);

  // Utility functions for responsive theme classes
  const getResponsiveClasses = (baseClasses = '', mobileClasses = '', tabletClasses = '', desktopClasses = '') => {
    let classes = baseClasses;
    
    if (deviceType.isMobile && mobileClasses) {
      classes += ` ${mobileClasses}`;
    } else if (deviceType.isTablet && tabletClasses) {
      classes += ` ${tabletClasses}`;
    } else if (deviceType.isDesktop && desktopClasses) {
      classes += ` ${desktopClasses}`;
    }
    
    return classes.trim();
  };

  const getThemeClasses = (variant = 'primary') => {
    const theme = themes[currentTheme];
    if (!theme) return '';

    const variants = {
      primary: `bg-gradient-to-r ${theme.primary} text-white`,
      secondary: `bg-gradient-to-r ${theme.secondary} text-white`,
      accent: `bg-gradient-to-r ${theme.accent} text-white`,
      background: `bg-gradient-to-r ${theme.background} ${theme.text}`,
      card: `bg-gradient-to-r ${theme.card} ${theme.text} ${theme.border}`,
      outline: `border-2 ${theme.border} ${theme.text} bg-transparent hover:${theme.card.replace('to-', 'hover:to-')}`,
      ghost: `${theme.text} hover:${theme.card.replace('to-', 'hover:to-')} bg-transparent`,
    };

    return variants[variant] || variants.primary;
  };

  const getResponsiveSize = (sizes = {}) => {
    const { mobile = 'sm', tablet = 'md', desktop = 'lg' } = sizes;
    
    if (deviceType.isMobile) return mobile;
    if (deviceType.isTablet) return tablet;
    return desktop;
  };

  const getAdaptivePadding = (scale = 1) => {
    const basePadding = deviceType.isMobile ? 16 : deviceType.isTablet ? 24 : 32;
    return `${basePadding * scale}px`;
  };

  const getAdaptiveFontSize = (size = 'base') => {
    return adaptiveStyles.text?.fontSize?.[size] || '1rem';
  };

  const getTouchTargetSize = (comfortable = false) => {
    if (deviceType.isMobile) {
      return comfortable ? '48px' : '44px';
    }
    return comfortable ? '40px' : '36px';
  };

  // CSS-in-JS helper for dynamic styles
  const createResponsiveStyle = (mobileStyle = {}, tabletStyle = {}, desktopStyle = {}) => {
    if (deviceType.isMobile) return { ...mobileStyle };
    if (deviceType.isTablet) return { ...tabletStyle };
    return { ...desktopStyle };
  };

  // Breakpoint utilities
  const breakpoints = {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    isSmallMobile: windowSize.width < 375,
    isMediumMobile: windowSize.width >= 375 && windowSize.width < 640,
    isLargeDesktop: windowSize.width >= 1536,
  };

  return {
    // Theme data
    currentTheme,
    themes,
    adaptiveStyles,
    
    // Device data
    deviceType,
    windowSize,
    orientation,
    breakpoints,
    
    // Utility functions
    getResponsiveClasses,
    getThemeClasses,
    getResponsiveSize,
    getAdaptivePadding,
    getAdaptiveFontSize,
    getTouchTargetSize,
    createResponsiveStyle,
    
    // Quick access helpers
    isMobile: deviceType.isMobile,
    isTablet: deviceType.isTablet,
    isDesktop: deviceType.isDesktop,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
  };
};

export default useResponsiveTheme;