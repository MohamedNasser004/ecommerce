import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBlogForm } from './Hook/useBlogForm';
import BlogEditor from './components/BlogEditor';
import BlogSEO from './components/BlogSEO';
import BlogPublish from './components/BlogPublish';
import BlogImageUpload from './components/BlogImageUpload';
import Card from './ComponentsReUsed/Card';
import Input from './ComponentsReUsed/Input';
import Select from './ComponentsReUsed/Select';
import { FiFileText, FiLink, FiTag, FiLayout } from 'react-icons/fi';
import { CATEGORIES } from './utils/constants';

const UpdatePage = () => {
  const { slug } = useParams();
  
  const { 
    formData, 
    errors, 
    isSubmitting, 
    isLoading,
    imagePreview,
    handleChange, 
    handleGenerateSlug,
    handleImageChange,
    removeImage,
    updateBlog, // ✅ استخدم updateBlog بدلاً من handleSubmit
    fetchBlog
  } = useBlogForm();

  // جلب بيانات المقالة عند التحميل
  useEffect(() => {
    if (slug) {
      fetchBlog(slug);
    }
  }, [slug, fetchBlog]);

  // معالجة التحديث
  const handleUpdate = (e) => {
    e.preventDefault();
    updateBlog(e, slug); // ✅ مرر الـ slug هنا
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل المقالة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            تعديل المقالة
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            قم بتعديل المقالة والتعديلات المطلوبة
          </p>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* القسم الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* المعلومات الأساسية */}
            <Card title="المعلومات الأساسية" icon="edit">
              <div className="space-y-6">
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
            <Card title="صورة المقالة" icon="image">
              <BlogImageUpload 
                image={formData.image}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
                error={errors.image}
              />
            </Card>

            <Card title="إعدادات SEO" icon="globe">
              <BlogSEO 
                metaDescription={formData.meta_description}
                metaKeywords={formData.meta_keywords}
                onMetaDescriptionChange={(value) => handleChange('meta_description', value)}
                onMetaKeywordsChange={(value) => handleChange('meta_keywords', value)}
              />
            </Card>

            <Card title="النشر" icon="settings">
              <BlogPublish 
                status={formData.status}
                author={formData.author}
                onStatusChange={(status) => handleChange('status', status)}
                onAuthorChange={(author) => handleChange('author', author)}
                isSubmitting={isSubmitting}
                onSubmit={handleUpdate}
                buttonText="تحديث المقالة"
              />
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage;