
"use client";
// src/app/orders/page.jsx — Lịch sử mua hàng

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrderHistory } from "@/services/orderService";
import {
    Package, ChevronRight, Clock, CheckCircle2,
    Truck, XCircle, ShoppingBag, Loader2,
    AlertCircle, CreditCard,
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency", currency: "VND",
    }).format(price);
}

function formatDate(instant) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(instant));
}

const STATUS_CONFIG = {
    PENDING: { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
    CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: CheckCircle2 },
    SHIPPING: { label: "Đang giao hàng", color: "text-purple-600 bg-purple-50 border-purple-200", icon: Truck },
    DELIVERED: { label: "Đã giao hàng", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    CANCELLED: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
};

const PAYMENT_LABEL = { COD: "COD", ONLINE: "Thanh toán online" };

const PAYMENT_STATUS_LABEL = {
    UNPAID: { label: "Chưa thanh toán", color: "text-orange-500" },
    PAID: { label: "Đã thanh toán", color: "text-green-500" },
    REFUNDED: { label: "Đã hoàn tiền", color: "text-blue-500" },
};

function OrderCard({ order }) {
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
    const StatusIcon = status.icon;
    const payStatus = PAYMENT_STATUS_LABEL[order.paymentStatus];
    const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

    return (
        <Link
            href={`/orders/${order.id}`}
            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-600 transition-all group"
        >
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </span>
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                            <img
                                key={idx}
                                src={item.productImageUrl || "/placeholder.png"}
                                alt={item.productName}
                                className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                            />
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 font-medium flex-shrink-0">
                                +{order.items.length - 3}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {totalItems} sản phẩm • {formatDate(order.createdAt)}
                        </p>
                        <p className="text-xs flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500">{PAYMENT_LABEL[order.paymentMethod]}</span>
                            {" · "}
                            <span className={payStatus?.color}>{payStatus?.label}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-500">
                            {formatPrice(order.totalAmount)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function OrderHistoryPage() {
    const router = useRouter();


    const { isAuthenticated, isLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        // Đợi auth load xong, nếu chưa đăng nhập thì bỏ qua
        if (isLoading || !isAuthenticated) {
            if (!isLoading) setLoading(false);
            return;
        }

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderHistory();
                setOrders(data);
            } catch (err) {
                setError(err.message || "Không thể tải lịch sử đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isAuthenticated, isLoading]);


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Bạn chưa đăng nhập</h2>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition mt-3"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    const FILTERS = ["ALL", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
    const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center gap-2 mb-6">
                    <ShoppingBag className="w-6 h-6 text-orange-500" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Lịch sử mua hàng
                    </h1>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {FILTERS.map((f) => {
                        const label = f === "ALL" ? "Tất cả" : STATUS_CONFIG[f]?.label || f;
                        const count = f === "ALL" ? orders.length : orders.filter((o) => o.status === f).length;

                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                                    filter === f
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300"
                                }`}
                            >
                                {label}
                                {count > 0 && (
                                    <span className={`ml-1.5 text-xs ${filter === f ? "opacity-80" : "text-gray-400"}`}>
                                        ({count})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <p className="text-gray-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-orange-500 hover:underline text-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">Không có đơn hàng nào</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
                        >
                            Mua hàng ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

"use client";
// src/app/orders/page.jsx — Lịch sử mua hàng

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getOrderHistory } from "@/services/orderService";
import {
    Package, ChevronRight, Clock, CheckCircle2,
    Truck, XCircle, ShoppingBag, Loader2,
    AlertCircle, CreditCard,
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency", currency: "VND",
    }).format(price);
}

function formatDate(instant) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(instant));
}

const STATUS_CONFIG = {
    PENDING: { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
    CONFIRMED: { label: "Đã xác nhận", color: "text-blue-600 bg-blue-50 border-blue-200", icon: CheckCircle2 },
    SHIPPING: { label: "Đang giao hàng", color: "text-purple-600 bg-purple-50 border-purple-200", icon: Truck },
    DELIVERED: { label: "Đã giao hàng", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    CANCELLED: { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
};

const PAYMENT_LABEL = { COD: "COD", ONLINE: "Thanh toán online" };

const PAYMENT_STATUS_LABEL = {
    UNPAID: { label: "Chưa thanh toán", color: "text-orange-500" },
    PAID: { label: "Đã thanh toán", color: "text-green-500" },
    REFUNDED: { label: "Đã hoàn tiền", color: "text-blue-500" },
};

function OrderCard({ order }) {
    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
    const StatusIcon = status.icon;
    const payStatus = PAYMENT_STATUS_LABEL[order.paymentStatus];
    const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

    return (
        <Link
            href={`/orders/${order.id}`}
            className="block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-600 transition-all group"
        >
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </span>
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                            <img
                                key={idx}
                                src={item.productImageUrl || "/placeholder.png"}
                                alt={item.productName}
                                className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                            />
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 font-medium flex-shrink-0">
                                +{order.items.length - 3}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {totalItems} sản phẩm • {formatDate(order.createdAt)}
                        </p>
                        <p className="text-xs flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500">{PAYMENT_LABEL[order.paymentMethod]}</span>
                            {" · "}
                            <span className={payStatus?.color}>{payStatus?.label}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-500">
                            {formatPrice(order.totalAmount)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function OrderHistoryPage() {
    const router = useRouter();


    const {isAuthenticated, isLoading} = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        // Đợi auth load xong, nếu chưa đăng nhập thì bỏ qua
        if (isLoading || !isAuthenticated) {
            if (!isLoading) setLoading(false);
            return;
        }

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderHistory();
                setOrders(data);
            } catch (err) {
                setError(err.message || "Không thể tải lịch sử đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isAuthenticated, isLoading]);


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin"/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4"/>
                    <h2 className="text-xl font-semibold mb-2">Bạn chưa đăng nhập</h2>
                    <button
                        onClick={() => router.push("/login")}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition mt-3"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    const FILTERS = ["ALL", "PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
    const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-center gap-2 mb-6">
                    <ShoppingBag className="w-6 h-6 text-orange-500"/>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Lịch sử mua hàng
                    </h1>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {FILTERS.map((f) => {
                        const label = f === "ALL" ? "Tất cả" : STATUS_CONFIG[f]?.label || f;
                        const count = f === "ALL" ? orders.length : orders.filter((o) => o.status === f).length;

                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                                    filter === f
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300"
                                }`}
                            >
                                {label}
                                {count > 0 && (
                                    <span className={`ml-1.5 text-xs ${filter === f ? "opacity-80" : "text-gray-400"}`}>
                                        ({count})
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin"/>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3"/>
                        <p className="text-gray-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-orange-500 hover:underline text-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                        <p className="text-gray-500 font-medium">Không có đơn hàng nào</p>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
                        >
                            Mua hàng ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order) => (
                            <OrderCard key={order.id} order={order}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
}