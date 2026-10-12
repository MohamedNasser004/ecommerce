import React from 'react';
import { FiX } from 'react-icons/fi';

const ImagePreview = ({ src, onRemove }) => {
  return (
    <div className="mb-4">
      <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md">
        <img
          src={src}
          alt="معاينة الصورة"
          className="w-full h-48 object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
          aria-label="إزالة الصورة"
        >
          <FiX className="w-4 h-4" />
        </button>
        
        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white text-xs">معاينة الصورة</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;