
package com.example.ecommerce.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Getter
@Setter
public class VNPayConfig {

    private String tmnCode;
    private String hashSecret;
    private String url;
    private String returnUrl;
    private String version;
    private String command;
    private String orderType;
    private String locale;
    private String currencyCode;

    // Alias cho VNPayService dùng getPaymentUrl()
    public String getPaymentUrl() {
        return url;
    }


}
