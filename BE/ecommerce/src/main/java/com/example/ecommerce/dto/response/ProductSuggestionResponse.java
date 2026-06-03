package com.example.ecommerce.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductSuggestionResponse {

    private Long id;
    private String name;
    private String imageUrl;
    private Double price;

    public ProductSuggestionResponse() {
    }

    public ProductSuggestionResponse(
            Long id,
            String name,
            String imageUrl,
            Double price
    ) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
    }
}
