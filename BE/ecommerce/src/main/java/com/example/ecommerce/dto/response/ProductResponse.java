package com.example.ecommerce.dto.response;

import com.example.ecommerce.enums.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;

    private String imageUrl;
    private List<String> images;

    private String itemNo;
    private String scale;
    private String marque;
    private ProductStatus status;

    private String description;
    private Double price;
    private Integer soldQuantity;
    private Integer stockQuantity;
    private Boolean isAuction;
    private String sellerId;
    private String sellerName;
    private String sellerEmail;
    private Boolean isApproved;
    private Boolean isDeleted;
    private BigDecimal auctionStartPrice;
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private BigDecimal currentPrice;
    private Boolean auctionPaid;
}
