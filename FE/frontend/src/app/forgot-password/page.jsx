"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, CheckCircle } from "lucide-react";
import { Input } from "@/components/Input";
import { forgotPassword, verifyOtp, resetPassword } from "@/services/authService";
import NextLink from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // 'email' | 'otp' | 'reset' | 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Không thể gửi OTP. Vui lòng kiểm tra lại email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      setResetToken(data.data.resetToken);
      setStep("reset");
    } catch (err) {
      setError(err.message || "OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setStep("success");
    } catch (err) {
      setError(err.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2">Quên Mật Khẩu</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {step === "email" && "Nhập email của bạn để nhận mã xác nhận"}
            {step === "otp" && "Nhập mã OTP gồm 6 chữ số đã gửi đến email"}
            {step === "reset" && "Tạo mật khẩu mới cho tài khoản của bạn"}
            {step === "success" && "Khôi phục mật khẩu thành công"}
          </p>
        </div>

        <div className="border border-gray-300 rounded-xl dark:border-gray-700 p-8 space-y-6 bg-white dark:bg-gray-800 shadow-sm">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    variant="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none dark:text-white"
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
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mã OTP (6 chữ số)
                </label>
                <Input
                  variant="text"
                  className="w-full text-center tracking-widest text-2xl py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:text-white"
                  type="text"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Đang xác nhận..." : "Xác nhận OTP"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Input
                    variant="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:text-white"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Input
                    variant="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 dark:text-white"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Đang đổi mật khẩu..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div className="text-gray-600 dark:text-gray-300">
                Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể sử dụng mật khẩu mới để đăng nhập.
              </div>
              <NextLink
                href="/login"
                className="inline-block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
              >
                Đăng nhập ngay
              </NextLink>
            </div>
          )}

          {step !== "success" && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              <NextLink href="/login" className="hover:underline">
                Quay lại đăng nhập
              </NextLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
