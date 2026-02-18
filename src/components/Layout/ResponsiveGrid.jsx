import PropTypes from 'prop-types';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridClasses = `
    grid
    grid-cols-${cols.mobile}
    sm:grid-cols-${cols.tablet}
    lg:grid-cols-${cols.desktop}
    xl:grid-cols-${cols.wide}
    ${gapClasses[gap]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  cols: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
    wide: PropTypes.number
  }),
  gap: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default ResponsiveGrid;
