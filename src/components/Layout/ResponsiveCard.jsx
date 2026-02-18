import PropTypes from 'prop-types';

const ResponsiveCard = ({ 
  children, 
  className = '',
  hover = true,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-10'
  };

  const hoverClasses = hover 
    ? 'hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 cursor-pointer' 
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`
        card-responsive
        ${paddingClasses[padding]}
        ${hoverClasses}
        ${clickableClasses}
        transition-all duration-300
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  onClick: PropTypes.func
};

export default ResponsiveCard;
