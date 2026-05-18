
"use client";
// src/app/orders/[id]/page.jsx — Chi tiết đơn hàng

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderDetail } from "@/services/orderService";
import {
    Package,
    MapPin,
    Phone,
    User,
    CreditCard,
    Truck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Loader2,
    PartyPopper,
    AlertCircle
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function formatDate(instant) {
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
    { key: "DELIVERED", label: "Đã giao hàng", icon: CheckCircle2 },
];

const STATUS_STEP_INDEX = {
    PENDING: 0,
    CONFIRMED: 1,
    SHIPPING: 2,
    DELIVERED: 3,
    CANCELLED: -1,
};

export default function OrderDetailPage() {

    const { id: orderId } = useParams();

    const searchParams = useSearchParams();
    const router = useRouter();


    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const isSuccess = searchParams.get("success") === "true";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBanner, setShowBanner] = useState(isSuccess);

    useEffect(() => {
        // Chờ kiểm tra đăng nhập xong
        if (authLoading) return;

        // Nếu chưa đăng nhập hoặc không có orderId thì dừng loading
        if (!isAuthenticated || !orderId) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const data = await getOrderDetail(orderId);
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isAuthenticated, authLoading, orderId]);

    useEffect(() => {
        if (showBanner) {
            const t = setTimeout(() => setShowBanner(false), 4000);
            return () => clearTimeout(t);
        }
    }, [showBanner]);


    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    //  Nếu chưa đăng nhập
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem chi tiết đơn hàng</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-500">{error || "Không tìm thấy đơn hàng"}</p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="mt-4 text-orange-500 hover:underline text-sm font-medium"
                    >
                        Quay lại lịch sử đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    const stepIndex = STATUS_STEP_INDEX[order.status];
    const isCancelled = order.status === "CANCELLED";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Success banner */}
                {showBanner && (
                    <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 animate-fade-in">
                        <PartyPopper className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Đặt hàng thành công!</p>
                            <p className="text-xs mt-0.5">
                                Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
                            </p>
                        </div>
                    </div>
                )}

                {/* Back */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition mb-5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Lịch sử mua hàng
                </button>

                {/* Order ID + Date */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                                #{order.id.toUpperCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Ngày đặt</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status tracker */}
                {!isCancelled ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Trạng thái đơn hàng
                        </h2>
                        <div className="flex items-center">
                            {STATUS_STEPS.map((step, idx) => {
                                const Icon = step.icon;
                                const done = idx <= stepIndex;
                                const active = idx === stepIndex;
                                return (
                                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                                    done
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                } ${active ? "ring-4 ring-orange-100 dark:ring-orange-900" : ""}`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <p
                                                className={`text-xs mt-1.5 text-center w-16 leading-tight ${
                                                    done ? "text-orange-500 font-medium" : "text-gray-400"
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div
                                                className={`flex-1 h-0.5 mx-1 mb-5 transition ${
                                                    idx < stepIndex ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-600"
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-4 flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Đơn hàng đã bị hủy
                        </p>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Sản phẩm ({order.items?.length || 0})
                    </h2>
                    <div className="space-y-4">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                                <img
                                    src={item.productImageUrl || "/placeholder.png"}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                        {item.productName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {formatPrice(item.unitPrice)} × {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                    {formatPrice(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Tạm tính</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-500">Miễn phí</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700 text-base">
                            <span>Tổng cộng</span>
                            <span className="text-orange-500">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping + Payment info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Thông tin giao hàng & thanh toán
                    </h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">Người nhận</p>
                                <p className="text-gray-900 dark:text-white font-medium">{order.receiverName}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">Số điện thoại</p>
                                <p className="text-gray-900 dark:text-white">{order.receiverPhone}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">Địa chỉ</p>
                                <p className="text-gray-900 dark:text-white">
                                    {order.shippingAddress}, {order.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">Thanh toán</p>
                                <p className="text-gray-900 dark:text-white">
                                    {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán online"}
                                    {" · "}
                                    <span
                                        className={
                                            order.paymentStatus === "PAID"
                                                ? "text-green-500"
                                                : order.paymentStatus === "REFUNDED"
                                                    ? "text-blue-500"
                                                    : "text-orange-500"
                                        }
                                    >
                                        {order.paymentStatus === "PAID"
                                            ? "Đã thanh toán"
                                            : order.paymentStatus === "REFUNDED"
                                                ? "Đã hoàn tiền"
                                                : "Chưa thanh toán"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {order.note && (
                            <div className="flex gap-3">
                                <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400">Ghi chú</p>
                                    <p className="text-gray-900 dark:text-white">{order.note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                        Tiếp tục mua hàng
                    </button>
                </div>
            </div>
        </div>
    );

"use client";
// src/app/orders/[id]/page.jsx — Chi tiết đơn hàng

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderDetail } from "@/services/orderService";
import {
    Package,
    MapPin,
    Phone,
    User,
    CreditCard,
    Truck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Loader2,
    PartyPopper,
    AlertCircle
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function formatDate(instant) {
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
    { key: "DELIVERED", label: "Đã giao hàng", icon: CheckCircle2 },
];

const STATUS_STEP_INDEX = {
    PENDING: 0,
    CONFIRMED: 1,
    SHIPPING: 2,
    DELIVERED: 3,
    CANCELLED: -1,
};

export default function OrderDetailPage() {

    const {id: orderId} = useParams();

    const searchParams = useSearchParams();
    const router = useRouter();


    const {isAuthenticated, isLoading: authLoading} = useAuth();

    const isSuccess = searchParams.get("success") === "true";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBanner, setShowBanner] = useState(isSuccess);

    useEffect(() => {
        // Chờ kiểm tra đăng nhập xong
        if (authLoading) return;

        // Nếu chưa đăng nhập hoặc không có orderId thì dừng loading
        if (!isAuthenticated || !orderId) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const data = await getOrderDetail(orderId);
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isAuthenticated, authLoading, orderId]);

    useEffect(() => {
        if (showBanner) {
            const t = setTimeout(() => setShowBanner(false), 4000);
            return () => clearTimeout(t);
        }
    }, [showBanner]);


    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin"/>
            </div>
        );
    }

    //  Nếu chưa đăng nhập
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4"/>
                    <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem chi tiết đơn hàng</p>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-500">{error || "Không tìm thấy đơn hàng"}</p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="mt-4 text-orange-500 hover:underline text-sm font-medium"
                    >
                        Quay lại lịch sử đơn hàng
                    </button>
                </div>
            </div>
        );
    }

    const stepIndex = STATUS_STEP_INDEX[order.status];
    const isCancelled = order.status === "CANCELLED";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Success banner */}
                {showBanner && (
                    <div
                        className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 animate-fade-in">
                        <PartyPopper className="w-5 h-5 flex-shrink-0"/>
                        <div>
                            <p className="font-semibold">Đặt hàng thành công!</p>
                            <p className="text-xs mt-0.5">
                                Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
                            </p>
                        </div>
                    </div>
                )}

                {/* Back */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition mb-5"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    Lịch sử mua hàng
                </button>

                {/* Order ID + Date */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Mã đơn hàng</p>
                            <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                                #{order.id.toUpperCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Ngày đặt</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status tracker */}
                {!isCancelled ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Trạng thái đơn hàng
                        </h2>
                        <div className="flex items-center">
                            {STATUS_STEPS.map((step, idx) => {
                                const Icon = step.icon;
                                const done = idx <= stepIndex;
                                const active = idx === stepIndex;
                                return (
                                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                                    done
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                } ${active ? "ring-4 ring-orange-100 dark:ring-orange-900" : ""}`}
                                            >
                                                <Icon className="w-4 h-4"/>
                                            </div>
                                            <p
                                                className={`text-xs mt-1.5 text-center w-16 leading-tight ${
                                                    done ? "text-orange-500 font-medium" : "text-gray-400"
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div
                                                className={`flex-1 h-0.5 mx-1 mb-5 transition ${
                                                    idx < stepIndex ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-600"
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-4 flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0"/>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Đơn hàng đã bị hủy
                        </p>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Sản phẩm ({order.items?.length || 0})
                    </h2>
                    <div className="space-y-4">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                                <img
                                    src={item.productImageUrl || "/placeholder.png"}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.png";
                                    }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                        {item.productName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {formatPrice(item.unitPrice)} × {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                    {formatPrice(item.subtotal)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4 space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Tạm tính</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>Phí vận chuyển</span>
                            <span className="text-green-500">Miễn phí</span>
                        </div>
                        <div
                            className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700 text-base">
                            <span>Tổng cộng</span>
                            <span className="text-orange-500">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping + Payment info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Thông tin giao hàng & thanh toán
                    </h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                            <div>
                                <p className="text-xs text-gray-400">Người nhận</p>
                                <p className="text-gray-900 dark:text-white font-medium">{order.receiverName}</p>
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
                                <p className="text-xs text-gray-400">Địa chỉ</p>
                                <p className="text-gray-900 dark:text-white">
                                    {order.shippingAddress}, {order.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                            <div>
                                <p className="text-xs text-gray-400">Thanh toán</p>
                                <p className="text-gray-900 dark:text-white">
                                    {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán online"}
                                    {" · "}
                                    <span
                                        className={
                                            order.paymentStatus === "PAID"
                                                ? "text-green-500"
                                                : order.paymentStatus === "REFUNDED"
                                                    ? "text-blue-500"
                                                    : "text-orange-500"
                                        }
                                    >
                                        {order.paymentStatus === "PAID"
                                            ? "Đã thanh toán"
                                            : order.paymentStatus === "REFUNDED"
                                                ? "Đã hoàn tiền"
                                                : "Chưa thanh toán"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {order.note && (
                            <div className="flex gap-3">
                                <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"/>
                                <div>
                                    <p className="text-xs text-gray-400">Ghi chú</p>
                                    <p className="text-gray-900 dark:text-white">{order.note}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                        Tiếp tục mua hàng
                    </button>
                </div>
            </div>
        </div>
    );
}
}