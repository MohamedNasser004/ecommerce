import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
const ProductsByCategory = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // Get Categories
    useEffect(() => {
        fetch("https://dummyjson.com/products/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    // Get Products for every Category
    useEffect(() => {
        if (categories.length === 0) return;

        const requests = categories.map((category) => {
            return fetch(
                `https://dummyjson.com/products/category/${category.slug}`
            ).then((res) => res.json());
        });

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
        <div className="w-full px-6 py-12 md:px-10 lg:px-16">
            {categories.map((category, index) => (
                <div key={category.slug || index}>
                    <h2 className="text-2xl font-600 text-gray-600 p-2">{category.name}</h2>
                    <p className="text-gray-500 p-2">
                        {category.description}
                    </p>

                    <div>
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
                            {products[index]?.products?.map((product) => (
                                <SwiperSlide key={product.id}>

                                    {/* Product Card */}
                                    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                                        {/* Image */}
                                        <Link to={`/product/${product.id}`}>
                                            <div className="flex h-60 items-center justify-center overflow-hidden bg-gray-50 p-5">
                                                <img
                                                    src={product.thumbnail}
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

                                            <h3 className="mt-2 truncate text-lg font-semibold text-gray-900">
                                                {product.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 h-10 text-sm leading-5 text-gray-500">
                                                {product.description}
                                            </p>

                                            <div className="mt-5 flex items-center justify-between">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>

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
                            ))}
                        </Swiper>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsByCategory;
