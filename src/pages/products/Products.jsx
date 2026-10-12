import React from "react";
import { Link } from "react-router-dom";

const Products = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="flex min-h-[250px] items-center justify-center">
                <p className="text-[#77758A]">جاري تحميل المنتجات...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex min-h-[250px] items-center justify-center">
                <p className="text-[#77758A]">
                    لا توجد منتجات في هذا التصنيف
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            <div className="grid grid-cols-1 pr-8 pl-8 pb-8 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                    const translation =
                        product.translations?.find(
                            (item) => item.language === "ar"
                        ) || product.translations?.[0];

                    const firstImage = product.images?.[0]?.image;
                    const variants = product.variants || [];

                    return (
                        <div
                            key={product.id}
                            className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#E8EAF2] bg-white shadow-[0_4px_20px_rgba(23,21,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8D0FF] hover:shadow-[0_10px_30px_rgba(50,21,143,0.09)]"
                        >
                            <Link
                                to={`/product/${product.id}`}
                                className="block"
                            >
                                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#F3F4F8] p-5">
                                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#F0EDFF] transition-transform duration-500 group-hover:scale-150" />

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
                                        <div className="relative z-10 flex h-full w-full items-center justify-center text-sm text-[#77758A]">
                                            لا توجد صورة
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="truncate text-center text-base font-bold text-[#17152A]">
                                    {translation?.name || "بدون اسم"}
                                </h3>

                                <p className="mt-1 line-clamp-2 min-h-[36px] text-center text-xs leading-5 text-[#77758A]">
                                    {translation?.short_description ||
                                        translation?.description ||
                                        ""}
                                </p>

                                <div className="mt-3">
                                    {variants.length > 0 ? (
                                        variants.length === 1 ? (
                                            <div className="rounded-lg border border-[#E4DFFF] bg-[#F6F4FF] px-3 py-2 text-center">
                                                <div className="mb-0.5 text-[11px] text-[#77758A]">
                                                    {
                                                        variants[0]
                                                            .variant_name
                                                    }
                                                </div>

                                                <div className="text-lg font-extrabold text-[#32158F]">
                                                    {Number(
                                                        variants[0].final_price
                                                    ).toFixed(2)}
                                                </div>

                                                <div className="text-[10px] text-[#77758A]">
                                                    جنيه
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`grid gap-2 ${
                                                    variants.length === 2
                                                        ? "grid-cols-2"
                                                        : "grid-cols-3"
                                                }`}
                                            >
                                                {variants.map((variant) => (
                                                    <div
                                                        key={variant.id}
                                                        className="flex min-h-[58px] flex-col items-center justify-center rounded-lg border border-[#E4DFFF] bg-[#F6F4FF] px-2 py-1.5 transition-colors hover:border-[#D8D0FF] hover:bg-[#F0EDFF]"
                                                    >
                                                        <span className="mb-0.5 truncate text-[10px] font-medium text-[#77758A]">
                                                            {
                                                                variant.variant_name
                                                            }
                                                        </span>

                                                        <span className="text-sm font-bold text-[#32158F]">
                                                            {Number(
                                                                variant.final_price
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="rounded-lg border border-[#E8EAF2] bg-[#F7F8FC] py-2.5 text-center text-xs text-[#77758A]">
                                            السعر غير متوفر
                                        </div>
                                    )}
                                </div>

                                {product.pricing?.has_offer && (
                                    <div className="mt-2 rounded-lg bg-[#F0EDFF] px-3 py-1.5 text-center text-xs font-semibold text-[#32158F]">
                                        يوجد عرض على المنتج
                                    </div>
                                )}

                                <Link
                                    to={`/product/${product.id}`}
                                    className="mt-3 flex items-center justify-center rounded-lg bg-[#32158F] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#24106F] hover:shadow-[0_6px_18px_rgba(50,21,143,0.2)]"
                                >
                                    View Details
                                    <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">
                                        →
                                    </span>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Products;