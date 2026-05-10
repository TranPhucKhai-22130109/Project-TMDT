"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load auth state từ localStorage khi app khởi động
  useEffect(() => {
    const savedUserId = localStorage.getItem("localstorage-userId");
    const savedUsername = localStorage.getItem("localstorage-username");
    if (savedUserId) {
      setUserId(savedUserId);
      setUsername(savedUsername || "User");
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Lắng nghe custom event 'auth:logout' từ apiFetch (khi bị 401)
  // Chỉ xóa state, KHÔNG redirect — ProtectedRoute sẽ tự redirect cho các trang cần auth
  useEffect(() => {
    const handleForceLogout = () => {
      setUserId(null);
      setUsername(null);
      setIsAuthenticated(false);
      localStorage.removeItem("localstorage-userId");
      localStorage.removeItem("localstorage-username");
    };

    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    const newUserId = data.data?.userId;
    const newUsername = data.data?.username;
    if (newUserId) {
      setUserId(newUserId);
      setUsername(newUsername || "User");
      setIsAuthenticated(true);
    }
    return data;
  };

  const signup = async ({ name, email, password }) => {
    const data = await authService.signup({ name, email, password });
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUserId(null);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem("localstorage-username"); // logout service removes userId, but let's remove username too
    router.push("/"); // Chuyển về trang chủ theo yêu cầu của User
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        isAuthenticated,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
