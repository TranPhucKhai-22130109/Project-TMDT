package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.CheckoutRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders/checkout
     * Đặt hàng + chọn phương thức thanh toán (COD hoặc ONLINE)
     * Requires: Bearer token (accessToken cookie)
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CheckoutRequest request
    ) {
        String userId = jwt.getSubject();
        OrderResponse order = orderService.checkout(userId, request);

        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .code("ORDER_CREATED")
                .message("Order placed successfully")
                .data(order)
                .build());
    }

    /**
     * POST /api/orders/{orderId}/payment/confirm?success=true
     * Mock payment gateway callback — simulates VNPay/MoMo returning result.
     * In production, replace with real webhook from payment provider.
     */
    @PostMapping("/{orderId}/payment/confirm")
    public ResponseEntity<ApiResponse<OrderResponse>> confirmPayment(
            @PathVariable String orderId,
            @RequestParam String transactionId,
            @RequestParam(defaultValue = "true") boolean success
    ) {
        OrderResponse order = orderService.confirmPayment(orderId, transactionId, success);

        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .code("PAYMENT_" + (success ? "SUCCESS" : "FAILED"))
                .message(success ? "Payment confirmed" : "Payment failed")
                .data(order)
                .build());
    }

    /**
     * GET /api/orders
     * Lịch sử mua hàng của user hiện tại
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrderHistory(
            @AuthenticationPrincipal Jwt jwt
    ) {
        String userId = jwt.getSubject();
        List<OrderResponse> orders = orderService.getOrderHistory(userId);

        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .code("ORDER_HISTORY")
                .message("Order history retrieved")
                .data(orders)
                .build());
    }

    /**
     * GET /api/orders/{orderId}
     * Chi tiết một đơn hàng
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderDetail(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String orderId
    ) {
        String userId = jwt.getSubject();
        OrderResponse order = orderService.getOrderDetail(userId, orderId);

        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .code("ORDER_DETAIL")
                .message("Order detail retrieved")
                .data(order)
                .build());
    }
}