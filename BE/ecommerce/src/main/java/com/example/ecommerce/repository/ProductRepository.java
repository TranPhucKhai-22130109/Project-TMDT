package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsDeletedFalseAndIsApprovedTrue();

    List<Product> findByIsAuctionAndIsDeletedFalseAndIsApprovedTrue(Boolean isAuction);

    List<Product> findByIsAuctionTrueAndStatusInAndIsApprovedTrueAndIsDeletedFalse(List<ProductStatus> statuses);

    List<Product> findByIsAuctionTrueAndStatusAndAuctionPaidFalseAndIsApprovedTrueAndIsDeletedFalse(ProductStatus status);

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

    @Query("""
    SELECT p
    FROM Product p
    WHERE LOWER(p.name)
          LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Product> searchSuggestions(
            @Param("keyword") String keyword,
            Pageable pageable
    );

}
