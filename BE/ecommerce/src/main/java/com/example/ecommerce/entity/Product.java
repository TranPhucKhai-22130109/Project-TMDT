package com.example.ecommerce.entity;

import com.example.ecommerce.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private Double price;
    private Integer soldQuantity;
    private Integer stockQuantity;

    private String imageUrl; // ảnh chính

    @Column(columnDefinition = "TEXT")
    private String images; // lưu JSON string list ảnh

    private String itemNo;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String scale;
    private String marque;
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    private Boolean isAuction;
    private BigDecimal auctionStartPrice;
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private BigDecimal currentPrice;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(nullable = false)
    private Boolean isApproved = false;
}
