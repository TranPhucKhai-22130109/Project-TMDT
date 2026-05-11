"use client";
// src/app/payment/process/page.jsx
// Trang mô phỏng cổng thanh toán (thay bằng VNPay/MoMo thật trong production)

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPayment } from "@/services/orderService";
import { CreditCard, Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

export default function PaymentProcessPage() {
    const router = useRouter();
    const params = useSearchParams();

    const orderId = params.get("orderId");
    const txnId = params.get("txnId");
    const amount = Number(params.get("amount") || 0);

    const [step, setStep] = useState("confirm"); // confirm | processing | success | failed
    const [error, setError] = useState(null);

    const handlePay = async (success) => {
        setStep("processing");
        setError(null);

        try {
            await confirmPayment(orderId, txnId, success);
            setStep(success ? "success" : "failed");

            if (success) {
                setTimeout(() => router.push(`/orders/${orderId}?success=true`), 2000);
            }
        } catch (err) {
            setError(err.message);
            setStep("confirm");
        }
    };

    if (step === "processing") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader2 className="w-14 h-14 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Đang xử lý thanh toán...
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Vui lòng không đóng trang này</p>
                </div>
            </div>
        );
    }

    if (step === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Thanh toán thành công!
                    </h2>
                    <p className="text-gray-500">Đang chuyển hướng đến trang đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (step === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Thanh toán thất bại
                    </h2>
                    <p className="text-gray-500 mb-6">Giao dịch của bạn không thành công.</p>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
                        <CreditCard className="w-7 h-7 text-orange-500" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Cổng thanh toán (Demo)
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Môi trường thử nghiệm — không thực hiện giao dịch thật
                    </p>
                </div>

                {/* Order info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Mã đơn hàng</span>
                        <span className="font-mono text-gray-900 dark:text-white text-xs">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Mã giao dịch</span>
                        <span className="font-mono text-gray-900 dark:text-white text-xs">
              {txnId?.slice(0, 16)}...
            </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <span className="text-gray-700 dark:text-gray-200">Số tiền</span>
                        <span className="text-orange-500 text-lg">{formatPrice(amount)}</span>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Giao dịch được mã hóa và bảo mật</span>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => handlePay(true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Thanh toán thành công (Giả lập)
                    </button>

                    <button
                        onClick={() => handlePay(false)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        Thanh toán thất bại (Giả lập)
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}