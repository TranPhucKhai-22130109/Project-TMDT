package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.auth.CheckoutRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/v1/orders") // ĐƯỜNG DẪN NÀY ĐÃ KHỚP 100% VỚI REACT
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            Principal principal,
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {

        // 1. Lấy ID của user đang đăng nhập từ Token (JWT)
        String userId = principal.getName();

        // 2. Lấy IP của máy khách (Dùng cho VNPay)
        String ipAddress = httpRequest.getRemoteAddr();

        // 3. Gọi Service xử lý đặt hàng (Đã được fix lỗi Null lúc nãy)
        OrderResponse response = orderService.checkout(userId, request, ipAddress);

        // 4. Trả kết quả về cho React
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .code("CHECKOUT_SUCCESS")
                .message("Đặt hàng thành công")
                .data(response)
                .build());
    }

    // Viết thêm API lấy lịch sử đơn hàng của User luôn cho đủ bộ
    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(Principal principal) {
        return ResponseEntity.ok(ApiResponse.builder()
                .success(true)
                .message("Lấy lịch sử đơn hàng thành công")
                .data(orderService.getOrderHistory(principal.getName()))
                .build());
    }
}