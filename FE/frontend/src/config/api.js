// Base URL (backend)
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Helper fetch chung
export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
}