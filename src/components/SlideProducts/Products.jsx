import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log(products);
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
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            {/* Product Card */}
            <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Image */}
              <Link to={`/product/${product.id}`}>
                <div className="flex h-60 items-center justify-center overflow-hidden bg-gray-50 p-5">
                  <img
                    src={`http://localhost:7000/uploads/products/${product.image}`}
                    alt={product.title}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {product.category}
                </span>
                <h3 className="mt-2 text-center truncate text-2xl  font-semibold text-gray-900">
                  {product.title}
                </h3>
                <p className="mt-2 text-center line-clamp-2 h-10 text-xl leading-5 text-gray-500">
                  {product.description}
                </p>
                {/* الأحجام والأسعار */}
                {product.sizes && product.sizes.length > 0 ? (
                  <div className="mb-4">
                    {product.sizes.length === 1 ? (
                      // حجم واحد
                      <div
                        className="flex min-h-[60px] items-center justify-center rounded-lg border bg-white p-2"
                        style={{ color: "#25147C" }}
                      >
                        <span
                          className="text-xl font-bold"
                          style={{ color: "#25147C" }}
                        >
                          {product.sizes[0].price}
                        </span>
                      </div>
                    ) : (
                      // أكتر من حجم
                      <div className="flex w-full gap-2">
                        {product.sizes.map((size, index) => (
                          <div
                            key={index}
                            className="min-w-0 flex-1 text-center"
                          >
                            <div
                              className="flex h-full min-h-[65px] flex-col items-center justify-center rounded-lg border bg-white p-2"
                              style={{ fontFamily: "Tajawal" }}
                            >
                              <div className="mb-1 truncate text-xs text-gray-500">
                                {size.size}
                              </div>

                              <div
                                className="text-sm font-bold"
                                style={{ color: "#25147C" }}
                              >
                                {size.price}
                              </div>
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
                <Link
                  to={`/product/${product.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Products;
