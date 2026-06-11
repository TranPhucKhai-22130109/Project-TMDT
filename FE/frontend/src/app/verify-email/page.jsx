"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/services/authService";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import NextLink from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Không tìm thấy mã xác nhận trong đường dẫn.");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message || "Xác nhận email thất bại hoặc link đã hết hạn.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Đang xác nhận...</h2>
            <p className="text-gray-600 dark:text-gray-400">Vui lòng đợi trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Xác nhận thành công!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Email của bạn đã được xác nhận. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <NextLink
              href="/login"
              className="inline-block w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Đăng nhập ngay
            </NextLink>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Xác nhận thất bại</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>
            <NextLink
              href="/login"
              className="inline-block w-full py-3 bg-gray-900 dark:bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Về trang đăng nhập
            </NextLink>
          </>
        )}
      </div>
    </div>
  );
}
