import { apiFetch } from "@/config/api";

export function getAuctionProducts() {
  return apiFetch("/auction/products");
}

export function getAuctionBids(productId) {
  return apiFetch(`/auction/${productId}/bids`);
}

export function getAuctionCurrentBid(productId) {
  return apiFetch(`/auction/${productId}/current`);
}

export function placeBid(productId, amount) {
  return apiFetch("/auction/bid", {
    method: "POST",
    body: JSON.stringify({ productId, amount }),
  });
}

export function getAuctionWinner(productId) {
  return apiFetch(`/auction/${productId}/winner`);
}

export function getMyWonAuctions() {
  return apiFetch("/auction/my-won");
}
