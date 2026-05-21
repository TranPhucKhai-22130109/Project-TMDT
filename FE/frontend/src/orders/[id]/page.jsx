"use client";

import { useEffect, useState, Suspense } from "react"; // NHỚ IMPORT THÊM Suspense
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderDetail } from "@/services/orderService";
import {
    Package, MapPin, Phone, User, CreditCard, Truck, Clock,
    CheckCircle2, XCircle, ArrowLeft, Loader2, PartyPopper, AlertCircle
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function formatDate(instant) {
    if (!instant) return "";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(instant));
}

const STATUS_STEPS = [
    { key: "PENDING", label: "Chờ xác nhận", icon: Clock },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle2 },
    { key: "SHIPPING", label: "Đang giao hàng", icon: Truck },
    { key: "COMPLETED", label: "Đã hoàn thành", icon: Package },
];

// ==========================================
// 1. COMPONENT CON CHỨA TOÀN BỘ LOGIC CỦA BẠN
// ==========================================
function OrderDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isPaymentSuccess = searchParams.get("payment") === "success";
    const orderId = params.id;

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                const data = await getOrderDetail(orderId);
                setOrder(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi lấy chi tiết đơn hàng:", err);
                setError(err.message || "Không thể tải thông tin đơn hàng này.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId, isAuthenticated, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-1">Xảy ra lỗi</h3>
                    <p className="text-gray-500 text-sm mb-4">{error || "Đơn hàng không tồn tại."}</p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-sm font-medium transition"
                    >
                        Quay về lịch sử mua hàng
                    </button>
                </div>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === order.status);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* BANNER CHÚC MỪNG KHI THANH TOÁN VNPAY THÀNH CÔNG */}
                {isPaymentSuccess && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center shadow-sm">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full text-emerald-600 dark:text-emerald-400 mb-3">
                            <PartyPopper className="w-6 h-6 animate-bounce" />
                        </div>
                        <h2 className="text-xl font-black text-emerald-900 dark:text-emerald-300">
                            Đặt hàng & Thanh toán thành công!
                        </h2>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                            Cảm ơn bạn! Đơn hàng thanh toán trực tuyến qua cổng VNPay đã được hoàn tất. Hệ thống đang tiến hành chuẩn bị hàng hóa.
                        </p>
                    </div>
                )}

                {/* Tiêu đề & Nút quay lại */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push("/orders")}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1"/>
                        Quay lại lịch sử
                    </button>
                    <h1 className="text-xl font-bold text-gray-950 dark:text-white">
                        Chi tiết đơn hàng #{order.id}
                    </h1>
                </div>

                {/* KHỐI 1: TIẾN TRÌNH TRẠNG THÁI ĐƠN HÀNG */}
                {order.status === "CANCELLED" ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center gap-4 text-red-600">
                        <XCircle className="w-8 h-8 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-base">Đơn hàng đã bị hủy</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Vào lúc {formatDate(order.updatedAt || order.createdAt)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                        <div className="relative flex justify-between items-center max-w-xl mx-auto">
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-orange-500 -z-10 transition-all duration-500"
                                style={{ width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
                            />

                            {STATUS_STEPS.map((step, idx) => {
                                const StepIcon = step.icon;
                                const isDone = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;

                                return (
                                    <div key={step.key} className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition border ${
                                            isDone
                                                ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-500/20"
                                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                                        } ${isCurrent ? "ring-4 ring-orange-100 dark:ring-orange-950/50" : ""}`}>
                                            <StepIcon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[11px] font-medium mt-2 absolute -bottom-6 transform translate-y-1 text-center whitespace-nowrap ${
                                            isCurrent ? "text-orange-600 font-bold" : isDone ? "text-gray-800 dark:text-gray-200" : "text-gray-400"
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-6" />
                    </div>
                )}

                {/* KHỐI 2: GRID THÔNG TIN GIAO HÀNG & THANH TOÁN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-700/50 pb-2 text-sm uppercase tracking-wider">
                            Thông tin nhận hàng
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Người nhận</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{order.receiverName}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Số điện thoại</p>
                                    <p className="text-gray-900 dark:text-white">{order.receiverPhone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Địa chỉ giao hàng</p>
                                    <p className="text-gray-900 dark:text-white">{order.shippingAddress}, {order.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-700/50 pb-2 text-sm uppercase tracking-wider">
                            Chi tiết giao dịch
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Thời gian tạo đơn</p>
                                    <p className="text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Phương thức thanh toán</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {order.paymentMethod === "ONLINE" ? "Thanh toán qua ví VNPay" : "Thanh toán COD khi nhận hàng"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Trạng thái thanh toán</p>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                                        order.paymentStatus === "PAID"
                                            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
                                            : order.paymentStatus === "REFUNDED"
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800"
                                    }`}>
                                        {order.paymentStatus === "PAID"
                                            ? "Đã thanh toán"
                                            : order.paymentStatus === "REFUNDED"
                                                ? "Đã hoàn tiền"
                                                : "Chưa thanh toán"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {order.note && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-sm flex gap-3">
                        <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-xs text-gray-400">Ghi chú từ khách hàng</p>
                            <p className="text-gray-900 dark:text-white mt-0.5 italic">"{order.note}"</p>
                        </div>
                    </div>
                )}

                {/* KHỐI 3: DANH SÁCH MẶT HÀNG TRONG ĐƠN HÀNG */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-50 dark:border-gray-700/50">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Danh sách sản phẩm</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {order.items && order.items.map((item) => (
                            <div key={item.id} className="p-4 sm:p-6 flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                                        {item.productName || `Sản phẩm #${item.productId}`}
                                    </h4>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{formatPrice(item.unitPrice * item.quantity)}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.unitPrice)} / cái</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng tiền đơn hàng:</span>
                        <span className="text-xl font-black text-red-600 dark:text-red-500">{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-sm shadow-orange-500/10 transition"
                    >
                        Tiếp tục mua hàng
                    </button>
                </div>

            </div>
        </div>
    );
}

// ==========================================
// 2. COMPONENT CHÍNH ĐƯỢC EXPORT (BỌC SUSPENSE)
// ==========================================
export default function OrderDetailPage() {
    return (
        // Bọc Suspense để Next.js không bị crash khi build do xài useSearchParams
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Đang tải...</p>
                </div>
            </div>
        }>
            <OrderDetailContent />
        </Suspense>
    );
}