"use client";

import { Edit, Trash2, Eye, CheckCircle2 } from "lucide-react";
export default function ProductTable({
  products,
  onView,
  onApprove,
  showApproveButton = false,
}) {
  const getStockColor = (stock) => {
    if (stock < 10) return "text-red-600";
    if (stock < 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getStockBarColor = (stock) => {
    if (stock < 10) return "bg-red-500";
    if (stock < 30) return "bg-yellow-500";
    return "bg-green-500";
  };


  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
            <th className="p-4 w-12">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </th>
            <th className="p-4 font-medium">Sản phẩm</th>
            {/* <th className="p-4 font-medium">Danh mục</th> */}
            <th className="p-4 font-medium">Giá</th>
            <th className="p-4 font-medium">Kho</th>
            <th className="p-4 font-medium">Loại</th>
            <th className="p-4 font-medium">Trạng thái</th>
            <th className="p-4 font-medium">Duyệt</th>
            <th className="p-4 font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-sm">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover border border-gray-200"
                  />
                  <div>
                    <button
                      onClick={() => onView(product)}
                      className="font-medium text-gray-900 hover:text-indigo-600 transition-colors text-left"
                    >
                      {product.name}
                    </button>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {product.itemNo}
                    </div>
                  </div>
                </div>
              </td>
              {/* <td className="p-4">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  {product.category}
                </span>
              </td> */}
              <td className="p-5">
                <div className="font-semibold text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </div>

                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <div className="text-xs text-gray-400 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.originalPrice)}
                    </div>
                  )}
              </td>
              <td className="p-5">
                <div className="flex flex-col gap-1 w-24">
                  <span
                    className={`font-medium ${getStockColor(
                      product.stockQuantity || 0,
                    )}`}
                  >
                    {product.stockQuantity || 0} in stock
                  </span>

                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getStockBarColor(
                        product.stockQuantity || 0,
                      )}`}
                      style={{
                        width: `${Math.min(
                          100,
                          ((product.stockQuantity || 0) / 120) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="p-5">
                {product.isAuction ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Đấu giá
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Bình thường
                  </span>
                )}
              </td>
              <td className="p-5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {product.status}
                </span>
              </td>
              <td className="p-5">
                {product.isApproved ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã duyệt
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Chờ duyệt
                  </span>
                )}
              </td>
              <td className="p-5 text-right">
                <div className="flex justify-end gap-2 text-gray-400">
                  <button
                    onClick={() => onView(product)}
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {showApproveButton && !product.isApproved && (
                    <button
                      onClick={() => onApprove(product)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Duyệt
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
