// Base URL (backend) — dùng cho các API nghiệp vụ (products, orders, ...)
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Auth Base URL — dùng riêng cho authService (không có prefix /api)
export const AUTH_BASE =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

// Helper fetch chung
export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include", // bắt buộc để browser gửi cookie (HttpOnly JWT)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // Nếu bị 401 → token hết hạn hoặc không hợp lệ → force logout
  if (res.status === 401) {
    localStorage.removeItem("blitz-userId");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Unauthorized — session expired");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
}
