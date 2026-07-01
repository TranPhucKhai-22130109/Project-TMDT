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
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.OrderRepository;
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
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public OrderResponse checkout(String userId, CheckoutRequest request) {
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
                .items(new ArrayList<>())
                .build();

        double totalAmount = 0;

        for (CheckoutRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            double price = product.getPrice() != null ? product.getPrice() : 0.0;

            if (product.getIsAuction() != null && product.getIsAuction()) {
                price = validateAndGetAuctionPrice(product, userId, itemRequest.getQuantity());
            } else {
                if (product.getStockQuantity() != null && product.getStockQuantity() < itemRequest.getQuantity()) {
                    throw new AppException(ErrorCode.VALIDATION_ERROR);
                }
                product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
                productRepository.save(product);
            }

            double subtotal = price * itemRequest.getQuantity();
            totalAmount += subtotal;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(price)
                    .build();

            order.getItems().add(orderItem);
        }

        double shippingFee = 50000.0;
        order.setTotalAmount(totalAmount + shippingFee);
        // ------------------------------------------------------------------

        Order savedOrder = orderRepository.save(order);
        if (!Boolean.TRUE.equals(request.getAuctionCheckout())) {
            try {
                cartItemRepository.deleteByUserId(userId);
            } catch (Exception e) {
                System.err.println("Lỗi khi xóa giỏ hàng sau checkout: " + e.getMessage());
            }
        }

        return OrderResponse.from(savedOrder);
    }

    private double validateAndGetAuctionPrice(Product product, String userId, Integer quantity) {
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

        return product.getCurrentPrice().doubleValue();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(String userId, String orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory(String userId) {
        List<Order> orders = orderRepository.findByUserIdWithItems(userId);
        return orders.stream().map(OrderResponse::from).toList();
    }
    @Transactional
    public OrderResponse cancelOrder(String userId, String orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        // Hoàn lại stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product.getStockQuantity() != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        return OrderResponse.from(orderRepository.save(order));
    }
}
