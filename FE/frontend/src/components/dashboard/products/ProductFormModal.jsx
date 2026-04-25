"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ProductFormModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    price: "",
    originalPrice: "",
    stock: "",
    maxStock: "",
    status: "active",
    description: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        price: initialData.price.toString(),
        originalPrice: initialData.originalPrice ? initialData.originalPrice.toString() : "",
        stock: initialData.stock.toString(),
        maxStock: initialData.maxStock.toString(),
        tags: initialData.tags ? initialData.tags.join(", ") : "",
      });
    } else {
      setForm({
        name: "",
        sku: "",
        category: "Electronics",
        price: "",
        originalPrice: "",
        stock: "",
        maxStock: "",
        status: "active",
        description: "",
        tags: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked ? "active" : "inactive" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.sku.trim()) newErrors.sku = "SKU is required.";
    if (!form.category) newErrors.category = "Category is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) newErrors.price = "Valid price is required.";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Valid stock is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    onSave({
      ...form,
      id: initialData?.id || `PRD-NEW-${Date.now().toString().slice(-4)}`,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      maxStock: form.maxStock ? Number(form.maxStock) : Number(form.stock) * 2,
      tags: tagsArray,
      images: initialData?.images || [
        "https://picsum.photos/seed/new1/400/400",
        "https://picsum.photos/seed/new2/400/400",
        "https://picsum.photos/seed/new3/400/400",
      ],
      specs: initialData?.specs || { weight: "-", dimensions: "-", material: "-", barcode: "-", supplier: "-" },
      salesStats: initialData?.salesStats || { totalSold: 0, revenue: 0, returnRate: 0, avgRating: 0 },
      recentOrders: initialData?.recentOrders || [],
    });
  };

  const renderTags = () => {
    if (!form.tags) return null;
    const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    if (tagsArray.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tagsArray.map((tag, idx) => (
          <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100">
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={form.sku} 
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center h-10">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="status" 
                      checked={form.status === "active"} 
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {form.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input 
                  type="number" 
                  name="price" 
                  step="0.01"
                  value={form.price} 
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                <input 
                  type="number" 
                  name="originalPrice" 
                  step="0.01"
                  value={form.originalPrice} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={form.stock} 
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                <input 
                  type="number" 
                  name="maxStock" 
                  value={form.maxStock} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description" 
                rows="3" 
                value={form.description} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input 
                type="text" 
                name="tags" 
                value={form.tags} 
                onChange={handleChange}
                placeholder="e.g. electronics, apple, smartphone"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {renderTags()}
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="product-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
