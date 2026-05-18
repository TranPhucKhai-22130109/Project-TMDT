package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true).code("ORDERS_FETCHED").message("Orders fetched")
                .data(adminOrderService.getAllOrders(status))
                .build());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminOrderService.OrderStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.<AdminOrderService.OrderStats>builder()
                .success(true).code("STATS_FETCHED").message("Stats fetched")
                .data(adminOrderService.getStats())
                .build());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderDetail(
            @PathVariable String orderId
    ) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true).code("ORDER_DETAIL").message("Order detail fetched")
                .data(adminOrderService.getOrderDetail(orderId))
                .build());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true).code("ORDER_STATUS_UPDATED")
                .message("Order status updated to " + status)
                .data(adminOrderService.updateOrderStatus(orderId, status))
                .build());
    }
}