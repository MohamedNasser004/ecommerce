import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";

const ProductDescription = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [product, setProduct] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Get Product
  // =========================
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:3001/api/products/${id}`,
        );

        if (!response.ok) {
          throw new Error("حدث خطأ أثناء جلب المنتج");
        }

        const data = await response.json();

        console.log("PRODUCT:", data);

        setProduct(data);

        // =========================
        // Product Images
        // =========================
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image);
        } else {
          setSelectedImage("");
        }

        // =========================
        // Select First Variant
        // =========================
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        } else {
          setSelectedVariant(null);
        }
      } catch (err) {
        console.error("GET PRODUCT ERROR:", err);

        setError("حدث خطأ أثناء تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          جاري تحميل المنتج...
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  // =========================
  // Product Not Found
  // =========================
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          المنتج غير موجود
        </div>
      </div>
    );
  }

  // =========================
  // Arabic Translation
  // =========================
  const translation =
    product.translations?.find((item) => item.language === "ar") ||
    product.translations?.[0];

  // =========================
  // Images
  // =========================
  const images = product.images || [];

  // =========================
  // Variants
  // =========================
  const variants = product.variants || [];

  // =========================
  // Image URL
  // =========================
  const imageUrl = selectedImage
    ? `http://localhost:3001/uploads/products/${selectedImage}`
    : "";

  // =========================
  // Price
  // =========================
  const price = selectedVariant ? Number(selectedVariant.final_price) : 0;

  // =========================
  // Original Price
  // =========================
  const originalPrice = selectedVariant
    ? Number(selectedVariant.original_price)
    : 0;

  // =========================
  // Has Offer
  // =========================
  const hasOffer = selectedVariant?.has_offer === true;

  // =========================
  // Total Price
  // =========================
  const totalPrice = price * quantity;

  // =========================
  // Increase Quantity
  // =========================
  const increaseQuantity = () => {
    if (!selectedVariant) return;

    const stock = Number(selectedVariant.stock);

    // لو مفيش مخزون
    if (stock <= 0) {
      return;
    }

    setQuantity((prev) => {
      if (prev >= stock) {
        return prev;
      }

      return prev + 1;
    });
  };

  // =========================
  // Decrease Quantity
  // =========================
  const decreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev <= 1) {
        return 1;
      }

      return prev - 1;
    });
  };

  // =========================
  // Select Variant
  // =========================
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);

    // Reset quantity
    setQuantity(1);
  };

  // =========================
  // Add To Cart
  // =========================
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("من فضلك اختر الحجم");
      return;
    }

    // =========================
    // Check Stock
    // =========================
    const stock = Number(selectedVariant.stock);

    if (stock <= 0) {
      alert("هذا المنتج غير متوفر حاليًا");
      return;
    }

    if (quantity > stock) {
      alert(`الكمية المتاحة فقط ${stock}`);
      return;
    }

    // =========================
    // Cart Item
    // =========================
    const cartItem = {
      id: product.id,

      product_id: product.id,

      variant_id: selectedVariant.id,

      title: translation?.name || "منتج بدون اسم",

      size: selectedVariant.variant_name,

      price: Number(selectedVariant.final_price),

      original_price: Number(selectedVariant.original_price),

      thumbnail: imageUrl,

      quantity: quantity,

      sku: selectedVariant.sku,

      stock: selectedVariant.stock,

      has_offer: selectedVariant.has_offer,

      offer: selectedVariant.offer,
    };

    console.log("ADDING TO CART:", cartItem);

    dispatch(addItem(cartItem));

    alert("تم إضافة المنتج إلى السلة");
  };

  return (
    <div className="container mx-auto px-4 py-10" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ==================================================
            Product Images
        ================================================== */}
        <div className="flex flex-col items-center">
          {/* =========================
              Main Image
          ========================= */}
          <div className="w-full max-w-[500px] h-[500px] bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={translation?.name || "Product"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400">لا توجد صورة</div>
            )}
          </div>

          {/* =========================
              Images Thumbnails
          ========================= */}
          {images.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {images.map((image) => {
                const thumbnailUrl = `http://localhost:3001/uploads/products/${image.image}`;

                const isSelected = selectedImage === image.image;

                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.image)}
                    className={`
                      w-20
                      h-20
                      rounded-xl
                      overflow-hidden
                      border-2
                      bg-gray-50
                      transition
                      duration-200

                      ${
                        isSelected
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-400"
                      }
                    `}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={translation?.name || "Product"}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================================
            Product Information
        ================================================== */}
        <div className="flex flex-col justify-center">
          {/* =========================
              Category
          ========================= */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
              Product #{product.id}
            </span>
          </div>

          {/* =========================
              Product Name
          ========================= */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            {translation?.name || "منتج بدون اسم"}
          </h1>

          {/* =========================
              Description
          ========================= */}
          {translation?.description && (
            <p className="text-gray-600 text-lg leading-8 mb-6">
              {translation.description}
            </p>
          )}

          {/* =========================
              Variants
          ========================= */}
          {variants.length > 0 && (
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                اختر الحجم
              </h2>

              <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;

                  const stock = Number(variant.stock);

                  const isOutOfStock = stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleSelectVariant(variant)}
                      className={`
                          relative
                          px-6
                          py-3
                          rounded-xl
                          border
                          font-semibold
                          transition
                          duration-200

                          ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300 hover:border-black"
                          }

                          ${
                            isOutOfStock
                              ? "opacity-40 cursor-not-allowed line-through"
                              : ""
                          }
                        `}
                    >
                      {variant.variant_name}

                      {/* Stock */}
                      {isOutOfStock && (
                        <span className="block text-xs mt-1">غير متوفر</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================
              Price
          ========================= */}
          <div className="mb-7">
            <div className="flex items-center gap-3">
              {/* Final Price */}
              <span className="text-3xl font-bold text-black">
                {price.toFixed(2)}
              </span>

              <span className="text-lg text-gray-500">جنيه</span>

              {/* Original Price */}
              {hasOffer && originalPrice > price && (
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice.toFixed(2)} جنيه
                </span>
              )}
            </div>

            {/* Offer */}
            {hasOffer && selectedVariant?.offer && (
              <div className="mt-3">
                <span className="inline-block rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                  {selectedVariant.offer.title}
                </span>
              </div>
            )}
          </div>

          {/* =========================
              Stock Status
          ========================= */}
          {selectedVariant && (
            <div className="mb-5">
              {Number(selectedVariant.stock) > 0 ? (
                <span className="text-sm font-medium text-green-600">
                  متوفر في المخزون ({selectedVariant.stock})
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">
                  غير متوفر في المخزون
                </span>
              )}
            </div>
          )}

          {/* =========================
              Quantity
          ========================= */}
          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-800 mb-4">الكمية</h2>

            <div className="flex items-center w-fit border border-gray-300 rounded-xl overflow-hidden">
              {/* Minus */}
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="
                  w-12
                  h-12
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                  hover:bg-gray-100
                  transition
                  disabled:text-gray-300
                  disabled:cursor-not-allowed
                "
              >
                -
              </button>

              {/* Quantity */}
              <div className="w-14 h-12 flex items-center justify-center font-bold border-x border-gray-300">
                {quantity}
              </div>

              {/* Plus */}
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  !selectedVariant ||
                  Number(selectedVariant.stock) <= 0 ||
                  quantity >= Number(selectedVariant.stock)
                }
                className="
                  w-12
                  h-12
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                  hover:bg-gray-100
                  transition
                  disabled:text-gray-300
                  disabled:cursor-not-allowed
                "
              >
                +
              </button>
            </div>
          </div>

          {/* =========================
              Total
          ========================= */}
          <div className="mb-7 bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">
                الإجمالي
              </span>

              <span className="text-2xl font-bold text-black">
                {totalPrice.toFixed(2)} جنيه
              </span>
            </div>
          </div>

          {/* =========================
              Add To Cart
          ========================= */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedVariant || Number(selectedVariant.stock) <= 0}
            className="
              w-full
              bg-black
              text-white
              py-4
              rounded-xl
              text-lg
              font-bold
              hover:bg-gray-800
              transition
              duration-200
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
          >
            {selectedVariant && Number(selectedVariant.stock) <= 0
              ? "غير متوفر"
              : "إضافة إلى السلة"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
