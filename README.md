---

# 🗂️ Next.js (FE) + Spring Boot (BE) — Hello World

## 📁 Cấu trúc tổng quan

```
my-project/
├── FE/frontend/       # Next.js App
└── BE/ecommerce/      # Spring Boot App
```

---

## 🖥️ Frontend — Next.js

```
FE/frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Trang chủ
│   │   └── globals.css
│   ├── components/
│   │   └── HelloMessage.tsx    # Component hiển thị message
│   ├── constants/
│   │   └── endpoints.ts        # Khai báo tất cả endpoint API
│   ├── services/
│   │   └── helloService.ts     # Gọi API qua service layer
│   └── lib/
│       └── api.ts              # HTTP client base (fetch wrapper)
├── .env.local
├── next.config.ts
└── package.json
```

---

### `src/constants/endpoints.ts`

Khai báo toàn bộ endpoint tại một chỗ — không hardcode URL rải rác khắp code.

```ts
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
```

---

### `src/lib/api.ts`

HTTP client base — wrapper cho `fetch`, xử lý lỗi tập trung.

```ts
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  put: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
```

---

### `src/services/helloService.ts`

Service layer — dùng `ENDPOINTS` + `apiClient`, không viết URL trực tiếp.

```ts
import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

interface HelloResponse {
  message: string;
}

export const helloService = {
  getMessage: () => apiClient.get<HelloResponse>(ENDPOINTS.hello.getMessage),
};
```

---

### `src/components/HelloMessage.tsx`

Component chỉ cần gọi service — không cần phải biết về URL hay HTTP.

```tsx
"use client";

import { useEffect, useState } from "react";
import { helloService } from "@/services/helloService";

export default function HelloMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    helloService.getMessage().then((data) => setMessage(data.message));
  }, []);

  return <h1>{message || "Loading..."}</h1>;
}
```

---

### `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## ☕ Backend — Spring Boot

```
BE/ecommerce/
├── src/main/
│   ├── java/com/example/ecommerce/
│   │   ├── EcommerceApplication.java
│   │   └── controller/
│   │       └── TestController.java
│   └── resources/
│       └── application.properties
└── pom.xml
```

### `TestController.java`

```java
package com.example.ecommerce.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

    @GetMapping("/hello")
    public java.util.Map<String, String> hello() {
        return java.util.Map.of("message", "Hello Nextjs + SpringBoot");
    }
}
```

### `application.properties`

```properties
spring.application.name=ecommerce
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 🚀 Chạy dự án

```bash
# Backend
cd BE/ecommerce
./mvnw spring-boot:run
# → http://localhost:8080/api/hello

# Frontend
cd FE/frontend
npm install && npm run dev
# → http://localhost:3000
```

---

## 🔄 Luồng hoạt động

```
Browser (localhost:3000)
        │  useEffect → helloService.getMessage()
        ▼
   helloService          (services/)
        │  apiClient.get(ENDPOINTS.hello.getMessage)
        ▼
   apiClient             (lib/api.ts)
        │  GET http://localhost:8080/api/hello
        ▼
  Spring Boot API
        │  { "message": "Hello Nextjs + SpringBoot" }
        ▼
  Render lên màn hình
```

---

## 🛠️ Tech Stack

| Layer    | Tech        | Version |
| -------- | ----------- | ------- |
| Frontend | Next.js     | 14+     |
| Language | TypeScript  | 5+      |
| Backend  | Spring Boot | 3+      |
| Language | Java        | 17+     |
| Database | MySQL       | 8+      |
| Build    | Maven       | 3.9+    |

---

**Điểm quan trọng cần nhớ:**

- Annotation `@CrossOrigin(origins = "http://localhost:3000")` trong Controller là bắt buộc để FE gọi được BE khi chạy dev (khác port).
- `NEXT_PUBLIC_` prefix bắt buộc để Next.js expose biến ra client-side.
- `"use client"` directive cần thiết khi dùng `useEffect`/`useState` trong Next.js App Router.
- `constants/endpoints.ts` là nơi duy nhất chứa URL — khi BE đổi path, chỉ cần sửa ở đây.
- `services/` đóng vai trò trung gian giữa component và HTTP client — component không bao giờ gọi `fetch` trực tiếp.
- `lib/api.ts` xử lý lỗi HTTP tập trung — không cần `if (!res.ok)` lặp lại ở từng service.
