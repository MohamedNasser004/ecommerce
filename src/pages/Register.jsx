import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowLeft } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("الاسم الكامل مطلوب");
    if (!formData.email.trim()) errors.push("البريد الإلكتروني مطلوب");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push("صيغة البريد الإلكتروني غير صالحة");
    if (!formData.password) errors.push("كلمة المرور مطلوبة");
    else if (formData.password.length < 6) errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (formData.password !== formData.confirmPassword) errors.push("كلمات المرور غير متطابقة");
    if (!agreeTerms) errors.push("يجب الموافقة على الشروط والأحكام");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("🎉 تم إنشاء الحساب بنجاح!");
        setTimeout(() => navigate("/login"), 1500);
      } else toast.error(data.message || "فشل في إنشاء الحساب");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("✅ تم تسجيل الدخول بنجاح");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/"), 1000);
      } else toast.error(data.message || "فشل تسجيل الدخول");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تسجيل الدخول بجوجل");
    }
  };

  const handleGoogleError = () => toast.error("❌ فشل تسجيل الدخول باستخدام جوجل");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">إنشاء حساب جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="الاسم الكامل"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </div>

          {/* البريد */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="البريد الإلكتروني"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="كلمة المرور"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
              minLength={6}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="تأكيد كلمة المرور"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3">
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              أوافق على <Link to="/terms" className="text-green-600">الشروط</Link> و <Link to="/privacy" className="text-green-600">الخصوصية</Link>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-xl">
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 text-center text-gray-500 dark:text-gray-400">أو</div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            theme="filled_blue"
            size="large"
          />
        </div>

        <div className="mt-5 text-center text-gray-600 dark:text-gray-400">
          لديك حساب بالفعل؟ <Link to="/login" className="text-green-600">سجل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
