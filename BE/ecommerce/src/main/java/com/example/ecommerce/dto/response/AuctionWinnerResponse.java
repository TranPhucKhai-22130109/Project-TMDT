package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionWinnerResponse {

    private Long productId;
    private String winnerUserId;
    private String winnerUsername;
    private BigDecimal winningPrice;
    private Boolean canPay;
}
