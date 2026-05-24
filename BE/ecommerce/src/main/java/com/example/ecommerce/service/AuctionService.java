package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.auction.PlaceBidRequest;
import com.example.ecommerce.dto.response.AuctionWinnerResponse;
import com.example.ecommerce.dto.response.BidResponse;
import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.AuctionBid;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.enums.ProductStatus;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.AuctionBidRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final ProductRepository productRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional(noRollbackFor = AppException.class)
    public BidResponse placeBid(PlaceBidRequest request, String userId) {
        validatePlaceBidRequest(request, userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        validateBiddableProduct(product);
        ensureAuctionNotEnded(product);

        BigDecimal currentPrice = resolveCurrentPrice(product);
        BigDecimal newPrice = currentPrice.add(request.getAmount());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AuctionBid bid = new AuctionBid();
        bid.setProduct(product);
        bid.setUser(user);
        bid.setAmount(newPrice);

        product.setCurrentPrice(newPrice);
        productRepository.save(product);

        return toBidResponse(auctionBidRepository.save(bid));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAuctionProducts() {
        return productRepository.findByIsAuctionTrueAndStatusInAndIsApprovedTrueAndIsDeletedFalse(
                        List.of(ProductStatus.SCHEDULED, ProductStatus.OPEN)
                )
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidHistory(Long productId) {
        return auctionBidRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toBidResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BidResponse getCurrentHighestBid(Long productId) {
        return auctionBidRepository.findTopByProductIdOrderByAmountDescCreatedAtDesc(productId)
                .map(this::toBidResponse)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public AuctionWinnerResponse getAuctionWinner(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (product.getStatus() != ProductStatus.ENDED) {
            return null;
        }

        return auctionBidRepository.findTopByProductIdOrderByAmountDescCreatedAtDesc(productId)
                .map(bid -> new AuctionWinnerResponse(
                        product.getId(),
                        bid.getUser().getId(),
                        bid.getUser().getUsername(),
                        bid.getAmount(),
                        true
                ))
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getMyWonAuctions(String userId) {
        return productRepository
                .findByIsAuctionTrueAndStatusAndAuctionPaidFalseAndIsApprovedTrueAndIsDeletedFalse(ProductStatus.ENDED)
                .stream()
                .filter(product -> isWinner(product, userId))
                .map(this::toProductResponse)
                .toList();
    }

    private boolean isWinner(Product product, String userId) {
        return auctionBidRepository.findTopByProductIdOrderByAmountDescCreatedAtDesc(product.getId())
                .map(bid -> bid.getUser().getId().equals(userId))
                .orElse(false);
    }

    private void validatePlaceBidRequest(PlaceBidRequest request, String userId) {
        if (request == null
                || request.getProductId() == null
                || request.getAmount() == null
                || request.getAmount().compareTo(BigDecimal.ZERO) <= 0
                || userId == null
                || userId.isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private void validateBiddableProduct(Product product) {
        if (!Boolean.TRUE.equals(product.getIsAuction())
                || !Boolean.TRUE.equals(product.getIsApproved())
                || Boolean.TRUE.equals(product.getIsDeleted())
                || product.getStatus() != ProductStatus.OPEN) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private void ensureAuctionNotEnded(Product product) {
        if (product.getAuctionEndTime() == null) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        if (!LocalDateTime.now().isBefore(product.getAuctionEndTime())) {
            product.setStatus(ProductStatus.ENDED);
            productRepository.save(product);
            throw new AppException(ErrorCode.AUCTION_ENDED);
        }
    }

    private BigDecimal resolveCurrentPrice(Product product) {
        if (product.getCurrentPrice() != null) {
            return product.getCurrentPrice();
        }

        if (product.getAuctionStartPrice() != null) {
            return product.getAuctionStartPrice();
        }

        if (product.getPrice() != null) {
            return BigDecimal.valueOf(product.getPrice());
        }

        return BigDecimal.ZERO;
    }

    private ProductResponse toProductResponse(Product product) {
        List<String> images = new ArrayList<>();

        try {
            if (product.getImages() != null) {
                images = objectMapper.readValue(
                        product.getImages(),
                        new TypeReference<List<String>>() {}
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getImageUrl(),
                images,
                product.getItemNo(),
                product.getScale(),
                product.getMarque(),
                product.getStatus(),
                product.getDescription(),
                product.getPrice(),
                product.getSoldQuantity(),
                product.getStockQuantity(),
                product.getIsAuction(),
                product.getSeller() != null
                        ? product.getSeller().getId()
                        : null,
                product.getSeller() != null
                        ? product.getSeller().getUsername()
                        : null,
                product.getSeller() != null
                        ? product.getSeller().getEmail()
                        : null,
                product.getIsApproved(),
                product.getIsDeleted(),
                product.getAuctionStartPrice(),
                product.getAuctionStartTime(),
                product.getAuctionEndTime(),
                product.getCurrentPrice(),
                Boolean.TRUE.equals(product.getAuctionPaid())
        );
    }

    private BidResponse toBidResponse(AuctionBid bid) {
        return new BidResponse(
                bid.getId(),
                bid.getProduct().getId(),
                bid.getAmount(),
                bid.getUser().getUsername(),
                bid.getCreatedAt()
        );
    }
}
