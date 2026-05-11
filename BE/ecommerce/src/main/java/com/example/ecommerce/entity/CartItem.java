package com.example.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
public class CartItem {
    @Id
    @GeneratedValue
    private Long id;

    private String userId;

    @ManyToOne
    private Product product;

    private Integer quantity;
}