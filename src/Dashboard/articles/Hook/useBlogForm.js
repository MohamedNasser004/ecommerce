import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { validateBlogForm, generateSlug } from '../utils/validation';

export const useBlogForm = (initialData = null) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: null,
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
    slug: initialData?.slug || '',
    status: initialData?.status || 'draft',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    author: initialData?.author || localStorage.getItem('userName') || 'مدير الموقع'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ أضف هذا
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);

  // ✅ دالة جلب مقالة واحدة
  const fetchBlog = useCallback(async (slug) => {
    setIsLoading(true); // ✅ استخدم setIsLoading
    try {
      const response = await axios.get(
        `http://localhost:3001/api/articles/${slug}`,
        {
          headers: {
            //'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('API Response:', response.data); // للتصحيح

      if (response.data) {
        const blog = response.data; // تحقق من هيكل الاستجابة
        
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          image: null, // نتركه null لأن المستخدم قد يغير الصورة
          meta_description: blog.meta_description || '',
          meta_keywords: blog.meta_keywords || '',
          slug: blog.slug || '',
          status: blog.status || 'draft',
          category: blog.category || '',
          tags: blog.tags || '',
          author: blog.author || localStorage.getItem('userName') || 'مدير الموقع'
        });

        // عرض معاينة الصورة الحالية
        if (blog.image) {
          setImagePreview(blog.image);
        }
        
        toast.success('تم تحميل المقالة بنجاح');
      } else {
        toast.error('المقالة غير موجودة');
      }
    } catch (error) {
      console.error('Error fetching blog:', error.response || error);
      toast.error('حدث خطأ في تحميل المقالة');
    } finally {
      setIsLoading(false); // ✅ استخدم setIsLoading
    }
  }, []);

  // ✅ دالة تحديث المقالة
  const updateBlog = useCallback(async (e, id) => {
    if (e) e.preventDefault();
    
    // التحقق من النموذج
    const validationErrors = validateBlogForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('الرجاء تصحيح الأخطاء في النموذج');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          // إذا كانت الصورة من النوع File أضفها، وإلا إذا كانت رابط أضفها كـ image_url
          if (key === 'image' && formData[key] instanceof File) {
            formDataToSend.append('image', formData[key]);
          } else if (key === 'image' && typeof formData[key] === 'string') {
            formDataToSend.append('image_url', formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      console.log('Updating article with ID:', id);
      console.log('Form data keys:', Array.from(formDataToSend.keys()));

      const response = await axios.put(
        `http://localhost:3001/api/articles/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        toast.success('تم تحديث المقالة بنجاح!');
        
        setTimeout(() => {
          navigate('/dashboard/articles');
        }, 2000);
      } else {
        toast.error(response.data.message || 'حدث خطأ أثناء التحديث');
      }
    } catch (error) {
      console.error('Error updating blog:', error.response || error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث المقالة');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate]);

  // ✅ بقية الدوال كما هي
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleGenerateSlug = useCallback(() => {
    if (!formData.title.trim()) {
      toast.error('الرجاء إدخال العنوان أولاً');
      return;
    }
    
    const slug = generateSlug(formData.title);
    setFormData(prev => ({ ...prev, slug }));
    toast.success('تم توليد الرابط المختصر');
  }, [formData.title]);

  const handleImageChange = useCallback((file) => {
    if (!file) return null;
    
    setFormData(prev => ({ ...prev, image: file }));
    
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    return previewUrl;
  }, []);

  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, image: null }));
    
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    const validationErrors = validateBlogForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('الرجاء تصحيح الأخطاء في النموذج');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:3001/api/articles/add",
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success("تمت إضافة المقالة بنجاح!");
        
        // Reset form
        setFormData({
          title: "",
          content: "",
          image: null,
          meta_description: "",
          meta_keywords: "",
          slug: "",
          status: "draft",
          category: "",
          tags: "",
          author: localStorage.getItem('userName') || "مدير الموقع"
        });
        
        setImagePreview(null);
        setErrors({});
        
        setTimeout(() => {
          navigate('/dashboard/articles');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('حدث خطأ أثناء إضافة المقالة');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate]);

  return {
    formData,
    errors,
    isSubmitting,
    isLoading, // ✅ أضف هذا
    imagePreview,
    handleChange,
    handleGenerateSlug,
    handleImageChange,
    removeImage,
    handleSubmit,
    fetchBlog,
    updateBlog // ✅ أضف هذا
  };
};