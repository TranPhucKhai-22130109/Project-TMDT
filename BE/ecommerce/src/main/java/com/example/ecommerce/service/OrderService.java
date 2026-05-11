package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.CheckoutRequest;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.PaymentRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse checkout(String userId, CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Build order items & calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .city(request.getCity())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.UNPAID)
                .totalAmount(0.0)
                .build();

        Order savedOrder = orderRepository.save(order);

        for (CheckoutRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            OrderItem item = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            orderItems.add(item);
            totalAmount += product.getPrice() * itemReq.getQuantity();
        }

        savedOrder.getItems().addAll(orderItems);
        savedOrder.setTotalAmount(totalAmount);

        // For ONLINE payment: create payment record and mock URL
        if (request.getPaymentMethod() == Order.PaymentMethod.ONLINE) {
            savedOrder = orderRepository.save(savedOrder);

            Payment payment = Payment.builder()
                    .order(savedOrder)
                    .amount(totalAmount)
                    .gateway(Payment.PaymentGateway.MOCK)
                    .transactionId(UUID.randomUUID().toString())
                    .result(Payment.PaymentResult.PENDING)
                    .build();

            paymentRepository.save(payment);

            OrderResponse response = OrderResponse.from(savedOrder);
            // Mock payment URL — replace with real VNPay/MoMo URL in production
            response.setPaymentUrl("/payment/process?orderId=" + savedOrder.getId()
                    + "&txnId=" + payment.getTransactionId()
                    + "&amount=" + (long) totalAmount);
            return response;
        }

        savedOrder = orderRepository.save(savedOrder);
        return OrderResponse.from(savedOrder);
    }

    /**
     * Simulate payment confirmation (mock gateway callback).
     * In production, this would be called by VNPay/MoMo webhook.
     */
    @Transactional
    public OrderResponse confirmPayment(String orderId, String transactionId, boolean success) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (success) {
            payment.setResult(Payment.PaymentResult.SUCCESS);
            payment.setPaidAt(Instant.now());
            order.setPaymentStatus(Order.PaymentStatus.PAID);
            order.setStatus(Order.OrderStatus.CONFIRMED);
        } else {
            payment.setResult(Payment.PaymentResult.FAILED);
            order.setStatus(Order.OrderStatus.CANCELLED);
        }

        paymentRepository.save(payment);
        Order updatedOrder = orderRepository.save(order);
        return OrderResponse.from(updatedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory(String userId) {
        return orderRepository.findByUserIdWithItems(userId)
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(String userId, String orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Security: ensure order belongs to requesting user
        if (!order.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return OrderResponse.from(order);
    }
}