const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const ENDPOINTS = {
  hello: {
    getMessage: `${BASE_URL}/api/hello`,
  },
  // Thêm các nhóm endpoint khác ở đây
  // user: {
  //   getAll:  `${BASE_URL}/api/users`,
  //   getById: (id: number) => `${BASE_URL}/api/users/${id}`,
  // },
} as const;
