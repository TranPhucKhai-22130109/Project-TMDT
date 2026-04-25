"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout.jsx";
import ProductTable from "@/components/dashboard/products/ProductTable.jsx";
import ProductFormModal from "@/components/dashboard/products/ProductFormModal.jsx";
import ProductDetailPanel from "@/components/dashboard/products/ProductDetailPanel.jsx";
import DeleteDialog from "@/components/dashboard/products/DeleteDialog.jsx";
import { mockProducts } from "@/data/mockProducts.js";

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Modal states
  const [formModal, setFormModal] = useState({ isOpen: false, data: null });
  const [detailPanel, setDetailPanel] = useState({ isOpen: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filtering
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    return list;
  }, [products, search, categoryFilter]);

  // Handlers
  const handleView = (product) => {
    setDetailPanel({ isOpen: true, product });
  };

  const handleEdit = (product) => {
    setDetailPanel({ isOpen: false, product: null });
    setFormModal({ isOpen: true, data: product });
  };

  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
  };

  const handleDeleteConfirm = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
    if (detailPanel.product?.id === id) {
      setDetailPanel({ isOpen: false, product: null });
    }
  };

  const handleSave = (formData) => {
    setProducts((prev) => {
      const exists = prev.find(p => p.id === formData.id);
      if (exists) {
        return prev.map(p => p.id === formData.id ? formData : p);
      } else {
        return [formData, ...prev];
      }
    });
    setFormModal({ isOpen: false, data: null });
    
    // Update detail panel if it's open and we just saved the active product (from status toggle)
    if (detailPanel.isOpen && detailPanel.product?.id === formData.id) {
      setDetailPanel(prev => ({ ...prev, product: formData }));
    }
  };

  const handleDuplicate = (product) => {
    const clone = {
      ...product,
      id: `PRD-COPY-${Date.now().toString().slice(-4)}`,
      name: `${product.name} (Copy)`,
    };
    setProducts((prev) => [clone, ...prev]);
    setDetailPanel({ isOpen: false, product: null });
  };

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setFormModal({ isOpen: true, data: null })}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Table wrapper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ProductTable 
            products={filtered}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>

      </div>

      {/* Modals & Panels */}
      <ProductFormModal
        isOpen={formModal.isOpen}
        initialData={formModal.data}
        onClose={() => setFormModal({ isOpen: false, data: null })}
        onSave={handleSave}
      />

      <ProductDetailPanel
        isOpen={detailPanel.isOpen}
        product={detailPanel.product}
        onClose={() => setDetailPanel({ isOpen: false, product: null })}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onDuplicate={handleDuplicate}
        onSaveStatus={handleSave}
      />

      <DeleteDialog
        isOpen={!!deleteTarget}
        product={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
