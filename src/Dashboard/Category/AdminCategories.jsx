import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiGlobe,
  FiLogOut,
  FiRefreshCw,
  FiFolder,
  FiImage
} from "react-icons/fi";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getTranslation = (category, currentLang = lang) => {
    if (!category?.translations) return {};
    return (
      category.translations.find(t => t.language === currentLang) ||
      category.translations[0] ||
      {}
    );
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();

      if (res.ok) {
        const list = data.categories || data.data || data || [];
        setCategories(list);
        setFilteredCategories(list);
      } else {
        toast.error(lang === "ar" ? "فشل في جلب التصنيفات" : "Failed to fetch categories");
      }
    } catch {
      toast.error(lang === "ar" ? "حدث خطأ أثناء جلب التصنيفات" : "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter(c => {
          const tr = getTranslation(c);
          return (
            tr.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }
  }, [searchTerm, categories, lang]);

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const deleteCategory = async (category) => {
    const tr = getTranslation(category);

    if (!window.confirm(
      lang === "ar"
        ? `هل تريد حذف "${tr.name}"؟`
        : `Delete "${tr.name}"?`
    )) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/category/${category.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        toast.success(lang === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        fetchCategories();
      } else {
        toast.error(lang === "ar" ? "فشل الحذف" : "Delete failed");
      }
    } catch {
      toast.error(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting");
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">
          {lang === "ar" ? "جاري تحميل التصنيفات..." : "Loading categories..."}
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
            {lang === "ar" ? "إدارة التصنيفات" : "Categories Management"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar"
              ? "إدارة وتنظيم تصنيفات المنتجات"
              : "Manage and organize product categories"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiGlobe className="w-4 h-4" />
            {lang === "ar" ? "English" : "العربية"}
          </button>

          <button
            onClick={() => navigate("/dashboard/category/add")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            {lang === "ar" ? "إضافة تصنيف" : "Add Category"}
          </button>

          <button
            onClick={fetchCategories}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            {lang === "ar" ? "تحديث" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title={lang === "ar" ? "إجمالي التصنيفات" : "Total Categories"} 
          value={categories.length}
          icon={<FiFolder className="w-5 h-5" />}
          color="blue"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "المعروض" : "Showing"} 
          value={filteredCategories.length}
          icon={<FiSearch className="w-5 h-5" />}
          color="green"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "بدون صورة" : "No Image"} 
          value={categories.filter(c => !c.image).length}
          icon={<FiImage className="w-5 h-5" />}
          color="yellow"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "بدون وصف" : "No Description"} 
          value={categories.filter(c => !getTranslation(c).description).length}
          icon={<FiFolder className="w-5 h-5" />}
          color="red"
          theme={theme}
        />
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <FiSearch className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث في التصنيفات..." : "Search categories..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-xl ps-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
              : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'
          }`}
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map(category => {
            const tr = getTranslation(category);

            return (
              <div
                key={category.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border shadow-lg`}
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  {category.image ? (
                    <img
                      src={`http://localhost:3001/uploads/${category.image}`}
                      alt={tr.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className={`h-full flex flex-col items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <FiImage className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        {lang === "ar" ? "لا توجد صورة" : "No Image"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className={`font-bold text-lg mb-2 truncate ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {tr.name}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {tr.description || (lang === "ar" ? "لا يوجد وصف" : "No description")}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/dashboard/category/update/${category.id}`)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FiEdit className="w-4 h-4" />
                      {lang === "ar" ? "تعديل" : "Edit"}
                    </button>

                    <button
                      onClick={() => deleteCategory(category)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      {lang === "ar" ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center py-16 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <FiFolder className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {searchTerm 
              ? (lang === "ar" ? "لم يتم العثور على نتائج" : "No results found")
              : (lang === "ar" ? "لا توجد تصنيفات" : "No categories available")
            }
          </h3>
          <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchTerm
              ? (lang === "ar" ? "حاول البحث بكلمات أخرى" : "Try different search terms")
              : (lang === "ar" ? "ابدأ بإضافة تصنيفات جديدة" : "Start by adding new categories")
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/dashboard/category/add")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FiPlus className="inline-block ml-2" />
              {lang === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, theme }) => {
  const colorClasses = {
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      border: theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200'
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      border: theme === 'dark' ? 'border-green-800/30' : 'border-green-200'
    },
    yellow: {
      bg: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
      text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      border: theme === 'dark' ? 'border-yellow-800/30' : 'border-yellow-200'
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      border: theme === 'dark' ? 'border-red-800/30' : 'border-red-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl p-4 border ${colors.bg} ${colors.border} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;