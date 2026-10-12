import React from 'react';
import { FiEdit3, FiCode, FiImage, FiGlobe, FiSettings } from 'react-icons/fi';

const iconMap = {
  edit: FiEdit3,
  code: FiCode,
  image: FiImage,
  globe: FiGlobe,
  settings: FiSettings
};

const Card = ({ title, icon, children, className = '' }) => {
  const Icon = iconMap[icon] || FiEdit3;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;