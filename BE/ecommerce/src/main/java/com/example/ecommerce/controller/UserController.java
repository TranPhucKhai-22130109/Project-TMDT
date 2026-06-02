package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.AddressRequest;
import com.example.ecommerce.dto.request.ChangePasswordRequest;
import com.example.ecommerce.dto.request.UpdateProfileRequest;
import com.example.ecommerce.dto.response.AddressResponse;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("GET_PROFILE_SUCCESS")
                        .message("Get profile successfully")
                        .data(userService.getProfile(userId))
                        .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("UPDATE_PROFILE_SUCCESS")
                        .message("Update profile successfully")
                        .data(userService.updateProfile(userId, request))
                        .build()
        );
    }

    @PutMapping("/me/change-password")
    public ResponseEntity<ApiResponse<Void>> changeMyPassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        userService.changePassword(userId, request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("CHANGE_PASSWORD_SUCCESS")
                        .message("Change password successfully")
                        .build()
        );
    }

    @GetMapping("/me/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMyAddresses(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<List<AddressResponse>>builder()
                        .success(true)
                        .code("GET_ADDRESSES_SUCCESS")
                        .message("Get addresses successfully")
                        .data(userService.getAddresses(userId))
                        .build()
        );
    }

    @PostMapping("/me/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addMyAddress(
            @RequestBody AddressRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<AddressResponse>builder()
                        .success(true)
                        .code("ADD_ADDRESS_SUCCESS")
                        .message("Add address successfully")
                        .data(userService.addAddress(userId, request))
                        .build()
        );
    }

    @PutMapping("/me/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateMyAddress(
            @PathVariable String addressId,
            @RequestBody AddressRequest request,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        return ResponseEntity.ok(
                ApiResponse.<AddressResponse>builder()
                        .success(true)
                        .code("UPDATE_ADDRESS_SUCCESS")
                        .message("Update address successfully")
                        .data(userService.updateAddress(userId, addressId, request))
                        .build()
        );
    }

    @DeleteMapping("/me/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteMyAddress(
            @PathVariable String addressId,
            Authentication authentication
    ) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = String.valueOf(jwt.getSubject());

        userService.deleteAddress(userId, addressId);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("DELETE_ADDRESS_SUCCESS")
                        .message("Delete address successfully")
                        .build()
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable String userId) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("GET_PROFILE_SUCCESS")
                        .message("Get profile successfully")
                        .data(userService.getProfile(userId))
                        .build()
        );
    }
}

