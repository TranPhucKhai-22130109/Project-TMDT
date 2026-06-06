"use client";
// src/app/orders/[id]/page.jsx

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import Navbar from "@/components/Navbar";
import { getOrderDetail } from "@/services/order";
import { useCart } from "@/app/cart/CartContext";
import {
    CheckCircle2, XCircle, Clock, Package, MapPin,
    Phone, User, CreditCard, Truck, ArrowLeft,
    Loader2, BadgeCheck, Calendar, Hash,
} from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price ?? 0);
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));
}

const FREE_SHIP_THRESHOLD = 5_000_000;
const SHIPPING_FEE        = 50_000;

const ORDER_STATUS_CONFIG = {
    PENDING:   { label: "Chờ xác nhận",   color: "text-amber-600 bg-amber-50 border-amber-200",     icon: Clock },
    CONFIRMED: { label: "Đã xác nhận",    color: "text-blue-600 bg-blue-50 border-blue-200",        icon: BadgeCheck },
    SHIPPING:  { label: "Đang giao hàng", color: "text-indigo-600 bg-indigo-50 border-indigo-200",  icon: Truck },
    DELIVERED: { label: "Đã giao hàng",   color: "text-green-600 bg-green-50 border-green-200",     icon: CheckCircle2 },
    CANCELLED: { label: "Đã hủy đơn",     color: "text-red-600 bg-red-50 border-red-200",           icon: XCircle },
};

const PAYMENT_STATUS_LABEL = {
    UNPAID:   { label: "Chưa thanh toán", color: "text-orange-500 bg-orange-50 border-orange-200" },
    PAID:     { label: "Đã thanh toán",   color: "text-green-600 bg-green-50 border-green-200" },
    REFUNDED: { label: "Đã hoàn tiền",    color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function OrderDetailPage() {
    const params       = useParams();
    const searchParams = useSearchParams();
    const router       = useRouter();
    const id           = params?.id;

    const vnpayStatus = searchParams?.get("vnpay");
    const codStatus   = searchParams?.get("status");

    const { reloadCartCount } = useCart();

    const [order, setOrder]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (!id) return;
        if (reloadCartCount) reloadCartCount();

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderDetail(id);
                setOrder(data);
            } catch (err) {
                console.error(err);
                setError(err.message || "Không thể lấy chi tiết đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="text-center py-20">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy đơn hàng</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <NextLink href="/orders" className="text-orange-500 underline">Quay lại danh sách</NextLink>
            </div>
        </div>
    );

    const statusInfo  = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
    const StatusIcon  = statusInfo.icon;
    const payStatus   = PAYMENT_STATUS_LABEL[order.paymentStatus];
    const totalItems  = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

    // ── Tính phí ship đồng bộ với CheckoutPage ──
    const subtotal    = order.totalAmount ?? 0;
    const shippingFee = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal  = subtotal + shippingFee;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 pt-8">

                {/* Banner VNPay thành công */}
                {vnpayStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        Thanh toán trực tuyến qua VNPay thành công! Đơn hàng của bạn đang được xử lý.
                    </div>
                )}

                {/* Banner VNPay thất bại */}
                {vnpayStatus === "fail" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        Giao dịch thanh toán qua VNPay thất bại hoặc đã bị hủy.
                    </div>
                )}

                {/* Banner COD thành công */}
                {codStatus === "cod_success" && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl flex items-center gap-3 text-sm font-medium">
                        <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />
                        Đặt hàng thành công! Vui lòng thanh toán tiền mặt khi nhận hàng (COD).
                    </div>
                )}

                {/* Nút quay lại */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại lịch sử đơn hàng
                </button>

                {/* ── Card: Trạng thái đơn hàng ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Hash className="w-4 h-4" />
                                <span className="font-mono font-bold text-gray-900 dark:text-white break-all">{order.id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(order.createdAt)}
                                </span>
                                <span>{totalItems} sản phẩm</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusInfo.label}
                            </span>
                            {payStatus && (
                                <span className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border ${payStatus.color}`}>
                                    {payStatus.label}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Card: Danh sách sản phẩm ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" /> Sản phẩm đã đặt
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {order.items?.map((item, idx) => (
                            <div key={item.id ?? idx} className="flex gap-4 p-5 items-center">
                                <img
                                    src={item.productImageUrl || "/placeholder.png"}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {item.productName}
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-0.5">Số lượng: x{item.quantity}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {formatPrice(item.price)}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-gray-400">{formatPrice(item.price / item.quantity)} / cái</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền */}
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Tạm tính ({totalItems} sản phẩm)</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span className={shippingFee === 0 ? "text-green-600 font-medium" : "text-gray-700 dark:text-gray-300"}>
                                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                            </span>
                        </div>
                        <div className="flex justify-between font-black text-base pt-2 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-gray-900 dark:text-white">Tổng cộng</span>
                            <span className="text-orange-500 text-lg">{formatPrice(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Card: Thông tin giao hàng ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> Thông tin giao hàng
                        </h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <User className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-gray-500 w-28 shrink-0">Người nhận</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{order.receiverName || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-gray-500 w-28 shrink-0">Số điện thoại</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{order.receiverPhone || "—"}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <span className="text-gray-500 w-28 shrink-0">Địa chỉ</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {[order.shippingAddress, order.city].filter(Boolean).join(", ") || "—"}
                            </span>
                        </div>
                        {order.note && (
                            <div className="flex items-start gap-3 text-sm">
                                <span className="w-4 h-4 shrink-0" />
                                <span className="text-gray-500 w-28 shrink-0">Ghi chú</span>
                                <span className="text-gray-700 dark:text-gray-300 italic">{order.note}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Card: Phương thức thanh toán ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" /> Thanh toán
                        </h2>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Phương thức</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán online (VNPay)"}
                        </span>
                    </div>
                </div>

                {/* Nút mua lại */}
                <NextLink
                    href="/"
                    className="block w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-center text-sm transition-all shadow-lg shadow-orange-500/20"
                >
                    Tiếp tục mua sắm
                </NextLink>

            </div>
        </div>
    );
}