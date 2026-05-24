package com.example.ecommerce.dto.response;

import com.example.ecommerce.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String username;
    private String email;
    private AccountStatus status;
    private Boolean isDeleted;
    private List<String> roles;
    private Instant createdAt;
    private Instant updatedAt;
}
