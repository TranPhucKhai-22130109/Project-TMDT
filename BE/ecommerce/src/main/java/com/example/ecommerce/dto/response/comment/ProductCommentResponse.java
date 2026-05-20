package com.example.ecommerce.dto.response.comment;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductCommentResponse {
    private Long id;
    private String content;
    private String username;
    private Long productId;
    private Long parentId;
    private LocalDateTime createdAt;
    private Boolean isOwner;
    private String userAvatar;
}
