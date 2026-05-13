"use client";

import { useState, useEffect } from "react";
import { X, Camera, User } from "lucide-react";

const PRESET_AVATARS = [
  "https://picsum.photos/seed/p1/128/128",
  "https://picsum.photos/seed/p2/128/128",
  "https://picsum.photos/seed/p3/128/128",
  "https://picsum.photos/seed/p4/128/128",
  "https://picsum.photos/seed/p5/128/128"
];

export default function UserFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    status: "Active",
    password: "",
    province: "",
    city: "",
    street: "",
    note: "",
    avatar: ""
  });

  const [errors, setErrors] = useState({});
  const [avatarIdx, setAvatarIdx] = useState(0);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || "Customer",
        status: initialData.status || "Active",
        password: "",
        province: initialData.address?.province || "",
        city: initialData.address?.city || "",
        street: initialData.address?.street || "",
        note: initialData.note || "",
        avatar: initialData.avatar || ""
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "Customer",
        status: "Active",
        password: "",
        province: "",
        city: "",
        street: "",
        note: "",
        avatar: ""
      });
      setAvatarIdx(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCycleAvatar = () => {
    const nextIdx = (avatarIdx + 1) % PRESET_AVATARS.length;
    setAvatarIdx(nextIdx);
    setForm(prev => ({ ...prev, avatar: PRESET_AVATARS[nextIdx] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!form.email.includes("@") || !form.email.includes(".")) {
      newErrors.email = "Valid email is required.";
    }
    if (!form.role) newErrors.role = "Role is required.";
    if (!initialData && !form.password) newErrors.password = "Password is required for new users.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      status: form.status,
      avatar: form.avatar,
      note: form.note,
      address: {
        street: form.street,
        city: form.city,
        province: form.province,
        zip: initialData?.address?.zip || "00000"
      }
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
            
            {/* Avatar Section */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <button 
                  type="button"
                  onClick={handleCycleAvatar}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </button>
                <p className="text-xs text-gray-500 mt-1.5">Click to cycle mock images</p>
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input 
                  type="text" 
                  name="province" 
                  value={form.province} 
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                  className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Customer">Customer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Full-width Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                type="text" 
                name="street" 
                value={form.street} 
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Note</label>
              <textarea 
                name="note" 
                rows="2" 
                value={form.note} 
                onChange={handleChange}
                placeholder="Internal notes, not visible to user"
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
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
