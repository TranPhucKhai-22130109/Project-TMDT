package com.example.ecommerce.dto.request.auth;

import com.example.ecommerce.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {

    @NotBlank(message = "Receiver name is required")
    private String receiverName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid phone number")
    private String receiverPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String city;

    private String note;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private Boolean auctionCheckout;

    @NotEmpty(message = "Order must have at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {

        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}
