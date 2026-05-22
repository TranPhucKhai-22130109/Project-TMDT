package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.cart.AddToCartRequest;
import com.example.ecommerce.dto.response.CartItemResponse;
import com.example.ecommerce.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String userId = String.valueOf(jwt.getSubject());

        cartService.addToCart(userId, request);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Added to cart successfully"
                )
        );
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartCount(
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String userId = String.valueOf(jwt.getSubject());

        int count = cartService.getCartCount(userId);

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getCartItems(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        String userId = String.valueOf(jwt.getSubject());

        List<CartItemResponse> items = cartService.getCartItems(userId)
                .stream()
                .map(CartItemResponse::from)
                .toList();

        return ResponseEntity.ok(items);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        cartService.updateQuantity(userId, cartItemId, quantity);

        return ResponseEntity.ok(
                Map.of("message", "Cart item updated successfully")
        );
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long cartItemId,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        cartService.removeCartItem(userId, cartItemId);

        return ResponseEntity.ok(
                Map.of("message", "Cart item removed successfully")
        );
    }
}