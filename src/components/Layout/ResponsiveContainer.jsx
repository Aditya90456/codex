import PropTypes from 'prop-types';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  fluid = false,
  noPadding = false 
}) => {
  const baseClasses = fluid ? 'container-fluid' : 'container';
  const paddingClasses = noPadding ? '' : 'px-4 md:px-6 lg:px-8';
  
  return (
    <div className={`${baseClasses} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  noPadding: PropTypes.bool
};

export default ResponsiveContainer;
