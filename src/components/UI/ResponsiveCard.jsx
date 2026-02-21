import PropTypes from 'prop-types';
import useResponsiveTheme from '../../hooks/useResponsiveTheme';

const ResponsiveCard = ({ 
  children, 
  variant = 'default',
  size = 'md',
  hover = true,
  border = true,
  shadow = true,
  className = '',
  onClick,
  ...props
}) => {
  const { 
    getResponsiveClasses, 
    getThemeClasses, 
    isMobile,
    getTouchTargetSize 
  } = useResponsiveTheme();

  const sizeClasses = {
    xs: getResponsiveClasses('p-2', 'p-3', 'p-4'),
    sm: getResponsiveClasses('p-3', 'p-4', 'p-5'),
    md: getResponsiveClasses('p-4', 'p-5', 'p-6'),
    lg: getResponsiveClasses('p-5', 'p-6', 'p-8'),
    xl: getResponsiveClasses('p-6', 'p-8', 'p-10')
  };

  const variantClasses = {
    default: getThemeClasses('card'),
    primary: getThemeClasses('primary'),
    secondary: getThemeClasses('secondary'),
    accent: getThemeClasses('accent'),
    outline: `bg-transparent border-2 ${getThemeClasses('outline').split(' ')[1]} ${getThemeClasses('outline').split(' ')[0]}`,
    ghost: 'bg-transparent hover:bg-white/5'
  };

  const baseClasses = getResponsiveClasses(
    'rounded-lg transition-all duration-200',
    'rounded-xl',
    'rounded-xl',
    'rounded-2xl'
  );

  const borderClass = border ? `border ${getThemeClasses('outline').split(' ')[1]}` : '';
  const shadowClass = shadow ? 'shadow-lg hover:shadow-xl' : '';
  const hoverClass = hover ? 'hover:scale-[1.02] hover:-translate-y-1' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  // Ensure minimum touch target for mobile
  const touchTargetClass = onClick && isMobile ? `min-h-[${getTouchTargetSize(true)}]` : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${borderClass}
        ${shadowClass}
        ${hoverClass}
        ${clickableClass}
        ${touchTargetClass}
        backdrop-blur-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'outline', 'ghost']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  border: PropTypes.bool,
  shadow: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default ResponsiveCard;