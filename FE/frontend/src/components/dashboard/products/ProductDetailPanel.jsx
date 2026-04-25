"use client";

import { useState, useEffect } from "react";
import { X, Copy, Edit, Trash2, Star, ShoppingBag, DollarSign, RefreshCcw } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const sparklineData = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 30 },
  { name: 'Mar', value: 60 },
  { name: 'Apr', value: 45 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 65 },
];

export default function ProductDetailPanel({ product, isOpen, onClose, onEdit, onDelete, onDuplicate, onSaveStatus }) {
  const [activeImage, setActiveImage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [displayProduct, setDisplayProduct] = useState(product);

  useEffect(() => {
    if (product) {
      setDisplayProduct(product);
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setActiveImage(0);
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
  if (!displayProduct) return null;

  const toggleStatus = () => {
    const newStatus = displayProduct.status === "active" ? "inactive" : "active";
    onSaveStatus({ ...displayProduct, status: newStatus });
  };

  const stockPercentage = Math.min(100, (displayProduct.stock / displayProduct.maxStock) * 100);
  const stockColor = stockPercentage < 10 ? "bg-red-500" : stockPercentage < 30 ? "bg-yellow-500" : "bg-green-500";

  const getOrderStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} 
        onClick={onClose}
      />
      
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* SECTION 1: Hero Block */}
          <div className="p-6 pb-4" style={{ transition: "opacity 300ms 60ms", opacity: isOpen ? 1 : 0 }}>
            <div className="mb-4">
              <img 
                src={displayProduct.images[activeImage]} 
                alt={displayProduct.name} 
                className="w-full h-[260px] object-cover rounded-lg bg-gray-100"
              />
              <div className="flex gap-2 mt-2">
                {displayProduct.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${activeImage === idx ? "border-indigo-600" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{displayProduct.name}</h1>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-md">{displayProduct.sku}</span>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">{displayProduct.category}</span>
              <label className="relative inline-flex items-center cursor-pointer ml-auto">
                <input type="checkbox" checked={displayProduct.status === "active"} onChange={toggleStatus} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                <span className="ml-2 text-sm font-medium text-gray-600">{displayProduct.status === "active" ? "Active" : "Inactive"}</span>
              </label>
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-bold text-indigo-600">${displayProduct.price.toLocaleString()}</span>
              {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
                <span className="text-lg text-gray-400 line-through mb-1">${displayProduct.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Stock Availability</span>
                <span className="text-gray-500">{displayProduct.stock} / {displayProduct.maxStock} units</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${stockColor} rounded-full`} style={{ width: `${stockPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 2: Description & Specs */}
          <div className="p-6 py-5" style={{ transition: "opacity 300ms 120ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Details</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{displayProduct.description}</p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6">
              {Object.entries(displayProduct.specs).map(([key, value]) => (
                <div key={key}>
                  <div className="text-gray-500 capitalize mb-0.5">{key}</div>
                  <div className="font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {displayProduct.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 3: Sales Mini-Stats */}
          <div className="p-6 py-5" style={{ transition: "opacity 300ms 180ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Performance</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs font-medium">Total Sold</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{displayProduct.salesStats.totalSold}</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium">Revenue</span>
                </div>
                <div className="text-xl font-bold text-gray-900">${displayProduct.salesStats.revenue.toLocaleString()}</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RefreshCcw className="w-4 h-4" />
                  <span className="text-xs font-medium">Return Rate</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{displayProduct.salesStats.returnRate}%</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-medium">Avg Rating</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{displayProduct.salesStats.avgRating}</div>
              </div>
            </div>

            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#6366f1' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 4: Recent Orders */}
          <div className="p-6 py-5 pb-6" style={{ transition: "opacity 300ms 240ms", opacity: isOpen ? 1 : 0 }}>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Orders</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">ID</th>
                    <th className="px-3 py-2 font-medium">Customer</th>
                    <th className="px-3 py-2 font-medium">Qty</th>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {displayProduct.recentOrders.map(order => (
                    <tr key={order.orderId}>
                      <td className="px-3 py-2 text-gray-500">{order.orderId}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{order.customerName}</td>
                      <td className="px-3 py-2 text-gray-600">{order.qty}</td>
                      <td className="px-3 py-2 text-gray-500">{order.date}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="text-indigo-600 text-sm font-medium mt-3 hover:underline">
              View all orders &rarr;
            </button>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white z-10 border-t border-gray-200 p-4 flex items-center justify-between shrink-0">
          <button 
            onClick={() => onDelete(displayProduct)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => onDuplicate(displayProduct)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button 
              onClick={() => { onClose(); onEdit(displayProduct); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
