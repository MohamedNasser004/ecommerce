import React from 'react';
// ❌ احذف استيراد BlogContext
// import { useBlog } from '../../contexts/BlogContext';

// ✅ استبدلها بـ props
import TextArea from '../ComponentsReUsed/TextArea';
import { FiFileText, FiHash } from 'react-icons/fi';

const BlogSEO = ({ 
  metaDescription, 
  metaKeywords, 
  onMetaDescriptionChange, 
  onMetaKeywordsChange 
}) => {


  return (
    <div className="space-y-6">
      <div>
        <TextArea
          label="وصف Meta"
          icon={FiFileText}
          name="meta_description"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          maxLength={160}
          placeholder="وصف مختصر يظهر في نتائج محركات البحث..."
          showCharCount
          rows={4}
          helperText="الوصف المثالي بين 50-160 حرف"
        />
      </div>

      <div>
        <TextArea
          label="كلمات دلالية"
          icon={FiHash}
          name="meta_keywords"
          value={metaKeywords}
          onChange={(e) => onMetaKeywordsChange(e.target.value)}
          placeholder="الكلمات الدلالية مفصولة بفواصل..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default BlogSEO;