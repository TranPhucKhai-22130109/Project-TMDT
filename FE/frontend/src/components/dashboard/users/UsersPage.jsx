"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout.jsx";
import UserTable from "./UserTable.jsx";
import UserDetailPanel from "./UserDetailPanel.jsx";
import UserFormModal from "./UserFormModal.jsx";
import { fetchUsers, createUser, updateUserStatus, updateUserRole } from "@/services/adminUserService";

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
  if (!name) return "#6366f1";
  const colors = ["#6366f1", "#3b82f6", "#10b981", "#f97316", "#ec4899", "#14b8a6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ROLE_TABS = ["All", "ADMIN", "SELLER", "USER"];

export default function UsersPage() {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [formModal, setFormModal] = useState({ isOpen: false, data: null });
  const [detailPanel, setDetailPanel] = useState({ isOpen: false, user: null });

  // Load users from API
  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
        u.username?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q)
      );
    }

    // 2. Role Filter
    if (roleFilter !== "All") {
      result = result.filter(u => u.roles?.includes(roleFilter));
    }

    // 3. Status Filter
    if (statusFilter !== "All") {
      result = result.filter(u => u.status === statusFilter);
    }

    // 4. Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "Oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "Name A-Z":
          return (a.username || "").localeCompare(b.username || "");
        case "Newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  const roleCounts = useMemo(() => {
    const counts = { All: users.length, ADMIN: 0, SELLER: 0, USER: 0 };
    users.forEach(u => {
      (u.roles || []).forEach(role => {
        if (counts[role] !== undefined) {
          counts[role]++;
        }
      });
    });
    return counts;
  }, [users]);

  // Handlers
  const handleView = (user) => {
    setDetailPanel({ isOpen: true, user });
  };

  const handleEdit = (user) => {
    setDetailPanel(prev => ({ ...prev, isOpen: false }));
    setFormModal({ isOpen: true, data: user });
  };

  const handleDelete = (id) => {
    alert("Delete user is not yet connected to the backend.");
  };

  const handleSave = async (formData) => {
    if (formData.id) {
      // Edit — client-side only (backend chưa có PUT endpoint tổng hợp)
      setUsers(prev => prev.map(u => u.id === formData.id ? { ...u, ...formData } : u));
      if (detailPanel.isOpen && detailPanel.user?.id === formData.id) {
        setDetailPanel(prev => ({ ...prev, user: { ...prev.user, ...formData } }));
      }
      setFormModal({ isOpen: false, data: null });
    } else {
      // Add — gọi API thật
      try {
        await createUser(formData);
        setFormModal({ isOpen: false, data: null });
        await loadUsers(); // reload danh sách
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const nextStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";
    
    try {
      await updateUserStatus(id, nextStatus);
      const updatedUser = { ...user, status: nextStatus };
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (detailPanel.isOpen && detailPanel.user?.id === id) {
        setDetailPanel(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      await updateUserRole(id, newRole);
      const updatedUser = { ...user, roles: [newRole] };
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      if (detailPanel.isOpen && detailPanel.user?.id === id) {
        setDetailPanel(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
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

  const handleBulkStatus = async (newStatus) => {
    try {
      await Promise.all(selectedIds.map(id => updateUserStatus(id, newStatus)));
      setUsers(prev => prev.map(u => {
        if (selectedIds.includes(u.id)) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
      setSelectedIds([]);
    } catch (err) {
      alert("Failed to update some users: " + err.message);
    }
  };

  const handleBulkDelete = () => {
    alert("Bulk delete users is not yet connected to the backend.");
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Users">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="Users">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => { setLoading(true); loadUsers(); }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
                    {tab === "All" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="BANNED">Banned</option>
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
                  onClick={() => handleBulkStatus("ACTIVE")}
                  className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                >
                  Set Active
                </button>
                <button 
                  onClick={() => handleBulkStatus("INACTIVE")}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Set Inactive
                </button>
                <button 
                  onClick={() => handleBulkStatus("BANNED")}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors ml-2"
                >
                  Ban Users
                </button>
                <button 
                  disabled
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-400 opacity-70 cursor-not-allowed rounded"
                  title="Bulk delete is not yet connected to backend"
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
            onChangeRole={handleChangeRole}
            getRelativeTime={getRelativeTime}
            getInitials={getInitials}
            getAvatarColor={getAvatarColor}
          />

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between mt-auto">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of <span className="font-medium text-gray-900">{users.length}</span> users
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
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onChangeRole={handleChangeRole}
        getRelativeTime={getRelativeTime}
        getInitials={getInitials}
        getAvatarColor={getAvatarColor}
      />

    </DashboardLayout>
  );
}
