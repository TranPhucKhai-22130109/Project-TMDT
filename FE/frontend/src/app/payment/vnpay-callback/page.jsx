'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VNPayCallbackContent() {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const verifyPaymentWithBackend = async () => {
            try {
                const txnRef = searchParams.get('vnp_TxnRef') || '';
                setOrderId(txnRef);
                const queryString = window.location.search;

                // Gọi API backend để verify chữ ký (checksum) và cập nhật trạng thái đơn hàng
                const response = await fetch(`http://localhost:8080/api/v1/orders/vnpay-callback${queryString}`, {
                    method: 'GET',
                    credentials: 'include', // Sử dụng cookie nếu backend yêu cầu định danh
                });

                if (response.ok) {
                    setIsSuccess(true);
                } else {
                    console.error("Lỗi từ server, status:", response.status);
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error("Lỗi xác thực thanh toán:", error);
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        if (searchParams.toString()) {
            verifyPaymentWithBackend();
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 font-medium">Đang xác thực giao dịch với VNPay...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
            <div className="w-full max-w-md rounded-[28px] bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 transition-all">
                {isSuccess ? (
                    <>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f7ed] text-[#00b050]">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="mt-6 text-[26px] font-extrabold text-[#111827] tracking-tight">
                            Đặt hàng thành công!
                        </h2>

                        <p className="mt-3 text-[15px] leading-relaxed text-gray-500 px-2">
                            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được thanh toán thành công qua cổng VNPay.
                        </p>

                        <p className="mt-3 text-xs font-medium text-gray-400 tracking-normal">
                            #{orderId || "Mã đơn hàng"}
                        </p>

                        <div className="mt-9 space-y-3">
                            <Link
                                href={`/orders/${orderId}?vnpay=success`}
                                className="flex w-full items-center justify-center rounded-xl bg-[#1e293b] py-3.5 text-[15px] font-semibold text-white hover:bg-[#0f172a] transition-all shadow-sm"
                            >
                                Xem chi tiết đơn hàng vừa đặt
                            </Link>
                            <Link
                                href="/products"
                                className="block w-full rounded-xl bg-[#f1f5f9] py-3.5 text-[15px] font-semibold text-[#475569] hover:bg-[#e2e8f0] transition-all"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <h2 className="mt-6 text-[24px] font-bold text-gray-900">
                            Thanh toán thất bại
                        </h2>

                        <p className="mt-2 text-[14px] text-gray-500 px-4">
                            Giao dịch qua VNPay chưa hoàn tất thành công hoặc có lỗi xảy ra trong quá trình xác thực.
                        </p>

                        <div className="mt-9 space-y-3">
                            <Link href="/cart" className="block w-full rounded-xl bg-red-600 py-3.5 text-[15px] font-semibold text-white hover:bg-red-700 transition-all">
                                Quay lại giỏ hàng để thử lại
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VNPayCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-500 font-medium">Đang tải...</p>
                </div>
            </div>
        }>
            <VNPayCallbackContent />
        </Suspense>
    );
}