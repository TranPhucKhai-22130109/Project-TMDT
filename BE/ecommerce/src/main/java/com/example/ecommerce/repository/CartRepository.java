package com.example.ecommerce.repository;

import com.example.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByUserIdAndProductId(String userId, Long productId);

    List<CartItem> findByUserId(String userId);

    int countByUserId(String userId);
}