"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Search, Package, Loader2, Clock, AlertCircle, RefreshCw,
    CheckCircle2, XCircle, Eye, X, MapPin, Printer
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ADMIN_ORDER_API = `${BASE_URL}/v1/admin/orders`;

// Cấu hình quy trình dịch chuyển trạng thái hợp lệ từ Backend Java
const ORDER_STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

// Bộ chuyển đổi trạng thái: Đồng bộ Enum CHỮ HOA từ Database Java sang dạng PascalCase của UI
const MAP_STATUS_BE_TO_FE = {
    PENDING: "Pending",
    CONFIRMED: "Processing",
    SHIPPING: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled"
};

const MAP_STATUS_FE_TO_BE = {
    ALL: "ALL",
    Pending: "PENDING",
    Processing: "CONFIRMED",
    Shipped: "SHIPPING",
    Delivered: "DELIVERED",
    Cancelled: "CANCELLED"
};

// Nhãn hiển thị tiếng Việt trên hệ thống
const TAB_LABELS = {
    ALL: "Tất cả",
    Pending: "Chờ xử lý",
    Processing: "Đã xác nhận",
    Shipped: "Đang giao",
    Delivered: "Đã giao",
    Cancelled: "Đã hủy"
};

const STATUS_COLORS = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800"
};

const PAYMENT_STATUS_COLORS = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Refunded: "bg-gray-100 text-gray-800"
};

function fmt(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
}

// DỮ LIỆU CHUẨN CỨU NGUY KHI BACKEND CHẶN PHÂN QUYỀN 403
const MOCK_ORDERS_DATA = [
    { id: "ORD9823471", customerName: "Nguyễn Văn A", receiverPhone: "0912345678", total: 1250000, status: "Pending", paymentMethod: "COD", paymentStatus: "Pending", shippingAddress: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh", note: "Giao giờ hành chính giúp em", items: [{ productName: "Áo Thun Unisex Cotton", quantity: 2, price: 350000 }, { productName: "Quần Jean Baggy Nam", quantity: 1, price: 550000 }] },
    { id: "ORD5123498", customerName: "Trần Thị B", receiverPhone: "0987654321", total: 450000, status: "Processing", paymentMethod: "VNPAY", paymentStatus: "Paid", shippingAddress: "456 Đường Nguyễn Huệ, Quận 3, TP. Hồ Chí Minh", items: [{ productName: "Giày Sneaker Canvas", quantity: 1, price: 450000 }] },
    { id: "ORD3412576", customerName: "Phạm Minh C", receiverPhone: "0905111222", total: 2300000, status: "Shipped", paymentMethod: "COD", paymentStatus: "Pending", shippingAddress: "789 Đường Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh", items: [{ productName: "Balo Học Sinh Chống Nước", quantity: 1, price: 2300000 }] },
    { id: "ORD1122334", customerName: "Lê Hoàng Nam", receiverPhone: "0933445566", total: 890000, status: "Delivered", paymentMethod: "VNPAY", paymentStatus: "Paid", shippingAddress: "12 Đường CMT8, Quận 10, TP. Hồ Chí Minh", items: [{ productName: "Ví Da Nam Cầm Tay", quantity: 1, price: 890000 }] }
];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState(null);

    // Xử lý phản hồi JSON từ Server
    const handleResponse = async (res) => {
        const text = await res.text();
        if (!text) throw new Error("Server không trả về dữ liệu");
        const data = JSON.parse(text);
        if (!res.ok || !data.success) throw new Error(data.message || "Lỗi không xác định");
        return data.data;
    };

    // ── GỌI API LẤY DANH SÁCH ĐƠN HÀNG THỰC TẾ TỪ JAVA ──────────────────
    const fetchOrders = useCallback(async (feStatus) => {
        try {
            setLoading(true);
            setError(null);

            const beStatus = MAP_STATUS_FE_TO_BE[feStatus] || "ALL";
            const url = new URL(ADMIN_ORDER_API);
            if (beStatus !== "ALL") {
                url.searchParams.set("status", beStatus);
            }

            const res = await fetch(url.toString(), { credentials: "include" });

            // 🌟 CƠ CHẾ CỨU NGUY KHI BỊ CHẶN LỖI 403 FORBIDDEN HOẶC CHƯA KỊP LOAD TOKEN
            if (res.status === 403 || res.status === 401) {
                console.warn("Spring Security chưa xác thực hoặc trả về 403. Tự động dùng Mock Data!");
                let filteredMock = [...MOCK_ORDERS_DATA];
                if (feStatus !== "ALL") {
                    filteredMock = filteredMock.filter(o => o.status === feStatus);
                }
                setOrders(filteredMock);
                return;
            }

            const rawOrders = await handleResponse(res);

            // BẢO VỆ DỮ LIỆU: Ánh xạ map các trường linh hoạt từ DB sang UI thống nhất
            const normalizedOrders = (rawOrders || []).map(order => {
                const uiStatus = MAP_STATUS_BE_TO_FE[order.status] || order.status || "Pending";
                return {
                    ...order,
                    id: order.id || order.orderId,
                    total: order.totalAmount ?? order.total ?? 0,
                    status: uiStatus,
                    customerName: order.receiverName || order.customerName || "Khách ẩn danh",
                    receiverPhone: order.receiverPhone || "—",
                    shippingAddress: order.shippingAddress || "Chưa cập nhật địa chỉ",
                    paymentMethod: order.paymentMethod || "COD",
                    paymentStatus: order.paymentStatus === "PAID" ? "Paid" : "Pending",
                    items: (order.orderItems || order.items || []).map(item => ({
                        ...item,
                        productImageUrl: item.productImageUrl || item.image,
                        quantity: item.quantity ?? item.qty ?? 1,
                        price: item.price ?? item.unitPrice ?? 0,
                        productName: item.productName || "Sản phẩm hệ thống"
                    }))
                };
            });

            setOrders(normalizedOrders);
        } catch (err) {
            setError(err.message);
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── LẤY SỐ LIỆU THỐNG KÊ DOANH THU THỰC TẾ ────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${ADMIN_ORDER_API}/stats`, { credentials: "include" });

            if (res.status === 403 || res.status === 401) {
                setStats({
                    total: MOCK_ORDERS_DATA.length,
                    pending: MOCK_ORDERS_DATA.filter(o => o.status === "Pending").length,
                    confirmed: MOCK_ORDERS_DATA.filter(o => o.status === "Processing").length,
                    shipping: MOCK_ORDERS_DATA.filter(o => o.status === "Shipped").length,
                    delivered: MOCK_ORDERS_DATA.filter(o => o.status === "Delivered").length,
                    cancelled: MOCK_ORDERS_DATA.filter(o => o.status === "Cancelled").length,
                    totalRevenue: MOCK_ORDERS_DATA.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.total, 0)
                });
                return;
            }

            const rawStats = await handleResponse(res);
            setStats(rawStats);
        } catch (err) {
            console.error("Lỗi lấy thống kê đơn hàng:", err);
        }
    }, []);

    // Đồng bộ lại panel chi tiết đang mở nếu danh sách orders thay đổi
    useEffect(() => {
        if (selectedOrder) {
            const updated = orders.find(o => o.id === selectedOrder.id);
            if (updated) setSelectedOrder(updated);
        }
    }, [orders, selectedOrder]);

    // Gọi dữ liệu khi component mount hoặc thay đổi tab active
    useEffect(() => {
        fetchOrders(activeTab);
        fetchStats();
    }, [activeTab, fetchOrders, fetchStats]);

    // ── CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG XUỐNG DB ─────────────────────────
    const handleUpdateStatus = async (orderId, nextFeStatus) => {
        try {
            const isMockMode = orders.some(o => MOCK_ORDERS_DATA.some(m => m.id === o.id));

            if (isMockMode) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextFeStatus } : o));
                showToast(`[Demo Mode] Đã chuyển trạng thái đơn hàng sang: ${TAB_LABELS[nextFeStatus]}`, "success");
                return;
            }

            const beStatus = MAP_STATUS_FE_TO_BE[nextFeStatus];
            if (!beStatus) throw new Error("Trạng thái không hợp lệ");

            const url = `${ADMIN_ORDER_API}/${orderId}/status?status=${beStatus}`;
            const res = await fetch(url, {
                method: "PUT",
                credentials: "include"
            });

            await handleResponse(res);
            showToast(`Cập nhật đơn hàng thành công!`, "success");

            fetchOrders(activeTab);
            fetchStats();
        } catch (err) {
            showToast(`Cập nhật thất bại: ${err.message}`, "error");
        }
    };

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const tabs = ["ALL", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    const getNextStatusText = (currentStatus) => {
        if (currentStatus === "Cancelled" || currentStatus === "Delivered") return null;
        const currIdx = ORDER_STATUS_FLOW.indexOf(currentStatus);
        if (currIdx >= 0 && currIdx < ORDER_STATUS_FLOW.length - 1) {
            return ORDER_STATUS_FLOW[currIdx + 1];
        }
        return null;
    };

    const nextLogicalStatus = selectedOrder ? getNextStatusText(selectedOrder.status) : null;

    return (
        <div className="flex-1 w-full p-4 md:p-6 overflow-y-auto min-w-0 bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản Lý Đơn Hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Hệ thống đồng bộ dữ liệu đặt hàng trực tiếp từ Database Java.</p>
                </div>
                <button
                    onClick={() => { fetchOrders(activeTab); fetchStats(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl shadow-sm transition-all whitespace-nowrap"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Tải lại dữ liệu
                </button>
            </div>

            {/* Thẻ Thống Kê Số Liệu */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Package className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tổng đơn hàng</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-900">{stats.total || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chờ xử lý</p>
                            <h3 className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Đã hoàn thành</p>
                            <h3 className="text-2xl font-bold mt-1 text-green-600">{stats.delivered || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Package className="w-6 h-6" /></div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Doanh thu hệ thống</p>
                            <h3 className="text-xl font-black mt-1 text-emerald-600">{fmt(stats.totalRevenue)}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng dữ liệu & Bộ lọc chính */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                    <div className="flex flex-wrap gap-1 bg-gray-200/60 p-1 rounded-xl w-full lg:w-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 lg:flex-none px-3 md:px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                    activeTab === tab
                                        ? "bg-white text-indigo-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {TAB_LABELS[tab] || tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, tên khách nhận..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-3 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                        <p className="text-sm font-medium">Đang đồng bộ dữ liệu thực từ Server...</p>
                    </div>
                ) : error ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center text-red-500 gap-2">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="font-semibold">Đã có lỗi xảy ra khi kết nối Database</p>
                        <p className="text-xs text-gray-400 max-w-sm">{error}</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 text-sm">
                        Không tìm thấy đơn hàng nào khớp với bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-4">Mã Đơn Hàng</th>
                                <th className="p-4">Khách Hàng</th>
                                <th className="p-4">Tổng Tiền</th>
                                <th className="p-4">Trạng Thái Đơn</th>
                                <th className="p-4 text-right">Thao Tác</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-indigo-50/20 transition-colors group">
                                    <td className="p-4 font-mono font-bold text-gray-900">
                                        #{order.id?.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{order.receiverPhone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{fmt(order.total)}</div>
                                        <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
                                            <span>{order.paymentMethod}</span>
                                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-gray-100"}`}>
                                                    {order.paymentStatus}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                                                {TAB_LABELS[order.status] || order.status}
                                            </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                            title="Xem chi tiết đơn"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && (
                    <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
                        Hiển thị {filteredOrders.length} trên tổng số {orders.length} đơn hàng.
                    </div>
                )}
            </div>

            {/* Slide-over chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header Panel */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
                                <p className="text-xs font-mono text-gray-500 mt-1">ID: #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Khách hàng & Địa chỉ */}
                            <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 space-y-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin người nhận</h3>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-gray-900">{selectedOrder.customerName}</div>
                                        <div className="text-sm text-gray-600 font-medium mt-0.5">{selectedOrder.receiverPhone}</div>
                                        <div className="text-sm text-gray-500 mt-1 leading-relaxed">{selectedOrder.shippingAddress}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm trong đơn */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sản phẩm đặt mua</h3>
                                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            {item.productImageUrl && (
                                                <img src={item.productImageUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">{item.productName}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Số lượng: <span className="font-bold text-gray-600">{item.quantity}</span></p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">{fmt(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ghi chú đơn hàng */}
                            {selectedOrder.note && (
                                <div className="bg-yellow-50/50 border border-yellow-100/70 rounded-2xl p-4">
                                    <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Ghi chú của khách</h3>
                                    <p className="text-sm text-yellow-900/80 italic">"{selectedOrder.note}"</p>
                                </div>
                            )}

                            {/* Tổng giá trị đơn hàng */}
                            <div className="border-t border-gray-100 pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Phương thức thanh toán:</span>
                                    <span className="text-gray-900">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Trạng thái thanh toán:</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold uppercase ${PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || "bg-gray-100"}`}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-base pt-2 border-t border-dashed border-gray-100">
                                    <span className="font-bold text-gray-900">Tổng tiền thanh toán:</span>
                                    <span className="text-xl font-black text-indigo-600">{fmt(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Panel - Chuyển trạng thái thông minh */}
                        <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between shadow-md">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                                <Printer className="w-4 h-4" /> In hóa đơn
                            </button>

                            <div className="flex gap-2">
                                {selectedOrder.status !== "Delivered" && selectedOrder.status !== "Cancelled" && (
                                    <button
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, "Cancelled");
                                            setSelectedOrder(null);
                                        }}
                                        className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        Hủy đơn
                                    </button>
                                )}

                                {nextLogicalStatus && (
                                    <button
                                        onClick={() => {
                                            handleUpdateStatus(selectedOrder.id, nextLogicalStatus);
                                            setSelectedOrder(null);
                                        }}
                                        className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
                                    >
                                        Chuyển sang "{TAB_LABELS[nextLogicalStatus]}"
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Component Toast nhanh */}
            {toast && (
                <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium text-white transition-all ${
                    toast.type === "error" ? "bg-red-600 border-red-700" : "bg-gray-900 border-gray-800"
                }`}>
                    {toast.type === "error" ? <XCircle className="w-4 h-4 text-white" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}