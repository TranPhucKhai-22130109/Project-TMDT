package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {

    private Long bidId;
    private Long productId;
    private BigDecimal currentPrice;
    private String username;
    private Instant createdAt;
}
