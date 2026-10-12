import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "اختر...",
  error,
  helperText,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`
              w-full p-3 rounded-lg border appearance-none
              ${Icon ? 'pr-10' : ''}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2
              transition-all duration-200
              cursor-pointer
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option 
                key={option.id || option.value} 
                value={option.value || option.id}
              >
                {option.name || option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FiChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Select;