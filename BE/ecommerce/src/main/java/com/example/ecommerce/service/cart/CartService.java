package com.example.ecommerce.service.cart;

import com.example.ecommerce.dto.requesy.AddToCartRequest;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartItemRepository;
    private final ProductRepository productRepository;

    public void addToCart(String userId, AddToCartRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(userId, request.getProductId())
                .orElse(null);

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }

        cartItemRepository.save(cartItem);
    }

    public int getCartCount(String userId) {
        return cartItemRepository.findByUserId(userId).size();
    }
}
