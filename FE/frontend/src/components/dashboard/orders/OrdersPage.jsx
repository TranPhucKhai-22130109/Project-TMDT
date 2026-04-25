"use client";

import { useState, useMemo } from "react";
import { Search, Download, Calendar, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout.jsx";
import OrderTable from "@/components/dashboard/orders/OrderTable.jsx";
import OrderDetailPanel from "@/components/dashboard/orders/OrderDetailPanel.jsx";
import { mockOrders } from "@/data/mockOrders.js";

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Detail Panel
  const [detailPanel, setDetailPanel] = useState({ isOpen: false, order: null });

  // ── Derived State ──────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search
      if (search) {
        const q = search.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchCustomer = order.customer.name.toLowerCase().includes(q);
        if (!matchId && !matchCustomer) return false;
      }
      
      // 2. Status
      if (statusFilter !== "All" && order.status !== statusFilter) {
        return false;
      }
      
      // 3. Payment Method
      if (paymentFilter !== "All" && order.paymentMethod !== paymentFilter) {
        return false;
      }
      
      // 4. Date Range
      if (dateFrom && order.createdAt < dateFrom) return false;
      if (dateTo && order.createdAt > dateTo) return false;
      
      return true;
    });
  }, [orders, search, statusFilter, paymentFilter, dateFrom, dateTo]);

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length, Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach(o => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

  // ── Handlers ─────────────────────────────────────────────────────
  const handleView = (order) => {
    setDetailPanel({ isOpen: true, order });
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      
      // Build new timeline entry
      let label = newStatus;
      let description = "Status updated manually";
      if (newStatus === "Cancelled") {
        description = "Order was cancelled";
      }
      
      const newTimelineEntry = {
        status: newStatus,
        label,
        description,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        completed: true
      };
      
      const updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0],
        timeline: [...order.timeline, newTimelineEntry]
      };
      
      // Update detail panel if open
      if (detailPanel.isOpen && detailPanel.order?.id === orderId) {
        setDetailPanel(prev => ({ ...prev, order: updatedOrder }));
      }
      
      return updatedOrder;
    }));
  };

  const handleBulkUpdate = (newStatus) => {
    if (selectedIds.length === 0) return;
    
    setOrders(prev => prev.map(order => {
      if (!selectedIds.includes(order.id)) return order;
      if (order.status === newStatus || order.status === "Cancelled" || order.status === "Delivered") return order; // Skip if already there or immutable
      
      const newTimelineEntry = {
        status: newStatus,
        label: newStatus,
        description: "Status updated via bulk action",
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        completed: true
      };
      
      return {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString().split('T')[0],
        timeline: [...order.timeline, newTimelineEntry]
      };
    }));
    
    setSelectedIds([]); // Clear selection after bulk action
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <DashboardLayout title="Orders">
      <div className="space-y-6">
        
        {/* Page Header (Export) */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">Orders Management</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm ml-auto">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Status Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 hide-scrollbar bg-gray-50/50">
            {STATUS_TABS.map(tab => {
              const isActive = statusFilter === tab;
              const count = statusCounts[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive 
                      ? "border-indigo-600 text-indigo-600 bg-white" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  {tab}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar */}
          <div className="p-4 flex flex-col xl:flex-row gap-4 border-b border-gray-100 bg-white justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Payment Method Filter */}
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="All">All Payments</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="COD">COD</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <div className="relative w-[140px]">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-600"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative w-[140px]">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div className="px-6 py-3 bg-indigo-50/50 border-b border-gray-100 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
              <span className="text-sm font-semibold text-indigo-900">
                {selectedIds.length} orders selected
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleBulkUpdate("Shipped")}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Mark as Shipped
                </button>
                <button 
                  onClick={() => handleBulkUpdate("Delivered")}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Mark as Delivered
                </button>
                <button 
                  onClick={() => handleBulkUpdate("Cancelled")}
                  className="px-3 py-1.5 text-xs font-medium bg-red-50 border border-red-200 rounded hover:bg-red-100 text-red-600 transition-colors ml-2"
                >
                  Cancel Orders
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <OrderTable 
            orders={filteredOrders}
            onView={handleView}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
          />

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between mt-auto">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredOrders.length}</span> of <span className="font-medium text-gray-900">{filteredOrders.length}</span> orders
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                Prev
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded hover:bg-indigo-700">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      <OrderDetailPanel 
        isOpen={detailPanel.isOpen}
        order={detailPanel.order}
        onClose={() => setDetailPanel(prev => ({ ...prev, isOpen: false }))}
        onUpdateStatus={handleUpdateStatus}
      />
    </DashboardLayout>
  );
}
