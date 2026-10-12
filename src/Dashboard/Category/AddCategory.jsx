import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiX,
  FiUpload,
  FiSave,
  FiArrowLeft,
  FiGlobe,
  FiImage
} from "react-icons/fi";

const AddCategory = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState([
    { language: "ar", name: "", description: "" },
  ]);
  
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { theme } = useTheme();

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
    setTranslations([
      ...translations,
      { language: "", name: "", description: "" },
    ]);
  };

  const removeTranslation = (index) => {
    if (translations.length <= 1) {
      toast.error(lang === "ar" ? "يجب أن يكون هناك ترجمة واحدة على الأقل" : "At least one translation is required");
      return;
    }
    setTranslations(translations.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImage(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error(lang === "ar" ? "يرجى اختيار صورة للتصنيف" : "Please select a category image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("translations", JSON.stringify(translations));

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(lang === "ar" ? "تمت إضافة التصنيف بنجاح!" : "Category added successfully!");
        navigate("/dashboard/category");
      } else {
        toast.error(data.message || data.error || (lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error submitting form"));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(lang === "ar" ? "حدث خطأ في الاتصال بالخادم" : "Server connection error");
    } finally {
      setLoading(false);
    }
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
            {lang === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "املأ النموذج لإضافة تصنيف جديد" : "Fill the form to add a new category"}
          </p>
        </div>

        <div className="flex gap-3">
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
            onClick={() => navigate("/dashboard/category")}
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
        {/* Translations Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              {lang === "ar" ? "الترجمات" : "Translations"}
            </h3>
            <button
              type="button"
              onClick={addTranslation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FiPlus className="w-4 h-4" />
              {lang === "ar" ? "إضافة ترجمة" : "Add Translation"}
            </button>
          </div>

          <div className="space-y-6">
            {translations.map((t, idx) => (
              <div key={idx} className={`border rounded-xl p-4 space-y-4 relative ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    {lang === "ar" ? "الترجمة" : "Translation"} {idx + 1}
                  </h4>
                  {translations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTranslation(idx)}
                      className={`p-2 rounded-full transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                      }`}
                    >
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
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'bg-gray-50 text-gray-900 border-gray-300'
                    } border`}
                    required
                  />

                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اسم التصنيف" : "Category Name"}
                    value={t.name}
                    onChange={(e) => handleTranslationChange(idx, "name", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'bg-gray-50 text-gray-900 border-gray-300'
                    } border`}
                    required
                  />

                  <textarea
                    placeholder={lang === "ar" ? "الوصف" : "Description"}
                    value={t.description}
                    onChange={(e) => handleTranslationChange(idx, "description", e.target.value)}
                    rows="3"
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'bg-gray-50 text-gray-900 border-gray-300'
                    } border`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Image Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            {lang === "ar" ? "صورة التصنيف" : "Category Image"}
          </h3>

          {image ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover rounded-xl mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    theme === 'dark' 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {image.name}
              </p>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 ${
                theme === 'dark' 
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-700/50' 
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <FiUpload className={`w-12 h-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {lang === "ar" ? "اسحب وأفلت الصورة هنا" : "Drag & Drop Image"}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {lang === "ar" ? "أو اضغط للتصفح" : "or click to browse"}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                  {lang === "ar" ? "يدعم الصور: PNG, JPG, JPEG" : "Supports: PNG, JPG, JPEG"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/category")}
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
              ? (lang === "ar" ? "جاري الإضافة..." : "Adding...") 
              : (lang === "ar" ? "إضافة التصنيف" : "Add Category")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;