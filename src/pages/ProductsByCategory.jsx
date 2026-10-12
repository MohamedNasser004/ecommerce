import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const ProductsByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Get Categories
  // =========================
  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        return res.json();
      })
      .then((data) => {
        setCategories(data);

        // اختيار أول Category تلقائيًا
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }

        console.log("Fetched categories:", data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // =========================
  // Get Products For Selected Category
  // =========================
  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);

    fetch(
      `http://localhost:3001/api/products/category/${selectedCategory.id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data);

        console.log(
          `Products for category ${selectedCategory.id}:`,
          data
        );
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 md:px-10 lg:px-16">

      {/* =========================
          Categories
      ========================= */}
      <div className="mb-10">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">

          {categories.map((category, index) => {
            // =========================
            // Category Translation
            // =========================
            const categoryTranslation =
              category.translations?.find(
                (item) => item.language === "ar"
              ) || category.translations?.[0];

            const isActive =
              selectedCategory?.id === category.id;

            return (
              <button
                key={category.id || index}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`
                  whitespace-nowrap rounded-xl px-6 py-3
                  text-sm font-semibold
                  transition-all duration-300
                  ${
                    isActive
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

      {/* =========================
          Loading
      ========================= */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-sm text-gray-500">
            جاري تحميل المنتجات...
          </div>
        </div>
      ) : products.length === 0 ? (

        /* =========================
           No Products
        ========================= */
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-sm text-gray-400">
            لا توجد منتجات في هذا التصنيف
          </div>
        </div>

      ) : (

        /* =========================
           Products Slider
        ========================= */
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            navigation={true}
            modules={[Navigation]}
            className="products-swiper !px-1 !pb-2"
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },

              640: {
                slidesPerView: 2,
                spaceBetween: 18,
              },

              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },

              1024: {
                slidesPerView: 4,
                spaceBetween: 22,
              },

              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
          >
            {products.map((product) => {

              // =========================
              // Product Translation
              // =========================
              const translation =
                product.translations?.find(
                  (item) => item.language === "ar"
                ) || product.translations?.[0];

              // =========================
              // Product Images
              // =========================
              const firstImage =
                product.images?.[0]?.image;

              // =========================
              // Product Variants
              // =========================
              const variants = product.variants || [];

              return (
                <SwiperSlide
                  key={product.id}
                  className="!h-auto"
                >
                  {/* =========================
                      Product Card
                  ========================= */}
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]">

                    {/* =========================
                        Image
                    ========================= */}
                    <Link
                      to={`/product/${product.id}`}
                      className="block"
                    >
                      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-50 p-6 md:h-72">

                        {/* Background decoration */}
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />

                        {firstImage ? (
                          <img
                            src={`http://localhost:3001/uploads/products/${firstImage}`}
                            alt={
                              translation?.name ||
                              "Product"
                            }
                            loading="lazy"
                            className="relative z-10 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="relative z-10 flex h-full w-full items-center justify-center text-sm text-gray-400">
                            لا توجد صورة
                          </div>
                        )}

                      </div>
                    </Link>

                    {/* =========================
                        Product Info
                    ========================= */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Product Title */}
                      <h3 className="min-h-[28px] truncate text-center text-lg font-bold text-gray-900">
                        {translation?.name ||
                          "بدون اسم"}
                      </h3>

                      {/* Product Description */}
                      <p className="mt-2 line-clamp-2 min-h-[40px] text-center text-sm leading-5 text-gray-500">
                        {translation?.short_description ||
                          translation?.description ||
                          ""}
                      </p>

                      {/* =========================
                          Variants & Prices
                      ========================= */}
                      <div className="mt-5">

                        {variants.length > 0 ? (

                          variants.length === 1 ? (

                            /* Single Variant */
                            <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-center">

                              <div className="mb-1 text-xs text-gray-500">
                                {variants[0].variant_name}
                              </div>

                              <div className="text-xl font-extrabold text-[#25147C]">
                                {Number(
                                  variants[0]
                                    .final_price
                                ).toFixed(2)}
                              </div>

                              <div className="text-xs text-gray-400">
                                جنيه
                              </div>

                            </div>

                          ) : (

                            /* Multiple Variants */
                            <div className="grid grid-cols-2 gap-2">

                              {variants.map(
                                (variant) => (
                                  <div
                                    key={variant.id}
                                    className="flex min-h-[65px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-2 transition hover:border-blue-200 hover:bg-blue-50/40"
                                  >

                                    {/* Variant Name */}
                                    <span className="mb-1 truncate text-xs font-medium text-gray-500">
                                      {
                                        variant.variant_name
                                      }
                                    </span>

                                    {/* Price */}
                                    <span className="text-sm font-bold text-[#25147C]">
                                      {Number(
                                        variant.final_price
                                      ).toFixed(2)}
                                    </span>

                                    <span className="text-[10px] text-gray-400">
                                      جنيه
                                    </span>

                                  </div>
                                )
                              )}

                            </div>

                          )

                        ) : (

                          /* No Price */
                          <div className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-center text-sm text-gray-400">
                            السعر غير متوفر
                          </div>

                        )}

                      </div>

                      {/* =========================
                          Offer
                      ========================= */}
                      {product.pricing?.has_offer && (
                        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-600">
                          يوجد عرض على المنتج
                        </div>
                      )}

                      {/* =========================
                          Button
                      ========================= */}
                      <Link
                        to={`/product/${product.id}`}
                        className="mt-5 flex items-center justify-center rounded-xl bg-[#25147C] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1c0e63] hover:shadow-lg"
                      >
                        View Details

                        <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
                          →
                        </span>
                      </Link>

                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

    </section>
  );
};

export default ProductsByCategory;