package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.AddressRequest;
import com.example.ecommerce.dto.request.ChangePasswordRequest;
import com.example.ecommerce.dto.request.UpdateProfileRequest;
import com.example.ecommerce.dto.response.AddressResponse;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.UserResponse;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private UserController userController;

    private final String userId = "user-123";

    @BeforeEach
    void setUp() {
        lenient().when(authentication.getPrincipal()).thenReturn(jwt);
        lenient().when(jwt.getSubject()).thenReturn(userId);
    }

    @Test
    @DisplayName("TC_USER_01: Lấy hồ sơ cá nhân qua API /api/users/me")
    void testGetMyProfile_Success() {
        UserResponse userResponse = mock(UserResponse.class);
        when(userService.getProfile(userId)).thenReturn(userResponse);

        ResponseEntity<ApiResponse<UserResponse>> response = userController.getMyProfile(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("GET_PROFILE_SUCCESS", response.getBody().getCode());
        assertEquals(userResponse, response.getBody().getData());
    }

    @Test
    @DisplayName("TC_USER_03: Cập nhật hồ sơ cá nhân qua PUT /api/users/me")
    void testUpdateMyProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        UserResponse updatedUser = mock(UserResponse.class);
        when(userService.updateProfile(userId, request)).thenReturn(updatedUser);

        ResponseEntity<ApiResponse<UserResponse>> response = userController.updateMyProfile(request, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("UPDATE_PROFILE_SUCCESS", response.getBody().getCode());
    }

    @Test
    @DisplayName("TC_USER_04: Đổi mật khẩu qua PUT /api/users/me/change-password")
    void testChangeMyPassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        doNothing().when(userService).changePassword(userId, request);

        ResponseEntity<ApiResponse<Void>> response = userController.changeMyPassword(request, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("CHANGE_PASSWORD_SUCCESS", response.getBody().getCode());
        verify(userService, times(1)).changePassword(userId, request);
    }

    @Test
    @DisplayName("TC_USER_06: Lấy danh sách địa chỉ nhận hàng qua GET /api/users/me/addresses")
    void testGetMyAddresses_Success() {
        AddressResponse addr = mock(AddressResponse.class);
        when(userService.getAddresses(userId)).thenReturn(List.of(addr));

        ResponseEntity<ApiResponse<List<AddressResponse>>> response = userController.getMyAddresses(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getData().size());
        assertEquals("GET_ADDRESSES_SUCCESS", response.getBody().getCode());
    }

    @Test
    @DisplayName("TC_USER_07: Thêm địa chỉ mới qua POST /api/users/me/addresses")
    void testAddMyAddress_Success() {
        AddressRequest request = new AddressRequest();
        AddressResponse newAddr = mock(AddressResponse.class);
        when(userService.addAddress(userId, request)).thenReturn(newAddr);

        ResponseEntity<ApiResponse<AddressResponse>> response = userController.addMyAddress(request, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("ADD_ADDRESS_SUCCESS", response.getBody().getCode());
    }
}
