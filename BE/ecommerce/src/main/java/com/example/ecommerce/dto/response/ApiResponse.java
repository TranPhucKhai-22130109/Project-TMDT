package com.example.ecommerce.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
}
