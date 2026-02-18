import PropTypes from 'prop-types';

const ResponsiveInput = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            touch-input
            w-full
            bg-white/5
            border
            ${error ? 'border-red-500' : 'border-white/10'}
            rounded-lg
            text-white
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
            focus:border-transparent
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-all
            ${Icon ? 'pl-11' : 'pl-4'}
            pr-4
            py-3
            text-base
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

ResponsiveInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string
};

export default ResponsiveInput;
