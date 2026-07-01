"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyProfile } from "@/services/userService";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, title = "Admin" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const { username, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;
    getMyProfile()
      .then((profile) => {
        if (!cancelled) setAdminProfile(profile);
      })
      .catch(() => {
        if (!cancelled) setAdminProfile({ username });
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, username]);

  const profile = adminProfile || { username };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminProfile={profile}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          adminProfile={profile}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
