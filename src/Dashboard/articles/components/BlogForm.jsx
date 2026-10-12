import React from 'react';
import { useBlogForm } from '../Hook/useBlogForm'; // ✅ استخدم Hook
import BlogEditor from './BlogEditor';
import BlogSEO from './BlogSEO';
import BlogPublish from './BlogPublish';
import BlogImageUpload from './BlogImageUpload';
import Card from '../ComponentsReUsed/Card';
import Input from '../ComponentsReUsed/Input';
import Select from '../ComponentsReUsed/Select';
import { FiFileText, FiLink, FiTag, FiLayout } from 'react-icons/fi';
import { CATEGORIES } from '../utils/constants';

const BlogForm = () => {
  // ✅ استخدام useBlogForm hook
  const { 
    formData, 
    errors, 
    isSubmitting, 
    imagePreview,
    handleChange, 
    handleGenerateSlug,
    handleImageChange,
    removeImage,
    handleSubmit 
  } = useBlogForm();

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* القسم الرئيسي */}
      <div className="lg:col-span-2 space-y-6">
        {/* المعلومات الأساسية */}
        <Card title="المعلومات الأساسية" icon="edit">
          <div className="space-y-6">
            {/* العنوان */}
            <Input
              label="عنوان المقالة"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="أدخل عنوان المقالة..."
              error={errors.title}
              icon={FiFileText}
              required
              maxLength={100}
              helperText={`${formData.title.length}/100`}
            />

            {/* الرابط المختصر */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  الرابط المختصر
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  توليد تلقائي
                </button>
              </div>
              <Input
                name="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="article-slug"
                error={errors.slug}
                icon={FiLink}
                required
              />
            </div>

            {/* التصنيف والوسوم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="التصنيف"
                name="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                options={CATEGORIES}
                icon={FiLayout}
                placeholder="اختر التصنيف"
                error={errors.category}
                required
              />
              
              <Input
                label="الوسوم"
                name="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="وسوم مفصولة بفواصل"
                icon={FiTag}
                helperText="مثال: تقنية، برمجة، تصميم"
              />
            </div>
          </div>
        </Card>

        {/* محرر النصوص */}
        <Card title="محتوى المقالة" icon="code">
          <BlogEditor 
            content={formData.content}
            onChange={(content) => handleChange('content', content)}
          />
        </Card>
      </div>

      {/* الشريط الجانبي */}
      <div className="space-y-6">
        {/* رفع الصورة */}
        <Card title="صورة المقالة" icon="image">
          <BlogImageUpload 
            image={formData.image}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            error={errors.image}
          />
        </Card>

        {/* إعدادات SEO */}
        <Card title="إعدادات SEO" icon="globe">
          <BlogSEO 
            metaDescription={formData.meta_description}
            metaKeywords={formData.meta_keywords}
            onMetaDescriptionChange={(value) => handleChange('meta_description', value)}
            onMetaKeywordsChange={(value) => handleChange('meta_keywords', value)}
          />
        </Card>

        {/* النشر */}
        <Card title="النشر" icon="settings">
          <BlogPublish 
            status={formData.status}
            author={formData.author}
            onStatusChange={(status) => handleChange('status', status)}
            onAuthorChange={(author) => handleChange('author', author)}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </form>
  );
};

export default BlogForm;