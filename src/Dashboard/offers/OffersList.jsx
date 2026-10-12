import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiPercent,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiTag,
  FiShoppingBag
} from 'react-icons/fi';

const OffersList = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOffers, setSelectedOffers] = useState([]);
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const lang = localStorage.getItem("lang") || "ar";

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/offers");
      const data = await response.json();
      
      if (response.ok) {
        setOffers(data.data || data || []);
      } else {
        toast.error(lang === "ar" ? "فشل تحميل العروض" : "Failed to load offers");
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء جلب العروض" : "Error fetching offers");
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (offerId) => {
    if (!window.confirm(
      lang === "ar" 
        ? "هل أنت متأكد من حذف هذا العرض؟" 
        : "Are you sure you want to delete this offer?"
    )) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          //Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(lang === "ar" ? "تم حذف العرض بنجاح" : "Offer deleted successfully");
        fetchOffers();
      } else {
        toast.error(lang === "ar" ? "فشل حذف العرض" : "Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting offer");
    }
  };

  const toggleOfferStatus = async (offerId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        toast.success(lang === "ar" ? "تم تحديث حالة العرض" : "Offer status updated");
        fetchOffers();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const applyToAllProducts = async (offerId) => {
    if (!window.confirm(
      lang === "ar" 
        ? "هل تريد تطبيق هذا العرض على جميع المنتجات؟" 
        : "Apply this offer to all products?"
    )) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/offers/apply-to-all", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offer_id: offerId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(
          lang === "ar" 
            ? `تم تطبيق العرض على ${data.added || 0} منتج` 
            : `Offer applied to ${data.added || 0} products`
        );
      } else {
        toast.error(data.message || (lang === "ar" ? "فشل تطبيق العرض" : "Failed to apply offer"));
      }
    } catch (error) {
      console.error("Error applying offer:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء التطبيق" : "Error applying offer");
    }
  };

  const removeFromAllProducts = async (offerId) => {
    if (!window.confirm(
      lang === "ar" 
        ? "هل تريد إزالة هذا العرض من جميع المنتجات؟" 
        : "Remove this offer from all products?"
    )) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/offers/remove-from-all", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ offer_id: offerId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(
          lang === "ar" 
            ? `تم إزالة العرض من ${data.removed || 0} منتج` 
            : `Offer removed from ${data.removed || 0} products`
        );
      } else {
        toast.error(data.message || (lang === "ar" ? "فشل إزالة العرض" : "Failed to remove offer"));
      }
    } catch (error) {
      console.error("Error removing offer:", error);
      toast.error(lang === "ar" ? "حدث خطأ أثناء الإزالة" : "Error removing offer");
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && offer.is_active) ||
      (statusFilter === 'inactive' && !offer.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  const getDiscountDisplay = (offer) => {
    if (offer.discount_type === 'percentage') {
      return `${offer.discount_value}%`;
    } else {
      return `$${offer.discount_value}`;
    }
  };

  const isOfferActive = (offer) => {
    const now = new Date();
    const start = new Date(offer.start_date);
    const end = new Date(offer.end_date);
    return offer.is_active && now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">
          {lang === "ar" ? "جاري تحميل العروض..." : "Loading offers..."}
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
            {lang === "ar" ? "إدارة العروض" : "Offers Management"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "إدارة العروض الترويجية والخصومات" : "Manage promotional offers and discounts"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/offers/add")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            {lang === "ar" ? "إضافة عرض" : "Add Offer"}
          </button>

          <button
            onClick={fetchOffers}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title={lang === "ar" ? "إجمالي العروض" : "Total Offers"} 
          value={offers.length}
          icon={<FiTag className="w-5 h-5" />}
          color="blue"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "العروض النشطة" : "Active Offers"} 
          value={offers.filter(o => isOfferActive(o)).length}
          icon={<FiCheckCircle className="w-5 h-5" />}
          color="green"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "ستنتهي قريباً" : "Expiring Soon"} 
          value={offers.filter(o => {
            const end = new Date(o.end_date);
            const now = new Date();
            const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            return daysLeft <= 7 && daysLeft > 0;
          }).length}
          icon={<FiCalendar className="w-5 h-5" />}
          color="yellow"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "منتهية الصلاحية" : "Expired"} 
          value={offers.filter(o => {
            const end = new Date(o.end_date);
            const now = new Date();
            return end < now;
          }).length}
          icon={<FiXCircle className="w-5 h-5" />}
          color="red"
          theme={theme}
        />
      </div>

      {/* Search and Filter */}
      <div className={`rounded-2xl p-6 mb-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FiSearch className="inline-block w-4 h-4 ml-1" />
              {lang === "ar" ? "البحث" : "Search"}
            </label>
            <input
              type="text"
              placeholder={lang === "ar" ? "ابحث بعنوان العرض..." : "Search by offer title..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-100 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border`}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FiFilter className="inline-block w-4 h-4 ml-1" />
              {lang === "ar" ? "الحالة" : "Status"}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-100 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border`}
            >
              <option value="all">{lang === "ar" ? "جميع الحالات" : "All Status"}</option>
              <option value="active">{lang === "ar" ? "نشط" : "Active"}</option>
              <option value="inactive">{lang === "ar" ? "غير نشط" : "Inactive"}</option>
            </select>
          </div>

          {/* Results Count */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {lang === "ar" ? "النتائج" : "Results"}
            </label>
            <div className={`px-4 py-3 rounded-xl text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 text-gray-100 border-gray-600' 
                : 'bg-gray-50 text-gray-900 border-gray-300'
            } border`}>
              {lang === "ar" ? "عرض" : "Showing"} {filteredOffers.length} {lang === "ar" ? "من" : "of"} {offers.length} {lang === "ar" ? "عرض" : "offers"}
            </div>
          </div>
        </div>
      </div>

      {/* Offers Table/Grid */}
      {filteredOffers.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <FiTag className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {lang === "ar" ? "لا توجد عروض" : "No offers found"}
          </h3>
          <p className={`text-sm mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {searchTerm 
              ? (lang === "ar" ? "حاول البحث بكلمات أخرى" : "Try different search terms")
              : (lang === "ar" ? "ابدأ بإضافة عروض جديدة" : "Start by adding new offers")
            }
          </p>
          <button
            onClick={() => navigate("/admin/offers/add")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FiPlus className="inline-block ml-2" />
            {lang === "ar" ? "إضافة أول عرض" : "Add First Offer"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map(offer => {
            const isActive = isOfferActive(offer);
            const now = new Date();
            const end = new Date(offer.end_date);
            const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={offer.id}
                className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border shadow-lg`}
              >
                {/* Offer Header */}
                <div className={`p-6 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`text-lg font-bold truncate ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        {offer.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.is_active && isActive)}`}>
                          {offer.is_active && isActive ? (
                            <>
                              <FiCheckCircle className="w-3 h-3" />
                              {lang === "ar" ? "نشط" : "Active"}
                            </>
                          ) : (
                            <>
                              <FiXCircle className="w-3 h-3" />
                              {lang === "ar" ? "غير نشط" : "Inactive"}
                            </>
                          )}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' 
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          <FiPercent className="w-3 h-3" />
                          {getDiscountDisplay(offer)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          offer.is_active
                            ? theme === 'dark'
                              ? 'bg-green-900/30 hover:bg-green-800/40 text-green-400 hover:text-green-300'
                              : 'bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700'
                            : theme === 'dark'
                              ? 'bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300'
                              : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                        }`}
                        title={offer.is_active ? (lang === "ar" ? "تعطيل" : "Disable") : (lang === "ar" ? "تفعيل" : "Enable")}
                      >
                        {offer.is_active ? <FiCheckCircle className="w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => navigate(`/admin/offers/edit/${offer.id}`)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                        }`}
                        title={lang === "ar" ? "تعديل" : "Edit"}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? "تاريخ البداية" : "Start Date"}
                      </span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {new Date(offer.start_date).toLocaleDateString(lang === "ar" ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? "تاريخ النهاية" : "End Date"}
                      </span>
                      <span className={`text-sm font-medium ${
                        daysLeft <= 3 ? 'text-red-600 dark:text-red-400' : 
                        daysLeft <= 7 ? 'text-yellow-600 dark:text-yellow-400' : 
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {new Date(offer.end_date).toLocaleDateString(lang === "ar" ? 'ar-SA' : 'en-US')}
                        {daysLeft > 0 && (
                          <span className={`text-xs mr-2 ${
                            daysLeft <= 3 ? 'text-red-500' : 
                            daysLeft <= 7 ? 'text-yellow-500' : 
                            'text-gray-500'
                          }`}>
                            ({daysLeft} {lang === "ar" ? "يوم" : "days"})
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {lang === "ar" ? "نوع الخصم" : "Discount Type"}
                      </span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {offer.discount_type === 'percentage' 
                          ? (lang === "ar" ? "نسبة مئوية" : "Percentage") 
                          : (lang === "ar" ? "مبلغ ثابت" : "Fixed Amount")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className={`p-4 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyToAllProducts(offer.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FiShoppingBag className="w-3 h-3" />
                      {lang === "ar" ? "تطبيق" : "Apply"}
                    </button>
                    
                    <button
                      onClick={() => removeFromAllProducts(offer.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                        theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <FiTrash2 className="w-3 h-3" />
                      {lang === "ar" ? "إزالة" : "Remove"}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className={`w-full mt-2 py-2 px-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiTrash2 className="w-3 h-3" />
                    {lang === "ar" ? "حذف العرض" : "Delete Offer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, theme }) => {
  const colorClasses = {
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      border: theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200'
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      border: theme === 'dark' ? 'border-green-800/30' : 'border-green-200'
    },
    yellow: {
      bg: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
      text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      border: theme === 'dark' ? 'border-yellow-800/30' : 'border-yellow-200'
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      border: theme === 'dark' ? 'border-red-800/30' : 'border-red-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersList;