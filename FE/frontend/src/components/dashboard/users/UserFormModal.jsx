"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function UserFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
    role: "USER",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || "",
        email: initialData.email || "",
        password: "",
        status: initialData.status || "ACTIVE",
        role: initialData.role || "USER",
      });
    } else {
      setForm({
        username: "",
        email: "",
        password: "",
        status: "ACTIVE",
        role: "USER",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!form.email.includes("@") || !form.email.includes(".")) {
      newErrors.email = "Valid email is required.";
    }
    if (!initialData && !form.password) newErrors.password = "Password is required for new users.";
    if (!form.role) newErrors.role = "Role is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id,
      username: form.username,
      email: form.email,
      password: form.password || undefined,
      status: form.status,
      role: form.role,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[480px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex-1">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input 
                  type="text" 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {initialData ? "" : "*"}</label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange}
                  placeholder={initialData ? "Leave blank to keep" : ""}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="BANNED">Banned</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="USER">User</option>
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>
            </div>

          </form>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-xl shrink-0">
          <p className="text-xs text-gray-500 italic">Admins have full system access</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="user-form"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
