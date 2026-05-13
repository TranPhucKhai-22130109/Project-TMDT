import { apiFetch } from "@/config/api";

export function getProducts() {
  return apiFetch("/seller/products/normal");
}

export function getAllProducts() {
  return apiFetch("/seller/products/getAll");
}

export function getProductsAuction() {
  return apiFetch("/seller/products/auction");
}

export function getSortedProducts(sortBy = "id", direction = "asc") {
  return apiFetch(
    `/seller/products/sort?sortBy=${sortBy}&direction=${direction}`,
  );
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:8080/api/seller/products/upload",
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Upload image failed");
  }

  return response.text();
}

export function createProduct(data) {
  return apiFetch("/seller/products/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return apiFetch(`/seller/products/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return apiFetch(`/seller/products/delete/${id}`, {
    method: "DELETE",
  });
}