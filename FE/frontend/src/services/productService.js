import { apiFetch } from "@/config/api";

export function getProducts() {
  return apiFetch("/products");
}

export function getProductById(id) {
    return apiFetch(`/products/${id}`);
}
export function getSortedProducts(sortBy = 'id', direction = 'asc') {
  // Kết quả sẽ là: /products/sort?sortBy=price&direction=desc
  return apiFetch(`/products/sort?sortBy=${sortBy}&direction=${direction}`);
}