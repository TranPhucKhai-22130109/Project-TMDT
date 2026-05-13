package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsDeletedFalseAndIsApprovedTrue();

    List<Product> findByIsAuctionAndIsDeletedFalseAndIsApprovedTrue(Boolean isAuction);

    List<Product> findByIsDeletedFalseAndIsApprovedTrue(Sort sort);

    List<Product> findBySellerIdAndIsDeletedFalse(String sellerId);

    List<Product> findByIsDeletedFalseAndIsApprovedFalse();

    List<Product> findBySellerIdAndIsAuctionAndIsDeletedFalse(
            String sellerId,
            Boolean isAuction
    );

    List<Product> findBySellerIdAndIsDeletedFalse(
            String sellerId,
            Sort sort
    );

    List<Product> findByIsDeletedFalse();

}