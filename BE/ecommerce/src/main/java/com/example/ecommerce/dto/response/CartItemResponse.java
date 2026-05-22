package com.example.ecommerce.dto.response;

import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long id;
    private Integer quantity;
    private ProductInfo product;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfo {
        private Long id;
        private String name;
        private Double price;
        private String imageUrl;
        private Boolean isDeleted;
    }

    public static CartItemResponse from(CartItem item) {
        Product p = item.getProduct();
        ProductInfo productInfo = new ProductInfo(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getImageUrl(),
                p.getIsDeleted()
        );
        return new CartItemResponse(item.getId(), item.getQuantity(), productInfo);
    }
}
