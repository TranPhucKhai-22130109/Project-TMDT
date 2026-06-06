// src/services/adminOrder.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ADMIN_ORDER_API = `${BASE_URL}/v1/admin/orders`;

async function handleResponse(res) {
    const text = await res.text();
    if (!text) throw new Error("Server không trả về dữ liệu");
    const data = JSON.parse(text);
    if (!res.ok || !data.success) throw new Error(data.message || "Lỗi không xác định");
    return data.data;
}

/** GET /v1/admin/orders?status=PENDING */
export async function adminGetAllOrders(status) {
    const url = new URL(ADMIN_ORDER_API);
    if (status && status !== "ALL") url.searchParams.set("status", status);
    const res = await fetch(url.toString(), { credentials: "include" });
    return handleResponse(res);
}

/** GET /v1/admin/orders/stats */
export async function adminGetStats() {
    const res = await fetch(`${ADMIN_ORDER_API}/stats`, { credentials: "include" });
    return handleResponse(res);
}

/** GET /v1/admin/orders/:id */
export async function adminGetOrderDetail(orderId) {
    const res = await fetch(`${ADMIN_ORDER_API}/${orderId}`, { credentials: "include" });
    return handleResponse(res);
}

/** PUT /v1/admin/orders/:id/status?status=CONFIRMED */
export async function adminUpdateOrderStatus(orderId, status) {
    const url = `${ADMIN_ORDER_API}/${orderId}/status?status=${status}`;
    const res = await fetch(url, { method: "PUT", credentials: "include" });
    return handleResponse(res);
}