import React from 'react';
import { useImageUpload } from '../Hook/useImageUpload';
import { FiUpload, FiX, FiHelpCircle } from 'react-icons/fi';
import ImagePreview from './ImagePreview';
import FileInput from '../ComponentsReUsed/FileInput';

const BlogImageUpload = () => {
  const { imagePreview, handleFileChange, removeImage, uploadError } = useImageUpload();

  return (
    <>
      {imagePreview ? (
        <ImagePreview 
          src={imagePreview} 
          onRemove={removeImage} 
        />
      ) : (
        <UploadArea onClick={() => document.getElementById("image").click()} />
      )}

      <FileInput
        id="image"
        onChange={handleFileChange}
        accept="image/*"
        maxSize={5 * 1024 * 1024}
        error={uploadError}
      />

      <ImageGuidelines />
    </>
  );
};

const UploadArea = ({ onClick }) => (
  <div className="mb-6">
    <div 
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        انقر لرفع صورة المقالة
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        PNG, JPG, GIF حتى 5MB
      </p>
    </div>
  </div>
);

const ImageGuidelines = () => (
  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
      <FiHelpCircle className="w-4 h-4" />
      نصائح للصورة
    </h4>
    <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
      <li>• استخدم صور عالية الجودة</li>
      <li>• نسب الصورة المثالية 16:9</li>
      <li>• تجنب الصور ذات النصوص</li>
      <li>• حجم مثالي: 1200×675 بكسل</li>
    </ul>
  </div>
);

export default BlogImageUpload;