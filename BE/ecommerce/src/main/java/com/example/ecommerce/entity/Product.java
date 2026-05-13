package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;

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
    private String status;
    private Boolean isAuction;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(nullable = false)
    private Boolean isApproved = false;
}
