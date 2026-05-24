package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.admin.CreateUserRequest;
import com.example.ecommerce.dto.request.admin.UpdateUserRequest;
import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.UserRole;
import com.example.ecommerce.enums.AccountStatus;
import com.example.ecommerce.enums.RoleName;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.RoleRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        validateCreateUserRequest(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        RoleName roleName = parseRole(request.getRole());
        Role role = roleRepository.findByRoleName(roleName.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(parseCreateStatus(request.getStatus()));

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        user.getUserRoles().add(userRole);

        return toUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                // .filter(user -> !Boolean.TRUE.equals(user.getIsDeleted()))
                .map(this::toUserResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        if (request == null || isBlank(request.getUsername())) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        user.setUsername(request.getUsername());

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void softDeleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        user.setIsDeleted(true);
        user.setStatus(AccountStatus.INACTIVE);

        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateUserStatus(String id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        user.setStatus(parseStatus(status));

        return toUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUserRole(String id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        RoleName roleName = parseRole(role);
        Role newRole = roleRepository.findByRoleName(roleName.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(newRole);

        user.getUserRoles().clear();
        user.getUserRoles().add(userRole);

        return toUserResponse(userRepository.save(user));
    }

    private AccountStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        try {
            return AccountStatus.valueOf(status);
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private AccountStatus parseCreateStatus(String status) {
        if (status == null || status.isBlank()) {
            return AccountStatus.ACTIVE;
        }

        return parseStatus(status);
    }

    private RoleName parseRole(String role) {
        if (role == null || role.isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }

        try {
            return RoleName.valueOf(role);
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private void validateCreateUserRequest(CreateUserRequest request) {
        if (request == null
                || isBlank(request.getUsername())
                || isBlank(request.getEmail())
                || isBlank(request.getPassword())
                || isBlank(request.getRole())) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getStatus(),
                Boolean.TRUE.equals(user.getIsDeleted()),
                user.getUserRoles()
                        .stream()
                        .map(userRole -> userRole.getRole().getRoleName())
                        .toList(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
