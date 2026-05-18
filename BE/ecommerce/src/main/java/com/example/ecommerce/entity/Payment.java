package com.example.ecommerce.entity;

import com.example.ecommerce.enums.PaymentGateway;
import com.example.ecommerce.enums.PaymentResult;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

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
    private PaymentGateway gateway = PaymentGateway.VNPAY;

    // Mã txnRef gửi sang VNPay
    private String transactionId;

    // Mã giao dịch VNPay trả về sau khi thành công
    private String gatewayTransactionNo;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentResult result = PaymentResult.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant paidAt;
}