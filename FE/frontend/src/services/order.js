// src/services/order.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ORDER_API = `${BASE_URL}/api/v1/orders`;

export async function checkout(checkoutData) {
    console.log(" Payload gửi lên:", JSON.stringify(checkoutData, null, 2));

    const res = await fetch(`${ORDER_API}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(checkoutData),
    });

    console.log(" Status:", res.status);

    // FIX: kiểm tra body có rỗng không trước khi parse
    const text = await res.text();
    if (!text) throw new Error("Server không trả về dữ liệu");

    const data = JSON.parse(text);
    console.log("📨 Response:", JSON.stringify(data, null, 2));

    if (!res.ok || !data.success) {
        throw new Error(data.message || "Đặt hàng thất bại");
    }
    return data.data;
}
export async function getOrderDetail(orderId) {
    const res = await fetch(`${ORDER_API}/${orderId}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể lấy chi tiết đơn hàng");
    }
    return data.data;
}

export async function getOrderHistory() {
    const res = await fetch(`${ORDER_API}/history`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể tải lịch sử đơn hàng");
    }
    return data.data;
}
export async function cancelOrder(orderId) {
    const res = await fetch(`${ORDER_API}/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
    });

    const text = await res.text();
    if (!text) throw new Error("Server không trả về dữ liệu");

    const data = JSON.parse(text);
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Hủy đơn hàng thất bại");
    }
    return data.data;
}