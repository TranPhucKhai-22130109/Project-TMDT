package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;

    private String imageUrl;      // ảnh chính
    private List<String> images;  // list ảnh

    private String itemNo;
    private String scale;
    private String marque;
    private String status;

    private String description;
}