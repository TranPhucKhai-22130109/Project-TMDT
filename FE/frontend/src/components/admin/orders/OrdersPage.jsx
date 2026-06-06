"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Search, Package, Loader2, Clock, AlertCircle, RefreshCw,
    CheckCircle2, XCircle, Eye, X, MapPin, Printer, Truck, ArrowRight
} from "lucide-react";

// ─── CẤU HÌNH API ────────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ADMIN_ORDER_API = `${BASE_URL}/v1/admin/orders`;

// ─── ENUM TRẠNG THÁI (ĐỒNG BỘ HOÀN TOÀN VỚI BACKEND JAVA) ───────────────────
// Không còn lớp mapping FE/BE trung gian — dùng thẳng enum của backend
const ORDER_STATUS_FLOW = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"];

// Nhãn hiển thị tiếng Việt ánh xạ 1:1 với enum Java
const STATUS_CONFIG = {
    PENDING:   { label: "Chờ xử lý",   color: "bg-amber-100 text-amber-800 border border-amber-200",   icon: Clock },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border border-blue-200",       icon: CheckCircle2 },
    SHIPPING:  { label: "Đang giao",   color: "bg-violet-100 text-violet-800 border border-violet-200", icon: Truck },
    DELIVERED: { label: "Đã giao",     color: "bg-emerald-100 text-emerald-800 border border-emerald-200", icon: CheckCircle2 },
    CANCELLED: { label: "Đã hủy",      color: "bg-red-100 text-red-800 border border-red-200",          icon: XCircle },
};

const PAY_STATUS_CONFIG = {
    UNPAID:   { label: "Chưa TT",  color: "bg-orange-100 text-orange-700" },
    PAID:     { label: "Đã TT",    color: "bg-emerald-100 text-emerald-800" },
    REFUNDED: { label: "Hoàn tiền",color: "bg-gray-100 text-gray-600" },
};

const TABS = ["ALL", ...ORDER_STATUS_FLOW, "CANCELLED"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount ?? 0);
}

function fmtDate(val) {
    if (!val) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(val));
}

// Lấy JWT token từ localStorage (hỗ trợ cả hai key phổ biến)
function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token")
            || localStorage.getItem("accessToken")
            || localStorage.getItem("blitz-token")  // thử thêm
            || localStorage.getItem("access_token");
        if (token) headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return headers;
}

// Parse response linh hoạt: hỗ trợ ApiResponse wrapper, mảng trực tiếp, Page object
async function parseResponse(res) {
    const text = await res.text();
    if (!text) throw new Error("Server không trả về dữ liệu");
    let json;
    try { json = JSON.parse(text); } catch { throw new Error("Phản hồi server không phải JSON hợp lệ"); }
    if (!res.ok) throw new Error(json?.message || `Lỗi server: ${res.status}`);
    if (json?.success && json?.data !== undefined) return json.data;
    if (Array.isArray(json)) return json;
    return json;
}

// Chuẩn hóa 1 order từ backend → UI (field names có thể khác nhau)
function normalizeOrder(order) {
    const status = (order.status || "PENDING").toUpperCase();
    return {
        ...order,
        id: order.id || order.orderId,
        status,                                         // giữ nguyên enum BE
        totalAmount: order.totalAmount ?? order.total ?? 0,
        receiverName: order.receiverName || order.customerName || "Khách hàng",
        receiverPhone: order.receiverPhone || order.phone || "—",
        shippingAddress: order.shippingAddress || order.address || "",
        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: (order.paymentStatus || "UNPAID").toUpperCase(),
        items: (order.orderItems || order.items || []).map(item => ({
            ...item,
            productName: item.productName || item.product?.name || "Sản phẩm",
            productImageUrl: item.productImageUrl || item.image || item.product?.imageUrl,
            quantity: item.quantity ?? item.qty ?? 1,
            price: item.price ?? item.unitPrice ?? 0,
        })),
    };
}

import DashboardLayout from "@/components/admin/layout/DashboardLayout.jsx";

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function OrdersPage() {
    const [orders, setOrders]           = useState([]);
    const [stats, setStats]             = useState(null);
    const [activeTab, setActiveTab]     = useState("ALL");
    const [searchTerm, setSearchTerm]   = useState("");
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating]       = useState(false);
    const [toast, setToast]             = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Fetch danh sách đơn hàng ──────────────────────────────────────────
    const fetchOrders = useCallback(async (tabStatus) => {
        setLoading(true);
        setError(null);
        try {
            const url = new URL(ADMIN_ORDER_API);
            // Gửi thẳng enum BE lên server, chỉ bỏ qua khi ALL
            if (tabStatus && tabStatus !== "ALL") {
                url.searchParams.set("status", tabStatus);
            }
            const res = await fetch(url.toString(), {
                headers: getAuthHeaders(),
                credentials: "include",
            });
            const data = await parseResponse(res);

            let raw = [];
            if (Array.isArray(data))                       raw = data;
            else if (Array.isArray(data?.content))         raw = data.content; // Spring Page
            else if (Array.isArray(data?.orders))          raw = data.orders;
            else if (Array.isArray(data?.data))            raw = data.data;

            setOrders(raw.map(normalizeOrder));
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Fetch thống kê ────────────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${ADMIN_ORDER_API}/stats`, {
                headers: getAuthHeaders(),
                credentials: "include",
            });
            const data = await parseResponse(res);
            setStats({
                total:        data.total        ?? 0,
                pending:      data.pending       ?? 0,
                confirmed:    data.confirmed     ?? 0,
                shipping:     data.shipping      ?? 0,
                delivered:    data.delivered     ?? 0,
                cancelled:    data.cancelled     ?? 0,
                totalRevenue: data.totalRevenue  ?? 0,
            });
        } catch (err) {
            console.error("Lỗi lấy thống kê:", err);
        }
    }, []);

    useEffect(() => {
        fetchOrders(activeTab);
        fetchStats();
    }, [activeTab, fetchOrders, fetchStats]);

    // Đồng bộ selectedOrder khi list thay đổi sau khi cập nhật
    useEffect(() => {
        if (selectedOrder) {
            const updated = orders.find(o => o.id === selectedOrder.id);
            if (updated) setSelectedOrder(updated);
        }
    }, [orders]);

    // ── Cập nhật trạng thái ───────────────────────────────────────────────
    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            const url = `${ADMIN_ORDER_API}/${orderId}/status?status=${newStatus}`;
            const res = await fetch(url, {
                method: "PUT",
                headers: getAuthHeaders(),
                credentials: "include",
            });
            const data = await parseResponse(res);
            const updated = normalizeOrder(data);

            // Cập nhật local state ngay lập tức — không cần reload toàn bộ
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
            if (selectedOrder?.id === orderId) setSelectedOrder(updated);

            showToast(`Cập nhật trạng thái thành: ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
            fetchStats(); // cập nhật số liệu thống kê
        } catch (err) {
            showToast(`Cập nhật thất bại: ${err.message}`, "error");
        } finally {
            setUpdating(false);
        }
    };

    // ── Lọc & tìm kiếm ───────────────────────────────────────────────────
    const filteredOrders = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return orders.filter(o =>
            (!term || String(o.id).toLowerCase().includes(term) ||
                o.receiverName?.toLowerCase().includes(term) ||
                o.receiverPhone?.includes(term))
        );
    }, [orders, searchTerm]);

    // Trạng thái tiếp theo hợp lệ (dựa luồng tuần tự BE)
    const getNextStatus = (status) => {
        const idx = ORDER_STATUS_FLOW.indexOf(status);
        return idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[idx + 1] : null;
    };

    // ─── RENDER ───────────────────────────────────────────────────────────
    return (
        <DashboardLayout title="Orders">
            <div className="flex-1 w-full overflow-y-auto min-w-0">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản Lý Đơn Hàng</h1>
                        <p className="text-sm text-gray-500 mt-1">Dữ liệu thực từ lịch sử đặt hàng của khách hàng.</p>
                    </div>
                    <button
                        onClick={() => { fetchOrders(activeTab); fetchStats(); }}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Tải lại
                    </button>
                </div>

                {/* Thẻ thống kê */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: "Tổng đơn",     value: stats.total,      icon: Package,      bg: "bg-indigo-50",  text: "text-indigo-600" },
                            { label: "Chờ xử lý",    value: stats.pending,    icon: Clock,        bg: "bg-amber-50",   text: "text-amber-600" },
                            { label: "Đã hoàn thành",value: stats.delivered,  icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600" },
                            { label: "Doanh thu",     value: fmt(stats.totalRevenue), icon: Package, bg: "bg-green-50", text: "text-green-700", small: true },
                        ].map(({ label, value, icon: Icon, bg, text, small }) => (
                            <div key={label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className={`p-2.5 ${bg} ${text} rounded-xl shrink-0`}><Icon className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                                    <h3 className={`font-bold mt-0.5 ${text} ${small ? "text-base" : "text-2xl"}`}>{value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bảng dữ liệu */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-gray-50/50">
                        {/* Tabs lọc trạng thái — dùng trực tiếp enum BE */}
                        <div className="flex flex-wrap gap-1 bg-gray-200/60 p-1 rounded-xl">
                            {TABS.map(tab => {
                                const cfg = STATUS_CONFIG[tab];
                                const label = tab === "ALL" ? "Tất cả" : (cfg?.label || tab);
                                const count = tab === "ALL" ? orders.length : orders.filter(o => o.status === tab).length;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                            activeTab === tab
                                                ? "bg-white text-indigo-600 shadow-sm"
                                                : "text-gray-500 hover:text-gray-900"
                                        }`}
                                    >
                                        {label}
                                        {count > 0 && (
                                            <span className={`ml-1 text-[10px] ${activeTab === tab ? "text-indigo-400" : "text-gray-400"}`}>
                                            ({count})
                                        </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tìm kiếm */}
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, tên / SĐT khách..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Nội dung bảng */}
                    {loading ? (
                        <div className="p-20 flex flex-col items-center gap-3 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Đang tải dữ liệu đơn hàng...</p>
                        </div>
                    ) : error ? (
                        <div className="p-16 flex flex-col items-center text-center gap-2 text-red-500">
                            <AlertCircle className="w-10 h-10 text-red-400" />
                            <p className="font-semibold">Lỗi kết nối máy chủ</p>
                            <p className="text-xs text-gray-400 max-w-sm">{error}</p>
                            <button
                                onClick={() => { fetchOrders(activeTab); fetchStats(); }}
                                className="mt-2 text-xs text-indigo-500 hover:underline font-semibold"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            Không có đơn hàng nào phù hợp với bộ lọc.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[820px]">
                                <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4">Mã Đơn / Ngày</th>
                                    <th className="p-4">Người Nhận</th>
                                    <th className="p-4">Sản Phẩm</th>
                                    <th className="p-4">Tổng Tiền</th>
                                    <th className="p-4">Trạng Thái</th>
                                    <th className="p-4 text-right">Hành Động</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredOrders.map(order => {
                                    const statusCfg = STATUS_CONFIG[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
                                    const payCfg    = PAY_STATUS_CONFIG[order.paymentStatus] || { label: order.paymentStatus, color: "bg-gray-100 text-gray-600" };

                                    return (
                                        <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors">
                                            {/* Mã đơn */}
                                            <td className="p-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="font-bold font-mono text-indigo-600 hover:underline text-left block"
                                                >
                                                    #{String(order.id).slice(0, 8).toUpperCase()}
                                                </button>
                                                <div className="text-[11px] text-gray-400 mt-0.5">{fmtDate(order.createdAt)}</div>
                                            </td>

                                            {/* Người nhận */}
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{order.receiverName}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{order.receiverPhone}</div>
                                            </td>

                                            {/* Ảnh sản phẩm */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {(order.items || []).slice(0, 3).map((item, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={item.productImageUrl || "https://placehold.co/64x64/f3f4f6/9ca3af?text=SP"}
                                                                alt=""
                                                                onError={e => { e.target.src = "https://placehold.co/64x64/f3f4f6/9ca3af?text=SP"; }}
                                                                className="w-8 h-8 rounded-lg border-2 border-white object-cover shadow-sm bg-gray-100"
                                                                style={{ zIndex: 10 - idx }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-500 ml-1">
                                                        {(order.items || []).length} món
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Tổng tiền & thanh toán */}
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">{fmt(order.totalAmount)}</div>
                                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase">
                                                        {order.paymentMethod}
                                                    </span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${payCfg.color}`}>
                                                        {payCfg.label}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Trạng thái đơn */}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                                                    {statusCfg.label}
                                                </span>
                                            </td>

                                            {/* Hành động */}
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer đếm đơn */}
                    {!loading && !error && (
                        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
                        </div>
                    )}
                </div>

                {/* ── PANEL CHI TIẾT ĐƠN HÀNG ── */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
                        <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col">

                            {/* Header panel */}
                            <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50 shrink-0">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-900 font-mono">
                                            #{String(selectedOrder.id).slice(0, 8).toUpperCase()}
                                        </h2>
                                        {(() => {
                                            const cfg = STATUS_CONFIG[selectedOrder.status] || { label: selectedOrder.status, color: "bg-gray-100 text-gray-700" };
                                            return (
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                            );
                                        })()}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{fmtDate(selectedOrder.createdAt)}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-xl transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body panel */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5">

                                {/* Timeline */}
                                {selectedOrder.status !== "CANCELLED" && (
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Luồng xử lý đơn</p>
                                        <div className="flex items-center gap-1">
                                            {ORDER_STATUS_FLOW.map((s, idx) => {
                                                const cfg = STATUS_CONFIG[s];
                                                const currentIdx = ORDER_STATUS_FLOW.indexOf(selectedOrder.status);
                                                const done = idx <= currentIdx;
                                                return (
                                                    <div key={s} className="flex items-center gap-1 flex-1">
                                                        <div className={`flex flex-col items-center flex-1 ${done ? "opacity-100" : "opacity-30"}`}>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${done ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                                                                {idx + 1}
                                                            </div>
                                                            <span className="text-[9px] font-semibold text-center text-gray-500 mt-1 leading-tight">{cfg.label}</span>
                                                        </div>
                                                        {idx < ORDER_STATUS_FLOW.length - 1 && (
                                                            <div className={`flex-1 h-0.5 mb-4 ${idx < currentIdx ? "bg-indigo-400" : "bg-gray-200"}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin người nhận */}
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thông tin giao nhận</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-gray-900">{selectedOrder.receiverName}</div>
                                            <div className="text-sm text-gray-500 mt-0.5">{selectedOrder.receiverPhone}</div>
                                            {selectedOrder.shippingAddress && (
                                                <div className="text-xs text-gray-400 mt-1 leading-relaxed">{selectedOrder.shippingAddress}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Danh sách sản phẩm */}
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sản phẩm đặt mua</p>
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white divide-y divide-gray-100">
                                        {(selectedOrder.items || []).map((item, idx) => (
                                            <div key={idx} className="p-3 flex items-center gap-3 hover:bg-gray-50/50">
                                                <img
                                                    src={item.productImageUrl || "https://placehold.co/64x64/f3f4f6/9ca3af?text=SP"}
                                                    alt=""
                                                    onError={e => { e.target.src = "https://placehold.co/64x64/f3f4f6/9ca3af?text=SP"; }}
                                                    className="w-11 h-11 rounded-xl object-cover border border-gray-100 shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 text-sm truncate">{item.productName}</div>
                                                    <div className="text-xs text-gray-400 mt-0.5">x{item.quantity} · {fmt(item.price)}/cái</div>
                                                </div>
                                                <div className="font-bold text-sm text-gray-900 shrink-0">{fmt(item.price * item.quantity)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ghi chú */}
                                {selectedOrder.note && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Ghi chú của khách</p>
                                        <p className="text-sm text-amber-900/80 italic">"{selectedOrder.note}"</p>
                                    </div>
                                )}

                                {/* Tổng tiền & thanh toán */}
                                <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Phương thức thanh toán</span>
                                        <span className="font-semibold text-gray-800">{selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Trạng thái thanh toán</span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${PAY_STATUS_CONFIG[selectedOrder.paymentStatus]?.color || "bg-gray-100 text-gray-600"}`}>
                                        {PAY_STATUS_CONFIG[selectedOrder.paymentStatus]?.label || selectedOrder.paymentStatus}
                                    </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                                        <span className="font-bold text-gray-900">Tổng thanh toán</span>
                                        <span className="text-xl font-black text-indigo-600">{fmt(selectedOrder.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer panel — hành động */}
                            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0 shadow-md">
                                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                                    <Printer className="w-4 h-4" /> In hóa đơn
                                </button>

                                <div className="flex items-center gap-2">
                                    {/* Hủy đơn — chỉ hiện khi chưa kết thúc */}
                                    {selectedOrder.status !== "DELIVERED" && selectedOrder.status !== "CANCELLED" && (
                                        <button
                                            disabled={updating}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, "CANCELLED")}
                                            className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-60"
                                        >
                                            Hủy đơn
                                        </button>
                                    )}

                                    {/* Nút chuyển trạng thái tiếp theo */}
                                    {(() => {
                                        const next = getNextStatus(selectedOrder.status);
                                        if (!next) return null;
                                        return (
                                            <button
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, next)}
                                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-60"
                                            >
                                                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                                                {STATUS_CONFIG[next]?.label || next}
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast thông báo */}
                {toast && (
                    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium text-white transition-all ${
                        toast.type === "error" ? "bg-red-600 border-red-700" : "bg-gray-900 border-gray-800"
                    }`}>
                        {toast.type === "error"
                            ? <XCircle className="w-4 h-4 text-white" />
                            : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        }
                        {toast.msg}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}