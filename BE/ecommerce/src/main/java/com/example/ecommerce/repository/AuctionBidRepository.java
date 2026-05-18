package com.example.ecommerce.repository;

import com.example.ecommerce.entity.AuctionBid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuctionBidRepository extends JpaRepository<AuctionBid, Long> {

    List<AuctionBid> findByProductId(Long productId);

    List<AuctionBid> findByProductIdOrderByCreatedAtDesc(Long productId);

    Optional<AuctionBid> findTopByProductIdOrderByAmountDescCreatedAtDesc(Long productId);

    List<AuctionBid> findByProductIdAndUserId(Long productId, String userId);
}
