import { apiFetch } from "@/config/api";

export async function addToCart(productId, quantity = 1) {
  console.log("CALL /cart/add:", productId, quantity);

  return apiFetch("/cart/add", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
}

export async function getCartCount() {
  return apiFetch("/cart/count");
}
