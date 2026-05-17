"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  // const { isAuthenticated, isLoading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isLoading, isAuthenticated, router]);

  // // Đang kiểm tra auth state → hiển thị loading
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
  //     </div>
  //   );
  // }

  // // Chưa đăng nhập → không render gì (đang redirect)
  // if (!isAuthenticated) {
  //   return null;
  // }

  // Đã đăng nhập → render children
  return children;
}
