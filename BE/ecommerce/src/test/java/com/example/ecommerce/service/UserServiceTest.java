package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.AddressRequest;
import com.example.ecommerce.dto.request.ChangePasswordRequest;
import com.example.ecommerce.dto.request.UpdateProfileRequest;
import com.example.ecommerce.dto.request.UpdateShopRequest;
import com.example.ecommerce.dto.response.AddressResponse;
import com.example.ecommerce.dto.response.ShopResponse;
import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.UserAddress;
import com.example.ecommerce.entity.UserRole;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.UserAddressRepository;
import com.example.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserAddressRepository userAddressRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User mockUser;
    private final String userId = "user-uuid-12345";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setUsername("testuser");
        mockUser.setEmail("testuser@gmail.com");
        mockUser.setPassword("encodedOldPassword");
        mockUser.setFullName("Nguyễn Văn A");
        mockUser.setPhoneNumber("0987654321");
        mockUser.setGender("Nam");
        mockUser.setDateOfBirth(LocalDate.of(2000, 1, 1));
        mockUser.setShopName("Auto Model Shop");
        mockUser.setShopDescription("Chuyên mô hình tĩnh cao cấp");
        mockUser.setUserRoles(new ArrayList<>());
    }

    @Test
    @DisplayName("TC_USER_01: Lấy hồ sơ cá nhân thành công khi userId tồn tại")
    void testGetProfile_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        UserResponse response = userService.getProfile(userId);

        assertNotNull(response);
        assertEquals(userId, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("testuser@gmail.com", response.getEmail());
        assertEquals("Nguyễn Văn A", response.getFullName());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("TC_USER_02: Ném lỗi AppException khi userId không tồn tại")
    void testGetProfile_UserNotFound_ThrowsException() {
        when(userRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> userService.getProfile("non-existent-id"));
        assertEquals(ErrorCode.USER_NOT_FOUND, ex.getErrorCode());
        verify(userRepository, times(1)).findById("non-existent-id");
    }

    @Test
    @DisplayName("TC_USER_03: Cập nhật thông tin hồ sơ cá nhân thành công")
    void testUpdateProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Trần Phúc Khải");
        request.setPhoneNumber("0912345678");
        request.setGender("Nam");
        request.setDateOfBirth(LocalDate.of(2004, 10, 15));
        request.setAvatarUrl("https://firebase.storage/avatar.png");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateProfile(userId, request);

        assertNotNull(response);
        assertEquals("Trần Phúc Khải", response.getFullName());
        assertEquals("0912345678", response.getPhoneNumber());
        assertEquals("https://firebase.storage/avatar.png", response.getAvatarUrl());
        verify(userRepository, times(1)).save(mockUser);
    }

    @Test
    @DisplayName("TC_USER_04: Đổi mật khẩu thành công khi cung cấp đúng mật khẩu hiện tại")
    void testChangePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("OldPassword123");
        request.setNewPassword("NewSecurePassword2026");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("OldPassword123", "encodedOldPassword")).thenReturn(true);
        when(passwordEncoder.encode("NewSecurePassword2026")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        assertDoesNotThrow(() -> userService.changePassword(userId, request));

        assertEquals("encodedNewPassword", mockUser.getPassword());
        verify(userRepository, times(1)).save(mockUser);
    }

    @Test
    @DisplayName("TC_USER_05: Báo lỗi BAD_CREDENTIALS khi mật khẩu hiện tại không chính xác")
    void testChangePassword_WrongCurrentPassword_ThrowsException() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("WrongPassword");
        request.setNewPassword("NewSecurePassword2026");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("WrongPassword", "encodedOldPassword")).thenReturn(false);

        AppException ex = assertThrows(AppException.class, () -> userService.changePassword(userId, request));
        assertEquals(ErrorCode.BAD_CREDENTIALS, ex.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("TC_USER_06: Lấy danh sách địa chỉ giao hàng của người dùng")
    void testGetAddresses_Success() {
        UserAddress addr1 = UserAddress.builder()
                .id("addr-1")
                .receiverName("Trần Phúc Khải")
                .receiverPhone("0987654321")
                .city("TP. Hồ Chí Minh")
                .addressDetails("227 Nguyễn Văn Cừ")
                .isDefault(true)
                .build();

        when(userAddressRepository.findByUserId(userId)).thenReturn(List.of(addr1));

        List<AddressResponse> result = userService.getAddresses(userId);

        assertEquals(1, result.size());
        assertEquals("addr-1", result.get(0).getId());
        assertTrue(result.get(0).getIsDefault());
    }

    @Test
    @DisplayName("TC_USER_07: Thêm địa chỉ mới với cờ Mặc định -> tự động gỡ mặc định địa chỉ cũ")
    void testAddAddress_WithDefaultTrue_UnsetsPreviousDefault() {
        AddressRequest request = new AddressRequest();
        request.setReceiverName("Khải");
        request.setReceiverPhone("0987654321");
        request.setCity("TP.HCM");
        request.setAddressDetails("Quận 5");
        request.setIsDefault(true);

        UserAddress oldDefault = UserAddress.builder()
                .id("addr-old")
                .isDefault(true)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByUserIdAndIsDefaultTrue(userId)).thenReturn(Optional.of(oldDefault));
        when(userAddressRepository.save(any(UserAddress.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AddressResponse response = userService.addAddress(userId, request);

        assertNotNull(response);
        assertTrue(response.getIsDefault());
        assertFalse(oldDefault.getIsDefault()); // Địa chỉ cũ phải bị hủy mặc định
        verify(userAddressRepository, times(1)).save(oldDefault);
    }

    @Test
    @DisplayName("TC_USER_08: Xóa địa chỉ nhận hàng thành công")
    void testDeleteAddress_Success() {
        UserAddress address = UserAddress.builder()
                .id("addr-to-delete")
                .user(mockUser)
                .build();

        when(userAddressRepository.findByIdAndUserId("addr-to-delete", userId)).thenReturn(Optional.of(address));
        doNothing().when(userAddressRepository).delete(address);

        assertDoesNotThrow(() -> userService.deleteAddress(userId, "addr-to-delete"));
        verify(userAddressRepository, times(1)).delete(address);
    }

    @Test
    @DisplayName("TC_USER_09: Lấy thông tin gian hàng người bán (Shop Profile)")
    void testGetShopProfile_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        ShopResponse shop = userService.getShopProfile(userId);

        assertNotNull(shop);
        assertEquals("Auto Model Shop", shop.getShopName());
        assertEquals("Chuyên mô hình tĩnh cao cấp", shop.getShopDescription());
    }

    @Test
    @DisplayName("TC_USER_10: Cập nhật thông tin gian hàng người bán")
    void testUpdateShopProfile_Success() {
        UpdateShopRequest request = new UpdateShopRequest();
        request.setShopName("GT Model Official Shop");
        request.setShopDescription("Mô hình chính hãng 1:18");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ShopResponse response = userService.updateShopProfile(userId, request);

        assertNotNull(response);
        assertEquals("GT Model Official Shop", response.getShopName());
        assertEquals("Mô hình chính hãng 1:18", response.getShopDescription());
    }
}
