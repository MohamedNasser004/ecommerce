import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSidebar } from "./SidebarContext";
import { useTheme } from "./ThemeContext";
import {
  FiHome,
  FiPackage,
  FiFolder,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiPlus,
  FiList,
  FiLogOut,
  FiUser,
  FiCreditCard,
  FiFileText,
  FiImage,
  FiTrendingUp,
} from "react-icons/fi";

// كل عناصر القائمة في مكان واحد. إضافة قسم جديد = سطر جديد هنا، مش نسخ ولصق JSX
const NAV_GROUPS = [
  {
    key: "products",
    label: "المنتجات",
    icon: FiPackage,
    items: [
      { to: "/dashboard/product", label: "كل المنتجات", icon: FiList },
      { to: "/dashboard/product/add", label: "إضافة منتج", icon: FiPlus },
    ],
  },
  {
    key: "categories",
    label: "التصنيفات",
    icon: FiFolder,
    items: [
      { to: "/dashboard/category", label: "كل التصنيفات", icon: FiList },
      { to: "/dashboard/category/add", label: "إضافة تصنيف", icon: FiPlus },
    ],
  },
  {
    key: "offers",
    label: "العروض",
    icon: FiShoppingCart,
    items: [
      { to: "/dashboard/offers", label: "كل العروض", icon: FiList },
      { to: "/dashboard/offers/add", label: "إضافة عرض", icon: FiPlus },
    ],
  },
  {
    key: "orders",
    label: "الطلبات",
    icon: FiCreditCard,
    items: [
      { to: "/dashboard/orders", label: "كل الطلبات", icon: FiList },
      { to: "/dashboard/orders/add", label: "إضافة طلب", icon: FiPlus },
    ],
  },
  {
    key: "articles",
    label: "المدونة",
    icon: FiFileText,
    items: [
      { to: "/dashboard/articles", label: "كل المقالات", icon: FiList },
      { to: "/dashboard/articles/new", label: "مقال جديد", icon: FiPlus },
    ],
  },
  {
    key: "users",
    label: "المستخدمون",
    icon: FiUsers,
    items: [
      { to: "/dashboard/users", label: "كل المستخدمين", icon: FiList },
      { to: "/dashboard/users/add", label: "إضافة مستخدم", icon: FiPlus },
    ],
  },
];

const SINGLE_LINKS = [
  { to: "/dashboard/analytics", label: "الإحصائيات", icon: FiTrendingUp },
  { to: "/dashboard/media", label: "المكتبة", icon: FiImage },
  { to: "/dashboard/settings", label: "الإعدادات", icon: FiSettings },
];

const Sidebar = () => {
  const [openGroup, setOpenGroup] = useState(null);
  const navigate = useNavigate();
  const { isSidebarOpen, isMobile, closeSidebar } = useSidebar();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) closeSidebar();
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [closeSidebar]);

  const toggleGroup = (key) =>
    setOpenGroup((current) => (current === key ? null : key));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleNavClick = () => isMobile && closeSidebar();

  // نظام لون واحد ثابت (أزرق) للحالة النشطة في كل مكان، بدل لون مختلف لكل قسم
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
    }`;

  const groupButtonClass = (isOpen) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isOpen
        ? "bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2 px-3 mr-6 rounded-lg text-sm transition-colors duration-150 border-r-2 ${
      isActive
        ? "border-blue-600 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/30"
        : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200"
    }`;

  return (
    <>
      <aside
        aria-label="القائمة الرئيسية"
        className={`h-full flex flex-col border-l shadow-sm transition-[width] duration-200 ease-in-out
          ${isMobile ? "fixed top-0 z-40" : "relative"}
          ${isSidebarOpen ? "w-64" : "w-20"}
          ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
          ${isMobile ? (isSidebarOpen ? "right-0" : "-right-80") : ""}
        `}
        style={{ height: "100vh" }}
      >
        <div className="h-full flex flex-col py-5 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-10 h-10 shrink-0 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold">
              A
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <h1
                  className={`text-base font-semibold truncate ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  لوحة التحكم
                </h1>
                <p className="text-xs text-gray-400 truncate">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 overflow-y-auto sidebar-scroll">
            <NavLink to="/dashboard" end className={linkClass} onClick={handleNavClick}>
              <FiHome className="w-[18px] h-[18px] shrink-0" />
              {isSidebarOpen && <span>الواجهة الرئيسية</span>}
            </NavLink>

            {NAV_GROUPS.map((group) => {
              const isOpen = openGroup === group.key;
              const GroupIcon = group.icon;
              return (
                <div key={group.key}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    aria-expanded={isOpen}
                    className={groupButtonClass(isOpen)}
                  >
                    <span className="flex items-center gap-3">
                      <GroupIcon className="w-[18px] h-[18px] shrink-0" />
                      {isSidebarOpen && <span>{group.label}</span>}
                    </span>
                    {isSidebarOpen && (
                      <FiChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isOpen && isSidebarOpen && (
                    <div className="mt-1 space-y-0.5">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={subLinkClass}
                            onClick={handleNavClick}
                          >
                            <ItemIcon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {SINGLE_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={handleNavClick}>
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {isSidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Profile */}
          <div
            className={`border-t pt-4 mt-2 px-3 ${
              isDark ? "border-gray-800" : "border-gray-100"
            }`}
          >
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isDark ? "hover:bg-gray-800/60" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <FiUser className="w-[18px] h-[18px]" />
                </div>
                <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>

              {isSidebarOpen && (
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-sm font-medium truncate ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    المدير
                  </p>
                  <p className="text-xs text-gray-400 truncate">Administrator</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                aria-label="تسجيل الخروج"
                title="تسجيل الخروج"
                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
              >
                <FiLogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            onClick={closeSidebar}
          />
        )}
      </aside>

      {/* إخفاء شريط السكرول فقط — بدون jsx prop اللي محتاجة styled-jsx/Next.js */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { display: none; }
        .sidebar-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </>
  );
};

export default Sidebar;