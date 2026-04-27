package com.example.ecommerce.exception;

import com.example.ecommerce.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AppException.class)
        public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
                ErrorCode errorCode = ex.getErrorCode();

                return ResponseEntity
                                .status(errorCode.getStatus())
                                .body(ApiResponse.<Void>builder()
                                                .success(false)
                                                .code(errorCode.name())
                                                .message(errorCode.getMessage())
                                                .build());
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception ex) {

                return ResponseEntity
                                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                                .body(ApiResponse.<Void>builder()
                                                .success(false)
                                                .code(ErrorCode.INTERNAL_SERVER_ERROR.name())
                                                .message(ErrorCode.INTERNAL_SERVER_ERROR.getMessage())
                                                .build());
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {

                return ResponseEntity
                                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                                .body(ApiResponse.<Void>builder()
                                                .success(false)
                                                .code(ErrorCode.BAD_CREDENTIALS.name())
                                                .message(ErrorCode.BAD_CREDENTIALS.getMessage())
                                                .build());
        }
}
