// src/services/orderService.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Đặt hàng / Checkout
 * @param {Object} checkoutData - { receiverName, receiverPhone, shippingAddress, city, note, paymentMethod, items }
 */
export async function checkout(checkoutData) {
    const res = await fetch(`${BASE_URL}/v1/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // gửi cookie accessToken
        body: JSON.stringify(checkoutData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Checkout failed");
    }
    return data.data; // OrderResponse
}

/**
 * Xác nhận thanh toán (mock gateway)
 * @param {string} orderId
 * @param {string} transactionId
 * @param {boolean} success
 */
export async function confirmPayment(orderId, transactionId, success = true) {
    const res = await fetch(
        `${BASE_URL}/api/orders/${orderId}/payment/confirm?transactionId=${transactionId}&success=${success}`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Payment confirmation failed");
    }
    return data.data;
}

/**
 * Lấy lịch sử đơn hàng của user
 */
export async function getOrderHistory() {
    const res = await fetch(`${BASE_URL}/api/orders`, {
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch order history");
    }
    return data.data; // List<OrderResponse>
}

/**
 * Lấy chi tiết một đơn hàng
 * @param {string} orderId
 */
export async function getOrderDetail(orderId) {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch order detail");
    }
    return data.data;
}