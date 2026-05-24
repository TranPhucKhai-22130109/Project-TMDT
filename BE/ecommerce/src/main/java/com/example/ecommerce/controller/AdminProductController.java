package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminProductController {

        private final ProductRepository productRepository;
        private final ObjectMapper objectMapper;

        @GetMapping
        public List<ProductResponse> getAllProducts() {
                return productRepository.findByIsDeletedFalse()
                                .stream()
                                .map(this::toProductResponse)
                                .toList();
        }

        @GetMapping("/pending")
        public List<ProductResponse> getPendingProducts() {
                return productRepository
                                .findByIsDeletedFalseAndIsApprovedFalse()
                                .stream()
                                .map(this::toProductResponse)
                                .toList();
        }

        @PutMapping("/approve/{id}")
        public Map<String, Object> approveProduct(@PathVariable Long id) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                product.setIsApproved(true);
                Product saved = productRepository.save(product);

                return Map.of(
                                "message", "Approve product successfully",
                                "productId", saved.getId());
        }

        private ProductResponse toProductResponse(Product product) {

                List<String> images = new ArrayList<>();

                try {

                        if (product.getImages() != null) {

                                images = objectMapper.readValue(
                                                product.getImages(),
                                                new TypeReference<List<String>>() {
                                                });
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
                                Boolean.TRUE.equals(product.getAuctionPaid()));
        }
}
