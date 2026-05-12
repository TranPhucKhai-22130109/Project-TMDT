"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Filter } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout.jsx";
import ProductTable from "@/components/dashboard/products/ProductTable.jsx";
import ProductFormModal from "@/components/dashboard/products/ProductFormModal.jsx";
import ProductDetailPanel from "@/components/dashboard/products/ProductDetailPanel.jsx";
import DeleteDialog from "@/components/dashboard/products/DeleteDialog.jsx";
import {
  getAllProducts,
  updateProduct,
  createProduct,
  deleteProduct,
} from "@/services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  // Modal states
  const [formModal, setFormModal] = useState({ isOpen: false, data: null });
  const [detailPanel, setDetailPanel] = useState({
    isOpen: false,
    product: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filtering
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.itemNo?.toLowerCase().includes(q) ||
          p.marque?.toLowerCase().includes(q) ||
          p.scale?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter === "Normal") {
      list = list.filter((p) => !p.isAuction);
    }

    if (categoryFilter === "Auction") {
      list = list.filter((p) => p.isAuction);
    }

    if (priceFilter !== "All") {
      list = list.filter((p) => {
        const price = Number(p.price || 0);

        switch (priceFilter) {
          case "under500":
            return price < 500000;

          case "500to1000":
            return price >= 500000 && price <= 1000000;

          case "1000to2000":
            return price > 1000000 && price <= 2000000;

          case "over2000":
            return price > 2000000;

          default:
            return true;
        }
      });
    }

    return list;
  }, [products, search, categoryFilter, priceFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      const list = Array.isArray(data) ? data : data.content || [];
      setProducts(list);
    } catch (error) {
      console.error("Tải sản phẩm admin thất bại:", error);
    } finally {
      setLoading(false);
    }
  };
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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteProduct(deleteTarget.id);

      await loadProducts();

      setDeleteTarget(null);

      if (detailPanel.product?.id === deleteTarget.id) {
        setDetailPanel({ isOpen: false, product: null });
      }
    } catch (error) {
      console.error("Delete product failed:", error);
      alert("Delete product failed!");
    }
  };

  const handleSave = async (formData, id) => {
    try {
      let savedProduct;

      if (id) {
        savedProduct = await updateProduct(id, formData);
      } else {
        savedProduct = await createProduct(formData);
      }

      await loadProducts();

      setFormModal({ isOpen: false, data: null });

      if (detailPanel.isOpen && detailPanel.product?.id === savedProduct.id) {
        setDetailPanel((prev) => ({ ...prev, product: savedProduct }));
      }
    } catch (error) {
      console.error("Lưu sản phẩm thất bại:", error);
      alert("Lưu sản phẩm thất bại!");
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

  useEffect(() => {
    loadProducts();
  }, []);

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
                <option value="All">Loại</option>
                <option value="Normal">Bình thường</option>
                <option value="Auction">Đấu giá</option>
              </select>
            </div>

            <div className="relative w-full sm:w-56">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white appearance-none cursor-pointer"
              >
                <option value="All">Giá</option>

                <option value="under500">Dưới 500K</option>

                <option value="500to1000">500K - 1 Triệu</option>

                <option value="1000to2000">1 - 2 Triệu</option>

                <option value="over2000">Trên 2 Triệu</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setFormModal({ isOpen: true, data: null })}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
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
