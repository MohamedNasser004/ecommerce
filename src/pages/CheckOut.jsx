import React, { useState } from "react";
import { useSelector } from "react-redux";

const CheckOut = () => {
  const ApiUrl = "http://localhost:3001/api/orders/";

  // =========================================
  // Redux Cart
  // =========================================

  const cartItems = useSelector((state) => state.cart.cartItems);

  // =========================================
  // States
  // =========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [loading, setLoading] = useState(false);

  // =========================================
  // Submit Order
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CART ITEMS:", cartItems);

    // =========================================
    // Check Cart
    // =========================================

    if (!cartItems || cartItems.length === 0) {
      alert("السلة فارغة");
      return;
    }

    // =========================================
    // Validate Form
    // =========================================

    if (!name.trim()) {
      alert("من فضلك اكتب الاسم");
      return;
    }

    if (!phone.trim()) {
      alert("من فضلك اكتب رقم الهاتف");
      return;
    }

    if (!paymentMethod) {
      alert("من فضلك اختر طريقة الدفع");
      return;
    }

    if (!address.trim()) {
      alert("من فضلك اكتب العنوان");
      return;
    }

    if (!city.trim()) {
      alert("من فضلك اكتب المدينة");
      return;
    }

    if (!governorate.trim()) {
      alert("من فضلك اكتب المحافظة");
      return;
    }

    // =========================================
    // Prepare Products
    // =========================================

    const products = cartItems.map((item) => ({
      product_id: item.product_id ?? item.id,
      variant_id: item.variant_id,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));

    console.log("PRODUCTS:", products);

    // =========================================
    // Validate Products
    // =========================================

    const invalidProduct = products.find(
      (item) =>
        !item.product_id || !item.variant_id || !item.price || !item.quantity,
    );

    if (invalidProduct) {
      console.log("INVALID PRODUCT:", invalidProduct);

      console.log("ORIGINAL CART:", cartItems);

      alert(
        "بيانات أحد المنتجات غير مكتملة. تأكد من وجود product_id و variant_id.",
      );

      return;
    }

    // =========================================
    // Order Data
    // =========================================

    const orderData = {
      name: name.trim(),

      payment_method: paymentMethod,

      products: products,

      address: address.trim(),

      city: city.trim(),

      government: governorate.trim(),

      delivery_fee: Number(deliveryFee || 0),
    };

    console.log("ORDER DATA:", orderData);

    // =========================================
    // Send Order
    // =========================================

    try {
      setLoading(true);

      const response = await fetch(ApiUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      console.log("SERVER RESPONSE:", data);

      // =========================================
      // Backend Error
      // =========================================

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إنشاء الطلب");
      }

      // =========================================
      // Success
      // =========================================

      console.log("ORDER CREATED:", data);

      alert(`تم إنشاء الطلب بنجاح\nرقم الطلب: ${data.order_id}`);

      // Clear LocalStorage
      localStorage.removeItem("cartItems");

      // =========================================
      // Optional Redirect
      // =========================================

      // window.location.href = "/";
    } catch (error) {
      console.error("ORDER ERROR:", error);

      alert(error.message || "حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-right">
            إتمام الطلب
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  الاسم
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب الاسم"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  البريد الإلكتروني
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  رقم الهاتف
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Country */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  الدولة
                </label>

                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="مصر"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Governorate */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  المحافظة
                </label>

                <input
                  type="text"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  placeholder="المحافظة"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* City */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  المدينة
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Address */}

              <div className="md:col-span-2">
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  العنوان بالتفصيل
                </label>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اكتب العنوان بالتفصيل"
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {/* Payment */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  طريقة الدفع
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
                  required
                >
                  <option value="">اختر طريقة الدفع</option>

                  <option value="cash">الدفع عند الاستلام</option>

                  <option value="card">الدفع بالبطاقة</option>
                </select>
              </div>

              {/* Delivery Fee */}

              <div>
                <label className="block text-right mb-2 font-semibold text-gray-700">
                  مصاريف الشحن
                </label>

                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg text-white font-bold text-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? "جاري إنشاء الطلب..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
