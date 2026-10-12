import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import toast from "react-hot-toast";
import {
  FiUserPlus,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiSave,
  FiArrowLeft,
  FiUsers
} from "react-icons/fi";

const AddUser = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // الحصول على اللغة من localStorage
  const lang = localStorage.getItem("lang") || "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // const role = localStorage.getItem("role");

    // if (!token || role?.trim().toLowerCase() !== "admin") {
    //   toast.error(lang === "ar" ? "يجب تسجيل الدخول كمسؤول" : "You must be logged in as admin");
    //   navigate("/");
    // }
  }, [navigate, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
         headers: {
           "Content-Type": "application/json",
        //   Authorization: `Bearer ${token}`,
         },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(lang === "ar" ? "تمت إضافة المستخدم بنجاح!" : "User added successfully!");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setRole("");
        navigate("/dashboard/users");
      } else {
        toast.error(data.message || (lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error submitting form"));
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
            {lang === "ar" ? "إضافة مستخدم جديد" : "Add New User"}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {lang === "ar" ? "املأ النموذج لإضافة مستخدم جديد" : "Fill the form to add a new user"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/users")}
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
        {/* User Information Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            <FiUser className="w-5 h-5" />
            {lang === "ar" ? "معلومات المستخدم" : "User Information"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiUser className="w-4 h-4" />
                {lang === "ar" ? "الاسم الكامل" : "Full Name"} *
              </label>
              <input
                type="text"
                placeholder={lang === "ar" ? "أدخل الاسم الكامل" : "Enter full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiPhone className="w-4 h-4" />
                {lang === "ar" ? "رقم الهاتف" : "Phone Number"} *
              </label>
              <input
                type="text"
                placeholder={lang === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiMail className="w-4 h-4" />
                {lang === "ar" ? "البريد الإلكتروني" : "Email Address"} *
              </label>
              <input
                type="email"
                placeholder={lang === "ar" ? "أدخل البريد الإلكتروني" : "Enter email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FiLock className="w-4 h-4" />
                {lang === "ar" ? "كلمة المرور" : "Password"} *
              </label>
              <input
                type="password"
                placeholder={lang === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border`}
                required
              />
            </div>
          </div>
        </div>

        {/* Role Selection Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}>
            <FiUsers className="w-5 h-5" />
            {lang === "ar" ? "صلاحيات المستخدم" : "User Permissions"}
          </h3>
          
          <div>
            <label className={`block text-sm font-medium mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {lang === "ar" ? "اختر دور المستخدم" : "Select User Role"} *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Role Card */}
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`border rounded-xl p-4 text-left transition-all duration-200 ${
                  role === "user"
                    ? theme === 'dark' 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-blue-500 bg-blue-50'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    role === "user"
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <FiUser className={`w-5 h-5 ${
                      role === "user" 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      role === "user"
                        ? 'text-blue-700 dark:text-blue-400'
                        : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {lang === "ar" ? "مستخدم" : "User"}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {lang === "ar" 
                        ? "صلاحيات محدودة - يمكنه التسوق والشراء فقط"
                        : "Limited permissions - can only shop and purchase"
                      }
                    </p>
                  </div>
                </div>
              </button>

              {/* Admin Role Card */}
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`border rounded-xl p-4 text-left transition-all duration-200 ${
                  role === "admin"
                    ? theme === 'dark' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-purple-500 bg-purple-50'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    role === "admin"
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <FiUsers className={`w-5 h-5 ${
                      role === "admin" 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      role === "admin"
                        ? 'text-purple-700 dark:text-purple-400'
                        : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {lang === "ar" ? "مسؤول" : "Admin"}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {lang === "ar" 
                        ? "صلاحيات كاملة - الوصول لجميع أجزاء النظام"
                        : "Full permissions - access to all system parts"
                      }
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <input
              type="hidden"
              value={role}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
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
            disabled={loading || !role}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${loading || !role ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiUserPlus className="w-5 h-5" />
            {loading 
              ? (lang === "ar" ? "جاري الإضافة..." : "Adding...") 
              : (lang === "ar" ? "إضافة المستخدم" : "Add User")
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;