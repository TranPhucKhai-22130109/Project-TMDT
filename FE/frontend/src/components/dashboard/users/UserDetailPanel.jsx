"use client";

import { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, StickyNote, ShoppingBag, DollarSign, TrendingUp, RefreshCw, AlertTriangle, ChevronDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, ComposedChart, YAxis } from "recharts";
import UserRoleBadge, { STATUS_STYLES } from "./UserRoleBadge.jsx";
import OrderStatusBadge from "../orders/OrderStatusBadge.jsx";

export default function UserDetailPanel({ 
  user, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  getRelativeTime,
  getInitials,
  getAvatarColor
}) {
  const [mounted, setMounted] = useState(false);
  const [displayUser, setDisplayUser] = useState(user);
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);

  useEffect(() => {
    if (user) setDisplayUser(user);
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setDangerZoneOpen(false); // Reset danger zone on open
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

  const statusStyle = STATUS_STYLES[displayUser.status] || STATUS_STYLES.Inactive;

  const handleDeleteConfirm = () => {
    if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      onDelete(displayUser.id);
    }
  };

  const handleToggleStatusConfirm = () => {
    const action = displayUser.status === "Banned" ? "unban" : "ban";
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
                style={{ backgroundColor: getAvatarColor(displayUser.name) }}
              >
                {displayUser.avatar ? (
                  <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  getInitials(displayUser.name)
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{displayUser.name}</h2>
                <p className="text-gray-500 text-sm mb-2">{displayUser.email}</p>
                <div className="flex items-center gap-3">
                  <UserRoleBadge role={displayUser.role} size="sm" />
                  <div className="flex items-center gap-1.5 border border-gray-200 px-2 py-0.5 rounded-full text-xs bg-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                    <span className={`font-medium ${statusStyle.color}`}>{displayUser.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-500 font-medium tracking-wide">
            Member since {new Date(displayUser.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          
          {/* SECTION 1: Stats Overview */}
          <div className="p-6 pb-2" style={{ transition: "opacity 300ms 60ms", opacity: isOpen ? 1 : 0 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <ShoppingBag className="w-4 h-4 text-indigo-500 mb-2" />
                <div className="text-lg font-bold text-gray-900 leading-none mb-1">{displayUser.stats.totalOrders}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Orders</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <DollarSign className="w-4 h-4 text-green-500 mb-2" />
                <div className="text-lg font-bold text-gray-900 leading-none mb-1">${displayUser.stats.totalSpent.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Spent</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <TrendingUp className="w-4 h-4 text-blue-500 mb-2" />
                <div className="text-lg font-bold text-gray-900 leading-none mb-1">${displayUser.stats.avgOrderValue.toLocaleString()}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Avg Order</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <RefreshCw className="w-4 h-4 text-orange-500 mb-2" />
                <div className="text-lg font-bold text-gray-900 leading-none mb-1">{displayUser.stats.returnRate}%</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Return Rate</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Activity Chart */}
          {displayUser.role === "Customer" && displayUser.activityData.some(d => d.orders > 0 || d.spent > 0) && (
            <div className="p-6 py-4" style={{ transition: "opacity 300ms 120ms", opacity: isOpen ? 1 : 0 }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Purchase Activity (Last 6 Months)</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={displayUser.activityData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Line yAxisId="right" type="monotone" dataKey="spent" name="Spent ($)" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Orders
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Spent ($)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Recent Orders */}
          {displayUser.recentOrders.length > 0 && (
            <div className="p-6 py-4" style={{ transition: "opacity 300ms 180ms", opacity: isOpen ? 1 : 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">{displayUser.recentOrders.length}</span>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {displayUser.recentOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-indigo-600">{order.orderId}</div>
                          <div className="text-gray-400 text-xs">{new Date(order.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 text-xs">{order.itemCount} items</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">${order.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <OrderStatusBadge status={order.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    View all orders →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Contact & Address */}
          <div className="p-6 py-4" style={{ transition: "opacity 300ms 240ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700 truncate" title={displayUser.email}>{displayUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-700">{displayUser.phone || "No phone number"}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="text-gray-700 leading-relaxed">
                  {displayUser.address.street ? (
                    <>
                      {displayUser.address.street}<br/>
                      {displayUser.address.city}, {displayUser.address.province} {displayUser.address.zip}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">No address provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Internal Note */}
          {displayUser.note && (
            <div className="p-6 py-4" style={{ transition: "opacity 300ms 300ms", opacity: isOpen ? 1 : 0 }}>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 relative">
                <div className="flex items-start gap-3">
                  <StickyNote className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Internal Note</h4>
                    <p className="text-sm text-yellow-900 italic leading-relaxed">{displayUser.note}</p>
                    <button 
                      onClick={() => onEdit(displayUser)}
                      className="text-xs font-semibold text-yellow-700 hover:text-yellow-800 hover:underline mt-2 inline-block"
                    >
                      Edit note →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Danger Zone */}
          <div className="p-6 py-4 pb-6" style={{ transition: "opacity 300ms 360ms", opacity: isOpen ? 1 : 0 }}>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setDangerZoneOpen(!dangerZoneOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dangerZoneOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dangerZoneOpen && (
                <div className="p-4 border-t border-red-100 bg-red-50/50 space-y-4">
                  {/* Ban/Unban */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {displayUser.status === "Banned" ? "Unban this user" : "Ban this user"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {displayUser.status === "Banned" 
                          ? "Restore their access to the platform." 
                          : "Prevent them from logging in and making purchases."}
                      </p>
                    </div>
                    <button 
                      onClick={handleToggleStatusConfirm}
                      className="shrink-0 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                    >
                      {displayUser.status === "Banned" ? "Unban User" : "Ban User"}
                    </button>
                  </div>
                  
                  <div className="w-full h-px bg-red-100"></div>
                  
                  {/* Delete */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Delete account permanently</h4>
                      <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
                    </div>
                    <button 
                      onClick={handleDeleteConfirm}
                      className="shrink-0 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors shadow-sm"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white z-10 border-t border-gray-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500">
            Last seen {getRelativeTime(displayUser.lastActive)}
          </div>
          <button 
            onClick={() => onEdit(displayUser)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
