package com.example.ecommerce.dto.request.admin;

import lombok.Data;

@Data
public class CreateUserRequest {

    private String username;
    private String email;
    private String password;
    private String role;
    private String status;
}
