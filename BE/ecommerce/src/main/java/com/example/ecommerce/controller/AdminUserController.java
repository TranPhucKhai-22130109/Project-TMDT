package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.admin.CreateUserRequest;
import com.example.ecommerce.dto.request.admin.UpdateUserRoleRequest;
import com.example.ecommerce.dto.request.admin.UpdateUserRequest;
import com.example.ecommerce.dto.request.admin.UpdateUserStatusRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.UserResponse;
import com.example.ecommerce.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("CREATE_USER_SUCCESS")
                        .message("Create user successfully")
                        .data(adminUserService.createUser(request))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsers() {
        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .success(true)
                        .code("GET_USERS_SUCCESS")
                        .message("Get users successfully")
                        .data(adminUserService.getUsers())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("GET_USER_SUCCESS")
                        .message("Get user successfully")
                        .data(adminUserService.getUserById(id))
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("UPDATE_USER_SUCCESS")
                        .message("Update user successfully")
                        .data(adminUserService.updateUser(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> softDeleteUser(@PathVariable String id) {
        adminUserService.softDeleteUser(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .code("DELETE_USER_SUCCESS")
                        .message("Delete user successfully")
                        .build()
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateUserStatusRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("UPDATE_USER_STATUS_SUCCESS")
                        .message("Update user status successfully")
                        .data(adminUserService.updateUserStatus(id, request.getStatus()))
                        .build()
        );
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable String id,
            @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .code("UPDATE_USER_ROLE_SUCCESS")
                        .message("Update user role successfully")
                        .data(adminUserService.updateUserRole(id, request.getRole()))
                        .build()
        );
    }
}
