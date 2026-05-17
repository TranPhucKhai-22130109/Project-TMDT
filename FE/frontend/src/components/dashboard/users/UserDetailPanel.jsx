"use client";

import { useState, useEffect } from "react";
import { X, Mail, AlertTriangle, ChevronDown } from "lucide-react";
import UserRoleBadge, { STATUS_STYLES } from "./UserRoleBadge.jsx";

export default function UserDetailPanel({
  user,
  isOpen,
  onClose,
  onDelete,
  onToggleStatus,
  onChangeRole,
  getRelativeTime,
  getInitials,
  getAvatarColor,
}) {
  const [mounted, setMounted] = useState(false);
  const [displayUser, setDisplayUser] = useState(user);
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [pendingUsername, setPendingUsername] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayUser(user);
      setPendingRole(null);
      setPendingUsername(user.username || "");
      setPendingPassword("");
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setDangerZoneOpen(false);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;
  if (!displayUser) return null;

  const statusStyle =
    STATUS_STYLES[displayUser.status] || STATUS_STYLES.INACTIVE;
  const role = displayUser.roles?.[0] || "USER";

  const handleDeleteConfirm = () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this user? This action cannot be undone.",
      )
    ) {
      onDelete(displayUser.id);
    }
  };

  const handleToggleStatusConfirm = () => {
    const action = displayUser.status === "BANNED" ? "unban" : "ban";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      onToggleStatus(displayUser.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* PANEL HEADER */}
        <div className="sticky top-0 bg-white z-10 flex flex-col p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0 overflow-hidden shadow-sm"
                style={{
                  backgroundColor: getAvatarColor(displayUser.username),
                }}
              >
                {getInitials(displayUser.username)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {displayUser.username}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  {displayUser.email}
                </p>
                <div className="flex items-center gap-3">
                  <UserRoleBadge role={role} size="sm" />
                  <div className="flex items-center gap-1.5 border border-gray-200 px-2 py-0.5 rounded-full text-xs bg-white">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                    ></span>
                    <span className={`font-medium ${statusStyle.color}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-500 font-medium tracking-wide">
            Member since{" "}
            {displayUser.createdAt
              ? new Date(displayUser.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Contact Info */}
          <div
            className="p-6 py-4"
            style={{
              transition: "opacity 300ms 60ms",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span
                  className="text-gray-700 truncate"
                  title={displayUser.email}
                >
                  {displayUser.email}
                </span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div
            className="p-6 py-4"
            style={{
              transition: "opacity 300ms 120ms",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  User ID
                </div>
                <div
                  className="text-sm font-mono text-gray-700 truncate"
                  title={displayUser.id}
                >
                  {displayUser.id}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Last Updated
                </div>
                <div className="text-sm text-gray-700">
                  {displayUser.updatedAt
                    ? getRelativeTime(displayUser.updatedAt)
                    : "Never"}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div
            className="p-6 py-4"
            style={{
              transition: "opacity 300ms 150ms",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Edit Profile
            </h3>
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={pendingUsername}
                  onChange={(e) => setPendingUsername(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={pendingPassword}
                  onChange={(e) => setPendingPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Role
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={pendingRole ?? role}
                    onChange={(e) => setPendingRole(e.target.value)}
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="USER">User</option>
                    <option value="SELLER">Seller</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => {
                      const newRole = pendingRole ?? role;
                      if (newRole === role) return;
                      if (
                        window.confirm(
                          `Are you sure you want to change role from ${role} to ${newRole}?`,
                        )
                      ) {
                        onChangeRole(displayUser.id, newRole);
                        setPendingRole(null);
                      }
                    }}
                    disabled={!pendingRole || pendingRole === role}
                    className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              <p className="text-xs text-red-500 font-semibold">
                Username and password changes are not yet connected to the
                backend.
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="p-6 py-4 pb-6"
            style={{
              transition: "opacity 300ms 180ms",
              opacity: isOpen ? 1 : 0,
            }}
          >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setDangerZoneOpen(!dangerZoneOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${dangerZoneOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dangerZoneOpen && (
                <div className="p-4 border-t border-red-100 bg-red-50/50 space-y-4">
                  {/* Ban/Unban */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {displayUser.status === "BANNED"
                          ? "Unban this user"
                          : "Ban this user"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {displayUser.status === "BANNED"
                          ? "Restore their access to the platform."
                          : "Prevent them from logging in and making purchases."}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleStatusConfirm}
                      className="shrink-0 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                    >
                      {displayUser.status === "BANNED"
                        ? "Unban User"
                        : "Ban User"}
                    </button>
                  </div>

                  <div className="w-full h-px bg-red-100"></div>

                  {/* Delete */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Delete account permanently
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button
                        disabled
                        onClick={handleDeleteConfirm}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-400 opacity-70 cursor-not-allowed rounded shadow-sm w-full"
                        title="Delete is not yet connected to backend"
                      >
                        Delete User
                      </button>
                      <span className="text-[10px] text-red-500 max-w-[120px] text-right">Not yet connected to backend</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white z-10 border-t border-gray-200 p-4 flex items-center justify-end shrink-0">
          <div className="text-xs text-gray-500">
            Updated{" "}
            {displayUser.updatedAt
              ? getRelativeTime(displayUser.updatedAt)
              : "Never"}
          </div>
        </div>
      </div>
    </div>
  );
}
