import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from "../ThemeContext";
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiPercent,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiCheck,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import {
  TbPackage,
  TbReceipt
} from "react-icons/tb";

const UpdateOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // الحقول القابلة للتعديل
  const [formData, setFormData] = useState({
    status: '',
    payment_method: '',
    payment_status: '',
    shipping_address: '',
    shipping_cost: 0,
    tax: 0,
    discount: 0,
    notes: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    items: []
  });

  // حالة لحالة النموذج
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  // قائمة حالات الطلب
  const orderStatuses = [
    { value: 'pending', label: lang === "ar" ? 'قيد الانتظار' : 'Pending' },
    { value: 'processing', label: lang === "ar" ? 'قيد المعالجة' : 'Processing' },
    { value: 'shipped', label: lang === "ar" ? 'تم الشحن' : 'Shipped' },
    { value: 'delivered', label: lang === "ar" ? 'تم التسليم' : 'Delivered' },
    { value: 'completed', label: lang === "ar" ? 'مكتمل' : 'Completed' },
    { value: 'cancelled', label: lang === "ar" ? 'ملغي' : 'Cancelled' }
  ];

  // طرق الدفع
  const paymentMethods = [
    { value: 'cash', label: lang === "ar" ? 'الدفع عند الاستلام' : 'Cash on Delivery' },
    { value: 'credit_card', label: lang === "ar" ? 'بطاقة ائتمان' : 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: lang === "ar" ? 'تحويل بنكي' : 'Bank Transfer' }
  ];

  // حالات الدفع
  const paymentStatuses = [
    { value: 'pending', label: lang === "ar" ? 'قيد الانتظار' : 'Pending' },
    { value: 'paid', label: lang === "ar" ? 'مدفوع' : 'Paid' },
    { value: 'failed', label: lang === "ar" ? 'فشل' : 'Failed' },
    { value: 'refunded', label: lang === "ar" ? 'تم الاسترجاع' : 'Refunded' }
  ];

  // دالة لتنسيق المبلغ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return lang === "ar" ? 'غير محدد' : 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "ar" ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // جلب بيانات الطلب
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
      
      if (response.data?.success) {
        const orderData = response.data.data?.order || response.data;
        
        // تعبئة بيانات النموذج
        setFormData({
          status: orderData.status || 'pending',
          payment_method: orderData.payment?.method || 'cash',
          payment_status: orderData.payment?.status || 'pending',
          shipping_address: orderData.shipping_address || '',
          shipping_cost: parseFloat(orderData.shipping_cost) || 0,
          tax: parseFloat(orderData.tax) || 0,
          discount: parseFloat(orderData.discount) || 0,
          notes: orderData.notes || '',
          customer_name: orderData.customer?.name || '',
          customer_email: orderData.customer?.email || '',
          customer_phone: orderData.customer?.phone || '',
          items: orderData.items?.map(item => ({
            id: item.id || item.product_id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            name_ar: item.name_ar || item.name,
            name_en: item.name_en || item.name,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            variant_name: item.variant_name || '',
            images: item.images || []
          })) || []
        });

        setOrder(orderData);
      }
    } catch (err) {
      console.error('❌ خطأ في تحميل بيانات الطلب:', err);
      setError(err.message || 'فشل تحميل البيانات');
      toast.error(
        lang === "ar" 
          ? '❌ فشل تحميل بيانات الطلب' 
          : '❌ Failed to load order data'
      );
    } finally {
      setLoading(false);
    }
  };

  // جلب المنتجات المتاحة
  const fetchProducts = async (search = '') => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products?search=${search}&limit=10`);
      if (response.data?.success) {
        setAvailableProducts(response.data.data?.products || []);
      }
    } catch (err) {
      console.error('❌ خطأ في جلب المنتجات:', err);
    }
  };

  // جلب العملاء المتاحين
  const fetchCustomers = async (search = '') => {
    try {
      const response = await axios.get(`http://localhost:3001/api/customers?search=${search}&limit=10`);
      if (response.data?.success) {
        setAvailableCustomers(response.data.data?.customers || []);
      }
    } catch (err) {
      console.error('❌ خطأ في جلب العملاء:', err);
    }
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // معالجة تغيير بيانات العميل
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // اختيار عميل من البحث
  const selectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone
    }));
    setShowCustomerSearch(false);
    setCustomerSearch('');
  };

  // إضافة منتج جديد
  const addProduct = (product) => {
    const newItem = {
      id: product.id,
      product_id: product.id,
      name_ar: product.name_ar || product.name,
      name_en: product.name_en || product.name,
      price: product.price || 0,
      quantity: 1,
      variant_name: '',
      images: product.images || []
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setShowProductSearch(false);
    setProductSearch('');
  };

  // تحديث كمية المنتج
  const updateItemQuantity = (index, quantity) => {
    const newItems = [...formData.items];
    if (newItems[index]) {
      newItems[index].quantity = Math.max(1, parseInt(quantity) || 1);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  // تحديث سعر المنتج
  const updateItemPrice = (index, price) => {
    const newItems = [...formData.items];
    if (newItems[index]) {
      newItems[index].price = parseFloat(price) || 0;
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  // حذف منتج
  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // حساب الإجمالي
  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // حساب الإجمالي النهائي
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = formData.shipping_cost || 0;
    const tax = formData.tax || 0;
    const discount = formData.discount || 0;
    return subtotal + shipping + tax - discount;
  };

  // حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      // تحضير البيانات للإرسال
      const orderData = {
        status: formData.status,
        payment_method: formData.payment_method,
        payment_status: formData.payment_status,
        shipping_address: formData.shipping_address,
        shipping_cost: formData.shipping_cost,
        tax: formData.tax,
        discount: formData.discount,
        notes: formData.notes,
        items: formData.items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // إذا تم تغيير بيانات العميل
      if (formData.customer_email && formData.customer_email !== order?.customer?.email) {
        orderData.customer = {
          name: formData.customer_name,
          email: formData.customer_email,
          phone: formData.customer_phone
        };
      }

      const response = await axios.put(`http://localhost:3001/api/orders/${orderId}`, orderData);
      
      if (response.data?.success) {
        toast.success(
          lang === "ar" 
            ? '✅ تم تحديث الطلب بنجاح' 
            : '✅ Order updated successfully'
        );
        navigate(`/dashboard/orders/${orderId}`);
      }
    } catch (err) {
      console.error('❌ خطأ في تحديث الطلب:', err);
      toast.error(
        lang === "ar" 
          ? '❌ فشل تحديث الطلب' 
          : '❌ Failed to update order'
      );
    } finally {
      setSaving(false);
    }
  };

  // الحذف
  const handleDelete = async () => {
    if (window.confirm(lang === "ar" 
      ? 'هل أنت متأكد من حذف هذا الطلب؟' 
      : 'Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
        toast.success(
          lang === "ar" 
            ? '✅ تم حذف الطلب بنجاح' 
            : '✅ Order deleted successfully'
        );
        navigate('/dashboard/orders');
      } catch (err) {
        console.error('❌ خطأ في حذف الطلب:', err);
        toast.error(
          lang === "ar" 
            ? '❌ فشل حذف الطلب' 
            : '❌ Failed to delete order'
        );
      }
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    if (customerSearch.length > 2) {
      fetchCustomers(customerSearch);
    }
  }, [customerSearch]);

  useEffect(() => {
    if (productSearch.length > 2) {
      fetchProducts(productSearch);
    }
  }, [productSearch]);

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
            {lang === "ar" ? "جاري تحميل بيانات الطلب" : "Loading Order Data"}
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="max-w-md w-full text-center">
          <h2 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {lang === "ar" ? 'عذراً، حدث خطأ' : 'Oops, Something Went Wrong'}
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <FiArrowLeft className="w-4 h-4" />
            {lang === "ar" ? 'العودة للطلبات' : 'Back to Orders'}
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(`/dashboard/orders/${orderId}`)}
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
                <TbReceipt className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lang === "ar" ? 'تعديل الطلب' : 'Edit Order'}
                </h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  #{orderId}
                </span>
                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatDate(order?.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status & Payment */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lang === "ar" ? 'حالة الطلب والدفع' : 'Order Status & Payment'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'حالة الطلب' : 'Order Status'}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    >
                      {orderStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'طريقة الدفع' : 'Payment Method'}
                    </label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'حالة الدفع' : 'Payment Status'}
                    </label>
                    <select
                      name="payment_status"
                      value={formData.payment_status}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    >
                      {paymentStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Shipping Address */}
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'عنوان الشحن' : 'Shipping Address'}
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lang === "ar" ? 'منتجات الطلب' : 'Order Items'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProductSearch(true)}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <FiPlus className="w-4 h-4" />
                    {lang === "ar" ? 'إضافة منتج' : 'Add Product'}
                  </button>
                </div>

                {showProductSearch && (
                  <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiSearch className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder={lang === "ar" ? 'بحث عن منتج...' : 'Search for a product...'}
                        className={`flex-1 p-2 bg-transparent outline-none ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowProductSearch(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {productSearch.length > 2 && (
                      <div className="max-h-60 overflow-y-auto">
                        {availableProducts.map(product => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                            onClick={() => addProduct(product)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                {product.images?.[0] ? (
                                  <img
                                    src={`http://localhost:3001/uploads/products/${product.images[0]}`}
                                    alt={product.name_ar}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiPackage className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{lang === "ar" ? product.name_ar : product.name_en}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatCurrency(product.price)} {lang === "ar" ? 'ج.م' : 'EGP'}
                                </div>
                              </div>
                            </div>
                            <FiPlus className="w-5 h-5 text-blue-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {formData.items.length > 0 ? (
                    formData.items.map((item, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Product Image & Name */}
                          <div className="col-span-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                {item.images?.[0] ? (
                                  <img
                                    src={`http://localhost:3001/uploads/products/${item.images[0]}`}
                                    alt={item.name_ar}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiPackage className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{lang === "ar" ? item.name_ar : item.name_en}</div>
                                {item.variant_name && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.variant_name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2">
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {lang === "ar" ? 'الكمية' : 'Quantity'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, e.target.value)}
                              className={`w-full p-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>

                          {/* Price */}
                          <div className="col-span-3">
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {lang === "ar" ? 'السعر' : 'Price'}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.price}
                              onChange={(e) => updateItemPrice(index, e.target.value)}
                              className={`w-full p-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </div>

                          {/* Total */}
                          <div className="col-span-1 text-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {lang === "ar" ? 'الإجمالي' : 'Total'}
                            </div>
                            <div className="font-bold text-blue-600 dark:text-blue-400">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <FiShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        {lang === "ar" ? 'لا توجد منتجات في هذا الطلب' : 'No items in this order'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lang === "ar" ? 'ملاحظات' : 'Notes'}
                </h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder={lang === "ar" ? 'أضف ملاحظات حول الطلب...' : 'Add notes about the order...'}
                  className={`w-full p-3 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                />
              </div>
            </div>

            {/* Right Column - Customer & Summary */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {lang === "ar" ? 'معلومات العميل' : 'Customer Information'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowCustomerSearch(true)}
                    className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </div>

                {showCustomerSearch && (
                  <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiSearch className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder={lang === "ar" ? 'بحث عن عميل...' : 'Search for a customer...'}
                        className={`flex-1 p-2 bg-transparent outline-none ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomerSearch(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {customerSearch.length > 2 && (
                      <div className="max-h-60 overflow-y-auto">
                        {availableCustomers.map(customer => (
                          <div
                            key={customer.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                            onClick={() => selectCustomer(customer)}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'اسم العميل' : 'Customer Name'}
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleCustomerChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleCustomerChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleCustomerChange}
                      className={`w-full p-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {lang === "ar" ? 'ملخص الطلب' : 'Order Summary'}
                </h3>

                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lang === "ar" ? 'المبلغ الإجمالي' : 'Subtotal'}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)} {lang === "ar" ? 'ج.م' : 'EGP'}
                    </span>
                  </div>

                  {/* Shipping Cost */}
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <FiTruck className="w-4 h-4 text-gray-400" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'رسوم الشحن' : 'Shipping'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="shipping_cost"
                        value={formData.shipping_cost}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-32 p-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } text-right`}
                      />
                      <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <FiPercent className="w-4 h-4 text-gray-400" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'الضريبة' : 'Tax'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="tax"
                        value={formData.tax}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-32 p-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } text-right`}
                      />
                      <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-gray-400" />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lang === "ar" ? 'الخصم' : 'Discount'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-32 p-2 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } text-right`}
                      />
                      <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4"></div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {lang === "ar" ? 'المبلغ النهائي' : 'Total Amount'}
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(total)} {lang === "ar" ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {lang === "ar" ? 'جاري الحفظ...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        {lang === "ar" ? 'حفظ التعديلات' : 'Save Changes'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/orders/${orderId}`)}
                    className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <FiX className="w-5 h-5" />
                    {lang === "ar" ? 'إلغاء' : 'Cancel'}
                  </button>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                    >
                      <FiTrash2 className="w-5 h-5" />
                      {lang === "ar" ? 'حذف الطلب' : 'Delete Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrder;