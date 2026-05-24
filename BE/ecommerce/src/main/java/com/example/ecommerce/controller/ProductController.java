package com.example.ecommerce.controller;

import com.cloudinary.Cloudinary;
import org.springframework.data.domain.Sort;

import com.example.ecommerce.dto.response.ProductResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final Cloudinary cloudinary;

    @GetMapping
    public List<ProductResponse> getAllProducts() {

        return productRepository.findByIsDeletedFalseAndIsApprovedTrue()
                .stream()
                .map(product -> {

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
                })
                .toList();
    }
    @GetMapping("/normal")
    public List<ProductResponse> getAllNormalProducts() {
        return productRepository.findByIsAuctionAndIsDeletedFalseAndIsApprovedTrue(false)
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @GetMapping("/auction")
    public List<ProductResponse> getAllAuctionProducts() {
        return productRepository.findByIsAuctionAndIsDeletedFalseAndIsApprovedTrue(true)
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @GetMapping("/sort")
    public List<ProductResponse> getSortedProducts(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return productRepository.findByIsDeletedFalseAndIsApprovedTrue(sort)
                .stream()
                .map(product -> {
                    List<String> images = new ArrayList<>();
                    try {
                        if (product.getImages() != null) {
                            images = objectMapper.readValue(
                                    product.getImages(),
                                    new TypeReference<List<String>>() {}
                            );
                        }
                    } catch (Exception e) { e.printStackTrace(); }

                    return new ProductResponse(
                            product.getId(), product.getName(), product.getImageUrl(),
                            images, product.getItemNo(), product.getScale(),
                            product.getMarque(), product.getStatus(),
                            product.getDescription(), product.getPrice(), product.getSoldQuantity(),  product.getStockQuantity(), product.getIsAuction(),product.getSeller() != null
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
                })
                .toList();
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
    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", "ecommerce/products")
            );

            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload Cloudinary failed: " + e.getMessage());
        }
    }

    @PutMapping("/update-product/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @RequestBody ProductResponse request
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setItemNo(request.getItemNo());
        product.setScale(request.getScale());
        product.setMarque(request.getMarque());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSoldQuantity(request.getSoldQuantity());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsAuction(request.getIsAuction());
        product.setAuctionStartPrice(request.getAuctionStartPrice());
        product.setAuctionStartTime(request.getAuctionStartTime());
        product.setAuctionEndTime(request.getAuctionEndTime());
        product.setCurrentPrice(request.getCurrentPrice());

        try {
            product.setImages(objectMapper.writeValueAsString(request.getImages()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        Product saved = productRepository.save(product);

        return toProductResponse(saved);
    }
    @PostMapping("/create")
    public ProductResponse createProduct(@RequestBody ProductResponse request) {
        Product product = new Product();

        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setItemNo(request.getItemNo());
        product.setScale(request.getScale());
        product.setMarque(request.getMarque());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSoldQuantity(request.getSoldQuantity());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsAuction(request.getIsAuction());
        product.setIsDeleted(false);
        product.setAuctionPaid(false);
        product.setAuctionStartPrice(request.getAuctionStartPrice());
        product.setAuctionStartTime(request.getAuctionStartTime());
        product.setAuctionEndTime(request.getAuctionEndTime());
        product.setCurrentPrice(request.getCurrentPrice());

        try {
            product.setImages(objectMapper.writeValueAsString(request.getImages()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        Product saved = productRepository.save(product);

        return toProductResponse(saved);
    }
    @DeleteMapping("/delete-product/{id}")
    public Map<String, String> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setIsDeleted(true);
        productRepository.save(product);

        return Map.of("message", "Delete product successfully");
    }
}
