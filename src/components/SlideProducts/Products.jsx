import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <section className="w-full px-6 py-12 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-blue-600">
            Our Products
          </span>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
        </div>

        <Link
          to="/products"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
        >
          View All →
        </Link>
      </div>

      {/* Products Slider */}
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        className="w-full"
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product) => {
          // =========================
          // Arabic Translation
          // =========================
          const translation =
            product.translations?.find(
              (item) => item.language === "ar"
            ) || product.translations?.[0];

          // =========================
          // First Image
          // =========================
          const firstImage = product.images?.[0]?.image;

          // =========================
          // Variants
          // =========================
          const variants = product.variants || [];

          return (
            <SwiperSlide key={product.id}>
              {/* Product Card */}
              <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="flex h-60 items-center justify-center overflow-hidden bg-gray-50 p-5">
                    {firstImage ? (
                      <img
                        src={`http://localhost:3001/uploads/products/${firstImage}`}
                        alt={translation?.name || "Product"}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5">
                  {/* Category */}
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Category #{product.category_id}
                  </span>

                  {/* Product Name */}
                  <h3 className="mt-2 truncate text-center text-2xl font-semibold text-gray-900">
                    {translation?.name || "اسم المنتج غير متوفر"}
                  </h3>

                  {/* Short Description */}
                  <p className="mt-2 line-clamp-2 h-10 text-center text-xl leading-5 text-gray-500">
                    {translation?.short_description ||
                      "لا يوجد وصف"}
                  </p>

                  {/* Variants / Prices */}
                  {variants.length > 0 ? (
                    <div className="mb-4 mt-4">
                      {variants.length === 1 ? (
                        /* Variant واحد */
                        <div
                          className="flex min-h-[60px] items-center justify-center rounded-lg border bg-white p-2"
                          style={{ color: "#25147C" }}
                        >
                          <span className="text-xl font-bold">
                            {variants[0].final_price} جنيه
                          </span>
                        </div>
                      ) : (
                        /* أكثر من Variant */
                        <div className="flex w-full gap-2">
                          {variants.map((variant) => (
                            <div
                              key={variant.id}
                              className="min-w-0 flex-1 text-center"
                            >
                              <div
                                className={`flex min-h-[65px] h-full flex-col items-center justify-center rounded-lg border p-2 ${variant.stock === 0
                                    ? "bg-gray-100 opacity-60"
                                    : "bg-white"
                                  }`}
                              >
                                {/* Variant Name */}
                                <div className="mb-1 truncate text-xs text-gray-500">
                                  {variant.variant_name}
                                </div>

                                {/* Price */}
                                <div
                                  className="text-sm font-bold"
                                  style={{ color: "#25147C" }}
                                >
                                  {variant.final_price} جنيه
                                </div>

                                {/* Stock */}
                                {variant.stock === 0 ? (
                                  <span className="mt-1 text-xs text-red-500">
                                    غير متوفر
                                  </span>
                                ) : (
                                  <span className="mt-1 text-xs text-green-600">
                                    متوفر
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 rounded-lg border bg-gray-50 py-2 text-center text-sm text-gray-500">
                      السعر غير متوفر
                    </div>
                  )}

                  {/* View Details */}
                  <div className="flex justify-center">
                    <Link
                      to={`/product/${product.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Products;