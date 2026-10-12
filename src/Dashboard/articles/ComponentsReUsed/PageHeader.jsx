import React from 'react';
import { FiArrowLeft, FiCalendar, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle, 
  backUrl,
  showDate = true,
  showAuthor = false,
  author,
  status,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {backUrl && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {status && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {status === 'draft' ? 'مسودة' : 'منشور'}
            </span>
          )}
          
          <div className="flex items-center gap-3">
            {showDate && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm">{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
            )}
            
            {showAuthor && author && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <FiUser className="w-4 h-4" />
                <span className="text-sm">{author}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;