import { apiFetch } from "@/config/api";

export function getAdminProducts() {
  return apiFetch("/admin/products");
}

export function getPendingProducts() {
  return apiFetch("/admin/products/pending");
}

export function approveProduct(id) {
  return apiFetch(`/admin/products/approve/${id}`, {
    method: "PUT",
  });
}