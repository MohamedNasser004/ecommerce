import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from "../ThemeContext";
import {
  FiSearch,
  FiTrash2,
  FiGlobe,
  FiPlus,
  FiRefreshCw,
  FiEye,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiShoppingBag,
  FiCreditCard,
  FiCalendar
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  const navigate = useNavigate();
  const { theme } = useTheme();

  // دالة لجلب جميع المنتجات
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  };

  // دالة لجلب جميع المستخدمين
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/all');
      return response.data?.data?.users || response.data || [];
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return [];
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // جلب جميع البيانات بالتوازي
      const [productsData, usersData] = await Promise.all([
        fetchProducts(),
        fetchUsers()
      ]);

      setProducts(productsData);
      setUsers(usersData);

      // ثم جلب الطلبات
      const response = await axios.get('http://localhost:3001/api/orders');

      const fetchedOrders = response.data?.data?.orders || [];
      
      // معالجة الطلبات لحساب المبلغ الإجمالي
      const processedOrders = fetchedOrders.map(order => {
        // حساب المبلغ الإجمالي من العناصر
        const totalPrice = order.items?.reduce((sum, item) => {
          return sum + ((item.price || 0) * (item.quantity || 0));
        }, 0) || 0;

        return {
          ...order,
          total_price: totalPrice,
          payment_method: order.payment_method || 'غير محدد', // القيمة الافتراضية
          status: order.status || 'pending' // إذا كانت فارغة
        };
      });

      setOrders(processedOrders);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      toast.error(lang === "ar" ? '❌ فشل تحميل البيانات' : '❌ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // دالة للحصول على معلومات المنتج من product_variant_id
  const getProductInfoFromVariant = (variantId) => {
    if (!variantId) {
      return {
        name: lang === "ar" ? 'منتج غير معروف' : 'Unknown Product',
        image: 'default-product.jpg',
        price: 0
      };
    }

    // البحث عن المنتج الذي يحتوي على هذا المتغير
    const product = products.find(p => 
      p.variants?.some(v => v.id === variantId)
    );
    
    if (product) {
      const variant = product.variants?.find(v => v.id === variantId);
      return {
        name: variant?.variant_name || product.translations?.[0]?.name || 'Product',
        image: product.images?.[0]?.image || 'default-product.jpg',
        price: variant?.price || 0
      };
    }

    return {
      name: `${lang === "ar" ? 'منتج' : 'Product'} ${variantId}`,
      image: 'default-product.jpg',
      price: 0
    };
  };

  // دالة للحصول على معلومات المستخدم
  const getUserInfo = (userId) => {
    if (!userId) {
      return {
        name: lang === "ar" ? 'مستخدم غير معروف' : 'Unknown User',
        email: lang === "ar" ? 'لا يوجد بريد' : 'No email'
      };
    }

    const user = users.find(u => u.id === userId || u._id === userId);
    return user || {
      name: `${lang === "ar" ? 'مستخدم' : 'User'} ${userId}`,
      email: lang === "ar" ? 'لا يوجد بريد' : 'No email'
    };
  };

  const handleDelete = async (orderId) => {
    if (window.confirm(
      lang === "ar" ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?'
    )) {
      try {
        await axios.delete(`http://localhost:3001/api/orders/delete/${orderId}`);
        setOrders(orders.filter(order => order.id !== orderId));
        toast.success(lang === "ar" ? '✅ تم حذف الطلب بنجاح' : '✅ Order deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error(lang === "ar" ? '❌ فشل حذف الطلب' : '❌ Failed to delete order');
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/orders/${orderId}`, 
        { status: newStatus }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(lang === "ar" ? '✅ تم تحديث حالة الطلب' : '✅ Order status updated');
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? '❌ فشل تحديث حالة الطلب' : '❌ Failed to update order status');
    }
  };

  // تصفية الطلبات
  const filteredOrders = orders.filter(order => {
    const userInfo = getUserInfo(order.user_id);
    const matchesSearch = 
      order.id?.toString().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // إحصائيات
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending' || o.status === '').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    const actualStatus = status || 'pending';
    switch(actualStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // الحصول على اسم الحالة
  const getStatusName = (status) => {
    const actualStatus = status || 'pending';
    switch(actualStatus) {
      case 'pending': return lang === "ar" ? 'قيد الانتظار' : 'Pending';
      case 'completed': return lang === "ar" ? 'مكتمل' : 'Completed';
      case 'cancelled': return lang === "ar" ? 'ملغي' : 'Cancelled';
      default: return actualStatus;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // تغيير اللغة
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">
          {lang === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}
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
            {lang === "ar" ? "إدارة الطلبات" : "Orders Management"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "إجمالي الطلبات: " : "Total orders: "} {stats.total}
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
            onClick={() => navigate("/dashboard/orders/add")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            {lang === "ar" ? "إضافة طلب" : "Add Order"}
          </button>

          <button
            onClick={fetchAllData}
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === "ar" ? "إجمالي الطلبات" : "Total Orders"}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FiShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === "ar" ? "قيد الانتظار" : "Pending"}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === "ar" ? "مكتملة" : "Completed"}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === "ar" ? 'text-gray-400' : 'text-gray-600'}`}>
                {lang === "ar" ? "ملغية" : "Cancelled"}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.cancelled}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <FiXCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3">
              <FiSearch className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder={lang === "ar" ? "ابحث برقم الطلب، اسم العميل، البريد..." : "Search by order ID, customer name, email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl ps-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'
              }`}
            />
          </div>
        </div>

        <div>
          <select
            className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-100' 
                : 'bg-gray-50 text-gray-900 border border-gray-200'
            }`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{lang === "ar" ? "جميع الحالات" : "All Statuses"}</option>
            <option value="pending">{lang === "ar" ? "قيد الانتظار" : "Pending"}</option>
            <option value="completed">{lang === "ar" ? "مكتمل" : "Completed"}</option>
            <option value="cancelled">{lang === "ar" ? "ملغي" : "Cancelled"}</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => {
            const userInfo = getUserInfo(order.user_id);
            const date = new Date(order.created_at);
            
            return (
              <div
                key={order.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border shadow-lg`}
              >
                {/* Order Header */}
                <div className={`p-4 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FiShoppingBag className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                      }`} />
                      <span className="font-bold text-lg text-gray-800 dark:text-white">
                        #{order.id}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{userInfo.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.email}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
                      </span>
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">
                        {order.total_price || 0} {lang === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {order.payment_method || (lang === "ar" ? "غير محدد" : "Not specified")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {lang === "ar" ? "تاريخ الطلب" : "Order Date"}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm">
                          {date.toLocaleDateString('en-US')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {lang === "ar" ? "عدد المنتجات" : "Products Count"}
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {order.items?.length || 0} {lang === "ar" ? "منتج" : "products"}
                      </span>
                    </div>
                  </div>

                  {/* Products Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {lang === "ar" ? "المنتجات" : "Products"}
                      </p>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item, index) => {
                          const productInfo = getProductInfoFromVariant(item.product_variant_id);
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded overflow-hidden">
                                <img
                                  src={`http://localhost:3001/uploads/products/${productInfo.image}`}
                                  alt={productInfo.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <div className={`w-full h-full ${
                                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                } hidden items-center justify-center text-xs`}>
                                  📦
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {productInfo.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {item.quantity || 0} × {item.price || productInfo.price || 0} {lang === "ar" ? "ج.م" : "EGP"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                            + {order.items.length - 2} {lang === "ar" ? "منتج آخر" : "more products"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FiEye className="w-4 h-4" />
                      {lang === "ar" ? "عرض" : "View"}
                    </button>

                    <select
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="pending">{lang === "ar" ? "قيد الانتظار" : "Pending"}</option>
                      <option value="completed">{lang === "ar" ? "مكتمل" : "Completed"}</option>
                      <option value="cancelled">{lang === "ar" ? "ملغي" : "Cancelled"}</option>
                    </select>

                    <button
                      onClick={() => handleDelete(order.id)}
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
            <FiSearch className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {searchTerm 
              ? (lang === "ar" ? "لم يتم العثور على طلبات" : "No orders found")
              : (lang === "ar" ? "لا توجد طلبات حالياً" : "No orders available")
            }
          </h3>
          <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchTerm
              ? (lang === "ar" ? "حاول البحث بكلمات أخرى" : "Try different search terms")
              : (lang === "ar" ? "سيظهر هنا الطلبات الجديدة" : "New orders will appear here")
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/dashboard/orders/add")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <FiPlus className="inline-block ml-2" />
              {lang === "ar" ? "إنشاء طلب جديد" : "Create New Order"}
            </button>
          )}
        </div>
      )}

      {/* Orders Count */}
      {filteredOrders.length > 0 && (
        <div className={`mt-6 text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {lang === "ar" 
            ? `عرض ${filteredOrders.length} من أصل ${orders.length} طلب`
            : `Showing ${filteredOrders.length} of ${orders.length} orders`
          }
        </div>
      )}
    </div>
  );
};

export default AdminOrders;