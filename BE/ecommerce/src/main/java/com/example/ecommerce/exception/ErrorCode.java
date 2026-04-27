package com.example.ecommerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // ===== VALIDATION =====
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Validation error"),
    INVALID_QUESTION_FORMAT(HttpStatus.BAD_REQUEST, "Invalid question format"),

    // ===== AUTH / SECURITY =====
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Unauthorized"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Forbidden"),
    USER_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "User already exists"),
    USERNAME_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Username already exists"),
    BAD_CREDENTIALS(HttpStatus.BAD_REQUEST, "Email or password is incorrect"),

    // ==== TOKEN ====
    INVALID_TOKEN(HttpStatus.BAD_REQUEST, "Invalid token"),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),

    // ==== PRODUCT ====
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "Product not found"),

    ;

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
