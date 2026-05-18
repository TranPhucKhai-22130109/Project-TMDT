package com.example.ecommerce.dto.request.auction;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlaceBidRequest {

    private Long productId;
    private BigDecimal amount;
}
