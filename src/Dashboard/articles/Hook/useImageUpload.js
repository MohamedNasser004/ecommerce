import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useImageUpload = (initialImage = null, initialPreview = null) => {
  const [image, setImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(initialPreview);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // تنظيف object URL عند unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validateImage = useCallback((file) => {
    if (!file) {
      return "الرجاء اختيار صورة";
    }

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return "نوع الملف غير مدعوم. الرجاء اختيار صورة (JPEG, PNG, GIF, WebP)";
    }

    // التحقق من حجم الملف (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "حجم الصورة يجب أن يكون أقل من 5 ميجابايت";
    }

    return "";
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    
    if (!file) {
      setImage(null);
      setImagePreview(null);
      setUploadError("");
      return null;
    }

    // التحقق من الصورة
    const error = validateImage(file);
    if (error) {
      setUploadError(error);
      toast.error(error);
      return null;
    }

    setUploadError("");
    setImage(file);

    // إنشاء معاينة للصورة
    const reader = new FileReader();
    reader.onloadstart = () => setIsUploading(true);
    reader.onloadend = () => setIsUploading(false);
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    return file;
  }, [validateImage]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (file) {
      const error = validateImage(file);
      if (error) {
        setUploadError(error);
        toast.error(error);
        return;
      }

      setUploadError("");
      setImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [validateImage]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const removeImage = useCallback(() => {
    // تنظيف object URL
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImage(null);
    setImagePreview(null);
    setUploadError("");
    
    // تنظيف حقل الإدخال
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  }, [imagePreview]);

  const uploadImage = useCallback(async () => {
    if (!image) {
      throw new Error("لا توجد صورة للرفع");
    }

    setIsUploading(true);
    
    try {
      // محاكاة رفع الصورة (استبدلها بـ API حقيقي)
      const formData = new FormData();
      formData.append('image', image);
      formData.append('type', 'blog');

      // هنا ضع كود رفع الصورة الفعلي
      // const response = await axios.post('your-upload-endpoint', formData);
      // return response.data.url;

      // لمحاكاة الرفع
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // محاكاة رابط الصورة
      const mockUrl = `https://picsum.photos/seed/${Date.now()}/800/450`;
      return mockUrl;
      
    } catch (error) {
      toast.error("فشل في رفع الصورة");
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [image]);

  return {
    image,
    imagePreview,
    uploadError,
    isUploading,
    handleFileChange,
    handleDrop,
    handleDragOver,
    removeImage,
    uploadImage,
    setImage,
    setImagePreview
  };
};