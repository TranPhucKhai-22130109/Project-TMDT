import { apiFetch } from "@/config/api";

export function getProducts() {
  return apiFetch("/products/normal");
}

export function getAllProducts() {
  return apiFetch("/products");
}

export function getProductsAuction() {
  return apiFetch("/products/auction");
}

export function getProductById(id) {
    return apiFetch(`/products/${id}`);
}
export function getSortedProducts(sortBy = 'id', direction = 'asc') {
  // Kết quả sẽ là: /products/sort?sortBy=price&direction=desc
  return apiFetch(`/products/sort?sortBy=${sortBy}&direction=${direction}`);
}

export async function uploadProductImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "http://localhost:8080/api/products/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload image failed");
  }

  return response.text();
}



export function updateProduct(id, data) {
  return apiFetch(`/products/update-product/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function createProduct(data) {
  return apiFetch("/products/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return apiFetch(`/products/delete-product/${id}`, {
    method: "DELETE",
  });
}