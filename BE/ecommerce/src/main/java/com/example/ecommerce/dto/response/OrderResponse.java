package com.example.ecommerce.dto.response;

import com.example.ecommerce.entity.Order;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {

    private String id;
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String city;
    private String note;
    private Instant createdAt;
    private List<OrderItemResponse> items;

    // Payment link (for online payment)
    private String paymentUrl;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private String productImageUrl;
        private Integer quantity;
        private Double unitPrice;
        private Double subtotal;
    }

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .city(order.getCity())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .productId(item.getProduct().getId())
                                .productName(item.getProduct().getName())
                                .productImageUrl(item.getProduct().getImageUrl())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .subtotal(item.getSubtotal())
                                .build())
                        .toList())
                .build();
    }
}