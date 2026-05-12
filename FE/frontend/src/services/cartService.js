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

export async function getCartItems() {
  return apiFetch("/cart/getAll");
}

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await apiFetch(
    `/cart/update/${cartItemId}?quantity=${quantity}`,
    {
      method: "PUT",
    }
  );

  return response;
};

export const removeCartItem = async (cartItemId) => {
  const response = await apiFetch(`/cart/remove/${cartItemId}`, {
    method: "DELETE",
  });

  return response;
};
