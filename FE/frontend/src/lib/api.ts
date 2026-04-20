async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export const apiClient = {
  get:  <T>(url: string)                        => request<T>(url),
  post: <T>(url: string, body: unknown)         => request<T>(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  put:  <T>(url: string, body: unknown)         => request<T>(url, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  del:  <T>(url: string)                        => request<T>(url, { method: "DELETE" }),
};
