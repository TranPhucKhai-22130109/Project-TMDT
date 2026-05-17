# Project Context — E-Commerce Backend (Spring Boot)

> **Tạo lúc:** 2026-05-14  
> **Đường dẫn root:** `D:\Project-TMDT\BE\ecommerce`

---

## 1. Tổng Quan Project

### Mục đích

Hệ thống backend cho sàn thương mại điện tử chuyên về **mô hình xe (diecast model cars)**, hỗ trợ 3 vai trò: **USER** (người mua), **SELLER** (người bán), **ADMIN** (quản trị). Hỗ trợ mua bán thông thường và **đấu giá (auction)**.

### Tech Stack

| Thành phần    | Chi tiết                                              |
| ------------- | ----------------------------------------------------- |
| Java          | 21                                                    |
| Spring Boot   | **4.0.5**                                             |
| Build tool    | Maven                                                 |
| Database      | MySQL (localhost:3306, schema `ecommerce`)            |
| ORM           | Spring Data JPA + Hibernate                           |
| Security      | Spring Security + OAuth2 Resource Server (JWT)        |
| Password      | BCrypt                                                |
| JWT           | Nimbus JOSE, HMAC-SHA512                              |
| Token storage | In-memory `ConcurrentHashMap` (thay thế Redis)        |
| Image upload  | Cloudinary (`cloudinary-http45:1.39.0`)               |
| Mapping       | MapStruct 1.6.3 + Lombok                              |
| Validation    | `spring-boot-starter-validation`                      |
| Cache         | Redis starter có trong POM nhưng **chưa cấu hình**    |
| JSON          | Jackson (`tools.jackson` — Spring Boot 4.x namespace) |

### Cấu trúc thư mục tổng thể

```
ecommerce/
├── pom.xml
└── src/main/
    ├── java/com/example/ecommerce/
    │   ├── EcommerceApplication.java       # Main class
    │   ├── configuration/                  # Security, JWT, Cloudinary config
    │   ├── controller/                     # REST API controllers (7 files)
    │   ├── dto/
    │   │   ├── TokenPayload.java
    │   │   ├── request/auth/               # LoginRequest, SignUpRequest, CheckoutRequest
    │   │   ├── requesy/                    # ⚠️ Typo! AddToCartRequest, ProductJson
    │   │   └── response/                   # ApiResponse, LoginResponse, OrderResponse, ProductResponse, SellerProductResponse
    │   ├── entity/                         # JPA entities (9 files)
    │   ├── enums/                          # RoleName enum
    │   ├── exception/                      # AppException, ErrorCode, GlobalExceptionHandler
    │   ├── mapper/                         # Trống (chỉ có .gitkeep)
    │   ├── repository/                     # Spring Data repositories (7 files)
    │   ├── seed/                           # DataSeeder, RoleSeeder (CommandLineRunner)
    │   └── service/
    │       ├── AuthService.java
    │       ├── JwtService.java
    │       ├── TokenService.java
    │       ├── UserDetailServiceCustomize.java
    │       ├── OrderService.java
    │       └── cart/CartService.java
    └── resources/
        ├── application.properties
        └── data/product/                   # JSON files dùng để seed sản phẩm
```

---

## 2. Các Thành Phần Chính

### 2.1 Packages & Vai trò

| Package         | Vai trò                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| `configuration` | Security filter chain, JWT encoder/decoder, Cloudinary bean, CORS                           |
| `controller`    | REST endpoints cho Auth, Product (public), Seller Product, Admin Product, Cart, Order, Test |
| `dto`           | Data Transfer Objects — request/response, tách biệt entity khỏi API                         |
| `entity`        | JPA entities ánh xạ database tables                                                         |
| `enums`         | Enum `RoleName` (USER, SELLER, ADMIN)                                                       |
| `exception`     | Custom exception (`AppException`), error codes, global handler                              |
| `mapper`        | Dự kiến dùng MapStruct nhưng **hiện đang trống**                                            |
| `repository`    | Spring Data JPA repositories                                                                |
| `seed`          | Khởi tạo dữ liệu mẫu khi chạy lần đầu                                                       |
| `service`       | Business logic: auth, JWT, token blacklist, order, cart                                     |

### 2.2 Entities & Quan hệ

```
┌───────────┐     1:N     ┌───────────┐     N:1     ┌─────────┐
│   User    │────────────▶│ UserRole  │◀────────────│  Role   │
│ (users)   │             │           │             │ (roles) │
└───────────┘             └───────────┘             └─────────┘
      │
      │ 1:N (as seller)          1:N (as buyer)
      ▼                          ▼
┌───────────┐             ┌───────────┐     1:N     ┌───────────┐
│  Product  │             │   Order   │────────────▶│ OrderItem │
│           │             │ (orders)  │             │(order_items)│
└───────────┘             └───────────┘             └───────────┘
      │                         │                         │
      │ N:1                     │ 1:1                     │ N:1
      ▼                         ▼                         ▼
┌───────────┐             ┌───────────┐             ┌───────────┐
│ CartItem  │             │  Payment  │             │  Product  │
│           │             │(payments) │             │           │
└───────────┘             └───────────┘             └───────────┘
```

#### Chi tiết Entity

| Entity         | Table                | PK              | Đặc điểm                                                                                                                                                               |
| -------------- | -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BaseEntity** | — (MappedSuperclass) | —               | `createdAt`, `updatedAt` tự động                                                                                                                                       |
| **User**       | `users`              | UUID (String)   | Implements `UserDetails`, chứa `username`, `email`, `password`. Quan hệ 1:N với `UserRole`                                                                             |
| **Role**       | `roles`              | UUID (String)   | `roleName` (unique). Quan hệ 1:N với `UserRole`                                                                                                                        |
| **UserRole**   | `user_role`          | UUID (String)   | Join table cho quan hệ User↔Role (Many-to-Many qua entity trung gian)                                                                                                  |
| **Product**    | `product`            | Long (auto)     | Sản phẩm mô hình xe. `images` lưu JSON string. Có `isDeleted` (soft delete), `isApproved` (cần admin duyệt), `isAuction`. ManyToOne → User (seller)                    |
| **CartItem**   | `cart_item`          | Long (auto)     | Gắn `userId` (String), ManyToOne → Product                                                                                                                             |
| **Order**      | `orders`             | UUID (String)   | Chứa status (`PENDING/CONFIRMED/SHIPPING/DELIVERED/CANCELLED`), payment method (`COD/ONLINE`), payment status (`UNPAID/PAID/REFUNDED`), shipping info. 1:N → OrderItem |
| **OrderItem**  | `order_items`        | Long (identity) | ManyToOne → Order, ManyToOne → Product. Chứa `quantity`, `unitPrice`                                                                                                   |
| **Payment**    | `payments`           | UUID (String)   | OneToOne → Order. Gateway (`MOCK/VNPAY/MOMO`), result (`PENDING/SUCCESS/FAILED/CANCELLED`)                                                                             |

### 2.3 Repositories

| Repository           | Entity   | Custom Methods                                                                                                      |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `UserRepository`     | User     | `findByUsername`, `findByEmail`, `existsByEmail`, `existsByUsername`, `findEmailById`                               |
| `RoleRepository`     | Role     | `findByRoleName`                                                                                                    |
| `UserRoleRepository` | UserRole | (chỉ CRUD mặc định)                                                                                                 |
| `ProductRepository`  | Product  | Nhiều query filter: by `isDeleted`, `isApproved`, `isAuction`, `sellerId`, có hỗ trợ `Sort`                         |
| `CartRepository`     | CartItem | `findByUserIdAndProductId`, `countByUserId`, `findByUserId`, `findByIdAndUserId`                                    |
| `OrderRepository`    | Order    | `findByUserIdOrderByCreatedAtDesc` (có/không phân trang), `findByIdWithItems` (JOIN FETCH), `findByUserIdWithItems` |
| `PaymentRepository`  | Payment  | `findByOrderId`, `findByTransactionId`                                                                              |

### 2.4 Services

| Service                        | Chức năng                                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **AuthService**                | Đăng ký (gán role USER), login (sinh access+refresh token), refresh token (rotate), logout (blacklist access + revoke refresh + clear cookie) |
| **JwtService**                 | Sinh/decode JWT token dùng HMAC-SHA512. Claims: `sub` (userId), `scope` (roles), `jwtId` (UUID), `exp`                                        |
| **TokenService**               | In-memory storage cho refresh tokens và access token blacklist. Dùng `ConcurrentHashMap` thay Redis                                           |
| **UserDetailServiceCustomize** | Implements `UserDetailsService`, load user bằng **email** (không phải username)                                                               |
| **OrderService**               | Checkout (tạo order + order items + payment nếu ONLINE), confirm payment (mock), lịch sử đơn hàng, chi tiết đơn hàng                          |
| **CartService**                | Thêm vào giỏ (nếu đã có thì cộng quantity), đếm, lấy danh sách, cập nhật số lượng, xóa item                                                   |

### 2.5 Controllers

| Controller                  | Base Path              | Vai trò                                                              |
| --------------------------- | ---------------------- | -------------------------------------------------------------------- |
| **AuthController**          | `/v1/auth`             | Register, Login, Refresh token, Logout                               |
| **ProductController**       | `/api/products`        | CRUD sản phẩm (public read), upload ảnh, sắp xếp/lọc                 |
| **SellerProductController** | `/api/seller/products` | CRUD sản phẩm của seller (cần auth), upload ảnh                      |
| **AdminProductController**  | `/api/admin/products`  | Xem tất cả sản phẩm, xem sản phẩm chờ duyệt, duyệt sản phẩm          |
| **CartController**          | `/api/cart`            | Thêm/xem/sửa/xóa item giỏ hàng (cần auth)                            |
| **OrderController**         | `/api/orders`          | Checkout, xác nhận thanh toán, lịch sử, chi tiết đơn hàng (cần auth) |
| **TestController**          | `/api`                 | Endpoint test: GET `/api/hello`                                      |

---

## 3. API Endpoints

### 3.1 Authentication (`/v1/auth`) — Public

| Method | Path                      | Chức năng                  | Input                                         | Output                                                                |
| ------ | ------------------------- | -------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/v1/auth/check-username` | Kiểm tra username khả dụng | `?username=xxx`                               | `ApiResponse<Void>`                                                   |
| POST   | `/v1/auth/register`       | Đăng ký tài khoản          | `SignUpRequest` (name, email, password)       | `ApiResponse<Void>`                                                   |
| POST   | `/v1/auth/login`          | Đăng nhập                  | `LoginRequest` (email, password)              | `ApiResponse<LoginResponse>` + Set-Cookie (accessToken, refreshToken) |
| POST   | `/v1/auth/refresh`        | Làm mới access token       | Cookie `refreshToken`                         | `ApiResponse<LoginResponse>` + Set-Cookie (accessToken)               |
| POST   | `/v1/auth/logout`         | Đăng xuất                  | Header `Authorization`, Cookie `refreshToken` | `ApiResponse<Void>` + Clear cookies                                   |

### 3.2 Products — Public (`/api/products`)

| Method | Path                                | Chức năng                                 | Input                      | Output                  |
| ------ | ----------------------------------- | ----------------------------------------- | -------------------------- | ----------------------- |
| GET    | `/api/products`                     | Lấy tất cả sản phẩm đã duyệt              | —                          | `List<ProductResponse>` |
| GET    | `/api/products/normal`              | Sản phẩm bán thường (isAuction=false)     | —                          | `List<ProductResponse>` |
| GET    | `/api/products/auction`             | Sản phẩm đấu giá (isAuction=true)         | —                          | `List<ProductResponse>` |
| GET    | `/api/products/sort`                | Sắp xếp sản phẩm                          | `?sortBy=id&direction=asc` | `List<ProductResponse>` |
| POST   | `/api/products/upload`              | Upload ảnh lên Cloudinary                 | `MultipartFile file`       | URL string              |
| POST   | `/api/products/create`              | Tạo sản phẩm (⚠️ không check auth/seller) | `ProductResponse` body     | `ProductResponse`       |
| PUT    | `/api/products/update-product/{id}` | Cập nhật sản phẩm (⚠️ không check auth)   | `ProductResponse` body     | `ProductResponse`       |
| DELETE | `/api/products/delete-product/{id}` | Soft delete (⚠️ không check auth)         | —                          | `{message: ...}`        |

### 3.3 Seller Products (`/api/seller/products`) — Authenticated

| Method | Path                               | Chức năng                           | Input                        | Output                        |
| ------ | ---------------------------------- | ----------------------------------- | ---------------------------- | ----------------------------- |
| GET    | `/api/seller/products/getAll`      | Lấy sản phẩm của seller hiện tại    | JWT                          | `List<SellerProductResponse>` |
| POST   | `/api/seller/products/create`      | Tạo sản phẩm mới (isApproved=false) | `SellerProductResponse` body | `SellerProductResponse`       |
| PUT    | `/api/seller/products/update/{id}` | Cập nhật (kiểm tra ownership)       | `SellerProductResponse` body | `SellerProductResponse`       |
| DELETE | `/api/seller/products/delete/{id}` | Soft delete (kiểm tra ownership)    | —                            | `{message: ...}`              |
| GET    | `/api/seller/products/normal`      | Sản phẩm thường của seller          | JWT                          | `List<SellerProductResponse>` |
| GET    | `/api/seller/products/auction`     | Sản phẩm đấu giá của seller         | JWT                          | `List<SellerProductResponse>` |
| GET    | `/api/seller/products/sort`        | Sắp xếp sản phẩm seller             | `?sortBy=id&direction=asc`   | `List<SellerProductResponse>` |
| POST   | `/api/seller/products/upload`      | Upload ảnh Cloudinary               | `MultipartFile file`         | URL string                    |

### 3.4 Admin Products (`/api/admin/products`) — ADMIN only

| Method | Path                               | Chức năng                  | Input | Output                  |
| ------ | ---------------------------------- | -------------------------- | ----- | ----------------------- |
| GET    | `/api/admin/products`              | Tất cả sản phẩm (chưa xóa) | —     | `List<ProductResponse>` |
| GET    | `/api/admin/products/pending`      | Sản phẩm chờ duyệt         | —     | `List<ProductResponse>` |
| PUT    | `/api/admin/products/approve/{id}` | Duyệt sản phẩm             | —     | `{message, productId}`  |

### 3.5 Cart (`/api/cart`) — Authenticated

| Method | Path                            | Chức năng              | Input                                    | Output                                     |
| ------ | ------------------------------- | ---------------------- | ---------------------------------------- | ------------------------------------------ |
| POST   | `/api/cart/add`                 | Thêm sản phẩm vào giỏ  | `AddToCartRequest` (productId, quantity) | `{success, message}`                       |
| GET    | `/api/cart/count`               | Đếm số item trong giỏ  | JWT                                      | `{count: N}`                               |
| GET    | `/api/cart/getAll`              | Lấy danh sách giỏ hàng | JWT                                      | `List<CartItem>` (⚠️ trả entity trực tiếp) |
| PUT    | `/api/cart/update/{cartItemId}` | Cập nhật số lượng      | `?quantity=N`                            | `{message: ...}`                           |
| DELETE | `/api/cart/remove/{cartItemId}` | Xóa item khỏi giỏ      | —                                        | `{message: ...}`                           |

### 3.6 Orders (`/api/orders`) — Authenticated

| Method | Path                                    | Chức năng                  | Input                                                    | Output                             |
| ------ | --------------------------------------- | -------------------------- | -------------------------------------------------------- | ---------------------------------- |
| POST   | `/api/orders/checkout`                  | Đặt hàng                   | `CheckoutRequest` (receiver info, payment method, items) | `ApiResponse<OrderResponse>`       |
| POST   | `/api/orders/{orderId}/payment/confirm` | Xác nhận thanh toán (mock) | `?transactionId=xxx&success=true`                        | `ApiResponse<OrderResponse>`       |
| GET    | `/api/orders`                           | Lịch sử đơn hàng           | JWT                                                      | `ApiResponse<List<OrderResponse>>` |
| GET    | `/api/orders/{orderId}`                 | Chi tiết đơn hàng          | JWT                                                      | `ApiResponse<OrderResponse>`       |

### 3.7 Test (`/api`)

| Method | Path         | Chức năng                                                   |
| ------ | ------------ | ----------------------------------------------------------- |
| GET    | `/api/hello` | Test endpoint, trả `{message: "Hello Nextjs + SpringBoot"}` |

---

## 4. Business Logic Quan Trọng

### 4.1 Flow Đăng ký (Register)

1. Kiểm tra email tồn tại → throw `USER_ALREADY_EXISTS`
2. Tạo `User` với password mã hóa BCrypt
3. Gán role `USER` qua `UserRole`
4. **Lưu ý:** `username` được set bằng `request.getName()` (field `name` trong SignUpRequest)

### 4.2 Flow Đăng nhập (Login)

1. Authenticate bằng email + password qua `AuthenticationManager`
2. Sinh access token (TTL: 100000s ≈ 27.7h) và refresh token (TTL: 8640000s = 100 ngày)
3. Lưu refresh token JTI vào in-memory store
4. Trả token qua **HttpOnly cookies** (accessToken path="/", refreshToken path="/v1/auth/refresh")
5. Response body chỉ chứa `userId` và `username` (token đã comment out)

### 4.3 Flow Refresh Token

1. Decode refresh token từ cookie
2. Kiểm tra JTI có trong store và chưa hết hạn
3. **Revoke** refresh token cũ (xóa khỏi store) — token rotation
4. Sinh access token mới, set vào cookie
5. **⚠️ Không sinh refresh token mới** — sau khi revoke, refresh token cũ sẽ không dùng lại được nhưng cũng không có refresh mới

### 4.4 Flow Logout

1. Blacklist access token (lưu JTI + expiry vào blacklist map)
2. Revoke refresh token (xóa JTI khỏi store)
3. Clear cả 2 cookies (accessToken, refreshToken) bằng maxAge=0
4. **⚠️ Bug:** Trong block xử lý refresh token, gọi `jwtService.extractToken(accessToken)` thay vì `refreshToken`

### 4.5 Flow Checkout (Đặt hàng)

1. Tạo `Order` với thông tin shipping + payment method
2. Duyệt danh sách items, tra Product, tạo `OrderItem`, tính tổng tiền
3. Nếu **ONLINE payment**: tạo `Payment` record với `MOCK` gateway, trả `paymentUrl` (mock)
4. Nếu **COD**: trả order trực tiếp
5. **⚠️ Không kiểm tra stock quantity** trước khi đặt hàng
6. **⚠️ Không trừ stock** sau khi đặt

### 4.6 Flow Confirm Payment (Mock)

1. Tìm Order + Payment theo orderId
2. Nếu success: Payment → SUCCESS, Order → PAID + CONFIRMED
3. Nếu fail: Payment → FAILED, Order → CANCELLED

### 4.7 Product Approval Flow

1. Seller tạo sản phẩm → `isApproved = false`
2. Admin duyệt qua `/api/admin/products/approve/{id}` → `isApproved = true`
3. Public API chỉ trả sản phẩm `isApproved=true AND isDeleted=false`

### 4.8 Seed Data

- **RoleSeeder** (CommandLineRunner): Tạo 3 roles (USER, SELLER, ADMIN) nếu chưa có
- **DataSeeder** (CommandLineRunner): Nếu bảng product trống → tạo 50 seller accounts, đọc JSON files từ `resources/data/product/`, sinh giá ngẫu nhiên theo scale/marque, gán seller round-robin
- Giá sinh ngẫu nhiên: từ 250K–2M VND tùy scale (1:18, 1:24, 1:43, 1:64) + premium cho các brand (MiniGT, Tarmac, Kyosho...)
- 20% sản phẩm được đánh dấu `isAuction=true`

---

## 5. Tích Hợp Bên Ngoài

### 5.1 Database

- **MySQL** — `jdbc:mysql://localhost:3306/ecommerce`
- DDL: `spring.jpa.hibernate.ddl-auto=update` (auto-create/update schema)
- Dialect: `org.hibernate.dialect.MySQLDialect`
- Username: `root`, Password: (trống)

### 5.2 Cloudinary (Image Upload)

- Cloud: `dgeud4f7k`
- Upload vào folder `ecommerce/products`
- Trả về `secure_url`

### 5.3 Redis

- Dependency `spring-boot-starter-data-redis` có trong POM
- **Chưa cấu hình** — hiện dùng in-memory `ConcurrentHashMap` trong `TokenService`
- ⚠️ Token sẽ mất khi restart server

---

## 6. Cấu Hình & Môi Trường

### 6.1 application.properties

```properties
# App
spring.application.name=ecommerce

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.base64-secret=tybBIQtqJWNdlTayWJmWt6v5xOoYq4W6g/iBY6XZp+a...
jwt.access-token-expire=100000    # ~27.7 giờ
jwt.refresh-token-expire=8640000  # ~100 ngày

# Cloudinary
cloudinary.cloud-name=dgeud4f7k
cloudinary.api-key=691263515529563
cloudinary.api-secret=HyUOrsSCV5P3aXNc8G2PZTwhJms

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

### 6.2 Security Configuration

- **CORS**: Chỉ allow `http://localhost:3000` (credentials=true)
- **CSRF**: Disabled
- **Public endpoints**: `/v1/auth/**`, `/v1/products/**`, `/api/products/**`
- **ADMIN only**: `/v1/admin/**`
- **Tất cả endpoint khác**: Authenticated
- **Bearer token**: Đọc từ cookie `accessToken` (custom `BearerTokenResolver`)
- **JWT roles**: Prefix `ROLE_` tự động thêm bởi `JwtGrantedAuthoritiesConverter`

### 6.3 JWT Flow

- Algorithm: HS512
- Secret: Base64-encoded key từ `jwt.base64-secret`
- Claims: `sub` (userId), `scope` (list roles), `jwtId` (UUID), `iat`, `exp`
- Decoder tích hợp **blacklist check**: nếu `jwtId` bị blacklist → throw `JwtException`

---

## 7. Các Điểm Cần Lưu Ý

### 🔴 Bugs & Lỗi Logic

1. **Bug trong `AuthService.logout()`** (line 130): Khi xử lý refresh token, gọi `jwtService.extractToken(accessToken)` thay vì `jwtService.extractToken(refreshToken)`. Điều này khiến refresh token không bị revoke đúng cách.

2. **Refresh flow thiếu token mới**: `refreshAccessToken()` revoke refresh token cũ nhưng không sinh refresh token mới. Sau 1 lần refresh, user sẽ không thể refresh tiếp → phải login lại.

3. **`/api/products/**`cho phép`@CrossOrigin(origins = "\*")`** trong khi SecurityConfig chỉ allow `localhost:3000` → conflict CORS policy.

### 🟡 Security Concerns

4. **Secrets hardcoded** trong `application.properties`: JWT secret, Cloudinary API key/secret, DB credentials → nên dùng environment variables.

5. **`/api/products/create`, `/api/products/update-product/{id}`, `/api/products/delete-product/{id}`** — các endpoint CUD trên `ProductController` **không kiểm tra authentication/authorization**. Bất kỳ ai cũng có thể tạo/sửa/xóa sản phẩm qua route này (dù SecurityConfig yêu cầu auth cho `anyRequest`, nhưng `/api/products/**` được `permitAll()`).

6. **Token storage in-memory**: Mọi refresh token và blacklist sẽ mất khi restart server → user phải login lại, và access token đã logout sẽ trở lại hợp lệ.

7. **Admin endpoint mismatch**: SecurityConfig bảo vệ `/v1/admin/**` nhưng AdminProductController mount tại `/api/admin/products` → **không được bảo vệ bởi hasRole("ADMIN")**, chỉ cần authenticated là truy cập được.

### 🟡 Code Quality

8. **Typo package name**: `dto.requesy` thay vì `dto.request` — chứa `AddToCartRequest` và `ProductJson`.

9. **Dùng `ProductResponse` làm cả request body** cho create/update product (ProductController) — nên tách riêng request DTO.

10. **Cart API trả entity trực tiếp** (`List<CartItem>`) thay vì dùng DTO → có thể leak thông tin không mong muốn và gây circular reference JSON.

11. **Code duplication**: `toProductResponse()` method bị duplicate giữa `ProductController`, `AdminProductController`, và `SellerProductController`. MapStruct mapper đã chuẩn bị (dependency + package) nhưng chưa implement.

12. **Inconsistent principal extraction**: Một số controller dùng `@AuthenticationPrincipal Jwt jwt`, số khác dùng `Authentication authentication` + cast, số khác dùng `SecurityContextHolder` trực tiếp. Nên thống nhất.

13. **SellerProductController.getNormalProducts()** và `getAuctionProducts()` cast principal thành `User` thay vì `Jwt` → sẽ throw `ClassCastException` vì OAuth2 Resource Server trả về `Jwt` principal.

14. **Checkout flow không kiểm tra/trừ stock**: Có thể đặt hàng vượt quá `stockQuantity`.

15. **GlobalExceptionHandler**: `BadCredentialsException` trả status `INTERNAL_SERVER_ERROR` (500) thay vì 401 Unauthorized — nên dùng `ErrorCode.BAD_CREDENTIALS.getStatus()`.

### 🟢 Ghi chú khác

16. **Soft delete**: Product sử dụng `isDeleted` flag, không xóa hard.
17. **Payment hiện tại là MOCK**: Gateway chỉ hỗ trợ `MOCK`, enum đã khai báo `VNPAY/MOMO` nhưng chưa tích hợp.
18. **Seed data**: Tự động chạy khi product table trống, tạo ~N products từ JSON files với 50 seller accounts.
19. **`CheckoutRequest`** đặt trong package `dto.request.auth` — không hợp lý, nên chuyển ra package riêng.
