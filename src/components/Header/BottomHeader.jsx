import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";

const BottomHeader = () => {
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [translationCategories, setTranslationCategories] = useState({});

  // ==========================================
  // Fetch Categories
  // ==========================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/categories",
          {
            headers: {
              "x-api-key": "AmKalbazSecretKeyAmKalbaz2025AmKalbaz",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setCategories(data);

        console.log("Fetched categories:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // Get Arabic Translations
  // ==========================================
  useEffect(() => {
    if (!categories.length) {
      return;
    }

    const translations = {};

    categories.forEach((category) => {
      const arabicTranslation = category.translations?.find(
        (translation) => translation.language === "ar"
      );

      translations[category.id] = arabicTranslation || {
        name: "بدون اسم",
        description: "",
      };
    });

    setTranslationCategories(translations);
  }, [categories]);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-14 flex items-center justify-center gap-8">
          {/* ==========================================
              Categories
          ========================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategories((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-4 text-sm font-medium transition-colors hover:text-gray-300"
            >
              <IoMdMenu className="text-2xl" />

              <span>All Categories</span>

              <MdOutlineArrowDropDown
                className={`text-xl transition-transform duration-200 ${showCategories ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* ==========================================
                Dropdown
            ========================================== */}
            {showCategories && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  z-50
                  w-64
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  text-gray-800
                  shadow-xl
                "
              >
                {/* Dropdown Header */}
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Categories
                  </p>
                </div>

                {/* Categories List */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const translation =
                        translationCategories[category.id];

                      return (
                        <Link
                          key={category.id}
                          to={`/categories/${category.id}`}
                          onClick={() => setShowCategories(false)}
                          className="
                            flex
                            items-center
                            justify-between
                            px-4
                            py-3
                            text-sm
                            text-gray-700
                            transition-colors
                            hover:bg-gray-50
                            hover:text-gray-900
                          "
                        >
                          <span>
                            {translation?.name || "بدون اسم"}
                          </span>

                          <span className="text-gray-300">
                            →
                          </span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-5 text-sm text-gray-400">
                      Loading categories...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==========================================
              Navigation Links
          ========================================== */}
          <div className="hidden items-center gap-1 sm:flex">
            <Link
              to="/"
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              Home
            </Link>

            <Link
              to="/products"
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              Products
            </Link>

            <Link
              to="/about"
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              About
            </Link>

            <Link
              to="/contact"
              className="
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomHeader;