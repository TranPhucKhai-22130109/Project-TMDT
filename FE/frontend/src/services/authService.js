// Auth Service — gọi API authentication từ Spring Boot backend
// Backend dùng Cookie-based HttpOnly JWT → credentials: 'include' là bắt buộc
// Token do browser quản lý qua cookie, FE chỉ lưu userId vào localStorage

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

/**
 * Login bằng Google
 * 1. Firebase popup → lấy idToken
 * 2. Gửi idToken lên BE POST /v1/auth/google
 * 3. BE verify → trả cookie + userId/username
 */
export async function loginWithGoogle() {
  // 1. Mở popup Google Sign-In qua Firebase
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  // 2. Gửi idToken lên backend
  const res = await fetch(`${AUTH_BASE}/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Google login failed");
  }

  // 3. Lưu localStorage (giống login thường)
  if (data.data?.userId) {
    localStorage.setItem("localstorage-userId", data.data.userId);
  }
  if (data.data?.username) {
    localStorage.setItem("localstorage-username", data.data.username);
  }

  return data;
}

/**
 * Đăng nhập
 * POST /v1/auth/login
 * Body: { email: String, password: String } (từ LoginRequest.java)
 * Response body: { success, code, message, data: { userId } }
 * Token được set vào cookie bởi backend (Set-Cookie header)
 */
export async function login({ email, password }) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // bắt buộc để browser nhận/gửi cookie
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  // Lưu userId và username vào localStorage (vì JS không đọc được HttpOnly cookie)
  if (data.data?.userId) {
    localStorage.setItem("localstorage-userId", data.data.userId);
  }
  if (data.data?.username) {
    localStorage.setItem("localstorage-username", data.data.username);
  }

  return data;
}

/**
 * Đăng ký
 * POST /v1/auth/register
 * Body: { name: String, email: String, password: String } (từ SignUpRequest.java)
 * Response body: { success, code, message, data: null }
 */
export async function signup({ name, email, password }) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

/**
 * Kiểm tra username khả dụng
 * GET /v1/auth/check-username?username=...
 * Response body: { success, code, message }
 */
export async function checkUsername(username) {
  const res = await fetch(
    `${AUTH_BASE}/v1/auth/check-username?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await res.json();
  return data;
}

/**
 * Refresh access token
 * POST /v1/auth/refresh
 * Không có body — backend đọc refreshToken từ cookie
 * Response: Set-Cookie header với accessToken mới
 */
export async function refreshToken() {
  const res = await fetch(`${AUTH_BASE}/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Token refresh failed");
  }

  return data;
}

/**
 * Đăng xuất
 * POST /v1/auth/logout
 * Backend đọc refreshToken từ cookie, accessToken từ Authorization header (optional)
 * Backend xóa cookie refreshToken (Set-Cookie maxAge=0)
 */
export async function logout() {
  try {
    await fetch(`${AUTH_BASE}/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Logout thất bại ở server → vẫn xóa state ở client
  }

  // Luôn xóa userId khỏi localStorage dù API thành công hay thất bại
  localStorage.removeItem("localstorage-userId");
}

/**
 * Verify Email
 * GET /v1/auth/verify-email?token=...
 */
export async function verifyEmail(token) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Email verification failed");
  }
  return data;
}

/**
 * Forgot Password - Send OTP
 * POST /v1/auth/forgot-password
 */
export async function forgotPassword(email) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to send OTP");
  }
  return data;
}

/**
 * Verify OTP
 * POST /v1/auth/verify-otp
 */
export async function verifyOtp(email, otp) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid OTP");
  }
  return data;
}

/**
 * Reset Password
 * POST /v1/auth/reset-password
 */
export async function resetPassword(resetToken, newPassword) {
  const res = await fetch(`${AUTH_BASE}/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ resetToken, newPassword }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Password reset failed");
  }
  return data;
}
