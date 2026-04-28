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

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @GetMapping
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
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
                            product.getDescription()
                    );
                })
                .toList();
    }
}