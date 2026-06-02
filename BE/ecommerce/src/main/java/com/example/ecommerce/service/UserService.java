package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.AddressRequest;
import com.example.ecommerce.dto.request.ChangePasswordRequest;
import com.example.ecommerce.dto.request.UpdateProfileRequest;
import com.example.ecommerce.dto.request.UpdateShopRequest;
import com.example.ecommerce.dto.response.AddressResponse;
import com.example.ecommerce.dto.response.ShopResponse;
import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.UserAddress;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.UserAddressRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.BAD_CREDENTIALS);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(String userId) {
        return userAddressRepository.findByUserId(userId).stream()
                .map(this::toAddressResponse)
                .toList();
    }

    @Transactional
    public AddressResponse addAddress(String userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // If the new address is set to default, unset previous default address
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetPreviousDefaultAddress(userId);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .addressDetails(request.getAddressDetails())
                .city(request.getCity())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        return toAddressResponse(userAddressRepository.save(address));
    }

    @Transactional
    public AddressResponse updateAddress(String userId, String addressId, AddressRequest request) {
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR));

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            unsetPreviousDefaultAddress(userId);
        }

        if (request.getReceiverName() != null) address.setReceiverName(request.getReceiverName());
        if (request.getReceiverPhone() != null) address.setReceiverPhone(request.getReceiverPhone());
        if (request.getAddressDetails() != null) address.setAddressDetails(request.getAddressDetails());
        if (request.getCity() != null) address.setCity(request.getCity());
        if (request.getIsDefault() != null) address.setIsDefault(request.getIsDefault());

        return toAddressResponse(userAddressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String userId, String addressId) {
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR));
        userAddressRepository.delete(address);
    }

    @Transactional(readOnly = true)
    public ShopResponse getShopProfile(String sellerId) {
        User user = userRepository.findById(sellerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return toShopResponse(user);
    }

    @Transactional
    public ShopResponse updateShopProfile(String sellerId, UpdateShopRequest request) {
        User user = userRepository.findById(sellerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getShopName() != null) user.setShopName(request.getShopName());
        if (request.getShopCoverUrl() != null) user.setShopCoverUrl(request.getShopCoverUrl());
        if (request.getShopDescription() != null) user.setShopDescription(request.getShopDescription());

        return toShopResponse(userRepository.save(user));
    }

    private void unsetPreviousDefaultAddress(String userId) {
        userAddressRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(addr -> {
                    addr.setIsDefault(false);
                    userAddressRepository.save(addr);
                });
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getIsDeleted()),
                user.getUserRoles().stream()
                        .map(userRole -> userRole.getRole().getRoleName())
                        .toList(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getAvatarUrl(),
                user.getPhoneNumber(),
                user.getFullName(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getShopName(),
                user.getShopCoverUrl(),
                user.getShopDescription()
        );
    }

    private AddressResponse toAddressResponse(UserAddress address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .addressDetails(address.getAddressDetails())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .build();
    }

    private ShopResponse toShopResponse(User user) {
        return ShopResponse.builder()
                .id(user.getId())
                .shopName(user.getShopName())
                .shopCoverUrl(user.getShopCoverUrl())
                .shopDescription(user.getShopDescription())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
