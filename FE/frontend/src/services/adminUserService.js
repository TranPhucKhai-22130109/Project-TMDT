// Admin User Service — gọi API quản lý user từ AdminUserController
import { apiFetch } from "@/config/api";

/** GET /api/admin/users — Lấy danh sách tất cả user */
export async function fetchUsers() {
  return apiFetch("/admin/users");
}

/** POST /api/admin/users — Tạo user mới */
export async function createUser({ username, email, password, role, status }) {
  return apiFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify({ username, email, password, role, status }),
  });
}

/** GET /api/admin/users/{id} — Lấy chi tiết user */
export async function fetchUserById(id) {
  return apiFetch(`/admin/users/${id}`);
}

/** PATCH /api/admin/users/{id}/status — Đổi status (ACTIVE, INACTIVE, BANNED) */
export async function updateUserStatus(id, status) {
  return apiFetch(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/** PATCH /api/admin/users/{id}/role — Đổi role (USER, SELLER, ADMIN) */
export async function updateUserRole(id, role) {
  return apiFetch(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
