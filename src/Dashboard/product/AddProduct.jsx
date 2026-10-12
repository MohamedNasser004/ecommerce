import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import { FiPlus, FiX, FiUpload, FiGlobe, FiSave, FiArrowLeft } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [translations, setTranslations] = useState([
    { language: "ar", name: "", short_description: "", description: "" },
  ]);
  const [variants, setVariants] = useState([{ variant_name: "", price: "", stock: "", sku: "" }]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleTranslationChange = (index, field, value) => {
    const newTranslations = [...translations];
    newTranslations[index][field] = value;
    setTranslations(newTranslations);
  };

  const addTranslation = () => {
    setTranslations([...translations, { language: "en", name: "", short_description: "", description: "" }]);
  };

  const removeTranslation = (index) => {
    if (translations.length <= 1) {
      toast.error(lang === "ar" ? "يجب أن يكون هناك ترجمة واحدة على الأقل" : "At least one translation is required");
      return;
    }
    const newTranslations = [...translations];
    newTranslations.splice(index, 1);
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
    setImages([...images, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages([...images, ...files]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error(lang === "ar" ? "يجب إدخال رقم التصنيف" : "Category ID is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("is_active", isActive);
    formData.append("translations", JSON.stringify(translations));
    formData.append("variants", JSON.stringify(variants));
    images.forEach((img) => formData.append("images", img));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/products/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(lang === "ar" ? "تمت إضافة المنتج بنجاح!" : "Product added successfully!");
        setCategoryId("");
        setIsActive(true);
        setTranslations([{ language: "ar", name: "", short_description: "", description: "" }]);
        setVariants([{ variant_name: "", price: "", stock: "", sku: "" }]);
        setImages([]);
        navigate("/dashboard/product");
      } else {
        toast.error(data.message || (lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error submitting form"));
      }
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "حدث خطأ في الاتصال بالخادم" : "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            {lang === "ar" ? "إضافة منتج جديد" : "Add New Product"}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {lang === "ar" ? "املأ النموذج لإضافة منتج جديد" : "Fill the form to add a new product"}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={cardClass}>
          <h3 className={sectionTitleClass}>{lang === "ar" ? "المعلومات الأساسية" : "Basic Information"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{lang === "ar" ? "رقم التصنيف" : "Category ID"} *</label>
              <input
                type="number"
                placeholder={lang === "ar" ? "أدخل رقم التصنيف" : "Enter category ID"}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>{lang === "ar" ? "حالة المنتج" : "Product Status"}</label>
              <select value={isActive} onChange={(e) => setIsActive(e.target.value === "true")} className={inputClass}>
                <option value="true">{lang === "ar" ? "نشط" : "Active"}</option>
                <option value="false">{lang === "ar" ? "غير نشط" : "Inactive"}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Translations */}
        <div className={cardClass}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={sectionTitleClass + " mb-0"}>{lang === "ar" ? "الترجمات" : "Translations"}</h3>
            <button type="button" onClick={addTranslation} className={primaryButtonClass}>
              <FiPlus className="w-4 h-4" />
              {lang === "ar" ? "إضافة ترجمة" : "Add Translation"}
            </button>
          </div>

          <div className="space-y-4">
            {translations.map((t, idx) => (
              <div key={idx} className={subCardClass}>
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {lang === "ar" ? "الترجمة" : "Translation"} {idx + 1}
                  </h4>
                  {translations.length > 1 && (
                    <button type="button" onClick={() => removeTranslation(idx)} className={removeIconButtonClass}>
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اللغة (مثال: ar, en)" : "Language (e.g., ar, en)"}
                    value={t.language}
                    onChange={(e) => handleTranslationChange(idx, "language", e.target.value)}
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اسم المنتج" : "Product Name"}
                    value={t.name}
                    onChange={(e) => handleTranslationChange(idx, "name", e.target.value)}
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "الوصف القصير" : "Short Description"}
                    value={t.short_description}
                    onChange={(e) => handleTranslationChange(idx, "short_description", e.target.value)}
                    className={inputClass}
                  />
                  <textarea
                    placeholder={lang === "ar" ? "الوصف الكامل" : "Full Description"}
                    value={t.description}
                    onChange={(e) => handleTranslationChange(idx, "description", e.target.value)}
                    rows="4"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
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

        {/* Images */}
        <div className={cardClass}>
          <h3 className={sectionTitleClass}>{lang === "ar" ? "صور المنتج" : "Product Images"}</h3>

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
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {lang === "ar" ? "يدعم الصور: PNG, JPG, JPEG" : "Supports: PNG, JPG, JPEG"}
              </p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h4 className={`font-medium mb-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {lang === "ar" ? "الصور المرفوعة" : "Uploaded Images"} ({images.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(img)} alt={`Preview ${i + 1}`} className="w-full h-28 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    <p className={`text-xs truncate mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
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
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiSave className="w-5 h-5" />
            {loading ? (lang === "ar" ? "جاري الإضافة..." : "Adding...") : lang === "ar" ? "إضافة المنتج" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;