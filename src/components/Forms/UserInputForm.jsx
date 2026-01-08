import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';

const UserInputForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  title = "User Information"
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    bio: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Invalid email format' : '';
      
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return value && !phoneRegex.test(value) ? 'Invalid phone number' : '';
      
      case 'dateOfBirth':
        if (value) {
          const date = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age < 13 || age > 120 ? 'Invalid age' : '';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const InputField = ({ 
    name, 
    label, 
    type = 'text', 
    icon: Icon, 
    placeholder, 
    required = false,
    rows 
  }) => {
    const hasError = touched[name] && errors[name];
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          {rows ? (
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={rows}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } text-gray-900 dark:text-gray-100`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              } text-gray-900 dark:text-gray-100`}
            />
          )}
        </div>
        {hasError && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="firstName"
            label="First Name"
            icon={User}
            placeholder="Enter your first name"
            required
          />
          <InputField
            name="lastName"
            label="Last Name"
            icon={User}
            placeholder="Enter your last name"
            required
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <InputField
            name="email"
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="Enter your email address"
            required
          />
          <InputField
            name="phone"
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            icon={Calendar}
          />
          <InputField
            name="country"
            label="Country"
            icon={MapPin}
            placeholder="Enter your country"
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <InputField
            name="address"
            label="Address"
            icon={MapPin}
            placeholder="Enter your address"
          />
          <InputField
            name="city"
            label="City"
            icon={MapPin}
            placeholder="Enter your city"
          />
        </div>

        {/* Bio */}
        <InputField
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
          rows={4}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Information'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Form Summary */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Form Status</h3>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p>Required fields: {Object.keys(errors).length === 0 ? '✓ Complete' : '⚠ Incomplete'}</p>
          <p>Total fields: {Object.keys(formData).length}</p>
          <p>Filled fields: {Object.values(formData).filter(v => v.toString().trim()).length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;