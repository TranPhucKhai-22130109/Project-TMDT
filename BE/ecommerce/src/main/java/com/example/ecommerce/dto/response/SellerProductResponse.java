package com.example.ecommerce.dto.response;

import com.example.ecommerce.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerProductResponse {

    private Long id;
    private String name;

    private String imageUrl;
    private List<String> images;

    private String itemNo;
    private String scale;
    private String marque;
    private String status;

    private String description;
    private Double price;
    private Integer soldQuantity;
    private Integer stockQuantity;
    private Boolean isAuction;
    private Boolean isDeleted;
    private String sellerId;
    private String sellerName;
    private String sellerEmail;
    private Boolean isApproved;
}