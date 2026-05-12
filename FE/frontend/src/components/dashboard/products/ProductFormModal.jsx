"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { uploadProductImage } from "@/services/productService";

const emptyForm = {
  name: "",
  itemNo: "",
  price: "",
  stockQuantity: "",
  soldQuantity: "",
  scale: "",
  marque: "",
  status: "Released",
  isAuction: false,
  description: "",
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        itemNo: initialData.itemNo || "",
        price: initialData.price?.toString() || "",
        stockQuantity: initialData.stockQuantity?.toString() || "",
        soldQuantity: initialData.soldQuantity?.toString() || "0",
        scale: initialData.scale || "",
        marque: initialData.marque || "",
        status: initialData.status || "Released",
        isAuction: Boolean(initialData.isAuction),
        description: initialData.description || "",
      });
    } else {
      setForm(emptyForm);
    }

    setExistingImages(initialData?.images || []);
    setNewImages([]);
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Tên sản phẩm không được bỏ trống.";

    if (!form.itemNo.trim()) newErrors.itemNo = "Item No không được bỏ trống.";

    if (!form.price || isNaN(form.price) || Number(form.price) < 0) {
      newErrors.price = "Giá không hợp lệ.";
    }

    if (
      form.stockQuantity === "" ||
      isNaN(form.stockQuantity) ||
      Number(form.stockQuantity) < 0
    ) {
      newErrors.stockQuantity = "Số lượng tồn không hợp lệ.";
    }

    if (
      form.soldQuantity !== "" &&
      (isNaN(form.soldQuantity) || Number(form.soldQuantity) < 0)
    ) {
      newErrors.soldQuantity = "Số lượng đã bán không hợp lệ.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let uploadedNewImages = [];

      if (newImages.length > 0) {
        uploadedNewImages = await Promise.all(
          newImages.map((file) => uploadProductImage(file)),
        );
      }

      const images = [...existingImages, ...uploadedNewImages];

      const imageUrl = images[0] || "";

      const payload = {
        name: form.name.trim(),
        itemNo: form.itemNo.trim(),
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        soldQuantity: Number(form.soldQuantity || 0),
        scale: form.scale.trim(),
        marque: form.marque.trim(),
        status: form.status,
        isAuction: Boolean(form.isAuction),
        description: form.description.trim(),
        imageUrl,
        images,
        isDeleted: false,
      };

      await onSave(payload, initialData?.id);
    } catch (error) {
      console.error("Update product error:", error);
      alert("Update product failed!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Thay đổi sản phẩm" : "Thêm sản phẩm"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            {/* IMAGE SECTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Hình ảnh sản phẩm
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {/* Existing images */}
                {existingImages.map((src, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setExistingImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* New images */}
                {newImages.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50 group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setNewImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {existingImages.length === 0 && newImages.length === 0 && (
                  <div className="aspect-square rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400 bg-gray-50">
                    Không hình ảnh
                  </div>
                )}
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setNewImages((prev) => [
                    ...prev,
                    ...Array.from(e.target.files),
                  ])
                }
                className="block w-full text-sm text-gray-600
      file:mr-4
      file:py-2
      file:px-4
      file:rounded-lg
      file:border-0
      file:bg-indigo-50
      file:text-indigo-700
      hover:file:bg-indigo-100
      cursor-pointer"
              />

              <p className="text-xs text-gray-500 mt-2">
                Có thể thêm hoặc xoá ảnh trước khi cập nhật sản phẩm.
              </p>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã sản phẩm *
                </label>
                <input
                  type="text"
                  name="itemNo"
                  value={form.itemNo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    errors.itemNo
                      ? "border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                />
                {errors.itemNo && (
                  <p className="text-red-500 text-xs mt-1">{errors.itemNo}</p>
                )}
              </div>
            </div>

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá *
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    errors.price
                      ? "border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                />

                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng tồn kho *
                </label>

                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    errors.stockQuantity
                      ? "border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                />

                {errors.stockQuantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stockQuantity}
                  </p>
                )}
              </div>
            </div>

            {/* SOLD + STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng đã bán
                </label>

                <input
                  type="number"
                  name="soldQuantity"
                  value={form.soldQuantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${
                    errors.soldQuantity
                      ? "border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                />

                {errors.soldQuantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.soldQuantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-indigo-500"
                >
                  <option value="Released">Released</option>
                  <option value="Draft">Draft</option>
                  <option value="SoldOut">Sold Out</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>

            {/* SCALE + MARQUE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scale
                </label>

                <input
                  type="text"
                  name="scale"
                  value={form.scale}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu
                </label>

                <input
                  type="text"
                  name="marque"
                  value={form.marque}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* AUCTION */}
            <div className="flex items-center gap-3">
              <input
                id="isAuction"
                type="checkbox"
                name="isAuction"
                checked={form.isAuction}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <label
                htmlFor="isAuction"
                className="text-sm font-medium text-gray-700"
              >
                Sản phẩm đấu giá
              </label>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>

              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-indigo-500"
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition"
          >
            Hủy
          </button>

          <button
            type="submit"
            form="product-form"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition"
          >
            {initialData ? "Thay đổi" : "Lưu sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}
