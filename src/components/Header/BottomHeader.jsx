import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";

const BottomHeader = () => {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "https://dummyjson.com/products/categories"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data = await response.json();

                setCategories(data);
            } catch (error) {
                console.error(
                    "Error fetching categories:",
                    error
                );
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="min-h-14 flex items-center justify-center gap-8">

                    {/* =========================
                        Categories
                    ========================= */}
                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setShowCategories((prev) => !prev)
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                py-4
                                px-3
                                font-medium
                                text-sm
                                hover:text-gray-300
                                transition-colors
                            "
                        >
                            <IoMdMenu className="text-2xl" />

                            <span>
                                All Categories
                            </span>

                            <MdOutlineArrowDropDown
                                className={`
                                    text-xl
                                    transition-transform
                                    duration-200
                                    ${showCategories
                                        ? "rotate-180"
                                        : ""
                                    }
                                `}
                            />
                        </button>


                        {/* =========================
                            Dropdown
                        ========================= */}
                        {showCategories && (
                            <div
                                className="
                                    absolute
                                    top-full
                                    left-0
                                    z-50
                                    w-64
                                    bg-white
                                    rounded-xl
                                    shadow-xl
                                    border
                                    border-gray-100
                                    overflow-hidden
                                    text-gray-800
                                "
                            >

                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Categories
                                    </p>
                                </div>

                                <div className="max-h-80 overflow-y-auto py-2">

                                    {categories.length > 0 ? (
                                        categories.map(
                                            (category) => (
                                                <Link
                                                    key={category.slug}
                                                    to={`/category/${category.slug}`}
                                                    onClick={() =>
                                                        setShowCategories(
                                                            false
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        text-gray-700
                                                        hover:bg-gray-50
                                                        hover:text-gray-900
                                                        transition-colors
                                                    "
                                                >
                                                    <span>
                                                        {category.name}
                                                    </span>

                                                    <span className="text-gray-300">
                                                        →
                                                    </span>
                                                </Link>
                                            )
                                        )
                                    ) : (
                                        <div className="px-4 py-5 text-sm text-gray-400">
                                            Loading categories...
                                        </div>
                                    )}

                                </div>

                            </div>
                        )}

                    </div>


                    {/* =========================
                        Navigation Links
                    ========================= */}
                    <div className="hidden sm:flex items-center gap-1">

                        <Link
                            to="/"
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-300
                                hover:bg-gray-800
                                hover:text-white
                                transition
                            "
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-300
                                hover:bg-gray-800
                                hover:text-white
                                transition
                            "
                        >
                            Products
                        </Link>

                        <Link
                            to="/about"
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-300
                                hover:bg-gray-800
                                hover:text-white
                                transition
                            "
                        >
                            About
                        </Link>

                        <Link
                            to="/contact"
                            className="
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-medium
                                text-gray-300
                                hover:bg-gray-800
                                hover:text-white
                                transition
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