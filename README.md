---
# 🗂️ Project-TMDT: E-commerce Admin Dashboard (Next.js) + Backend (Spring Boot)
---

## 📁 Cấu trúc tổng quan

```text
my-project/
├── FE/frontend/       # Next.js App (UI/UX + Admin Dashboard)
└── BE/ecommerce/      # Spring Boot App (REST API)
```

---

## 🖥️ Frontend — Next.js (UI/UX + Admin Dashboard)

### 🛠️ Tech Stack (Frontend)

- **Framework**: Next.js 14+ (App Router)
- **Ngôn ngữ**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`)

### 📂 Cấu trúc thư mục Frontend

```text
FE/frontend/src/
├── app/
│   ├── dashboard/                  # Các trang Admin Dashboard
│   │   ├── page.jsx                # Trang Analytics/Tổng quan
│   │   ├── products/page.jsx       # Trang quản lý Sản phẩm
│   │   ├── orders/page.jsx         # Trang quản lý Đơn hàng
│   │   └── users/page.jsx          # Trang quản lý Người dùng
│   ├── layout.jsx
│   └── globals.css                 # File CSS chứa Tailwind & global styles
├── components/
│   └── dashboard/                  # Các UI components cho Admin
│       ├── layout/                 # Layout (Sidebar, Topbar)
│       ├── products/               # Components cho Products (Table, Form, Detail Modal)
│       ├── orders/                 # Components cho Orders (Table, Detail Modal, Status Badge)
│       ├── users/                  # Components cho Users (Table, Form, Detail Modal)
│       ├── ActivityFeed.jsx        # Component: Hoạt động gần đây
│       ├── OrderStatusChart.jsx    # Component: Biểu đồ trạng thái đơn hàng (Pie Chart)
│       ├── RecentOrdersTable.jsx   # Component: Bảng đơn hàng gần đây
│       ├── RevenueChart.jsx        # Component: Biểu đồ doanh thu (Composed Chart)
│       ├── StatCards.jsx           # Component: Thẻ thống kê KPI
│       └── TopProductsChart.jsx    # Component: Biểu đồ top sản phẩm (Bar Chart)
└── data/                           # Mock data (dữ liệu mẫu) cho UI
    ├── mockAnalytics.js
    ├── mockOrders.js
    ├── mockProducts.js
    └── mockUsers.js
```

### ✨ Các module chính đã hoàn thiện

1. **Layout & Navigation**
   - Sidebar với navigation links và notification badges.
   - Topbar với thanh tìm kiếm và menu người dùng.

2. **Dashboard / Analytics (`/dashboard`)**
   - **Thống kê tổng quan (KPIs)**: Doanh thu, số lượng đơn hàng, số lượng sản phẩm, người dùng đang hoạt động (kèm tỷ lệ tăng trưởng).
   - **Biểu đồ doanh thu (Revenue Chart)**: Line/Area chart hỗ trợ lọc theo thời gian.
   - **Top Sản phẩm (Top Products)**: Bar chart thống kê sản phẩm bán chạy theo số lượng/doanh thu.
   - **Trạng thái đơn hàng (Order Status)**: Donut chart hiển thị tỷ lệ trạng thái đơn hàng.
   - **Hoạt động gần đây (Activity Feed)**: Danh sách cuộn chứa thông báo hệ thống.

3. **Quản lý Sản phẩm (`/dashboard/products`)**
   - Danh sách sản phẩm với chức năng tìm kiếm, lọc theo danh mục.
   - Modal thêm/sửa sản phẩm.
   - Modal hiển thị chi tiết sản phẩm (hiệu ứng scale/fade) kèm biểu đồ sparkline.
   - Xóa sản phẩm (kèm dialog xác nhận).

4. **Quản lý Đơn hàng (`/dashboard/orders`)**
   - Danh sách đơn hàng với status badges sinh động.
   - Modal chi tiết đơn hàng cho phép xem thông tin khách hàng, chi tiết sản phẩm và cập nhật trạng thái giao hàng.

5. **Quản lý Người dùng (`/dashboard/users`)**
   - Bảng danh sách người dùng, lọc theo role (Admin/Manager/Customer) và status.
   - Modal thêm/sửa thông tin người dùng.
   - Modal chi tiết người dùng với biểu đồ hoạt động gần đây.

---

## ☕ Backend — Spring Boot

_Backend hiện tại đóng vai trò cung cấp REST API cho toàn bộ hệ thống._

```text
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
@CrossOrigin(origins = "http://localhost:3000") // Cho phép FE kết nối
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

## 🚀 Cách chạy dự án

### Chạy Backend (Spring Boot)

```bash
cd BE/ecommerce
./mvnw spring-boot:run
# API chạy tại: http://localhost:8080
```

### Chạy Frontend (Next.js)

```bash
cd FE/frontend
npm install
npm run dev
# Dashboard chạy tại: http://localhost:3000/dashboard
```

---

## 🛠️ Điểm quan trọng cần nhớ

- **Mock Data**: Giao diện hiện tại đang sử dụng dữ liệu tĩnh từ thư mục `src/data/` để thiết kế UI. Bước tiếp theo sẽ là kết nối với các Spring Boot REST APIs thông qua `fetch` hoặc Axios.
