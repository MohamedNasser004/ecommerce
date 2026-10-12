import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Category = () => {
    const { id } = useParams();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3001/api/products/category/${id}`,
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const productsData = Array.isArray(data)
                    ? data
                    : data?.products || data?.data || [];

                setCategories(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("حدث خطأ أثناء تحميل المنتجات");
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchCategories();
        }
    }, [id]);

    // =========================
    // Loading
    // =========================
    if (loading) {
        return (
            <section dir="rtl" className="w-full bg-[#FAFAF8] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-[3px] border-[#E8E6E0] border-t-[#1E1355]" />
                        <p className="font-body text-sm text-[#6B6B6B]">
                            جاري تحميل المنتجات...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // =========================
    // Error
    // =========================
    if (error) {
        return (
            <section dir="rtl" className="w-full bg-[#FAFAF8] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="max-w-sm rounded-lg border border-[#E7C9C3] bg-[#FBF1EF] px-6 py-5 text-center">
                        <p className="font-body text-sm font-semibold text-[#9A3B2C]">
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // =========================
    // No Products
    // =========================
    if (categories.length === 0) {
        return (
            <section dir="rtl" className="w-full bg-[#FAFAF8] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
                <div className="flex min-h-[320px] items-center justify-center">
                    <div className="max-w-sm rounded-lg border border-[#E8E6E0] bg-white px-8 py-6 text-center">
                        <p className="font-body text-sm text-[#8A8A8A]">
                            لا توجد منتجات في هذا التصنيف حاليًا
                        </p>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section dir="rtl" className="w-full bg-[#FAFAF8] px-4 py-16 sm:px-6 md:px-10 lg:px-16">
            <div className="mb-16 last:mb-0">
                {/* =========================
                    Products Grid
                ========================= */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    {categories.map((product) => {
                        const translation =
                            product.translations?.find((t) => t.language === "ar") ||
                            product.translations?.[0];

                        const firstImage =
                            product.images?.[0]?.image ||
                            product.image ||
                            product.product_image;

                        const variants = product.variants || [];
                        const title = translation?.name || product.name || "بدون اسم";
                        const description =
                            translation?.short_description ||
                            translation?.description ||
                            product.short_description ||
                            product.description ||
                            "";

                        return (
                            <article
                                key={product.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-[#E8E6E0] bg-white transition-colors duration-300 hover:border-[#1E1355]"
                            >
                                {/* Image */}
                                <Link
                                    to={`/product/${product.id}`}
                                    className="relative block aspect-square bg-[#F1EFFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1355]"
                                >
                                    {product.pricing?.has_offer && (
                                        <span className="absolute top-3 end-3 z-10 rounded-full bg-[#9A3B2C] px-2.5 py-1 font-body text-[10px] font-semibold text-white">
                                            عرض خاص
                                        </span>
                                    )}

                                    {firstImage ? (
                                        <img
                                            src={`http://localhost:3001/uploads/products/${firstImage}`}
                                            alt={title}
                                            loading="lazy"
                                            className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out motion-reduce:transition-none hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-body text-sm text-[#B4B0C9]">
                                            لا توجد صورة
                                        </div>
                                    )}
                                </Link>

                                {/* Info */}
                                <div className="flex flex-1 flex-col gap-3 p-4 text-right">
                                    <div>
                                        <h3 className="truncate font-headline text-base font-bold text-[#14121F] md:text-lg">
                                            {title}
                                        </h3>
                                        {description && (
                                            <p className="mt-1 line-clamp-2 font-body text-xs leading-5 text-[#8A8A8A] md:text-sm md:leading-6">
                                                {description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sizes & Prices — each variant its own box: size on top, price below */}
                                    <div className="mt-auto">
                                        {variants.length === 0 ? (
                                            <div className="rounded-lg border border-[#E8E6E0] bg-[#FAFAF8] py-2 text-center font-body text-xs text-[#B4B0C9]">
                                                السعر غير متوفر
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant.id}
                                                        className="flex min-w-[64px] flex-1 flex-col items-center gap-0.5 rounded-lg border border-[#E8E6E0] bg-[#FAFAF8] px-2 py-2 text-center"
                                                    >
                                                        <span className="truncate font-body text-[11px] text-[#8A8A8A]">
                                                            {variant.variant_name || variant.name || "الحجم"}
                                                        </span>
                                                        <span className="font-headline text-sm font-bold text-[#B8862F]">
                                                            {Number(
                                                                variant.final_price ?? variant.price ?? 0,
                                                            ).toFixed(2)}
                                                            <span className="mr-1 font-body text-[10px] font-normal text-[#8A8A8A]">
                                                                جنيه
                                                            </span>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#1E1355] py-2.5 font-body text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#160D40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1355]"
                                    >
                                        عرض التفاصيل
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Category;