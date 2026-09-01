import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
const ProductDescription = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // =========================
  // Fetch Product
  // =========================

  useEffect(() => {
    console.log("Cart updated:", cartItems);
  }, [cartItems]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`http://localhost:7000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        console.log("data" + data);
        setProduct(data);
        console.log(product);
        setSelectedImage(data.image);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Unable to load product information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            !
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>

          <p className="text-gray-500">
            {error || "We couldn't find this product."}
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Calculations
  // =========================
  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  const totalPrice = discountedPrice * quantity;

  const images =
    product.images?.length > 0 ? product.images : [product.thumbnail];

  // =========================
  // Add To Cart
  // =========================
  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.product_name,
      price: discountedPrice,
      originalPrice: product.price,
      thumbnail: product.thumbnail,
      quantity,
    };
    dispatch(addItem(cartItem));
    console.log(cartItems);

    //console.log("Added to cart:", cartItem);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================
                    Breadcrumb
                ========================= */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <span className="hover:text-gray-900 cursor-pointer transition">
            Home
          </span>

          <span>/</span>

          <span className="capitalize">{product.category}</span>

          <span>/</span>

          <span className="text-gray-900 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </div>

        {/* =========================
                    Main Product Card
                ========================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 p-5 sm:p-8 lg:p-10">
            {/* =========================
                            Product Images
                        ========================= */}
            <div>
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-5 left-5 z-10 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm">
                    -{product.discountPercentage.toFixed(0)}%
                  </div>
                )}

                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`
                                            flex-shrink-0
                                            w-20
                                            h-20
                                            rounded-xl
                                            border-2
                                            bg-gray-50
                                            p-2
                                            transition-all
                                            duration-200
                                            ${
                                              selectedImage === image
                                                ? "border-gray-900"
                                                : "border-gray-200 hover:border-gray-400"
                                            }
                                        `}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* =========================
                            Product Information
                        ========================= */}
            <div className="flex flex-col">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  {product.brand}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* SKU */}
              <p className="text-sm text-gray-400 mt-3">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(product.rating)
                          ? "text-yellow-400 text-xl"
                          : "text-gray-300 text-xl"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="font-semibold text-gray-900">
                  {product.rating.toFixed(1)}
                </span>

                <span className="text-gray-400">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-7 mt-6">
                {product.description}
              </p>

              {/* =========================
                                Price
                            ========================= */}
              <div className="mt-7">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </span>

                  {product.discountPercentage > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}

                  {product.discountPercentage > 0 && (
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                      Save {product.discountPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* =========================
                                Stock
                            ========================= */}
              <div className="mt-6 flex items-center flex-wrap gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>

                <span className="font-semibold text-gray-800">
                  {product.availabilityStatus}
                </span>

                <span className="text-gray-300">•</span>

                <span className="text-gray-500">
                  {product.stock} units available
                </span>
              </div>

              {/* =========================
                                Minimum Order
                            ========================= */}
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Minimum order quantity</span>

                  <span className="font-bold text-gray-900">
                    {product.minimumOrderQuantity}
                  </span>
                </div>
              </div>

              {/* =========================
                                Quantity
                            ========================= */}
              <div className="mt-7">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">Quantity</span>

                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.max(product.minimumOrderQuantity || 1, prev - 1),
                        )
                      }
                      disabled={quantity <= (product.minimumOrderQuantity || 1)}
                      className="w-11 h-11 flex items-center justify-center text-xl font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>

                    <span className="w-14 h-11 flex items-center justify-center font-semibold border-x border-gray-300">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((prev) => Math.min(product.stock, prev + 1))
                      }
                      disabled={quantity >= product.stock}
                      className="w-11 h-11 flex items-center justify-center text-xl font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* =========================
                                Total
                            ========================= */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-gray-500">Total</span>

                <span className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* =========================
                                Cart Buttons
                            ========================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="h-14 rounded-xl border-2 border-gray-900 bg-white text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>

              {/* =========================
                                Tags
                            ========================= */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-7">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full capitalize"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =========================
                        Features
                    ========================= */}
          <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shipping */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  🚚
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Shipping
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  {product.shippingInformation}
                </p>
              </div>

              {/* Warranty */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  🛡️
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Warranty
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  {product.warrantyInformation}
                </p>
              </div>

              {/* Returns */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  ↩️
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Returns
                </p>

                <p className="font-semibold text-gray-900 mt-2">
                  {product.returnPolicy}
                </p>
              </div>
            </div>
          </div>

          {/* =========================
                        Product Details
                    ========================= */}
          <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Brand</p>

                <p className="font-semibold mt-1">{product.brand || "N/A"}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Category</p>

                <p className="font-semibold mt-1 capitalize">
                  {product.category}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">SKU</p>

                <p className="font-semibold mt-1">{product.sku}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Weight</p>

                <p className="font-semibold mt-1">{product.weight} kg</p>
              </div>
            </div>
          </div>

          {/* =========================
                        Dimensions
                    ========================= */}
          {product.dimensions && (
            <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dimensions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Width</p>

                  <p className="text-xl font-bold mt-1">
                    {product.dimensions.width}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Height</p>

                  <p className="text-xl font-bold mt-1">
                    {product.dimensions.height}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="text-sm text-gray-500">Depth</p>

                  <p className="text-xl font-bold mt-1">
                    {product.dimensions.depth}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================
                        Reviews
                    ========================= */}
          <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>

                <p className="text-gray-500 mt-1">
                  What customers think about this product
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {product.rating.toFixed(1)}
                </div>

                <div className="text-yellow-400 text-lg">
                  {"★".repeat(Math.round(product.rating))}

                  <span className="text-gray-300">
                    {"★".repeat(5 - Math.round(product.rating))}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {product.reviews?.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Reviewer */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                        {review.reviewerName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.reviewerName}
                        </p>

                        <p className="text-xs text-gray-400">
                          {review.reviewerEmail}
                        </p>
                      </div>
                    </div>

                    {/* Review Rating */}
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400">
                        {"★".repeat(review.rating)}

                        <span className="text-gray-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </div>

                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-4 leading-6">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =========================
                        Additional Information
                    ========================= */}
          <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Additional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
              <div className="flex justify-between gap-5 border-b border-gray-100 py-4">
                <span className="text-gray-500">Barcode</span>

                <span className="font-semibold text-right">
                  {product.meta?.barcode || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b border-gray-100 py-4">
                <span className="text-gray-500">Product ID</span>

                <span className="font-semibold">#{product.id}</span>
              </div>

              <div className="flex justify-between gap-5 border-b border-gray-100 py-4">
                <span className="text-gray-500">Created At</span>

                <span className="font-semibold">
                  {product.meta?.createdAt
                    ? new Date(product.meta.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b border-gray-100 py-4">
                <span className="text-gray-500">Updated At</span>

                <span className="font-semibold">
                  {product.meta?.updatedAt
                    ? new Date(product.meta.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* =========================
                        QR Code
                    ========================= */}
          {product.meta?.qrCode && (
            <div className="border-t border-gray-100 p-5 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={product.meta.qrCode}
                  alt="Product QR Code"
                  className="w-28 h-28 object-contain border border-gray-200 rounded-xl p-2"
                />

                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    Product QR Code
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Scan this QR code to access product information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
