import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTrash2,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiKey,
  FiMail,
  FiPhone
} from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // الحصول على اللغة من localStorage
  const lang = localStorage.getItem("lang") || "ar";

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const role = localStorage.getItem('role');

    // if (!token) {
    //   navigate('/login');
    //   return;
    // }

    // if (role !== 'admin') {
    //   toast.error(lang === "ar" ? "ليس لديك صلاحية الوصول" : "You don't have permission");
    //   navigate('/dashboard');
    //   return;
    // }

    fetchUsers();
  }, [navigate, lang]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/users/all', {
        headers: {
          //'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // معالجة البيانات حسب تنسيق الاستجابة
      let fetchedUsers = [];
      if (Array.isArray(data)) {
        fetchedUsers = data;
      } else if (data.data && Array.isArray(data.data)) {
        fetchedUsers = data.data;
      } else if (data.users && Array.isArray(data.users)) {
        fetchedUsers = data.users;
      } else if (data.data && data.data.users && Array.isArray(data.data.users)) {
        fetchedUsers = data.data.users;
      }
      
      console.log('Fetched users:', fetchedUsers);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      toast.error(lang === "ar" ? "فشل تحميل المستخدمين" : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getUserId = (user) => {
    const id = user.id || user._id || user.user_id;
    return id ? id.toString() : '';
  };
  
  const formatUserId = (userId) => {
    if (!userId) return lang === "ar" ? "غير محدد" : "N/A";
    const idStr = userId.toString();
    if (idStr.length <= 8) return idStr;
    return `${idStr.substring(0, 8)}...`;
  };
  
  const getDisplayRole = (userRole) => {
    const roles = {
      admin: lang === "ar" ? "مسؤول" : "Admin",
      user: lang === "ar" ? "مستخدم" : "User",
      moderator: lang === "ar" ? "مشرف" : "Moderator",
      manager: lang === "ar" ? "مدير" : "Manager"
    };
    return roles[userRole] || roles.user;
  };

  const getRoleColor = (userRole) => {
    if (userRole === 'admin') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    if (userRole === 'moderator') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    if (userRole === 'manager') return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
  };

  const handleDelete = async (userId) => {
    // التحقق من أن userId موجود
    if (!userId) {
      toast.error(lang === "ar" ? "معرف المستخدم غير صالح" : "Invalid user ID");
      return;
    }

    const userToDelete = users.find(u => getUserId(u) === userId);
    
    if (userToDelete?.role === 'admin') {
      toast.error(lang === "ar" ? "لا يمكن حذف المسؤولين" : "Cannot delete admin users");
      return;
    }

    if (window.confirm(
      lang === "ar" 
        ? "هل أنت متأكد من حذف هذا المستخدم؟"
        : "Are you sure you want to delete this user?"
    )) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Delete failed with status: ${response.status}`);
        }
        
        setUsers(users.filter(user => getUserId(user) !== userId));
        toast.success(lang === "ar" ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error(lang === "ar" ? "فشل حذف المستخدم" : "Failed to delete user");
      }
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!userId) {
      toast.error(lang === "ar" ? "معرف المستخدم غير صالح" : "Invalid user ID");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Update failed with status: ${response.status}`);
      }
      
      setUsers(users.map(user => 
        getUserId(user) === userId 
          ? { ...user, role: newRole } 
          : user
      ));
      toast.success(lang === "ar" ? "تم تحديث الدور بنجاح" : "Role updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(lang === "ar" ? "فشل تحديث الدور" : "Failed to update role");
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    const allUserIds = filteredUsers.map(user => getUserId(user));
    setSelectedUsers(allUserIds);
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error(lang === "ar" ? "لم يتم اختيار أي مستخدمين" : "No users selected");
      return;
    }

    const hasAdmin = selectedUsers.some(userId => {
      const user = users.find(u => getUserId(u) === userId);
      return user?.role === 'admin';
    });

    if (hasAdmin) {
      toast.error(lang === "ar" ? "لا يمكن حذف المسؤولين" : "Cannot delete admin users");
      return;
    }

    if (window.confirm(
      lang === "ar" 
        ? `هل أنت متأكد من حذف ${selectedUsers.length} مستخدم؟`
        : `Are you sure you want to delete ${selectedUsers.length} users?`
    )) {
      const token = localStorage.getItem('token');
      const deletePromises = selectedUsers.map(userId =>
        fetch(`http://localhost:3001/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      );

      try {
        await Promise.all(deletePromises);
        setUsers(users.filter(user => !selectedUsers.includes(getUserId(user))));
        setSelectedUsers([]);
        toast.success(lang === "ar" ? `تم حذف ${selectedUsers.length} مستخدم بنجاح` : `Successfully deleted ${selectedUsers.length} users`);
      } catch (err) {
        console.error(err);
        toast.error(lang === "ar" ? "فشل حذف بعض المستخدمين" : "Failed to delete some users");
      }
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'all' || 
      (user.role || 'user') === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-[60vh] ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">
          {lang === "ar" ? "جاري تحميل المستخدمين..." : "Loading users..."}
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
          <h2 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {lang === "ar" ? "إدارة المستخدمين" : "Users Management"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "إدارة جميع مستخدمي النظام" : "Manage all system users"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/dashboard/users/add")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FiPlus className="w-4 h-4" />
            {lang === "ar" ? "إضافة مستخدم" : "Add User"}
          </button>

          <button
            onClick={fetchUsers}
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
          title={lang === "ar" ? "إجمالي المستخدمين" : "Total Users"} 
          value={users.length}
          icon={<FiUsers className="w-5 h-5" />}
          color="blue"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "المسؤولين" : "Admins"} 
          value={users.filter(u => u.role === 'admin').length}
          icon={<FiUserCheck className="w-5 h-5" />}
          color="red"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "المستخدمين العاديين" : "Regular Users"} 
          value={users.filter(u => u.role === 'user' || !u.role).length}
          icon={<FiUser className="w-5 h-5" />}
          color="green"
          theme={theme}
        />
        <StatCard 
          title={lang === "ar" ? "تم اختيارهم" : "Selected"} 
          value={selectedUsers.length}
          icon={<FiUserX className="w-5 h-5" />}
          color="purple"
          theme={theme}
        />
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className={`rounded-2xl p-4 mb-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
        } border shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-blue-800'
            }`}>
              <span className="font-bold">{selectedUsers.length}</span>
              {lang === "ar" ? " مستخدم تم اختياره" : " users selected"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSelectAll}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {lang === "ar" ? "اختيار الكل" : "Select All"}
              </button>
              <button
                onClick={handleClearSelection}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {lang === "ar" ? "إلغاء الكل" : "Clear All"}
              </button>
              <button
                onClick={handleBulkDelete}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <FiTrash2 className="inline-block ml-1" />
                {lang === "ar" ? "حذف المحدد" : "Delete Selected"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              placeholder={lang === "ar" ? "ابحث بالاسم، البريد أو الهاتف..." : "Search by name, email or phone..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-100 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border`}
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <FiFilter className="inline-block w-4 h-4 ml-1" />
              {lang === "ar" ? "تصفية حسب الدور" : "Filter by Role"}
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-100 border-gray-600' 
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border`}
            >
              <option value="all">{lang === "ar" ? "جميع الأدوار" : "All Roles"}</option>
              <option value="admin">{lang === "ar" ? "مسؤول" : "Admin"}</option>
              <option value="user">{lang === "ar" ? "مستخدم" : "User"}</option>
              <option value="moderator">{lang === "ar" ? "مشرف" : "Moderator"}</option>
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
              {lang === "ar" ? "عرض" : "Showing"} {currentUsers.length} {lang === "ar" ? "من" : "of"} {filteredUsers.length} {lang === "ar" ? "مستخدم" : "users"}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-2xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            } border-b`}>
              <tr>
                <th className="py-4 px-6 text-right font-semibold">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSelectAll();
                      } else {
                        handleClearSelection();
                      }
                    }}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </th>
                <th className={`py-4 px-6 text-right font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "المستخدم" : "User"}
                </th>
                <th className={`py-4 px-6 text-right font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "المعلومات" : "Information"}
                </th>
                <th className={`py-4 px-6 text-right font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "الدور" : "Role"}
                </th>
                <th className={`py-4 px-6 text-right font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "الحالة" : "Status"}
                </th>
                <th className={`py-4 px-6 text-right font-semibold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {lang === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiUsers className={`w-16 h-16 mb-4 ${
                        theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                      <h3 className={`text-lg font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {lang === "ar" ? "لا توجد مستخدمين" : "No users found"}
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {searchTerm 
                          ? (lang === "ar" ? "حاول البحث بكلمات أخرى" : "Try different search terms")
                          : (lang === "ar" ? "ابدأ بإضافة مستخدمين جدد" : "Start by adding new users")
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const userId = getUserId(user);
                  const userRole = user.role || 'user';
                  const isSelected = selectedUsers.includes(userId);
                  
                  return (
                    <tr key={userId} className={`border-b ${
                      theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors duration-200`}>
                      {/* Checkbox */}
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectUser(userId)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                      </td>

                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                            userRole === 'admin' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                            userRole === 'moderator' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                            userRole === 'manager' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' :
                            'bg-gradient-to-br from-blue-500 to-cyan-600'
                          }`}>
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className={`font-semibold ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {user.name || (lang === "ar" ? "بدون اسم" : "No Name")}
                            </h4>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              ID: {formatUserId(userId)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FiMail className={`w-4 h-4 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                            <p className={`font-medium truncate ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            }`} title={user.email}>
                              {user.email}
                            </p>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <FiPhone className={`w-4 h-4 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                              <p className={`text-sm truncate ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`} title={user.phone}>
                                {user.phone}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <select
                          value={userRole}
                          onChange={(e) => handleRoleUpdate(userId, e.target.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            getRoleColor(userRole)
                          } border`}
                          disabled={userRole === 'admin' && userId === localStorage.getItem('userId')}
                        >
                          <option value="user">{lang === "ar" ? "مستخدم" : "User"}</option>
                          <option value="moderator">{lang === "ar" ? "مشرف" : "Moderator"}</option>
                          <option value="admin">{lang === "ar" ? "مسؤول" : "Admin"}</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(userRole)}`}>
                            {getDisplayRole(userRole)}
                          </span>
                          {user.created_at && (
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {new Date(user.created_at).toLocaleDateString(lang === "ar" ? 'ar-SA' : 'en-US')}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/users/edit/${userId}`)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                            }`}
                            title={lang === "ar" ? "تعديل" : "Edit"}
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/users/reset-password/${userId}`)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 hover:text-blue-300'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700'
                            }`}
                            title={lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password"}
                          >
                            <FiKey className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(userId)}
                            disabled={userRole === 'admin'}
                            className={`p-2 rounded-lg transition-colors ${
                              userRole === 'admin'
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400'
                                : theme === 'dark'
                                  ? 'bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300'
                                  : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
                            }`}
                            title={lang === "ar" ? "حذف" : "Delete"}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {userRole === 'admin' && (
                          <p className={`text-xs mt-2 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {lang === "ar" ? "لا يمكن حذف المسؤولين" : "Cannot delete admins"}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <div className={`flex flex-col sm:flex-row items-center justify-between py-4 px-6 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm mb-4 sm:mb-0 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {lang === "ar" ? "عرض" : "Showing"} {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} {lang === "ar" ? "من" : "of"} {filteredUsers.length} {lang === "ar" ? "نتيجة" : "results"}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                aria-label={lang === "ar" ? "الصفحة السابقة" : "Previous page"}
              >
                {lang === "ar" ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }

                  if (pageNumber < 1 || pageNumber > totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                aria-label={lang === "ar" ? "الصفحة التالية" : "Next page"}
              >
                {lang === "ar" ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, theme }) => {
  const colorClasses = {
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      border: theme === 'dark' ? 'border-blue-800/30' : 'border-blue-200',
      iconBg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      border: theme === 'dark' ? 'border-red-800/30' : 'border-red-200',
      iconBg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      border: theme === 'dark' ? 'border-green-800/30' : 'border-green-200',
      iconBg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      border: theme === 'dark' ? 'border-purple-800/30' : 'border-purple-200',
      iconBg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
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
        <div className={`p-2 rounded-lg ${colors.iconBg}`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;