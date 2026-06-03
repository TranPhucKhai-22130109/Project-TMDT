package com.example.ecommerce.dto.response;

import lombok.*;

@Getter
@Setter
public class SellerSuggestionResponse {

    private String id;
    private String username;
    private String avatarUrl;

    public SellerSuggestionResponse() {
    }

    public SellerSuggestionResponse(
            String id,
            String username,
            String avatarUrl
    ) {
        this.id = id;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }

}
