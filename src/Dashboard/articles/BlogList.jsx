import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
  FiBarChart2,
  FiGrid,
  FiList,
  FiChevronRight,
  FiChevronLeft,
  FiExternalLink,
  FiDownload,
  FiUpload,
  FiMoreVertical,
  FiStar,
  FiTrendingUp,
  FiArchive,
  FiX,
  FiGlobe,
  FiHash,
} from "react-icons/fi";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [itemsPerPage] = useState(9);
  const navigate = useNavigate();

  // استخراج التصنيفات الفريدة من المقالات
  const getUniqueCategories = () => {
    const categoriesSet = new Set();
    blogs.forEach((blog) => {
      if (blog.category) {
        categoriesSet.add(blog.category);
      }
    });

    const categories = Array.from(categoriesSet).map((cat) => ({
      id: cat,
      name: cat,
    }));

    // إضافة "جميع التصنيفات" في البداية
    return [{ id: "all", name: "جميع التصنيفات" }, ...categories];
  };

  const categories = getUniqueCategories();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, statusFilter, categoryFilter, sortBy]);

  // جلب المقالات من API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log("🔍 جاري تحميل المقالات...");
      const response = await axios.get(
        "http://localhost:3001/api/articles/all",
      );

      console.log("📊 استجابة API:", response.data);

      // البيانات تأتي كـ array مباشرة
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
        toast.success(`تم تحميل ${response.data.length} مقالة بنجاح`);
      } else if (response.data?.data?.articles) {
        // إذا كانت البيانات في حقل data.articles
        setBlogs(response.data.data.articles);
        toast.success(
          `تم تحميل ${response.data.data.articles.length} مقالة بنجاح`,
        );
      } else if (response.data?.articles) {
        // إذا كانت البيانات في حقل articles
        setBlogs(response.data.articles);
        toast.success(`تم تحميل ${response.data.articles.length} مقالة بنجاح`);
      } else {
        console.warn("⚠️ هيكل البيانات غير متوقع:", response.data);
        setBlogs([]);
        toast.error("هيكل البيانات غير متوقع");
      }
    } catch (error) {
      console.error("❌ خطأ في تحميل المقالات:", error);
      toast.error("فشل في تحميل المقالات: " + error.message);
      setBlogs([]); // تعيين مصفوفة فارغة في حالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  // حذف مقالة
  const handleDeleteBlog = async (slug, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف المقالة "${title}"؟`)) return;

    try {
      console.log("🗑️ جاري حذف المقالة:", slug);
      const response = await axios.delete(
        `http://localhost:3001/api/articles/delete/${slug}`,
      );

      if (response.data?.success) {
        toast.success("تم حذف المقالة بنجاح");
        fetchBlogs(); // إعادة تحميل المقالات
      } else if (response.status === 200) {
        toast.success("تم حذف المقالة بنجاح");
        fetchBlogs();
      } else {
        toast.error(response.data?.message || "فشل في حذف المقالة");
      }
    } catch (error) {
      console.error("❌ خطأ في حذف المقالة:", error);
      toast.error("فشل في حذف المقالة: " + error.message);
    }
  };

  // حذف مقالات متعددة
  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) {
      toast.error("لم يتم اختيار أي مقالات للحذف");
      return;
    }

    if (!window.confirm(`هل أنت متأكد من حذف ${selectedBlogs.length} مقالة؟`))
      return;

    try {
      const promises = selectedBlogs.map((slug) =>
        axios.delete(`http://localhost:3001/api/articles/delete/${slug}`),
      );

      await Promise.all(promises);
      toast.success(`تم حذف ${selectedBlogs.length} مقالة بنجاح`);
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      console.error("❌ خطأ في حذف المقالات:", error);
      toast.error("فشل في حذف المقالات: " + error.message);
    }
  };

  // تصدير المقالات
  const handleExport = () => {
    if (filteredBlogs.length === 0) {
      toast.error("لا توجد مقالات للتصدير");
      return;
    }

    const dataStr = JSON.stringify(filteredBlogs, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `articles-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success(`تم تصدير ${filteredBlogs.length} مقالة بنجاح`);
  };

  // تغيير حالة مقالات متعددة
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedBlogs.length === 0) {
      toast.error("لم يتم اختيار أي مقالات");
      return;
    }

    try {
      const promises = selectedBlogs.map((slug) =>
        axios.put(`http://localhost:3001/api/articles/update/${slug}`, {
          status: newStatus,
        }),
      );

      await Promise.all(promises);
      const statusText = newStatus === "published" ? "منشور" : "مسودة";
      toast.success(
        `تم تغيير حالة ${selectedBlogs.length} مقالة إلى ${statusText}`,
      );
      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      console.error("❌ خطأ في تغيير الحالة:", error);
      toast.error("فشل في تغيير الحالة: " + error.message);
    }
  };

  // التصفية والترتيب
  const filterAndSortBlogs = () => {
    let filtered = [...blogs];

    // تطبيق البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          (blog.title?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (blog.meta_description?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (blog.meta_keywords?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (blog.author?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (blog.content?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ),
      );
    }

    // تطبيق فلتر الحالة
    if (statusFilter !== "all") {
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }

    // تطبيق فلتر التصنيف
    if (categoryFilter !== "all") {
      filtered = filtered.filter((blog) => blog.category === categoryFilter);
    }

    // تطبيق الترتيب
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateA - dateB;
        });
        break;
      case "title_asc":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title_desc":
        filtered.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1); // العودة للصفحة الأولى بعد التصفية
  };

  // تحديد/إلغاء تحديد جميع المقالات
  const toggleSelectAll = () => {
    if (selectedBlogs.length === currentBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(currentBlogs.map((blog) => blog.slug || blog.id));
    }
  };

  // تحديد/إلغاء تحديد مقالة
  const toggleSelectBlog = (slug) => {
    setSelectedBlogs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const getStatusBadge = (status) => {
    const actualStatus = status || "draft";

    switch (actualStatus) {
      case "published":
        return {
          text: "منشور",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          dot: "bg-green-500",
          icon: FiEye,
        };
      case "draft":
        return {
          text: "مسودة",
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          dot: "bg-yellow-500",
          icon: FiEdit,
        };
      case "archived":
        return {
          text: "مؤرشف",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          dot: "bg-gray-500",
          icon: FiArchive,
        };
      default:
        return {
          text: "غير معروف",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          dot: "bg-gray-500",
          icon: FiMoreVertical,
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };

  // حساب وقت القراءة التقريبي
  const estimateReadingTime = (content) => {
    if (!content) return 0;
    try {
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0).length;
      return Math.max(1, Math.ceil(words / 200)); // 200 كلمة في الدقيقة، ولا تقل عن دقيقة
    } catch (error) {
      return 0;
    }
  };

  // الحصول على رابط الصورة
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/uploads/")) {
      return `http://localhost:3001${imagePath}`;
    }

    if (imagePath.startsWith("uploads/")) {
      return `http://localhost:3001/${imagePath}`;
    }

    return `http://localhost:3001/uploads/${imagePath}`;
  };

  // حساب الصفحات
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiTrendingUp className="w-12 h-12 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            جاري تحميل المقالات
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            نجهز قائمة مقالاتك...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    إدارة المقالات
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {blogs.length} مقالة متاحة للإدارة
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/articles/new")}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              إضافة مقالة جديدة
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    إجمالي المقالات
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {blogs.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40">
                  <FiBarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    مقالات منشورة
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {blogs.filter((b) => b.status === "published").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40">
                  <FiEye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    مسودات
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {blogs.filter((b) => b.status === "draft").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40">
                  <FiEdit className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    متوسط القراءة
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {blogs.length > 0
                      ? Math.round(
                          blogs.reduce(
                            (acc, blog) =>
                              acc + estimateReadingTime(blog.content),
                            0,
                          ) / blogs.length,
                        )
                      : 0}{" "}
                    د
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40">
                  <FiClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedBlogs.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FiStar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      تم اختيار {selectedBlogs.length} مقالة
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      اختر الإجراء الذي تريد تنفيذه
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkStatusChange("published")}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 text-green-700 dark:text-green-300"
                  >
                    <FiEye className="w-4 h-4" />
                    نشر
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("draft")}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 text-yellow-700 dark:text-yellow-300"
                  >
                    <FiEdit className="w-4 h-4" />
                    حفظ كمسودة
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    حذف المحدد
                  </button>
                  <button
                    onClick={() => setSelectedBlogs([])}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <FiX className="w-4 h-4" />
                    إلغاء التحديد
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث في العناوين، المحتوى، الكلمات المفتاحية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="published">منشور</option>
                    <option value="draft">مسودة</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <FiTag className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <FiTrendingUp className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  >
                    <option value="newest">الأحدث أولاً</option>
                    <option value="oldest">الأقدم أولاً</option>
                    <option value="title_asc">عنوان (أ-ي)</option>
                    <option value="title_desc">عنوان (ي-أ)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                    title="عرض شبكي"
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                    title="عرض قائمة"
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={filteredBlogs.length === 0}
                  className="px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                  title="تصدير المقالات"
                >
                  <FiDownload className="w-5 h-5" />
                  تصدير
                </button>

                {/* Refresh Button */}
                <button
                  onClick={fetchBlogs}
                  className="px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  title="تحديث القائمة"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  تحديث
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <p className="text-gray-600 dark:text-gray-400">
                عرض {currentBlogs.length} من {filteredBlogs.length} مقالة
              </p>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    نتائج البحث عن: "{searchTerm}"
                  </span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
                  >
                    <FiX className="w-3 h-3" />
                    مسح البحث
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Cards Grid/List */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد مقالات"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? "لم يتم العثور على مقالات تطابق بحثك"
                : "لم تتم إضافة أي مقالات بعد"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <FiX className="w-4 h-4" />
                  عرض جميع المقالات
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard/articles/new")}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                إضافة مقالة جديدة
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentBlogs.map((blog, index) => {
              const statusBadge = getStatusBadge(blog.status);
              const StatusIcon = statusBadge.icon;
              const isSelected = selectedBlogs.includes(blog.slug || blog.id);
              const readingTime = estimateReadingTime(blog.content);
              const imageUrl = getImageUrl(blog.image || blog.photo);
              const blogSlug = blog.slug || blog.id;

              return (
                <div
                  key={index}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectBlog(blogSlug)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
                      }}
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.text}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <div className="flex items-center gap-3">
                          <FiClock className="w-4 h-4" />
                          <span className="text-sm">
                            {readingTime} دقيقة قراءة
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {blog.category || "غير مصنف"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        #{blog.id || index + 1}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      <Link
                        to={`/dashboard/articles/${blogSlug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {blog.title || "عنوان غير معروف"}
                      </Link>
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {blog.meta_description || blog.excerpt || "لا يوجد وصف"}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(blog.created_at || blog.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        <span>{blog.author || "غير معروف"}</span>
                      </div>
                    </div>

                    {/* Keywords */}
                    {blog.meta_keywords && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiHash className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            الكلمات المفتاحية:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {blog.meta_keywords
                            .split(",")
                            .slice(0, 2)
                            .map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          {blog.meta_keywords.split(",").length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-400 rounded">
                              +{blog.meta_keywords.split(",").length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/articles/${blogSlug}/edit`}
                        className="flex-1 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm"
                      >
                        <FiEdit className="w-4 h-4" />
                        تعديل
                      </Link>

                      <button
                        onClick={() =>
                          navigate(`/dashboard/articles/${blogSlug}`)
                        }
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm"
                      >
                        <FiEye className="w-4 h-4" />
                        عرض
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blogSlug, blog.title)}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 text-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-4 px-6 text-right">
                      <input
                        type="checkbox"
                        checked={selectedBlogs.length === currentBlogs.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      المقالة
                    </th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      الحالة
                    </th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      التصنيف
                    </th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      التاريخ
                    </th>
                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-900 dark:text-white">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBlogs.map((blog, index) => {
                    const statusBadge = getStatusBadge(blog.status);
                    const StatusIcon = statusBadge.icon;
                    const isSelected = selectedBlogs.includes(
                      blog.slug || blog.id,
                    );
                    const imageUrl = getImageUrl(blog.image || blog.photo);
                    const blogSlug = blog.slug || blog.id;

                    return (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/10"
                            : "hover:bg-gray-50 dark:hover:bg-gray-900/30"
                        }`}
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectBlog(blogSlug)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                              <img
                                src={imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                  <Link
                                    to={`/dashboard/articles/${blogSlug}`}
                                    className="hover:text-blue-600 dark:hover:text-blue-400"
                                  >
                                    {blog.title || "عنوان غير معروف"}
                                  </Link>
                                </h4>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                                {blog.meta_description ||
                                  blog.excerpt ||
                                  "لا يوجد وصف"}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <FiUser className="w-3 h-3" />
                                  {blog.author || "غير معروف"}
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {estimateReadingTime(blog.content)} دقيقة
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusBadge.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {blog.category || "غير مصنف"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(blog.created_at || blog.date)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dashboard/articles/${blogSlug}/edit`}
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors duration-200"
                              title="تعديل"
                            >
                              <FiEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                navigate(`/dashboard/articles/${blogSlug}`)
                              }
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                              title="عرض"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteBlog(blogSlug, blog.title)
                              }
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors duration-200"
                              title="حذف"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > itemsPerPage && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              صفحة {currentPage} من {totalPages} • إجمالي {filteredBlogs.length}{" "}
              مقالة
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="الصفحة السابقة"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="الصفحة التالية"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
