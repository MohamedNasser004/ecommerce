import React from 'react';
import { FiUpload } from 'react-icons/fi';

const FileInput = ({
  label,
  id,
  name,
  onChange,
  accept = "image/*",
  error,
  helperText,
  required = false,
  className = '',
  maxSize,
  ...props
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file size if maxSize provided
    if (maxSize && file && file.size > maxSize) {
      if (onChange) onChange(null);
      return;
    }
    
    if (onChange) onChange(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange}
          accept={accept}
          className={`
            w-full p-3 rounded-lg border
            ${error 
              ? 'border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
            }
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            file:mr-4 file:py-2 file:px-4 
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-blue-900/30 dark:file:text-blue-300
            cursor-pointer
            transition-all duration-200
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      
      {maxSize && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          الحد الأقصى: {maxSize / (1024 * 1024)} ميجابايت
        </p>
      )}
    </div>
  );
};

export default FileInput;