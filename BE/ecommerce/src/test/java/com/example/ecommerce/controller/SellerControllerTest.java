package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.UpdateShopRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.ShopResponse;
import com.example.ecommerce.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SellerControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private SellerController sellerController;

    private final String sellerId = "seller-uuid-777";

    @BeforeEach
    void setUp() {
        lenient().when(authentication.getPrincipal()).thenReturn(jwt);
        lenient().when(jwt.getSubject()).thenReturn(sellerId);
    }

    @Test
    @DisplayName("TC_SHOP_02: Lấy thông tin gian hàng người bán qua GET /api/seller/my-shop")
    void testGetMyShopProfile_Success() {
        ShopResponse shopResponse = mock(ShopResponse.class);
        when(userService.getShopProfile(sellerId)).thenReturn(shopResponse);

        ResponseEntity<ApiResponse<ShopResponse>> response = sellerController.getMyShopProfile(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("GET_SHOP_SUCCESS", response.getBody().getCode());
        assertEquals(shopResponse, response.getBody().getData());
    }

    @Test
    @DisplayName("TC_SHOP_07: Cập nhật thông tin gian hàng qua PUT /api/seller/my-shop")
    void testUpdateMyShopProfile_Success() {
        UpdateShopRequest request = new UpdateShopRequest();
        ShopResponse updatedShop = mock(ShopResponse.class);
        when(userService.updateShopProfile(sellerId, request)).thenReturn(updatedShop);

        ResponseEntity<ApiResponse<ShopResponse>> response = sellerController.updateMyShopProfile(request, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("UPDATE_SHOP_SUCCESS", response.getBody().getCode());
        assertEquals(updatedShop, response.getBody().getData());
    }
}
