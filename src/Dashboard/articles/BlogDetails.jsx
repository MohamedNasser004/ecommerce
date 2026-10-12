import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiCalendar, 
  FiUser, 
  FiTag, 
  FiEye, 
  FiEyeOff,
  FiTrash2,
  FiExternalLink,
  FiShare2,
  FiPrinter,
  FiDownload,
  FiCopy,
  FiRefreshCw,
  FiBarChart2,
  FiLink
} from "react-icons/fi";
import { TbCategory } from "react-icons/tb";
import Card from './ComponentsReUsed/Card';
import Button from './ComponentsReUsed/Button';
import Badge from './ComponentsReUsed/Badge';

const DashboardBlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0
  });

  useEffect(() => {
    fetchBlogDetails();
    fetchBlogStats();
  }, [slug]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/articles/${slug}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data) {
        setBlog(response.data);
      } else {
        setError("المقال غير موجود");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء تحميل المقال");
      toast.error("حدث خطأ أثناء تحميل المقال");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogStats = async () => {
    try {
      // محاكاة للإحصائيات
      setStats({
        views: Math.floor(Math.random() * 1000) + 500,
        likes: Math.floor(Math.random() * 200) + 50,
        shares: Math.floor(Math.random() * 100) + 20,
        comments: Math.floor(Math.random() * 50) + 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المقالة؟')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3001/api/articles/${blog.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      toast.success('تم حذف المقالة بنجاح');
      navigate('/dashboard/articles');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('حدث خطأ أثناء حذف المقالة');
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    
    try {
      await axios.patch(
        `http://localhost:3001/api/articles/${blog.id}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setBlog({ ...blog, status: newStatus });
      toast.success(`تم ${newStatus === 'published' ? 'نشر' : 'إخفاء'} المقالة`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('حدث خطأ أثناء تغيير حالة المقالة');
    }
  };

  const copyUrl = () => {
    const url = `${window.location.origin}/articles/${blog.slug}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('تم نسخ الرابط'))
      .catch(() => toast.error('فشل في نسخ الرابط'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل المقالة...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FiEye className="w-16 h-16 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            المقال غير موجود
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "عذراً، لم نتمكن من العثور على المقال المطلوب."}
          </p>
          <Button
            onClick={() => navigate('/dashboard/articles')}
            variant="primary"
            icon={FiArrowLeft}
          >
            العودة للمقالات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Article Card */}
            <Card title="المقالة" icon="file">
              <div className="space-y-6">
                {/* Title & Slug */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FiLink className="w-4 h-4" />
                    <span className="text-sm">/{blog.slug}</span>
                    <Button
                      onClick={copyUrl}
                      variant="ghost"
                      size="small"
                      icon={FiCopy}
                    >
                      نسخ الرابط
                    </Button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbCategory className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{blog.category || 'غير مصنف'}</span>
                  </div>
                  {blog.tags && (
                    <div className="flex items-center gap-2">
                      <FiTag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{blog.tags}</span>
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                {blog.image && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={`http://localhost:3001${blog.image}`}
                      alt={blog.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">المحتوى</h3>
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                {/* SEO Info */}
                {(blog.meta_description || blog.meta_keywords) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      معلومات SEO
                    </h3>
                    <div className="space-y-4">
                      {blog.meta_description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            وصف Meta
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            {blog.meta_description}
                          </p>
                        </div>
                      )}
                      {blog.meta_keywords && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الكلمات المفتاحية
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {blog.meta_keywords.split(',').map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
          

            {/* Actions Card */}
            <Card title="الإجراءات" icon="settings">
              <div className="space-y-3">
                <Link to={`/dashboard/articles/edit/${blog.id}`}>
                  <Button
                    variant="primary"
                    icon={FiEdit}
                    className="w-full justify-center"
                  >
                    تعديل المقالة
                  </Button>
                </Link>
                
                <Button
                  onClick={handleStatusToggle}
                  variant={blog.status === 'published' ? 'warning' : 'success'}
                  icon={blog.status === 'published' ? FiEyeOff : FiEye}
                  className="w-full justify-center"
                >
                  {blog.status === 'published' ? 'إخفاء' : 'نشر'}
                </Button>
                
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  icon={FiTrash2}
                  className="w-full justify-center"
                >
                  حذف المقالة
                </Button>
              </div>
            </Card>
            {/* Info Card */}
            <Card title="معلومات إضافية" icon="info">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">تاريخ الإنشاء</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(blog.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">آخر تحديث</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(blog.updated_at || blog.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">معرّف المقالة</span>
                  <span className="text-gray-900 dark:text-white font-mono">#{blog.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBlogDetails;