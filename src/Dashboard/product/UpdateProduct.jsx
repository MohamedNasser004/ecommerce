import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import { FiPlus, FiX, FiUpload, FiSave, FiArrowLeft, FiGlobe } from "react-icons/fi";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  const [category_id, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [translations, setTranslations] = useState([
    { language: "ar", name: "", short_description: "", description: "" },
    { language: "en", name: "", short_description: "", description: "" },
  ]);
  const [variants, setVariants] = useState([{ variant_name: "", price: "", stock: "", sku: "" }]);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= أنماط مشتركة ================= */
  const cardClass = `rounded-xl border p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`;
  const sectionTitleClass = `text-lg font-semibold mb-6 ${isDark ? "text-gray-100" : "text-gray-800"}`;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const inputClass = `w-full px-4 py-2.5 rounded-lg text-sm border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark ? "bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-500" : "bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400"
  }`;
  const subCardClass = `border rounded-lg p-4 space-y-4 ${isDark ? "border-gray-700" : "border-gray-200"}`;
  const secondaryButtonClass = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
    isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`;
  const primaryButtonClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150";
  const removeIconButtonClass = `p-2 rounded-full transition-colors duration-150 ${
    isDark ? "text-gray-400 hover:bg-gray-700 hover:text-red-400" : "text-gray-500 hover:bg-gray-100 hover:text-red-500"
  }`;

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/products/${id}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(lang === "ar" ? "فشل تحميل المنتج" : "Failed to load product");
        navigate("/dashboard/product");
        return;
      }

      setCategoryId(data.product?.category_id || "");
      setIsActive(data.product?.is_active === 0 ? 0 : 1);

      if (data.translations?.length) {
        const arTranslation = data.translations.find((t) => t.language === "ar") || {};
        const enTranslation = data.translations.find((t) => t.language === "en") || {};

        setTranslations([
          {
            language: "ar",
            name: arTranslation.name || "",
            short_description: arTranslation.short_description || "",
            description: arTranslation.description || "",
          },
          {
            language: "en",
            name: enTranslation.name || "",
            short_description: enTranslation.short_description || "",
            description: enTranslation.description || "",
          },
        ]);
      }

      if (data.variants?.length) {
        setVariants(
          data.variants.map((v) => ({
            variant_name: v.variant_name || "",
            price: v.price || "",
            stock: v.stock || "",
            sku: v.sku || "",
          }))
        );
      }

      if (data.images?.length) {
        setCurrentImages(data.images);
      }
    } catch (err) {
      toast.error(lang === "ar" ? "خطأ في جلب البيانات" : "Error fetching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (index, field, value) => {
    const newTranslations = [...translations];
    newTranslations[index][field] = value;
    setTranslations(newTranslations);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { variant_name: "", price: "", stock: "", sku: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      toast.error(lang === "ar" ? "يجب أن يكون هناك مقاس واحد على الأقل" : "At least one variant is required");
      return;
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setNewImages([...newImages, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const deleteCurrentImage = (imageId) => {
    setDeletedImages([...deletedImages, imageId]);
    setCurrentImages(currentImages.filter((img) => img.id !== imageId));
  };

  const deleteNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("category_id", category_id);
      formData.append("is_active", isActive);
      formData.append("translations", JSON.stringify(translations));
      formData.append("variants", JSON.stringify(variants));
      newImages.forEach((img) => formData.append("images", img));
      if (deletedImages.length > 0) {
        formData.append("deleted_images", JSON.stringify(deletedImages));
      }

      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || (lang === "ar" ? "فشل تحديث المنتج" : "Failed to update product"));
        return;
      }

      toast.success(lang === "ar" ? "تم تحديث المنتج بنجاح" : "Product updated successfully");
      navigate("/dashboard/product");
    } catch (err) {
      toast.error(lang === "ar" ? "حدث خطأ أثناء التحديث" : "Error updating product");
      console.error("Update error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4" />
        <p className="text-sm">{lang === "ar" ? "جاري تحميل المنتج..." : "Loading product..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {lang === "ar" ? "تعديل المنتج" : "Edit Product"}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {lang === "ar" ? `رقم المنتج ${id}` : `Product #${id}`}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={toggleLanguage} className={secondaryButtonClass}>
            <FiGlobe className="w-4 h-4" />
            {lang === "ar" ? "English" : "العربية"}
          </button>

          <button onClick={() => navigate("/dashboard/product")} className={secondaryButtonClass}>
            <FiArrowLeft className="w-4 h-4" />
            {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Basic Information */}
        <div className={cardClass}>
          <h3 className={sectionTitleClass}>{lang === "ar" ? "المعلومات الأساسية" : "Basic Information"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{lang === "ar" ? "رقم التصنيف" : "Category ID"} *</label>
              <input type="number" value={category_id} onChange={(e) => setCategoryId(e.target.value)} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>{lang === "ar" ? "حالة المنتج" : "Product Status"}</label>
              <select value={isActive} onChange={(e) => setIsActive(Number(e.target.value))} className={inputClass}>
                <option value={1}>{lang === "ar" ? "نشط" : "Active"}</option>
                <option value={0}>{lang === "ar" ? "غير نشط" : "Inactive"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Translations */}
        <div className={cardClass}>
          <h3 className={sectionTitleClass}>{lang === "ar" ? "الترجمات" : "Translations"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic */}
            <div className={subCardClass}>
              <h4 className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                {lang === "ar" ? "الترجمة العربية" : "Arabic Translation"}
              </h4>
              <input
                type="text"
                placeholder={lang === "ar" ? "اسم المنتج (عربي)" : "Product Name (Arabic)"}
                value={translations[0]?.name || ""}
                onChange={(e) => handleTranslationChange(0, "name", e.target.value)}
                className={inputClass}
                required
              />
              <input
                type="text"
                placeholder={lang === "ar" ? "الوصف المختصر" : "Short Description"}
                value={translations[0]?.short_description || ""}
                onChange={(e) => handleTranslationChange(0, "short_description", e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder={lang === "ar" ? "الوصف الكامل" : "Full Description"}
                value={translations[0]?.description || ""}
                onChange={(e) => handleTranslationChange(0, "description", e.target.value)}
                rows="4"
                className={inputClass}
                required
              />
            </div>

            {/* English */}
            <div className={subCardClass}>
              <h4 className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {lang === "ar" ? "الترجمة الإنجليزية" : "English Translation"}
              </h4>
              <input
                type="text"
                placeholder="Product Name (English)"
                value={translations[1]?.name || ""}
                onChange={(e) => handleTranslationChange(1, "name", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Short Description"
                value={translations[1]?.short_description || ""}
                onChange={(e) => handleTranslationChange(1, "short_description", e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder="Full Description"
                value={translations[1]?.description || ""}
                onChange={(e) => handleTranslationChange(1, "description", e.target.value)}
                rows="4"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={sectionTitleClass + " mb-0"}>{lang === "ar" ? "المقاسات والمتغيرات" : "Variants"}</h3>
            <button type="button" onClick={addVariant} className={primaryButtonClass}>
              <FiPlus className="w-4 h-4" />
              {lang === "ar" ? "إضافة مقاس" : "Add Variant"}
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={idx} className={subCardClass}>
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {lang === "ar" ? "المقاس" : "Variant"} {idx + 1}
                  </h4>
                  {variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(idx)} className={removeIconButtonClass}>
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اسم المقاس" : "Variant Name"}
                    value={v.variant_name}
                    onChange={(e) => handleVariantChange(idx, "variant_name", e.target.value)}
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder={lang === "ar" ? "السعر" : "Price"}
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                    className={inputClass}
                    required
                  />
                  <input
                    type="number"
                    placeholder={lang === "ar" ? "الكمية" : "Stock"}
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>
              {lang === "ar" ? "الصور الحالية" : "Current Images"} ({currentImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentImages.map((img, index) => (
                <div key={img.id} className="relative group">
                  <img
                    src={`http://localhost:3001/uploads/products/${img.image}`}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => deleteCurrentImage(img.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div className={cardClass}>
          <h3 className={sectionTitleClass}>{lang === "ar" ? "إضافة صور جديدة" : "Add New Images"}</h3>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-150 hover:border-blue-500 ${
              isDark ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input type="file" id="fileInput" accept="image/*" multiple hidden onChange={handleImageChange} />
            <div className="flex flex-col items-center justify-center gap-3">
              <FiUpload className={`w-10 h-10 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {lang === "ar" ? "اسحب وأفلت الصور هنا" : "Drag & Drop Images"}
              </p>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {lang === "ar" ? "أو اضغط للتصفح" : "or click to browse"}
              </p>
            </div>
          </div>

          {newImages.length > 0 && (
            <div className="mt-6">
              <h4 className={`font-medium mb-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {lang === "ar" ? "الصور الجديدة" : "New Images"} ({newImages.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`صورة جديدة ${i + 1}`}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => deleteNewImage(i)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/product")}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-150 ${
              isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiSave className="w-5 h-5" />
            {submitting ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : lang === "ar" ? "حفظ التعديلات" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;