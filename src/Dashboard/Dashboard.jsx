import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import {
  FiSun,
  FiMoon,
  FiBell,
  FiSearch,
  FiLayout,
  FiBarChart2,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

// روابط سريعة في شاشة الترحيب — نفس لون واحد بدل لون مختلف لكل بطاقة
const QUICK_LINKS = [
  { icon: FiLayout, label: "لوحات المعلومات" },
  { icon: FiBarChart2, label: "الإحصائيات" },
  { icon: FiUsers, label: "المستخدمون" },
  { icon: FiSettings, label: "الإعدادات" },
];

const iconButtonClass =
  "p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors duration-150";

const Dashboard = () => {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboardHome =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex h-16 items-center justify-between bg-white dark:bg-gray-800 px-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className={`${iconButtonClass} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              aria-label={isSidebarOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
            >
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>

            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {isDashboardHome ? "لوحة التحكم" : "الصفحة الحالية"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className={iconButtonClass} aria-label="بحث">
              <FiSearch className="w-5 h-5" />
            </button>

            <button className={`${iconButtonClass} relative`} aria-label="الإشعارات">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
            </button>

            <button
              onClick={toggleTheme}
              className={`${iconButtonClass} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              aria-label="تبديل الوضع الداكن"
            >
              {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>

            <div className="relative cursor-pointer mr-1">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                م
              </div>
              <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
          </div>
        </header>

        {/* محتوى الصفحة */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {isDashboardHome ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  <HiOutlineSparkles className="w-9 h-9 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                    مرحباً بك في لوحة التحكم
                  </h1>
                  <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    اختر أحد الخيارات من القائمة الجانبية للبدء في إدارة تطبيقك
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
                  {QUICK_LINKS.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-150"
                    >
                      <Icon className="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400" />
                      <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">الإصدار 2.0</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 lg:p-8 h-full">
                <Outlet />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;