package com.example.ecommerce.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String receiverName;
    private String receiverPhone;
    private String addressDetails;
    private String city;
    private Boolean isDefault;
}
