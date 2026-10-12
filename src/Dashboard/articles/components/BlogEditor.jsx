import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { uploadPlugin } from '../utils/uploadAdapter';
import { FiEye, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const BlogEditor = ({ content, onChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isFullscreen ? (
            <FiMinimize2 className="w-5 h-5" />
          ) : (
            <FiMaximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="ckeditor-container border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <CKEditor
          editor={ClassicEditor}
          data={content}
          config={getEditorConfig()}
          onChange={(event, editor) => onChange(editor.getData())}
        />
      </div>

      {content && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FiEye className="w-5 h-5" />
            معاينة المحتوى
          </h4>
          <div 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
};

const getEditorConfig = () => ({
  extraPlugins: [uploadPlugin],
  language: 'ar',
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'link',
      'bulletedList', 'numberedList', '|',
      'alignment', '|',
      'uploadImage', 'blockQuote',
      'insertTable', 'mediaEmbed', '|',
      'undo', 'redo'
    ]
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ]
  },
  contentsLangDirection: 'rtl',
  height: '400px'
});

export default BlogEditor;