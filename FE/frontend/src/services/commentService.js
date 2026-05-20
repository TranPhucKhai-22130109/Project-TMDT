import { apiFetch } from "@/config/api";

export function getProductComments(productId) {
  return apiFetch(`/products/${productId}/comments`);
}

export function createProductComment(productId, content) {
  return apiFetch(`/products/${productId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function replyProductComment(productId, commentId, content) {
  return apiFetch(`/products/${productId}/comments/${commentId}/reply`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function updateProductComment(productId, commentId, content) {
  return apiFetch(`/products/${productId}/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export function deleteProductComment(productId, commentId) {
  return apiFetch(`/products/${productId}/comments/${commentId}`, {
    method: "DELETE",
  });
}