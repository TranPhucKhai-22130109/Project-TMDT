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
    ACCOUNT_BANNED(HttpStatus.FORBIDDEN, "Account has been banned"),
    ACCOUNT_INACTIVE(HttpStatus.FORBIDDEN, "Account is inactive"),
    ROLE_NOT_FOUND(HttpStatus.BAD_REQUEST, "Role not found"),

    // ==== TOKEN ====
    INVALID_TOKEN(HttpStatus.BAD_REQUEST, "Invalid token"),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),

    // ==== PRODUCT ====
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "Product not found"),

    // ==== AUCTION ====
    AUCTION_ENDED(HttpStatus.BAD_REQUEST, "Auction has ended"),
    AUCTION_NOT_ENDED(HttpStatus.BAD_REQUEST, "Auction has not ended"),
    AUCTION_HAS_NO_BID(HttpStatus.BAD_REQUEST, "Auction has no bid"),
    AUCTION_NOT_WINNER(HttpStatus.FORBIDDEN, "Only auction winner can checkout this product"),
    AUCTION_ALREADY_PAID(HttpStatus.BAD_REQUEST, "Auction product has already been paid"),
    INVALID_AUCTION_QUANTITY(HttpStatus.BAD_REQUEST, "Auction product quantity must be 1"),

    // ==== ORDER ====
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "Order not found"),
    PAYMENT_FAILED(HttpStatus.BAD_REQUEST, "Payment processing failed"),

    // ==== EMAIL VERIFICATION / PASSWORD RESET ====
    INVALID_VERIFY_TOKEN(HttpStatus.BAD_REQUEST, "Invalid or expired verification token"),
    INVALID_OTP(HttpStatus.BAD_REQUEST, "Invalid or expired OTP"),
    INVALID_RESET_TOKEN(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"),
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to send email"),
    ;


    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
