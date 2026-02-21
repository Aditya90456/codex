import PropTypes from 'prop-types';
import useResponsiveTheme from '../../hooks/useResponsiveTheme';

const ResponsiveLayout = ({ 
  children, 
  variant = 'default',
  padding = 'normal',
  maxWidth = 'container',
  background = 'default',
  className = ''
}) => {
  const { 
    getResponsiveClasses, 
    getThemeClasses, 
    adaptiveStyles,
    isMobile,
    isTablet 
  } = useResponsiveTheme();

  const paddingClasses = {
    none: 'p-0',
    tight: getResponsiveClasses('p-2', 'p-4', 'p-6', 'p-8'),
    normal: getResponsiveClasses('p-4', 'p-6', 'p-8', 'p-10'),
    loose: getResponsiveClasses('p-6', 'p-8', 'p-10', 'p-12'),
    custom: ''
  };

  const maxWidthClasses = {
    none: 'max-w-none',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    container: 'max-w-7xl',
    full: 'max-w-full'
  };

  const backgroundClasses = {
    default: getThemeClasses('background'),
    card: getThemeClasses('card'),
    transparent: 'bg-transparent',
    primary: getThemeClasses('primary'),
    secondary: getThemeClasses('secondary')
  };

  const variantClasses = {
    default: 'min-h-screen',
    page: 'min-h-[calc(100vh-80px)]',
    section: 'min-h-0',
    card: `rounded-xl border ${getThemeClasses('outline').split(' ')[1]} backdrop-blur-lg`,
    modal: 'rounded-2xl shadow-2xl backdrop-blur-lg'
  };

  return (
    <div className={getResponsiveClasses(
      `w-full mx-auto ${variantClasses[variant]} ${backgroundClasses[background]} ${paddingClasses[padding]} ${maxWidthClasses[maxWidth]} ${className}`,
      isMobile ? 'px-4' : '',
      isTablet ? 'px-6' : '',
      'px-8'
    )}>
      {children}
    </div>
  );
};

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'page', 'section', 'card', 'modal']),
  padding: PropTypes.oneOf(['none', 'tight', 'normal', 'loose', 'custom']),
  maxWidth: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', '4xl', '6xl', 'container', 'full']),
  background: PropTypes.oneOf(['default', 'card', 'transparent', 'primary', 'secondary']),
  className: PropTypes.string
};

export default ResponsiveLayout;