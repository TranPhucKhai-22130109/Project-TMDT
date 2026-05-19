package com.example.ecommerce.repository;

import com.example.ecommerce.entity.ProductComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCommentRepository extends JpaRepository<ProductComment, Long> {

    List<ProductComment> findByProductIdAndIsDeletedFalseOrderByCreatedAtDesc(Long productId);

}