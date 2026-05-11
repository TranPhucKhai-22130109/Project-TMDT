package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByUserIdOrderByCreatedAtDesc(String userId);

    Page<Order> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.items i JOIN FETCH i.product WHERE o.id = :orderId")
    Optional<Order> findByIdWithItems(String orderId);

    @Query("SELECT o FROM Order o JOIN FETCH o.items i JOIN FETCH i.product WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdWithItems(String userId);
}