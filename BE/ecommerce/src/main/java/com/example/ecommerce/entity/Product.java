package com.example.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String imageUrl; // ảnh chính

    @Column(columnDefinition = "TEXT")
    private String images; // lưu JSON string list ảnh

    private String itemNo;
    private String description;
    private String scale;
    private String marque;
    private String status;
}
