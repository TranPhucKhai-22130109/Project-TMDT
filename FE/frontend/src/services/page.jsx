"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { useAuth } from "@/context/AuthContext";
import { checkout } from "@/services/order";
import { getCartItems } from "@/services/cartService";
import Navbar from "@/components/Navbar";
import {
    MapPin, Phone, User, CreditCard, Truck,
    ChevronRight, Loader2, AlertCircle, CheckCircle2,
    ShoppingBag, ArrowLeft, Lock, Package,
} from "lucide-react";

const CITIES = [
    "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Ninh", "Bến Tre",
    "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
    "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
    "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
    "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
    "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi",
    "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh",
    "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế",
    "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

function formatPrice(price) {
    if (isNaN(price)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

function StepIndicator({ step }) {
    const steps = ["Thông tin giao hàng", "Thanh toán"];
    return (
        <div className="flex items-center mb-8">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done = idx < step;
                const active = idx === step;
                return (
                    <div key={idx} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                done ? "bg-green-500 text-white" :
                                    active ? "bg-red-600 text-white ring-4 ring-red-100 dark:ring-red-900" :
                                        "bg-gray-200 dark:bg-gray-700 text-gray-400"
                            }`}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : idx}
                            </div>
                            <span className={`text-sm font-semibold hidden sm:block ${
                                active ? "text-gray-900 dark:text-white" : "text-gray-400"
                            }`}>{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`h-0.5 w-12 sm:w-20 mx-3 rounded-full transition-colors ${
                                step > idx ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Page() {
    const router = useRouter();

    const { isAuthenticated, username, isLoading } = useAuth();
    const { reloadCartCount } = useCart();

    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loadingCart, setLoadingCart] = useState(true);

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        receiverName: "",
        receiverPhone: "",
        shippingAddress: "",
        city: "TP. Hồ Chí Minh",
        note: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Lấy lại bước hiện tại nếu khách hàng bấm Back từ trang VNPay
    useEffect(() => {
        try {
            const savedStep = sessionStorage.getItem("checkoutStep");
            if (savedStep) {
                setStep(Number(savedStep));
            }
        } catch (error) {
            console.warn("Lỗi truy cập sessionStorage", error);
        }
    }, []);

    // Fetch giỏ hàng từ Server
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            const fetchCartItems = async () => {
                try {
                    const response = await getCartItems();

                    let list = [];
                    if (Array.isArray(response)) list = response;
                    else if (response?.data && Array.isArray(response.data)) list = response.data;
                    else if (response?.content && Array.isArray(response.content)) list = response.content;

                    const filtered = list.filter((item) => {
                        const product = item?.product || item;
                        return product && !product?.isDeleted;
                    });

                    setCart(filtered);

                    const total = filtered.reduce((sum, item) => {
                        const product = item?.product || item;
                        return sum + Number(product?.price || 0) * Number(item?.quantity || 1);
                    }, 0);
                    setCartTotal(total);

                } catch (error) {
                    console.error("Lỗi lấy giỏ hàng checkout:", error);
                } finally {
                    setLoadingCart(false);
                }
            };
            fetchCartItems();
        } else if (!isLoading && !isAuthenticated) {
            setLoadingCart(false);
        }
    }, [isLoading, isAuthenticated]);

    const shippingFee = cartTotal >= 5_000_000 ? 0 : 50_000;
    const grandTotal = cartTotal + shippingFee;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateStep1 = () => {
        const errs = {};
        if (!form.receiverName?.trim()) errs.receiverName = "Vui lòng nhập tên người nhận";
        if (!form.receiverPhone?.trim()) errs.receiverPhone = "Vui lòng nhập số điện thoại";
        else if (!/^(0|\+84)[0-9]{9,10}$/.test(form.receiverPhone))
            errs.receiverPhone = "Số điện thoại không hợp lệ";
        if (!form.shippingAddress?.trim()) errs.shippingAddress = "Vui lòng nhập địa chỉ";
        return errs;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        const errs = validateStep1();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setStep(2);
        try {
            sessionStorage.setItem("checkoutStep", "2");
        } catch (e) {}
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ==========================================
    // HÀM XỬ LÝ ĐẶT HÀNG ĐÃ ĐƯỢC CẬP NHẬT CHUẨN
    // ==========================================
    const handlePlaceOrder = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!isAuthenticated) { router.push("/login"); return; }
        if (cart.length === 0) return;

        setLoading(true);
        setOrderError(null);

        try {
            // 1. CHUẨN BỊ PAYLOAD VÀ LOG RA CONSOLE
            const payload = {
                receiverName: form.receiverName,
                receiverPhone: form.receiverPhone,
                shippingAddress: form.shippingAddress,
                city: form.city,
                note: form.note,
                paymentMethod: paymentMethod, // Giá trị sẽ là "ONLINE" hoặc "COD"
                items: cart.map((item) => {
                    const product = item.product || item;
                    return {
                        productId: product.id || item.productId,
                        quantity: item.quantity,
                    }
                }),
            };

            // Thêm dòng này để kiểm tra xem productId có bị undefined/null không
            console.log("DỮ LIỆU GỬI XUỐNG SPRING BOOT:", payload);

            // 2. GỌI API THẬT XUỐNG SPRING BOOT
            const orderResult = await checkout(payload);

            if (reloadCartCount) await reloadCartCount();

            // 3. NHẢY SANG LINK VNPAY HOẶC SANG TRANG CHI TIẾT
            if (paymentMethod === "ONLINE" && orderResult.paymentUrl) {
                window.location.href = orderResult.paymentUrl; // Nhảy sang VNPay
            } else {
                try {
                    sessionStorage.removeItem("checkoutStep");
                } catch (e) {}
                router.push(`/orders/${orderResult.id}?success=true`); // Chuyển sang trang xem đơn
            }

        } catch (err) {
            console.error("Lỗi khi đặt hàng:", err);
            setOrderError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || loadingCart) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <AlertCircle className="w-16 h-16 text-orange-400 mb-5" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bạn chưa đăng nhập</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Vui lòng đăng nhập để tiến hành thanh toán.</p>
                    <NextLink href="/login" className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors">
                        Đăng nhập ngay
                    </NextLink>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-5" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Thêm sản phẩm vào giỏ trước khi thanh toán.</p>
                    <NextLink href="/products" className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors">
                        Tiếp tục mua sắm
                    </NextLink>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <NextLink href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
                </NextLink>

                <h1 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white mb-6">
                    Thanh toán
                </h1>

                <StepIndicator step={step} />

                {orderError && (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl px-4 py-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{orderError}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── LEFT ── */}
                    <div className="lg:col-span-2">
                        {/* STEP 1: Shipping */}
                        {step === 1 && (
                            <form onSubmit={handleNextStep} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-500" /> Thông tin giao hàng
                                </h2>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    Đặt hàng với tài khoản: <span className="font-bold text-gray-900 dark:text-white">{username || "Khách hàng"}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Tên người nhận <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="receiverName"
                                            value={form.receiverName}
                                            onChange={handleChange}
                                            placeholder={username || "Nguyễn Văn A"}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition ${
                                                errors.receiverName ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                                            }`}
                                        />
                                    </div>
                                    {errors.receiverName && <p className="text-xs text-red-500 mt-1">{errors.receiverName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="receiverPhone"
                                            value={form.receiverPhone}
                                            onChange={handleChange}
                                            placeholder="0901234567"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition ${
                                                errors.receiverPhone ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                                            }`}
                                        />
                                    </div>
                                    {errors.receiverPhone && <p className="text-xs text-red-500 mt-1">{errors.receiverPhone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Tỉnh / Thành phố <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:text-white"
                                    >
                                        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Địa chỉ cụ thể <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="shippingAddress"
                                        value={form.shippingAddress}
                                        onChange={handleChange}
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:text-white transition ${
                                            errors.shippingAddress ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                                        }`}
                                    />
                                    {errors.shippingAddress && <p className="text-xs text-red-500 mt-1">{errors.shippingAddress}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                        Ghi chú (tuỳ chọn)
                                    </label>
                                    <textarea
                                        name="note"
                                        value={form.note}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Ghi chú thêm cho đơn hàng..."
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:text-white resize-none"
                                    />
                                </div>

                                <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    Tiếp tục <ChevronRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Thông tin giao hàng</h3>
                                        <button onClick={() => {
                                            setStep(1);
                                            sessionStorage.setItem("checkoutStep", "1");
                                        }} className="text-xs text-red-600 hover:underline">Sửa</button>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p><span className="font-semibold text-gray-900 dark:text-white">{form.receiverName}</span> — {form.receiverPhone}</p>
                                        <p>{form.shippingAddress}, {form.city}</p>
                                        {form.note && <p className="text-gray-400 italic">"{form.note}"</p>}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-red-500" /> Phương thức thanh toán
                                    </h2>

                                    <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${
                                        paymentMethod === "COD"
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                    }`}>
                                        <input type="radio" name="paymentMethod" value="COD"
                                               checked={paymentMethod === "COD"}
                                               onChange={(e) => setPaymentMethod(e.target.value)}
                                               className="accent-red-600"
                                        />
                                        <Truck className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Trả tiền mặt khi shipper giao hàng</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${
                                        paymentMethod === "ONLINE"
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                    }`}>
                                        <input type="radio" name="paymentMethod" value="ONLINE"
                                               checked={paymentMethod === "ONLINE"}
                                               onChange={(e) => setPaymentMethod(e.target.value)}
                                               className="accent-red-600"
                                        />
                                        <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">Thanh toán trực tuyến</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Thanh toán qua cổng điện tử (VNPay, MoMo...)</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            sessionStorage.setItem("checkoutStep", "1");
                                        }}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        ← Quay lại
                                    </button>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex-[2] py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
                                        ) : paymentMethod === "ONLINE" ? (
                                            <><CreditCard className="w-5 h-5" /> Thanh toán — {formatPrice(grandTotal)}</>
                                        ) : (
                                            <><CheckCircle2 className="w-5 h-5" /> Đặt hàng — {formatPrice(grandTotal)}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Order summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-red-500" />
                                Đơn hàng ({cart.length} sản phẩm)
                            </h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
                                {cart.map((item, index) => {
                                    const product = item?.product || item;
                                    return (
                                        <div key={item?.id || index} className="flex gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={product?.imageUrl || product?.image || "/placeholder.png"}
                                                    alt={product?.name || "Product"}
                                                    className="w-14 h-14 object-contain rounded-xl bg-gray-100 dark:bg-gray-700 p-1"
                                                    onError={(e) => {
                                                        if (!e.target.src.includes("/placeholder.png")) {
                                                            e.target.src = "/placeholder.png";
                                                        }
                                                    }}
                                                />
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                    {item?.quantity || 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">{product?.name || "Sản phẩm"}</p>
                                                <p className="text-xs text-red-600 font-bold mt-0.5">{formatPrice((product?.price || 0) * (item?.quantity || 1))}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Phí vận chuyển</span>
                                    <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
                                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700 text-base">
                                    <span>Tổng cộng</span>
                                    <span className="text-red-600 text-lg">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}