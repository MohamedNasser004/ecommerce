import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const ProductsByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // =========================
  // Get Categories
  // =========================
  useEffect(() => {
    fetch("http://localhost:7000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // =========================
  // Get Products For Categories
  // =========================
  useEffect(() => {
    if (categories.length === 0) return;

    const requests = categories.map((category) =>
      fetch(
        `http://localhost:7000/api/products/category/${category.id}`
      ).then((res) => {
        if (!res.ok) {
          return { products: [] };
        }

        return res.json();
      })
    );

    Promise.all(requests)
      .then((data) => {
        setProducts(data);
        console.log("All products:", data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [categories]);

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 md:px-10 lg:px-16">

      {categories.map((category, index) => {

        const categoryProducts =
          products[index]?.products || [];

        // لو التصنيف مفيهوش منتجات متظهرهوش
        if (categoryProducts.length === 0) {
          return null;
        }

        return (
          <div
            key={category.id || index}
            className="mb-16 last:mb-0"
          >

            {/* =========================
                Category Header
            ========================= */}
            <div className="mb-7">

              <div className="flex items-center gap-4">

                {/* Line */}
                <div className="hidden h-px flex-1 bg-gray-200 sm:block" />

                {/* Title */}
                <div className="text-right">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Collection
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {category.category_name}
                  </h2>
                </div>

              </div>

              {category.description && (
                <p className="mt-2 max-w-2xl ml-auto text-right text-sm leading-6 text-gray-500">
                  {category.description}
                </p>
              )}

            </div>

            {/* =========================
                Products Slider
            ========================= */}
            <div className="relative">

              <Swiper
                slidesPerView={1}
                spaceBetween={16}
                navigation={true}
                modules={[Navigation]}
                className="products-swiper !pb-2 !px-1"
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

                {categoryProducts.map((product) => (

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

                          <img
                            src={`http://localhost:7000/uploads/products/${product.image}`}
                            alt={product.title}
                            loading="lazy"
                            className="relative z-10 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                          />

                        </div>
                      </Link>

                      {/* =========================
                          Product Info
                      ========================= */}
                      <div className="flex flex-1 flex-col p-5">

                        {/* Category */}
                        <span className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          {product.category_name}
                        </span>

                        {/* Title */}
                        <h3 className="min-h-[28px] truncate text-center text-lg font-bold text-gray-900">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 line-clamp-2 min-h-[40px] text-center text-sm leading-5 text-gray-500">
                          {product.description}
                        </p>

                        {/* =========================
                            Sizes & Prices
                        ========================= */}
                        <div className="mt-5">

                          {product.sizes &&
                          product.sizes.length > 0 ? (

                            product.sizes.length === 1 ? (

                              /* Single Size */
                              <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-center">

                                <div className="mb-1 text-xs text-gray-500">
                                  {product.sizes[0].size}
                                </div>

                                <div className="text-xl font-extrabold text-[#25147C]">
                                  {product.sizes[0].price}
                                </div>

                              </div>

                            ) : (

                              /* Multiple Sizes */
                              <div className="grid grid-cols-2 gap-2">

                                {product.sizes.map(
                                  (size) => (

                                    <div
                                      key={size.id}
                                      className="flex min-h-[65px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-2 py-2 transition hover:border-blue-200 hover:bg-blue-50/40"
                                    >

                                      <span className="mb-1 truncate text-xs font-medium text-gray-500">
                                        {size.size}
                                      </span>

                                      <span className="text-sm font-bold text-[#25147C]">
                                        {size.price}
                                      </span>

                                    </div>

                                  )
                                )}

                              </div>

                            )

                          ) : (

                            <div className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-center text-sm text-gray-400">
                              السعر غير متوفر
                            </div>

                          )}

                        </div>

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

                ))}

              </Swiper>

            </div>

          </div>
        );
      })}

    </section>
  );
};

export default ProductsByCategory;
