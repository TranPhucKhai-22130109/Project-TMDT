// Service gọi API quản lý Profile cá nhân và Cửa hàng
const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

export async function getMyProfile() {
  const res = await fetch(`${AUTH_BASE}/api/users/me`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load profile");
  }
  return data.data;
}

export async function updateMyProfile(profileData) {
  const res = await fetch(`${AUTH_BASE}/api/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update profile");
  }
  return data.data;
}

export async function changeMyPassword(passwordData) {
  const res = await fetch(`${AUTH_BASE}/api/users/me/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(passwordData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to change password");
  }
  return data;
}

export async function getMyAddresses() {
  const res = await fetch(`${AUTH_BASE}/api/users/me/addresses`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load addresses");
  }
  return data.data;
}

export async function addMyAddress(addressData) {
  const res = await fetch(`${AUTH_BASE}/api/users/me/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(addressData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to add address");
  }
  return data.data;
}

export async function updateMyAddress(addressId, addressData) {
  const res = await fetch(`${AUTH_BASE}/api/users/me/addresses/${addressId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(addressData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update address");
  }
  return data.data;
}

export async function deleteMyAddress(addressId) {
  const res = await fetch(`${AUTH_BASE}/api/users/me/addresses/${addressId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete address");
  }
  return data;
}

export async function getMyShop() {
  const res = await fetch(`${AUTH_BASE}/api/seller/my-shop`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load shop details");
  }
  return data.data;
}

export async function updateMyShop(shopData) {
  const res = await fetch(`${AUTH_BASE}/api/seller/my-shop`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(shopData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update shop details");
  }
  return data.data;
}

export async function getUserProfileById(userId) {
  const res = await fetch(`${AUTH_BASE}/api/users/${userId}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to load profile");
  }
  return data.data;
}
