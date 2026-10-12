import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiSave,
  FiArrowLeft,
  FiPercent,
  FiCalendar,
  FiTag
} from "react-icons/fi";

const AddOffer = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // الحصول على اللغة من localStorage
  const lang = localStorage.getItem("lang") || "ar";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    discount_type: "percentage", // percentage or fixed
    discount_value: "",
    start_date: "",
    end_date: "",
    is_active: true
  });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    // التحقق من الصلاحيات
    // const token = localStorage.getItem("token");
    // const role = localStorage.getItem("role");
    
    // if (!token || role?.trim().toLowerCase() !== "admin") {
    //   toast.error(lang === "ar" ? "يجب تسجيل الدخول كمسؤول" : "You must be logged in as admin");
    //   navigate("/");
    // }

    // جلب المنتجات
    fetchProducts();
  }, [navigate, lang]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.data || data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const selectAllProducts = () => {
    const allProductIds = products.map(p => p.id);
    setSelectedProducts(allProductIds);
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

 // في handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title || !formData.discount_value || !formData.start_date || !formData.end_date) {
    toast.error(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    
    // 1. إضافة العرض فقط
    const offerResponse = await fetch("http://localhost:3001/api/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const offerData = await offerResponse.json();

    if (!offerResponse.ok) {
      throw new Error(offerData.message || "Failed to add offer");
    }

    const offerId = offerData.offer_id;

    // 2. تطبيق العرض على المنتجات المحددة باستخدام endpoint صحيح
    if (selectedProducts.length > 0) {
      for (const productId of selectedProducts) {
        await fetch("http://localhost:3001/api/offers/apply-to-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            offer_id: offerId,
            product_id: productId
          }),
        });
      }
      
      toast.success(lang === "ar" 
        ? `تم تطبيق العرض على ${selectedProducts.length} منتج` 
        : `Offer applied to ${selectedProducts.length} products`);
    }

    toast.success(lang === "ar" ? "تم إضافة العرض بنجاح" : "Offer added successfully");
    
    // الانتقال إلى صفحة العروض
    //navigate("/admin/offers");
    
  } catch (error) {
    console.error("Error:", error);
    toast.error(lang === "ar" ? "حدث خطأ أثناء إضافة العرض" : "Error adding offer");
  } finally {
    setLoading(false);
  }
};

  const getTranslation = (product) => {
    if (!product?.translations) return {};
    const translation = product.translations.find(t => t.language === lang);
    return translation || product.translations[0] || {};
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6 transition-colors duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {lang === "ar" ? "إضافة عرض جديد" : "Add New Offer"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "إنشاء عرض ترويجي جديد للمنتجات" : "Create a new promotional offer for products"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/offers")}
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
        {/* Basic Information Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            <FiTag className="w-5 h-5" />
            {lang === "ar" ? "معلومات العرض الأساسية" : "Basic Offer Information"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {lang === "ar" ? "عنوان العرض" : "Offer Title"} *
              </label>
              <input
                type="text"
                name="title"
                placeholder={lang === "ar" ? "مثال: خصم الصيف، العرض الخاص..." : "e.g., Summer Sale, Special Offer..."}
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {lang === "ar" ? "نوع الخصم" : "Discount Type"} *
              </label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
              >
                <option value="percentage">{lang === "ar" ? "نسبة مئوية %" : "Percentage %"}</option>
                <option value="fixed">{lang === "ar" ? "مبلغ ثابت" : "Fixed Amount"}</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {lang === "ar" ? "قيمة الخصم" : "Discount Value"} *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discount_value"
                  placeholder={formData.discount_type === "percentage" ? "10" : "50"}
                  value={formData.discount_value}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-100 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 border-gray-300'
                  } border`}
                  required
                  step={formData.discount_type === "percentage" ? "0.1" : "1"}
                  min="0"
                />
                <span className={`absolute top-1/2 transform -translate-y-1/2 ${
                  lang === "ar" ? "left-4" : "right-4"
                } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.discount_type === "percentage" ? "%" : "$"}
                </span>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiCalendar className="w-4 h-4" />
                {lang === "ar" ? "تاريخ البداية" : "Start Date"} *
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiCalendar className="w-4 h-4" />
                {lang === "ar" ? "تاريخ النهاية" : "End Date"} *
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="is_active" className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "تفعيل العرض فوراً" : "Activate offer immediately"}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Selection Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <FiPercent className="w-5 h-5" />
              {lang === "ar" ? "تطبيق العرض على المنتجات" : "Apply Offer to Products"}
            </h3>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllProducts}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {lang === "ar" ? "اختيار الكل" : "Select All"}
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {lang === "ar" ? "إلغاء الكل" : "Clear All"}
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
              {products.map(product => {
                const tr = getTranslation(product);
                const isSelected = selectedProducts.includes(product.id);
                
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelection(product.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? theme === 'dark'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-blue-500 bg-blue-50'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium truncate ${
                          isSelected
                            ? 'text-blue-700 dark:text-blue-400'
                            : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {tr.name || product.name}
                        </h4>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className={`mt-4 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {lang === "ar" 
              ? `تم اختيار ${selectedProducts.length} منتج من أصل ${products.length}`
              : `Selected ${selectedProducts.length} of ${products.length} products`
            }
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/offers")}
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
            <FiPlus className="w-5 h-5" />
            {loading 
              ? (lang === "ar" ? "جاري الإضافة..." : "Adding...") 
              : (lang === "ar" ? "إضافة العرض" : "Add Offer")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;