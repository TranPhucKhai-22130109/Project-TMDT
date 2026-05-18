"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Apple, ArrowRight, Chrome, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup, loginWithGoogle, isAuthenticated, syncGuestCartToDB } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Nếu đã đăng nhập → redirect về dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await signup({ name, email, password });
      setSuccessMsg("Đăng ký thành công! Đang chuyển hướng đến đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //  handler google
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      await syncGuestCartToDB();
      router.push("/");
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Tham gia BLITZ để nhận nhiều ưu đãi
          </p>
        </div>

        {/* Form */}
        <form
          className="border border-gray-300 rounded-xl dark:border-gray-700 p-8 space-y-6 bg-white dark:bg-gray-800 shadow-sm"
          onSubmit={handleSubmit}
        >
          {/* Error / Success messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
              {successMsg}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {" "}
              Họ và Tên{" "}
            </label>
            <div className="relative">
              <Input
                variant="text"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white"
                type="text"
                placeholder="Nguyễn Văn A"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {" "}
              Email Address{" "}
            </label>
            <div className="relative">
              <Input
                variant="text"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white"
                type="email"
                placeholder="you@example.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {" "}
              Password{" "}
            </label>
            <div className="relative">
              <Input
                variant="text"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all dark:text-white"
                type="password"
                placeholder="••••••••"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Đang đăng ký..." : "Đăng Ký"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?{" "}
            <NextLink
              href="/login"
              className="text-red-600 dark:text-red-500 font-bold hover:underline"
            >
              Đăng nhập ngay
            </NextLink>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                {" "}
                Hoặc tiếp tục với{" "}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              contentKey="cta_2"
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              type="button"
              onClick={handleGoogleLogin}
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Google{" "}
            </Button>
            <Button
              contentKey="cta_3"
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              type="button"
            >
              <Apple className="w-5 h-5 text-gray-900 dark:text-white" />
              Apple{" "}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
