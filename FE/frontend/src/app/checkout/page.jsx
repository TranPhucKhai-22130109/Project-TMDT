"use client";

import { checkout } from "@/services/order";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getCartItems } from "@/services/cartService";
import { getProductById } from "@/services/productService";
import { getMyProfile } from "@/services/userService";
import Navbar from "@/components/Navbar";
import {
    MapPin, Phone, User, CreditCard,
    ChevronRight, Loader2, AlertCircle, CheckCircle2,
    ShoppingBag, Package, Info
} from "lucide-react";

const CITIES = [
    "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Ninh", "Bến Tre",
    "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
    "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang"
];

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price ?? 0);
}

function getItemSubtotal(item) {
    if (item.subtotal != null && !isNaN(item.subtotal)) return Number(item.subtotal);
    const price = Number(item.product?.price ?? item.product?.currentPrice ?? item.unitPrice ?? 0);
    const qty   = Number(item.quantity ?? 1);
    return price * qty;
}

const FREE_SHIP_THRESHOLD = 5_000_000;
const SHIPPING_FEE        = 50_000;

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { reloadCartCount } = useCart();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const auctionProductId = searchParams.get("auctionProductId");
    const auctionPrice = Number(searchParams.get("price"));
    const isAuctionCheckout = Boolean(auctionProductId);

    const [cartItems, setCartItems]     = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting]   = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [isSuccess, setIsSuccess]           = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState("");
    const [prefilled, setPrefilled] = useState(false);

    const [receiverName, setReceiverName]       = useState("");
    const [receiverPhone, setReceiverPhone]     = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [city, setCity]                       = useState("");
    const [note, setNote]                       = useState("");
    const [paymentMethod, setPaymentMethod]     = useState("COD");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?redirect=/checkout");
            return;
        }
        if (!isAuthenticated) return;

        const fetchCheckoutData = async () => {
            try {
                setPageLoading(true);
                if (isAuctionCheckout) {
                    const product = await getProductById(auctionProductId);
                    const displayPrice = auctionPrice || product.currentPrice || product.price || 0;
                    setCartItems([
                        {
                            id: `auction-${product.id}`,
                            quantity: 1,
                            subtotal: displayPrice,
                            product: {
                                ...product,
                                price: displayPrice,
                                currentPrice: displayPrice,
                            },
                        },
                    ]);
                } else {
                    const data = await getCartItems();
                    const list = Array.isArray(data) ? data : data.content || [];
                    setCartItems(list);
                }

                try {
                    const p = await getMyProfile();
                    if (p) {
                        const name     = p.fullName || p.name || [p.firstName, p.lastName].filter(Boolean).join(" ") || "";
                        const phone    = p.phone || p.phoneNumber || p.mobile || "";
                        const addr     = p.address || p.shippingAddress || "";
                        const userCity = p.city || p.province || "";
                        if (name)     setReceiverName(name);
                        if (phone)    setReceiverPhone(phone);
                        if (addr)     setShippingAddress(addr);
                        if (userCity) setCity(userCity);
                        if (name || phone) setPrefilled(true);
                    }
                } catch (profileErr) {
                    console.warn("Không thể tải thông tin profile:", profileErr.message);
                }
            } catch (err) {
                console.error("Lỗi lấy giỏ hàng checkout:", err);
                setSubmitError("Không thể tải giỏ hàng. Vui lòng thử lại.");
            } finally {
                setPageLoading(false);
            }
        };

        fetchCheckoutData();
    }, [isAuthenticated, authLoading, isAuctionCheckout, auctionProductId, auctionPrice]);

    // ── Derived totals ─────────────────────────────────────────────
    const cartTotal   = cartItems.reduce((sum, item) => sum + getItemSubtotal(item), 0);
    // Miễn phí ship khi giỏ hàng trống (0đ) HOẶC đạt ngưỡng FREE_SHIP_THRESHOLD
    const shippingFee = cartTotal === 0 || cartTotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotal  = cartTotal + shippingFee;
    const remaining   = FREE_SHIP_THRESHOLD - cartTotal; // số tiền còn thiếu để miễn ship

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setSubmitError("Giỏ hàng của bạn đang trống.");
            return;
        }
        try {
            setSubmitting(true);
            setSubmitError("");
            const checkoutData = {
                receiverName,
                receiverPhone,
                shippingAddress,
                city,
                note,
                paymentMethod,
                auctionCheckout: isAuctionCheckout,
                items: cartItems.map(item => ({
                    productId: item.product?.id || item.id,
                    quantity: item.quantity,
                })),
            };
            console.log("Checkout payload:", JSON.stringify(checkoutData, null, 2));
            const orderResult = await checkout(checkoutData);
            if (reloadCartCount) await reloadCartCount();
            if (paymentMethod === "ONLINE" && orderResult.paymentUrl) {
                window.location.href = orderResult.paymentUrl;
            } else if (paymentMethod === "ONLINE") {
                throw new Error("Không nhận được URL thanh toán từ hệ thống.");
            } else {
                setCreatedOrderId(orderResult.id);
                setIsSuccess(true);
            }
        } catch (err) {
            setSubmitError(err.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Đặt hàng thành công!</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
                    </p>
                    <p className="text-xs font-mono text-gray-400 mb-6 break-all">#{createdOrderId}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/orders/${createdOrderId}?status=cod_success`)}
                            className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Xem chi tiết đơn hàng vừa đặt
                        </button>
                        <NextLink
                            href="/"
                            className="block w-full py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-all hover:bg-gray-200"
                        >
                            Tiếp tục mua sắm
                        </NextLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 mt-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <NextLink href="/cart" className="hover:text-gray-600 transition-colors">Giỏ hàng</NextLink>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 dark:text-white font-medium">Thanh toán</span>
                </div>

                {/* Error banner */}
                {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2 mb-6">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{submitError}</span>
                    </div>
                )}

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ── CỘT TRÁI ── */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Thông tin giao hàng */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-400" /> Thông tin giao hàng
                                </h3>
                            </div>

                            {prefilled && (
                                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-600 dark:text-blue-400">
                                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Thông tin đã được tự động điền từ tài khoản của bạn. Bạn có thể chỉnh sửa trước khi đặt hàng.</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Họ và tên người nhận</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                                        <input
                                            required type="text" value={receiverName}
                                            onChange={e => setReceiverName(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Số điện thoại liên hệ</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-300" />
                                        <input
                                            required type="tel" value={receiverPhone}
                                            onChange={e => setReceiverPhone(e.target.value)}
                                            placeholder="0901234567"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tỉnh / Thành phố</label>
                                        <select
                                            required value={city} onChange={e => setCity(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        >
                                            <option value="">Chọn Tỉnh/Thành phố</option>
                                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Địa chỉ nhà chi tiết</label>
                                        <input
                                            required type="text" value={shippingAddress}
                                            onChange={e => setShippingAddress(e.target.value)}
                                            placeholder="Số 123, Đường ABC..."
                                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                                    <textarea
                                        value={note} onChange={e => setNote(e.target.value)}
                                        placeholder="Giao giờ hành chính, gọi trước khi giao..."
                                        rows={3}
                                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" /> Phương thức thanh toán
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 dark:border-gray-800"}`}>
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mt-1 accent-orange-500" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Thanh toán khi nhận hàng (COD)</p>
                                        <p className="text-xs text-gray-400 mt-1">Trả bằng tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.</p>
                                    </div>
                                </label>
                                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === "ONLINE" ? "border-orange-500 bg-orange-50/30" : "border-gray-100 dark:border-gray-800"}`}>
                                    <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} className="mt-1 accent-orange-500" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Thanh toán Trực tuyến (VNPay)</p>
                                        <p className="text-xs text-gray-400 mt-1">Thanh toán an toàn qua tài khoản ATM nội địa, Internet Banking hoặc mã QR Code.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ── CỘT PHẢI: Tóm tắt đơn hàng ── */}
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gray-400" /> Tóm tắt đơn hàng ({cartItems.length})
                            </h3>

                            {/* Danh sách sản phẩm */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50 pr-1">
                                {cartItems.map((item, index) => {
                                    const subtotal = getItemSubtotal(item);
                                    return (
                                        <div key={item.id ?? index} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                                            <img
                                                src={item.product?.productImageUrl || item.product?.imageUrl || "/placeholder.png"}
                                                className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                                                alt={item.product?.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.product?.name}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">SL: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white shrink-0">{formatPrice(subtotal)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tổng tiền */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Phí vận chuyển</span>
                                    <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
                                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                                    </span>
                                </div>

                                {/* Gợi ý mua thêm để miễn ship */}
                                {shippingFee > 0 && remaining > 0 && (
                                    <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-dashed border-gray-200 dark:border-gray-700">
                                        Mua thêm <span className="font-bold text-orange-500">{formatPrice(remaining)}</span> để được miễn phí ship
                                    </div>
                                )}

                                <div className="flex justify-between font-black text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-700 text-base">
                                    <span>Tổng số tiền</span>
                                    <span className="text-red-600 text-lg">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Nút đặt hàng */}
                            <button
                                type="submit"
                                disabled={submitting || cartItems.length === 0}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-orange-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang tạo đơn hàng...
                                    </>
                                ) : (
                                    paymentMethod === "ONLINE" ? "Tiến hành thanh toán" : "Xác nhận đặt hàng"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
