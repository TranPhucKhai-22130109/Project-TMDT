"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout.jsx";
import UserTable from "./UserTable.jsx";
import UserDetailPanel from "./UserDetailPanel.jsx";
import UserFormModal from "./UserFormModal.jsx";
import { mockUsers } from "@/data/mockUsers.js";

// Helper Functions
const getRelativeTime = (dateString) => {
  if (!dateString) return "Never";
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return "#6366f1"; // default indigo
  const colors = ["#6366f1", "#3b82f6", "#10b981", "#f97316", "#ec4899", "#14b8a6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ROLE_TABS = ["All", "Admin", "Manager", "Customer"];

export default function UsersPage() {
  // State
  const [users, setUsers] = useState(mockUsers);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Debounced
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [formModal, setFormModal] = useState({ isOpen: false, data: null });
  const [detailPanel, setDetailPanel] = useState({ isOpen: false, user: null });

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Derived State
  const filteredUsers = useMemo(() => {
    let result = users;

    // 1. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    // 2. Role Filter
    if (roleFilter !== "All") {
      result = result.filter(u => u.role === roleFilter);
    }

    // 3. Status Filter
    if (statusFilter !== "All") {
      result = result.filter(u => u.status === statusFilter);
    }

    // 4. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "Oldest":
          return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
        case "Name A-Z":
          return a.name.localeCompare(b.name);
        case "Most Orders":
          return b.stats.totalOrders - a.stats.totalOrders;
        case "Highest Spent":
          return b.stats.totalSpent - a.stats.totalSpent;
        case "Newest":
        default:
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      }
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  const roleCounts = useMemo(() => {
    const counts = { All: users.length, Admin: 0, Manager: 0, Customer: 0 };
    users.forEach(u => {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      }
    });
    return counts;
  }, [users]);

  // Handlers
  const handleView = (user) => {
    setDetailPanel({ isOpen: true, user });
  };

  const handleEdit = (user) => {
    setDetailPanel(prev => ({ ...prev, isOpen: false })); // Close detail if open
    setFormModal({ isOpen: true, data: user });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (detailPanel.isOpen && detailPanel.user?.id === id) {
        setDetailPanel({ isOpen: false, user: null });
      }
      setSelectedIds(prev => prev.filter(selId => selId !== id));
    }
  };

  const handleSave = (formData) => {
    if (formData.id) {
      // Edit
      setUsers(prev => prev.map(u => u.id === formData.id ? { ...u, ...formData } : u));
      if (detailPanel.isOpen && detailPanel.user?.id === formData.id) {
        setDetailPanel(prev => ({ ...prev, user: { ...prev.user, ...formData } }));
      }
    } else {
      // Add
      const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
      const newUser = {
        ...formData,
        id: newId,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        stats: { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, returnRate: 0 },
        recentOrders: [],
        activityData: []
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setFormModal({ isOpen: false, data: null });
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      let nextStatus = "Active";
      if (u.status === "Active") nextStatus = "Inactive";
      else if (u.status === "Inactive") nextStatus = "Banned";
      
      const updatedUser = { ...u, status: nextStatus };
      if (detailPanel.isOpen && detailPanel.user?.id === id) {
        setDetailPanel(prev => ({ ...prev, user: updatedUser }));
      }
      return updatedUser;
    }));
  };

  // Bulk Actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selId => selId !== id));
    }
  };

  const handleBulkStatus = (newStatus) => {
    setUsers(prev => prev.map(u => {
      if (selectedIds.includes(u.id)) {
        return { ...u, status: newStatus };
      }
      return u;
    }));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
      setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    }
  };

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
              {users.length} total
            </span>
          </div>
          <button 
            onClick={() => setFormModal({ isOpen: true, data: null })}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-100 bg-white flex flex-col lg:flex-row justify-between gap-4">
            
            {/* Role Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2">
              {ROLE_TABS.map(tab => {
                const isActive = roleFilter === tab;
                const count = roleCounts[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setRoleFilter(tab)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                    }`}
                  >
                    {tab}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
                />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[130px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-auto px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Name A-Z">Name A-Z</option>
                <option value="Most Orders">Most Orders</option>
                <option value="Highest Spent">Highest Spent</option>
              </select>
            </div>
          </div>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div className="px-6 py-3 bg-indigo-50/50 border-b border-gray-100 flex items-center justify-between animate-in slide-in-from-top-2 duration-200 overflow-x-auto">
              <span className="text-sm font-semibold text-indigo-900 whitespace-nowrap mr-4">
                {selectedIds.length} users selected
              </span>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <button 
                  onClick={() => handleBulkStatus("Active")}
                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                >
                  Set Active
                </button>
                <button 
                  onClick={() => handleBulkStatus("Inactive")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Set Inactive
                </button>
                <button 
                  onClick={() => handleBulkStatus("Banned")}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors ml-2"
                >
                  Ban Users
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Table Component */}
          <UserTable 
            users={filteredUsers}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            getRelativeTime={getRelativeTime}
            getInitials={getInitials}
            getAvatarColor={getAvatarColor}
          />

          {/* Table Footer / Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between mt-auto">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{Math.min(10, filteredUsers.length)}</span> of <span className="font-medium text-gray-900">{filteredUsers.length}</span> users
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                Prev
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded hover:bg-indigo-700">
                1
              </button>
              {filteredUsers.length > 10 && (
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  2
                </button>
              )}
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled={filteredUsers.length <= 10}>
                Next
              </button>
            </div>
          </div>

        </div>
      </div>

      <UserFormModal 
        isOpen={formModal.isOpen} 
        initialData={formModal.data}
        onClose={() => setFormModal({ isOpen: false, data: null })}
        onSave={handleSave}
      />

      <UserDetailPanel 
        isOpen={detailPanel.isOpen}
        user={detailPanel.user}
        onClose={() => setDetailPanel({ isOpen: false, user: null })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        getRelativeTime={getRelativeTime}
        getInitials={getInitials}
        getAvatarColor={getAvatarColor}
      />

    </DashboardLayout>
  );
}
