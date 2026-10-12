import React, { useEffect, useState } from "react";
import Categories from "./Categories";
import Products from "./Products";

const Api = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // =========================
    // Fetch Categories
    // =========================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);

                const res = await fetch(
                    "http://localhost:3001/api/categories"
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data = await res.json();

                setCategories(data);

                // اختيار أول Category تلقائيًا
                if (data.length > 0) {
                    setSelectedCategory(data[0]);
                }

                console.log("Fetched categories:", data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // =========================
    // Fetch Products By Category
    // =========================
    useEffect(() => {
        if (!selectedCategory) {
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);

                const res = await fetch(
                    `http://localhost:3001/api/products/category/${selectedCategory.id}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await res.json();

                setProducts(data);

                console.log(
                    `Products for category ${selectedCategory.id}:`,
                    data
                );
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    // =========================
    // Loading Categories
    // =========================
    if (loadingCategories) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">
                    جاري تحميل التصنيفات...
                </p>
            </div>
        );
    }

    return (
        <section className="w-full">
            {/* Categories */}
            <Categories
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* Products */}
            <Products
                products={products}
                loading={loadingProducts}
            />
        </section>
    );
};

export default Api;