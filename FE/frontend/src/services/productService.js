import { apiFetch } from "@/config/api";

export function getProducts() {
  return apiFetch("/products");
}

export function getProductById(id) {
    return apiFetch(`/products/${id}`);
}