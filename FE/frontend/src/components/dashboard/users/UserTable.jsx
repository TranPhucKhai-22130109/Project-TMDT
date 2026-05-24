"use client";

import { Eye, Edit, Trash2 } from "lucide-react";
import UserRoleBadge, { STATUS_STYLES } from "./UserRoleBadge.jsx";

export default function UserTable({ 
  users, 
  selectedIds,
  onSelectAll,
  onSelectOne,
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onChangeRole,
  getRelativeTime,
  getInitials,
  getAvatarColor
}) {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No users found matching the current filters.
      </div>
    );
  }

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
              />
            </th>
            <th className="p-4">User</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Joined</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-sm">
          {users.map((user) => {
            const isSelected = selectedIds.includes(user.id);
            const statusStyle = STATUS_STYLES[user.status] || STATUS_STYLES.INACTIVE;
            const role = user.roles?.[0] || "USER";
            
            return (
              <tr key={user.id} className={`group hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => onSelectOne(user.id, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                </td>
                
                {/* User Info */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden"
                      style={{ backgroundColor: getAvatarColor(user.username) }}
                    >
                      {getInitials(user.username)}
                    </div>
                    <div>
                      <button 
                        onClick={() => onView(user)}
                        className="font-bold text-gray-900 hover:text-indigo-600 hover:underline text-left block"
                      >
                        {user.username}
                      </button>
                      <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                    </div>
                  </div>
                </td>
                
                {/* Role */}
                <td className="p-4">
                  <div className="flex items-center gap-2 group/role">
                    <UserRoleBadge role={role} size="sm" />
                    <select
                      value={role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (newRole !== role && window.confirm(`Change role from ${role} to ${newRole}?`)) {
                          onChangeRole(user.id, newRole);
                        } else {
                          e.target.value = role;
                        }
                      }}
                      className="opacity-0 group-hover/role:opacity-100 text-xs text-gray-500 px-1 py-0.5 border border-gray-200 rounded hover:border-indigo-300 bg-white cursor-pointer transition-all focus:opacity-100"
                    >
                      <option value="USER">User</option>
                      <option value="SELLER">Seller</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </td>
                
                {/* Status */}
                <td className="p-4">
                  <div className="flex items-center gap-2 group/status">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                      <span className={`font-medium ${statusStyle.color}`}>{statusStyle.label}</span>
                    </div>
                    <select
                      value={user.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus !== user.status && window.confirm(`Change status from ${user.status} to ${newStatus}?`)) {
                          onToggleStatus(user.id, newStatus);
                        } else {
                          e.target.value = user.status;
                        }
                      }}
                      className="opacity-0 group-hover/status:opacity-100 text-xs text-gray-500 px-1 py-0.5 border border-gray-200 rounded hover:border-indigo-300 bg-white cursor-pointer transition-all focus:opacity-100"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="BANNED">Banned</option>
                    </select>
                  </div>
                </td>
                
                {/* Joined */}
                <td className="p-4 text-gray-600">
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"
                  }
                </td>
                
                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(user)} 
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(user)} 
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user?')) {
                          onDelete(user.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
