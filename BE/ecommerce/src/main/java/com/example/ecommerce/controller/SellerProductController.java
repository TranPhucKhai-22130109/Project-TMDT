package com.example.ecommerce.controller;

import com.cloudinary.Cloudinary;
import com.example.ecommerce.dto.response.SellerProductResponse;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class SellerProductController {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final Cloudinary cloudinary;
    private final UserRepository userRepository;

    @GetMapping("/getAll")
    public List<SellerProductResponse> getMyProducts() {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String sellerId = jwt.getSubject();

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return productRepository.findBySellerIdAndIsDeletedFalse(seller.getId())
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @PostMapping("/create")
    public SellerProductResponse createProduct(@RequestBody SellerProductResponse request) {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String id = jwt.getSubject();

        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = new Product();

        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setItemNo(request.getItemNo());
        product.setScale(request.getScale());
        product.setMarque(request.getMarque());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        product.setSoldQuantity(0);
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setIsAuction(request.getIsAuction() != null ? request.getIsAuction() : false);
        product.setAuctionStartPrice(request.getAuctionStartPrice());
        product.setAuctionStartTime(request.getAuctionStartTime());
        product.setAuctionEndTime(request.getAuctionEndTime());
        product.setCurrentPrice(request.getCurrentPrice());

        product.setSeller(seller);
        product.setIsApproved(false);
        product.setIsDeleted(false);
        product.setAuctionPaid(false);

        try {
            product.setImages(objectMapper.writeValueAsString(
                    request.getImages() != null ? request.getImages() : List.of()
            ));
        } catch (Exception e) {
            product.setImages("[]");
        }

        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }

    @PutMapping("/update/{id}")
    public SellerProductResponse updateProduct(
            @PathVariable Long id,
            @RequestBody SellerProductResponse request
    ) {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String idt = jwt.getSubject();

        User seller = userRepository.findById(idt)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You cannot update this product");
        }

        product.setName(request.getName());
        product.setImageUrl(request.getImageUrl());
        product.setItemNo(request.getItemNo());
        product.setScale(request.getScale());
        product.setMarque(request.getMarque());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
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

    @DeleteMapping("/delete/{id}")
    public Map<String, String> deleteProduct(@PathVariable Long id) {
        Jwt jwt = (Jwt) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String idt = jwt.getSubject();

        User seller = userRepository.findById(idt)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You cannot delete this product");
        }

        product.setIsDeleted(true);
        productRepository.save(product);

        return Map.of("message", "Delete product successfully");
    }

    private SellerProductResponse toProductResponse(Product product) {
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

        return new SellerProductResponse(
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
                product.getIsDeleted(),
                product.getSeller() != null
                        ? product.getSeller().getId()
                        : null,

                product.getSeller() != null
                        ? product.getSeller().getUsername()
                        : null,

                product.getSeller() != null
                        ? product.getSeller().getEmail()
                        : null,
                product.getSeller() != null
                        ? product.getSeller().getPhoneNumber()
                        : null,

                product.getSeller() != null
                        ? product.getSeller().getAvatarUrl()
                        : null,
                product.getIsApproved(),
                product.getAuctionStartPrice(),
                product.getAuctionStartTime(),
                product.getAuctionEndTime(),
                product.getCurrentPrice(),
                Boolean.TRUE.equals(product.getAuctionPaid())
        );
    }

    @GetMapping("/normal")
    public List<SellerProductResponse> getNormalProducts() {

        User seller = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return productRepository
                .findBySellerIdAndIsAuctionAndIsDeletedFalse(
                        seller.getId(),
                        false
                )
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @GetMapping("/auction")
    public List<SellerProductResponse> getAuctionProducts() {

        User seller = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return productRepository
                .findBySellerIdAndIsAuctionAndIsDeletedFalse(
                        seller.getId(),
                        true
                )
                .stream()
                .map(this::toProductResponse)
                .toList();
    }

    @GetMapping("/sort")
    public List<SellerProductResponse> getSortedProducts(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        User seller = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return productRepository
                .findBySellerIdAndIsDeletedFalse(
                        seller.getId(),
                        sort
                )
                .stream()
                .map(this::toProductResponse)
                .toList();
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

            throw new RuntimeException(
                    "Upload Cloudinary failed: " + e.getMessage()
            );
        }
    }
}
