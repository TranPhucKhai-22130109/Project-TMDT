package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.auth.CheckoutRequest;
import com.example.ecommerce.entity.AuctionBid;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentMethod;
import com.example.ecommerce.enums.PaymentStatus;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.AuctionBidRepository;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.PaymentRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final VNPayService vnPayService;

    @Transactional
    public OrderResponse checkout(String userId, CheckoutRequest request, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = Order.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .city(request.getCity())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .totalAmount(0.0)
                .items(new ArrayList<>()) // BẢO VỆ KHỎI LỖI NULL TẠI ĐÂY
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        for (CheckoutRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            double unitPrice = resolveCheckoutUnitPrice(product, user.getId(), itemReq.getQuantity());

            OrderItem item = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .build();

            orderItems.add(item);
            totalAmount += unitPrice * itemReq.getQuantity();
        }

        double shippingFee = 50000.0;
        totalAmount += shippingFee;
        // ========================================================

        // Chắc chắn 100% không bao giờ bị NPE nữa
        if (savedOrder.getItems() == null) {
            savedOrder.setItems(new ArrayList<>());
        }
        savedOrder.getItems().addAll(orderItems);
        savedOrder.setTotalAmount(totalAmount);

        savedOrder = orderRepository.save(savedOrder);

        OrderResponse response = OrderResponse.from(savedOrder);

        // Thanh toán Online → tạo URL VNPay thật
        if (request.getPaymentMethod() == PaymentMethod.ONLINE) {
            String paymentUrl = vnPayService.createPaymentUrl(savedOrder.getId(), ipAddress);
            response.setPaymentUrl(paymentUrl);
        }

        return response;
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

        if (!order.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        return OrderResponse.from(order);
    }

    private double resolveCheckoutUnitPrice(Product product, String userId, Integer quantity) {
        if (!Boolean.TRUE.equals(product.getIsAuction())) {
            return product.getPrice();
        }

        validateAuctionCheckout(product, userId, quantity);

        return product.getCurrentPrice().doubleValue();
    }

    private void validateAuctionCheckout(Product product, String userId, Integer quantity) {
        if (quantity == null || quantity != 1) {
            throw new AppException(ErrorCode.INVALID_AUCTION_QUANTITY);
        }

        if (Boolean.TRUE.equals(product.getAuctionPaid())) {
            throw new AppException(ErrorCode.AUCTION_ALREADY_PAID);
        }

        if (product.getStatus() == ProductStatus.OPEN
                && product.getAuctionEndTime() != null
                && !LocalDateTime.now().isBefore(product.getAuctionEndTime())) {
            product.setStatus(ProductStatus.ENDED);
            productRepository.save(product);
        }

        if (product.getStatus() != ProductStatus.ENDED) {
            throw new AppException(ErrorCode.AUCTION_NOT_ENDED);
        }

        AuctionBid winningBid = auctionBidRepository
                .findTopByProductIdOrderByAmountDescCreatedAtDesc(product.getId())
                .orElseThrow(() -> new AppException(ErrorCode.AUCTION_HAS_NO_BID));

        if (!winningBid.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.AUCTION_NOT_WINNER);
        }

        if (product.getCurrentPrice() == null) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        product.setAuctionPaid(true);
        productRepository.save(product);
    }
}
