package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentGateway gateway = PaymentGateway.MOCK;

    // Transaction ID from payment gateway
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentResult result = PaymentResult.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant paidAt;

    public enum PaymentGateway {
        MOCK, VNPAY, MOMO
    }

    public enum PaymentResult {
        PENDING, SUCCESS, FAILED, CANCELLED
    }
}