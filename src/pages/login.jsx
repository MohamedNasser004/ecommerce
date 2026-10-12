import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // لو مستخدم مسجل من قبل واختر rememberMe
  useEffect(() => {
    if (localStorage.getItem("rememberMe") === "true") {
      setEmail(localStorage.getItem("savedEmail") || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        toast.success(`مرحباً بعودتك ${data.user?.name || ""}!`);

        if (data.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        toast.error(data.message || "فشل في تسجيل الدخول");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ تم تسجيل الدخول بنجاح");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user?.role || "user");

        setTimeout(() => {
          if (data.user?.role === "admin") navigate("/admin");
          else navigate("/");
        }, 500);
      } else {
        toast.error(data.message || "فشل تسجيل الدخول");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("حدث خطأ أثناء تسجيل الدخول بجوجل");
    }
  };

  const handleGoogleError = () => toast.error("❌ فشل تسجيل الدخول باستخدام جوجل");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">العودة للرئيسية</span>
        </button>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
            <p className="text-blue-100 text-sm mt-1">
              مرحباً بعودتك! يرجى تسجيل الدخول لحسابك
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  تذكرني
                </label>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold transition-all duration-200"
              >
                {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 text-center text-gray-500 dark:text-gray-400">أو</div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                theme="filled_blue"
                size="large"
              />
            </div>

            {/* Register Link */}
            <div className="mt-5 text-center text-gray-600 dark:text-gray-400">
              ليس لديك حساب؟ <Link to="/register" className="text-blue-600 hover:text-blue-800">سجل الآن</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;