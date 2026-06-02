package com.example.ecommerce.dto.request;

import lombok.Data;

@Data
public class UpdateShopRequest {
    private String shopName;
    private String shopCoverUrl;
    private String shopDescription;
}
