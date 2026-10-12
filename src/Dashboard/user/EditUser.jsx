import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import toast from 'react-hot-toast';
import {
  FiSave,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiShield
} from 'react-icons/fi';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const lang = localStorage.getItem("lang") || "ar";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      const data = await response.json();
      const user = data.data || data;
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user'
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      toast.error(lang === "ar" ? "فشل تحميل بيانات المستخدم" : "Failed to load user data");
      navigate('/dashboard/users');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push(lang === "ar" ? "الاسم مطلوب" : "Name is required");
    }

    if (!formData.email.trim()) {
      errors.push(lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push(lang === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email format");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        role: formData.role
      };

      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to update user');
      }

      toast.success(lang === "ar" ? "تم تحديث المستخدم بنجاح" : "User updated successfully");
      
      // Navigate back to users list
      setTimeout(() => {
        navigate('/dashboard/users');
      }, 1500);

    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.message || (lang === "ar" ? "حدث خطأ أثناء تحديث المستخدم" : "Error updating user"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">
          {lang === "ar" ? "جاري تحميل بيانات المستخدم..." : "Loading user data..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6 transition-colors duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {lang === "ar" ? "تعديل المستخدم" : "Edit User"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "تعديل بيانات المستخدم" : "Edit user information"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Information Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            <FiUser className="w-5 h-5" />
            {lang === "ar" ? "معلومات المستخدم" : "User Information"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiUser className="inline-block w-4 h-4 ml-1" />
                {lang === "ar" ? "الاسم الكامل" : "Full Name"} *
              </label>
              <input
                type="text"
                name="name"
                placeholder={lang === "ar" ? "أدخل الاسم الكامل" : "Enter full name"}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiMail className="inline-block w-4 h-4 ml-1" />
                {lang === "ar" ? "البريد الإلكتروني" : "Email"} *
              </label>
              <input
                type="email"
                name="email"
                placeholder={lang === "ar" ? "example@domain.com" : "example@domain.com"}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiPhone className="inline-block w-4 h-4 ml-1" />
                {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder={lang === "ar" ? "+1234567890" : "+1234567890"}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
              />
            </div>

            {/* Role */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiShield className="inline-block w-4 h-4 ml-1" />
                {lang === "ar" ? "الدور" : "Role"} *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
              >
                <option value="user">{lang === "ar" ? "مستخدم" : "User"}</option>
                <option value="moderator">{lang === "ar" ? "مشرف" : "Moderator"}</option>
                <option value="admin">{lang === "ar" ? "مسؤول" : "Admin"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/users")}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiSave className="w-5 h-5" />
            {loading 
              ? (lang === "ar" ? "جاري التحديث..." : "Updating...") 
              : (lang === "ar" ? "تحديث المستخدم" : "Update User")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;