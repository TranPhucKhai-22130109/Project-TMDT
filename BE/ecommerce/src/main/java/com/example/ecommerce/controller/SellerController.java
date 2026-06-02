package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.UpdateShopRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.ShopResponse;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SellerController {

    private final UserService userService;

    @GetMapping("/my-shop")
    public ResponseEntity<ApiResponse<ShopResponse>> getMyShopProfile(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<ShopResponse>builder()
                        .success(true)
                        .code("GET_SHOP_SUCCESS")
                        .message("Get shop profile successfully")
                        .data(userService.getShopProfile(userId))
                        .build()
        );
    }

    @PutMapping("/my-shop")
    public ResponseEntity<ApiResponse<ShopResponse>> updateMyShopProfile(
            @RequestBody UpdateShopRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<ShopResponse>builder()
                        .success(true)
                        .code("UPDATE_SHOP_SUCCESS")
                        .message("Update shop profile successfully")
                        .data(userService.updateShopProfile(userId, request))
                        .build()
        );
    }
}
