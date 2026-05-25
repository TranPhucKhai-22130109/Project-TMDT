package com.example.ecommerce.dto.response;

public interface RevenueChartDTO {
    String getMonth();    // Hứng cột AS month
    Double getRevenue();  // Hứng cột AS revenue
    Long getOrders();     // Hứng cột AS orders
}