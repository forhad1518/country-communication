"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LogIn,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<{
    message: string;
    type: "error" | "warning";
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for deactivated redirect
    const reason = searchParams.get("reason");
    if (reason === "deactivated") {
      setApiError({
        message:
          "Your account has been deactivated. Please contact administrator.",
        type: "warning",
      });
    }
  }, [searchParams]);

  const validate = () => {
    let err = { email: "", password: "" };
    let isValid = true;

    if (!form.email.trim()) {
      err.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password.trim()) {
      err.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(err);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setApiError(null);

      const res = await axios.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setIsSuccess(true);

        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      }
    } catch (error: any) {
      console.log("Login error:", error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";

      // Handle different error scenarios
      if (status === 403) {
        // Account deactivated
        setApiError({
          message:
            "Your account has been deactivated. Please contact the administrator.",
          type: "warning",
        });
      } else if (status === 401) {
        // Invalid credentials
        setApiError({
          message: "Invalid email or password. Please try again.",
          type: "error",
        });
      } else if (status === 429) {
        // Too many attempts
        setApiError({
          message: "Too many login attempts. Please try again later.",
          type: "warning",
        });
      } else {
        // Other errors
        setApiError({
          message: message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => {
              const randomX = Math.random() * window.innerWidth;
              const randomY = Math.random() * window.innerHeight;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  initial={{ x: randomX, y: randomY, opacity: 0 }}
                  animate={{
                    y: [randomY, randomY - 100],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md z-10"
      >
        {/* Card Glow */}
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl" />

        {/* Card Content */}
        <div className="relative bg-linear-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="p-4 bg-linear-to-r from-primary to-accent rounded-2xl">
                <Lock className="w-8 h-8 text-primary-light" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
              />
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              <span className="bg-linear-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
                Welcome Back
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-sm"
            >
              Sign in to access your admin dashboard
            </motion.p>
          </div>

          {/* ===== API ERROR MESSAGE ===== */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
                  apiError.type === "warning"
                    ? "bg-yellow-500/10 border border-yellow-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    apiError.type === "warning"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                />
                <p
                  className={`text-sm ${
                    apiError.type === "warning"
                      ? "text-yellow-300"
                      : "text-red-300"
                  }`}
                >
                  {apiError.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== SUCCESS MESSAGE ===== */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-300 font-medium text-sm">
                    Login Successful!
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Redirecting to dashboard...
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-green-400 ml-auto" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/10 focus:border-primary focus:ring-primary/20"
                  }`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-white/10 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-linear-to-r from-primary to-primary-hover text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 pt-6 border-t border-white/10 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by Country Communication</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
