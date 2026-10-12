import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const blogService = {
  createBlog: async (formData) => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/articles/add`,
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
        return response.data;
      } else {
        throw new Error(response.data.message || "حدث خطأ أثناء إضافة المقالة.");
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('type', 'ckeditor');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.url) {
        return response.data.url;
      } else {
        throw new Error('Image upload failed: no URL returned');
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

const handleApiError = (error) => {
  if (error.response?.status === 401) {
    toast.error("غير مصرح بالوصول. الرجاء تسجيل الدخول مرة أخرى.");
  } else if (error.response?.data?.message?.includes('slug')) {
    toast.error("الرابط المختصر مستخدم مسبقاً. الرجاء اختيار رابط آخر.");
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error("حدث خطأ أثناء الاتصال بالخادم.");
  }
};

export default blogService;