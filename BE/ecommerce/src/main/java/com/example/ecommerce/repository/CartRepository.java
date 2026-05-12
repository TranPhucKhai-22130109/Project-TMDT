package com.example.ecommerce.repository;

import com.example.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByUserIdAndProductId(String userId, Long productId);

    int countByUserId(String userId);

    List<CartItem> findByUserId(String userId);

    Optional<CartItem> findByIdAndUserId(Long id, String userId);

    void deleteByIdAndUserId(Long id, Long userId);

}