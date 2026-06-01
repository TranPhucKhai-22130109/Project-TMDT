package com.example.ecommerce.repository;

import com.example.ecommerce.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Tìm danh sách tất cả các món hàng trong giỏ của 1 User
    List<CartItem> findByUserId(String userId);

    // Xóa toàn bộ sản phẩm trong giỏ hàng sau khi User bấm đặt hàng (checkout) thành công
    void deleteByUserId(String userId);
}