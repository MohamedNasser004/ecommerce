import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from "../ThemeContext";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEdit,
  FiPrinter,
  FiDollarSign,
  FiAlertCircle,
  FiShoppingCart,
  FiTag,
  FiImage,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiBox,
  FiLayers
} from "react-icons/fi";
import {
  TbPackage,
  TbPackageExport,
  TbPackageImport,
  TbReceipt
} from "react-icons/tb";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // دالة للحصول على اسم الحالة
  const getStatusName = (status) => {
    const actualStatus = status || 'pending';
    switch(actualStatus) {
      case 'pending':
        return lang === "ar" ? 'قيد الانتظار' : 'Pending';
      case 'processing':
        return lang === "ar" ? 'قيد المعالجة' : 'Processing';
      case 'shipped':
        return lang === "ar" ? 'تم الشحن' : 'Shipped';
      case 'delivered':
        return lang === "ar" ? 'تم التسليم' : 'Delivered';
      case 'completed':
        return lang === "ar" ? 'مكتمل' : 'Completed';
      case 'cancelled':
        return lang === "ar" ? 'ملغي' : 'Cancelled';
      default:
        return actualStatus;
    }
  };

  // دالة للحصول على معلومات الحالة
  const getStatusInfo = (status) => {
    const actualStatus = status || 'pending';
    
    switch(actualStatus) {
      case 'pending':
        return {
          name: getStatusName(actualStatus),
          color: 'text-yellow-600 dark:text-yellow-300',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: FiClock,
          iconColor: 'text-yellow-500 dark:text-yellow-400',
          description: lang === "ar" 
            ? 'الطلب قيد الانتظار للمعالجة' 
            : 'Order is waiting for processing',
          badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      case 'processing':
        return {
          name: getStatusName(actualStatus),
          color: 'text-blue-600 dark:text-blue-300',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: TbPackage,
          iconColor: 'text-blue-500 dark:text-blue-400',
          description: lang === "ar" 
            ? 'الطلب قيد التحضير والتغليف' 
            : 'Order is being processed and packed',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        };
      case 'shipped':
        return {
          name: getStatusName(actualStatus),
          color: 'text-purple-600 dark:text-purple-300',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: TbPackageExport,
          iconColor: 'text-purple-500 dark:text-purple-400',
          description: lang === "ar" 
            ? 'الطلب تم شحنه للعميل' 
            : 'Order has been shipped to customer',
          badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        };
      case 'delivered':
        return {
          name: getStatusName(actualStatus),
          color: 'text-green-600 dark:text-green-300',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: TbPackageImport,
          iconColor: 'text-green-500 dark:text-green-400',
          description: lang === "ar" 
            ? 'الطلب تم تسليمه للعميل' 
            : 'Order has been delivered to customer',
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'completed':
        return {
          name: getStatusName(actualStatus),
          color: 'text-green-600 dark:text-green-300',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: FiCheckCircle,
          iconColor: 'text-green-500 dark:text-green-400',
          description: lang === "ar" 
            ? 'الطلب تم إكماله بنجاح' 
            : 'Order has been completed successfully',
          badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'cancelled':
        return {
          name: getStatusName(actualStatus),
          color: 'text-red-600 dark:text-red-300',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: FiXCircle,
          iconColor: 'text-red-500 dark:text-red-400',
          description: lang === "ar" 
            ? 'الطلب تم إلغاؤه' 
            : 'Order has been cancelled',
          badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
      default:
        return {
          name: actualStatus,
          color: 'text-gray-600 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          icon: FiBox,
          iconColor: 'text-gray-500 dark:text-gray-400',
          description: '',
          badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
        };
    }
  };

  // دالة للحصول على معلومات طريقة الدفع
  const getPaymentMethodInfo = (method) => {
    const actualMethod = method || 'cash';
    
    switch(actualMethod.toLowerCase()) {
      case 'cash':
        return {
          name: lang === "ar" ? 'الدفع عند الاستلام' : 'Cash on Delivery',
          icon: FiDollarSign,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'credit_card':
        return {
          name: lang === "ar" ? 'بطاقة ائتمان' : 'Credit Card',
          icon: FiCreditCard,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'paypal':
        return {
          name: 'PayPal',
          icon: FiCreditCard,
          color: 'text-blue-400 dark:text-blue-300',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'bank_transfer':
        return {
          name: lang === "ar" ? 'تحويل بنكي' : 'Bank Transfer',
          icon: FiCreditCard,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          name: actualMethod,
          icon: FiCreditCard,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  // دالة للحصول على حالة الدفع
  const getPaymentStatusInfo = (status) => {
    const actualStatus = status || 'pending';
    
    switch(actualStatus.toLowerCase()) {
      case 'paid':
        return {
          name: lang === "ar" ? 'مدفوع' : 'Paid',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          icon: FiCheckCircle,
          iconColor: 'text-green-500'
        };
      case 'pending':
        return {
          name: lang === "ar" ? 'قيد الانتظار' : 'Pending',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          icon: FiClock,
          iconColor: 'text-yellow-500'
        };
      case 'failed':
        return {
          name: lang === "ar" ? 'فشل' : 'Failed',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          icon: FiXCircle,
          iconColor: 'text-red-500'
        };
      default:
        return {
          name: actualStatus,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          icon: FiInfo,
          iconColor: 'text-gray-500'
        };
    }
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return lang === "ar" ? 'غير محدد' : 'Not specified';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "ar" ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // دالة لتنسيق المبلغ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // دالة لتحديث حالة الطلب
  const updateOrderStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.put(`http://localhost:3001/api/orders/${orderId}`, {
        status: newStatus
      });
      
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(
        lang === "ar" 
          ? `✅ تم تحديث حالة الطلب إلى ${getStatusName(newStatus)}` 
          : `✅ Order status updated to ${getStatusName(newStatus)}`
      );
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      toast.error(
        lang === "ar" 
          ? '❌ فشل تحديث حالة الطلب' 
          : '❌ Failed to update order status'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // دالة لجلب تفاصيل الطلب
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 جاري تحميل تفاصيل الطلب رقم:', orderId);
      
      const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
      console.log('📦 الرد من السيرفر:', response.data);
      
      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }

      const orderData = response.data.data?.order || response.data;
      
      if (!orderData) {
        throw new Error('No order data found');
      }

      console.log('📊 بيانات الطلب:', orderData);
      console.log('👤 بيانات العميل مباشرة:', orderData.customer);

      // معالجة بيانات العميل
      let customerInfo = null;
      if (orderData.customer) {
        customerInfo = {
          id: orderData.customer.id,
          name: orderData.customer.name || 'مستخدم غير معروف',
          email: orderData.customer.email || 'لا يوجد بريد',
          phone: orderData.customer.phone || 'غير محدد',
          address: orderData.customer.address || 'غير محدد'
        };
      }

      // إنشاء كائن الطلب النهائي
      const finalOrder = {
        ...orderData,
        id: orderData.order_id || orderData.id,
        customer: customerInfo,
        status: orderData.status || 'pending',
        payment_method: orderData.payment?.method || 'cash',
        payment_status: orderData.payment?.status || 'pending',
        transaction_id: orderData.payment?.transaction_id || '',
        shipping_address: orderData.shipping_address || 'غير محدد',
        shipping_cost: orderData.shipping_cost || 0,
        tax: orderData.tax || 0,
        discount: orderData.discount || 0,
        notes: orderData.notes || '',
        items: orderData.items || []
      };

      console.log('✅ الطلب النهائي:', finalOrder);
      console.log('👤 العميل النهائي:', finalOrder.customer);
      
      setOrder(finalOrder);
      
    } catch (err) {
      console.error('❌ خطأ في تحميل تفاصيل الطلب:', err);
      setError(err.message || 'فشل تحميل البيانات');
      toast.error(
        lang === "ar" 
          ? '❌ فشل تحميل تفاصيل الطلب' 
          : '❌ Failed to load order details'
      );
    } finally {
      setLoading(false);
    }
  };

  // دالة لحساب المبلغ الإجمالي
  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  // دالة لحساب الإجمالي النهائي
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    const shipping = order?.shipping_cost || 0;
    const tax = order?.tax || 0;
    const discount = order?.discount || 0;
    return subtotal + shipping + tax - discount;
  };

  // دالة لعرض تفاصيل المنتج الموسعة
  const toggleProductDetails = (index) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <TbPackage className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
            {lang === "ar" ? "جاري تحميل تفاصيل الطلب" : "Loading Order Details"}
          </h3>
          <p className={`text-gray-500 dark:text-gray-400 ${lang === "ar" ? 'font-arabic' : 'font-sans'}`}>
            {lang === "ar" ? "رقم الطلب" : "Order ID"}: <span className="font-mono text-blue-600 dark:text-blue-400">{orderId}</span>
          </p>
          <div className="mt-4 h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="max-w-md w-full text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <FiAlertCircle className="w-20 h-20 text-red-500 dark:text-red-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-50 dark:border-gray-900 flex items-center justify-center">
              <FiInfo className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
          </div>
          
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {lang === "ar" ? 'عذراً، حدث خطأ' : 'Oops, Something Went Wrong'}
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${lang === "ar" ? 'text-lg' : 'text-base'}`}>
            {error}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchOrderDetails}
              className="group px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              {lang === "ar" ? 'إعادة المحاولة' : 'Try Again'}
            </button>
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              <FiArrowLeft className="w-4 h-4" />
              {lang === "ar" ? 'العودة للطلبات' : 'Back to Orders'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="text-center max-w-md">
          <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
            <TbPackage className="w-24 h-24 text-blue-500 dark:text-blue-400 opacity-50" />
          </div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {lang === "ar" ? 'الطلب غير موجود' : 'Order Not Found'}
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {lang === "ar" 
              ? 'عذراً، لم يتم العثور على الطلب المطلوب. قد يكون قد تم حذفه أو الرابط غير صحيح.' 
              : 'Sorry, the requested order was not found. It may have been deleted or the link is incorrect.'}
          </p>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft className="w-4 h-4" />
            {lang === "ar" ? 'العودة إلى قائمة الطلبات' : 'Back to Orders List'}
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const paymentInfo = getPaymentMethodInfo(order.payment_method);
  const paymentStatusInfo = getPaymentStatusInfo(order.payment_status);
  const StatusIcon = statusInfo.icon;
  const PaymentIcon = paymentInfo.icon;
  const PaymentStatusIcon = paymentStatusInfo.icon;
  const subtotal = calculateTotal();
  const finalTotal = calculateFinalTotal();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.print()}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
          title={lang === "ar" ? "طباعة" : "Print"}
        >
          <FiPrinter className="w-6 h-6" />
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => navigate('/dashboard/orders')}
                  className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <TbReceipt className={`w-6 h-6 ${statusInfo.iconColor}`} />
                    <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang === "ar" ? 'تفاصيل الطلب' : 'Order Details'}
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      #{order.id}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/dashboard/orders/edit/${orderId}`)}
                className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              >
                <FiEdit className="w-4 h-4" />
                {lang === "ar" ? 'تعديل' : 'Edit'}
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`rounded-2xl p-6 mb-8 border ${statusInfo.borderColor} ${statusInfo.bgColor} backdrop-blur-sm`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                  <StatusIcon className={`w-8 h-8 ${statusInfo.iconColor}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-bold ${statusInfo.color}`}>
                      {statusInfo.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.badgeClass}`}>
                      {statusInfo.name}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {statusInfo.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']
                  .filter(status => status !== order.status)
                  .slice(0, 3)
                  .map(status => {
                    const sInfo = getStatusInfo(status);
                    const SIcon = sInfo.icon;
                    return (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(status)}
                        disabled={updatingStatus}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <SIcon className="w-4 h-4" />
                        {sInfo.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Products Section */}
            <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <FiShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang === "ar" ? 'المنتجات المطلوبة' : 'Ordered Products'}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {order.items?.length || 0} {lang === "ar" ? 'منتج' : 'items'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const itemTotal = (parseFloat(item.price) || 0) * (item.quantity || 1);
                      const isExpanded = expandedProduct === index;
                      
                      return (
                        <div 
                          key={index}
                          className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                            isExpanded 
                              ? (theme === 'dark' ? 'border-blue-500/50 bg-blue-900/10' : 'border-blue-200 bg-blue-50')
                              : (theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300')
                          }`}
                        >
                          <div 
                            className={`p-4 cursor-pointer transition-colors duration-200 ${
                              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => toggleProductDetails(index)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img
                                      src={`http://localhost:3001/uploads/products/${item.images?.[0] || 'default-product.jpg'}`}
                                      alt={item.name_ar || item.name_en}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                      }}
                                    />
                                    <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} hidden items-center justify-center`}>
                                      <FiPackage className="w-8 h-8 opacity-50" />
                                    </div>
                                  </div>
                                  {item.images && item.images.length > 1 && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs flex items-center justify-center">
                                      {item.images.length}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {lang === "ar" ? item.name_ar : item.name_en}
                                  </h4>
                                  {item.variant_name && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <FiTag className="w-3 h-3 text-gray-400" />
                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.variant_name}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="text-right">
                                  <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                    {formatCurrency(itemTotal)} {lang === "ar" ? 'ج.م' : 'EGP'}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.quantity || 1} × {formatCurrency(parseFloat(item.price) || 0)}
                                  </div>
                                </div>
                              </div>

                              <div className="ml-4">
                                {isExpanded ? (
                                  <FiChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className={`px-4 pb-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                              <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'رقم المنتج' : 'Product ID'}</div>
                                  <div className="font-mono text-sm">{item.product_id}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'رقم المتغير' : 'Variant ID'}</div>
                                  <div className="font-mono text-sm">{item.variant_id}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">SKU</div>
                                  <div className="font-mono text-sm">{item.sku || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'الإجمالي' : 'Total'}</div>
                                  <div className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(itemTotal)} {lang === "ar" ? 'ج.م' : 'EGP'}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                      <FiPackage className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'لا توجد منتجات' : 'No Products'}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {lang === "ar" ? 'لم يتم العثور على منتجات في هذا الطلب' : 'No products found in this order'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className={`rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <FiShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  {lang === "ar" ? 'ملخص الطلب' : 'Order Summary'}
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'المبلغ الإجمالي' : 'Subtotal'}
                    </span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(subtotal)} {lang === "ar" ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  {order.shipping_cost > 0 && (
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'رسوم الشحن' : 'Shipping'}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(order.shipping_cost)} {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  )}

                  {order.tax > 0 && (
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'الضريبة' : 'Tax'}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(order.tax)} {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  )}

                  {order.discount > 0 && (
                    <div className="flex justify-between items-center py-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'الخصم' : 'Discount'}
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        -{formatCurrency(order.discount)} {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  )}

                  <div className="pt-6 border-t-2 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {lang === "ar" ? 'المبلغ النهائي' : 'Total Amount'}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(finalTotal)} {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Payment Info */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  {lang === "ar" ? 'معلومات العميل' : 'Customer Information'}
                </h3>

                {order.customer ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          {order.customer.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <FiUser className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {order.customer.name}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {order.customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <FiMail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'البريد الإلكتروني' : 'Email'}</div>
                          <div className="font-medium">{order.customer.email}</div>
                        </div>
                      </div>

                      {order.customer.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <FiPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'رقم الهاتف' : 'Phone'}</div>
                            <div className="font-medium">{order.customer.phone}</div>
                          </div>
                        </div>
                      )}

                      {order.customer.address && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <FiMapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'العنوان' : 'Address'}</div>
                            <div className="font-medium">{order.customer.address}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {order.customer.id && (
                      <button
                        onClick={() => navigate(`/dashboard/customers/${order.customer.id}`)}
                        className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        <FiUser className="w-4 h-4" />
                        {lang === "ar" ? 'عرض الملف الشخصي' : 'View Profile'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                      <FiUser className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'لا توجد معلومات' : 'No Information'}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {lang === "ar" ? 'لا توجد معلومات متاحة للعميل' : 'No customer information available'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                    <FiCreditCard className="w-5 h-5 text-white" />
                  </div>
                  {lang === "ar" ? 'معلومات الدفع' : 'Payment Information'}
                </h3>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${paymentInfo.bgColor} border ${paymentInfo.borderColor}`}>
                        <PaymentIcon className={`w-5 h-5 ${paymentInfo.color}`} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'طريقة الدفع' : 'Payment Method'}</div>
                        <div className={`font-bold ${paymentInfo.color}`}>{paymentInfo.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${paymentStatusInfo.bgColor}`}>
                          <PaymentStatusIcon className={`w-5 h-5 ${paymentStatusInfo.iconColor}`} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'حالة الدفع' : 'Payment Status'}</div>
                          <div className={`font-bold ${paymentStatusInfo.color}`}>{paymentStatusInfo.name}</div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {order.payment?.date ? formatDate(order.payment.date) : ''}
                      </span>
                    </div>
                  </div>

                  {order.transaction_id && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === "ar" ? 'رقم المعاملة' : 'Transaction ID'}</div>
                        <div className="font-mono text-sm break-all bg-gray-100 dark:bg-gray-800 p-2 rounded-lg mt-1">
                          {order.transaction_id}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? 'تاريخ الطلب' : 'Order Date'}</span>
                        <span className="font-medium">{formatDate(order.created_at)}</span>
                      </div>
                      {order.payment?.date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{lang === "ar" ? 'تاريخ الدفع' : 'Payment Date'}</span>
                          <span className="font-medium">{formatDate(order.payment.date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {lang === "ar" 
                ? `© ${new Date().getFullYear()} • رقم الطلب: ${order.id} • تم التحديث: ${formatDate(order.created_at)}`
                : `© ${new Date().getFullYear()} • Order ID: ${order.id} • Last updated: ${formatDate(order.created_at)}`
              }
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/orders/edit/${orderId}`)}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
              >
                <FiEdit className="w-4 h-4" />
                {lang === "ar" ? 'تعديل الطلب' : 'Edit Order'}
              </button>
              <button
                onClick={() => navigate('/dashboard/orders')}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <FiArrowLeft className="w-4 h-4" />
                {lang === "ar" ? 'العودة للطلبات' : 'Back to Orders'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;