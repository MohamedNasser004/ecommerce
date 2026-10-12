import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../ThemeContext";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiPlus,
  FiRefreshCw,
  FiPackage,
} from "react-icons/fi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageIndex, setImageIndex] = useState({});
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ================= أنماط مشتركة ================= */
  const secondaryButtonClass = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
    isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;
  const primaryButtonClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150";

  /* ================= الترجمة ================= */
  const getTranslation = (product, currentLang = lang) => {
    if (!product?.translations) return {};
    return (
      product.translations.find((t) => t.language === currentLang) ||
      product.translations[0] ||
      {}
    );
  };

  /* ================= جلب المنتجات ================= */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/products");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || [];

      setProducts(list);
      setFilteredProducts(list);

      const indexes = {};
      list.forEach((p) => (indexes[p.id] = 0));
      setImageIndex(indexes);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء جلب المنتجات" : "Error fetching products");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= البحث ================= */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const filtered = products.filter((p) => {
      const tr = getTranslation(p);
      return (
        tr.name?.toLowerCase().includes(searchLower) ||
        tr.short_description?.toLowerCase().includes(searchLower) ||
        tr.description?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower) ||
        false
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products, lang]);

  /* ================= اللغة ================= */
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  /* ================= حذف ================= */
  const deleteProduct = async (product) => {
    const tr = getTranslation(product);

    if (!window.confirm(lang === "ar" ? `هل تريد حذف "${tr.name}"؟` : `Delete "${tr.name}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(lang === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        fetchProducts();
      } else {
        toast.error(lang === "ar" ? "فشل في الحذف" : "Failed to delete");
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting");
    }
  };

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  /* ================= الحالة النشطة ================= */
  const toggleProductStatus = async (product) => {
    const newStatus = product.is_active === 1 ? 0 : 1;

    try {
      const res = await fetch(`http://localhost:3001/api/products/${product.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (res.ok) {
        toast.success(
          lang === "ar" ? `تم ${newStatus === 1 ? "تفعيل" : "تعطيل"} المنتج` : `Product ${newStatus === 1 ? "activated" : "deactivated"}`
        );
        fetchProducts();
      } else {
        toast.error(lang === "ar" ? "فشل في تغيير الحالة" : "Failed to change status");
      }
    } catch (error) {
      console.error("خطأ في تغيير الحالة:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء تغيير الحالة" : "Error changing status");
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4" />
        <p className="text-sm">{lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {lang === "ar" ? "إدارة المنتجات" : "Products Management"}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {lang === "ar" ? "إجمالي المنتجات: " : "Total products: "}
            {filteredProducts.length}
            {searchTerm && <span className="ms-2">({lang === "ar" ? "نتائج البحث" : "Search results"})</span>}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={toggleLanguage} className={secondaryButtonClass}>
            <FiGlobe className="w-4 h-4" />
            {lang === "ar" ? "English" : "العربية"}
          </button>

          <button onClick={() => navigate("/dashboard/product/add")} className={primaryButtonClass}>
            <FiPlus className="w-4 h-4" />
            {lang === "ar" ? "إضافة منتج" : "Add Product"}
          </button>

          <button onClick={fetchProducts} className={secondaryButtonClass}>
            <FiRefreshCw className="w-4 h-4" />
            {lang === "ar" ? "تحديث" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <FiSearch className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
        </div>
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث عن منتج..." : "Search products..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-lg ps-10 pe-4 py-2.5 text-sm border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? "bg-gray-800 text-gray-100 placeholder-gray-500 border-gray-700" : "bg-white text-gray-900 placeholder-gray-400 border-gray-200"
          }`}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const tr = getTranslation(product);
            const imgs = product.images || [];
            const index = imageIndex[product.id] || 0;
            const variants = product.variants || [];
            const pricing = product.pricing || {};
            const isActive = product.is_active === 1;

            return (
              <div
                key={product.id}
                className={`rounded-xl overflow-hidden border transition-colors duration-150 ${
                  isDark ? "bg-gray-800 border-gray-700 hover:border-blue-700" : "bg-white border-gray-200 hover:border-blue-300"
                }`}
              >
                {/* Status */}
                <div
                  className={`px-4 py-2 flex justify-between items-center ${
                    isDark ? (isActive ? "bg-green-900/30" : "bg-red-900/30") : isActive ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                    <span
                      className={`text-sm font-medium ${
                        isDark ? (isActive ? "text-green-300" : "text-red-300") : isActive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isActive ? (lang === "ar" ? "نشط" : "Active") : lang === "ar" ? "غير نشط" : "Inactive"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleProductStatus(product)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors duration-150 ${
                      isActive
                        ? isDark
                          ? "bg-red-500/20 hover:bg-red-600 text-red-300"
                          : "bg-red-100 hover:bg-red-200 text-red-600"
                        : isDark
                        ? "bg-green-500/20 hover:bg-green-600 text-green-300"
                        : "bg-green-100 hover:bg-green-200 text-green-600"
                    }`}
                  >
                    {isActive ? (lang === "ar" ? "تعطيل" : "Deactivate") : lang === "ar" ? "تفعيل" : "Activate"}
                  </button>
                </div>

                {/* Image Slider */}
                <div className="relative h-48 overflow-hidden">
                  {imgs.length > 0 ? (
                    <>
                      <img
                        src={`http://localhost:3001/uploads/products/${imgs[index].image}`}
                        alt={tr.name}
                        className="w-full h-full object-cover"
                      />

                      {imgs.length > 1 && (
                        <>
                          {index > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageIndex({ ...imageIndex, [product.id]: index - 1 });
                              }}
                              className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "right-2" : "left-2"} w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 ${
                                isDark ? "bg-black/60 hover:bg-black/80 text-white" : "bg-white/80 hover:bg-white text-gray-800"
                              }`}
                            >
                              <FiChevronLeft className="w-5 h-5" />
                            </button>
                          )}

                          {index < imgs.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageIndex({ ...imageIndex, [product.id]: index + 1 });
                              }}
                              className={`absolute top-1/2 -translate-y-1/2 ${lang === "ar" ? "left-2" : "right-2"} w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 ${
                                isDark ? "bg-black/60 hover:bg-black/80 text-white" : "bg-white/80 hover:bg-white text-gray-800"
                              }`}
                            >
                              <FiChevronRight className="w-5 h-5" />
                            </button>
                          )}

                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                            {imgs.map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors duration-150 ${
                                  i === index ? (isDark ? "bg-white" : "bg-blue-500") : isDark ? "bg-gray-600" : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className={`h-full flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                      <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                        {lang === "ar" ? "لا توجد صور" : "No Images"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className={`font-semibold text-base mb-1.5 truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {tr.name}
                  </h3>

                  <p className={`text-sm mb-3 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {tr.short_description || tr.description || (lang === "ar" ? "لا يوجد وصف" : "No description")}
                  </p>

                  <div className="mb-4">
                    {pricing.has_offer ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${isDark ? "text-green-400" : "text-green-600"}`}>
                          {formatPrice(pricing.final_price)}
                          <span className="text-xs ms-1">{lang === "ar" ? "د.أ" : "SAR"}</span>
                        </span>
                        <span className={`text-sm line-through ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {formatPrice(pricing.original_price)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-600"}`}>
                          {pricing.offer?.discount_value}%{lang === "ar" ? " خصم" : " OFF"}
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold">
                        <span className={isDark ? "text-gray-100" : "text-gray-900"}>
                          {formatPrice(pricing.original_price || variants[0]?.price || 0)}
                        </span>
                        <span className="text-xs ms-1">{lang === "ar" ? "د.أ" : "SAR"}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <FiPackage className={`w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                      <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                        {variants.length} {lang === "ar" ? "متغير" : "variant(s)"}
                      </span>
                    </div>

                    <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {lang === "ar" ? "المخزون: " : "Stock: "}
                      <span
                        className={`font-medium ${
                          variants.some((v) => v.stock > 0) ? (isDark ? "text-green-400" : "text-green-600") : isDark ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        {variants.some((v) => v.stock > 0)
                          ? lang === "ar"
                            ? "متوفر"
                            : "Available"
                          : lang === "ar"
                          ? "نفذ"
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  <div className={`flex gap-2 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <button
                      onClick={() => navigate(`/dashboard/product/update/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
                    >
                      <FiEdit className="w-4 h-4" />
                      {lang === "ar" ? "تعديل" : "Edit"}
                    </button>

                    <button
                      onClick={() => deleteProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-150"
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
        <div className={`flex flex-col items-center justify-center py-16 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
            {searchTerm ? (
              <FiSearch className={`w-8 h-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            ) : (
              <FiPackage className={`w-8 h-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            )}
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {searchTerm ? (lang === "ar" ? "لم يتم العثور على نتائج" : "No results found") : lang === "ar" ? "لا توجد منتجات" : "No products available"}
          </h3>
          <p className={`text-center mb-6 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {searchTerm
              ? lang === "ar"
                ? "حاول البحث بكلمات أخرى"
                : "Try different search terms"
              : lang === "ar"
              ? "ابدأ بإضافة منتجات جديدة"
              : "Start by adding new products"}
          </p>
          {!searchTerm && (
            <button onClick={() => navigate("/dashboard/product/add")} className={primaryButtonClass}>
              <FiPlus className="w-4 h-4" />
              {lang === "ar" ? "إضافة منتج جديد" : "Add New Product"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;