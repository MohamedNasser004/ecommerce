import React from "react";

const Categories = ({
    categories,
    selectedCategory,
    setSelectedCategory,
}) => {
    return (
        <div className="mb-10 mt-10 align-center flex w-full flex-col items-center justify-center gap-3">
            <div className="flex text-center gap-3 overflow-x-auto pb-3 scrollbar-hide">

                {categories.map((category, index) => {
                    // =========================
                    // Category Translation
                    // =========================
                    const categoryTranslation =
                        category.translations?.find(
                            (item) => item.language === "ar"
                        ) || category.translations?.[0];

                    // =========================
                    // Active Category
                    // =========================
                    const isActive =
                        selectedCategory?.id === category.id;

                    return (
                        <button
                            key={category.id || index}
                            type="button"
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                            className={`
                                whitespace-nowrap
                                rounded-xl
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                transition-all
                                duration-300
                                ${isActive
                                    ? "bg-[#25147C] text-white shadow-lg"
                                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#25147C]"
                                }
                            `}
                        >
                            {categoryTranslation?.name || "Category"}
                        </button>
                    );
                })}

            </div>
        </div>
    );
};

export default Categories;