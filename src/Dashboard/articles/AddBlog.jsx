import React from 'react';
import BlogForm from './components/BlogForm';

const AddBlogPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        <BlogForm />
      </div>
    </div>
  );
};

export default AddBlogPage;