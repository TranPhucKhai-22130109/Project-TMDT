package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopResponse {
    private String id;
    private String shopName;
    private String shopCoverUrl;
    private String shopDescription;
    private String username;
    private String email;
    private String avatarUrl;
}
