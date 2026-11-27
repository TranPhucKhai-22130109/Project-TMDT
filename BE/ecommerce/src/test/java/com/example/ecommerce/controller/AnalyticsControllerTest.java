package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.RevenueChartDTO;
import com.example.ecommerce.dto.response.TopCategoryDTO;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.OrderItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnalyticsControllerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AnalyticsController analyticsController;

    private final String sellerId = "seller-uuid-999";

    @BeforeEach
    void setUpSecurity() {
        Jwt jwt = mock(Jwt.class);
        lenient().when(jwt.getSubject()).thenReturn(sellerId);

        Authentication authentication = mock(Authentication.class);
        lenient().when(authentication.getPrincipal()).thenReturn(jwt);

        SecurityContext securityContext = mock(SecurityContext.class);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);

        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDownSecurity() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("TC_REV_01: Lấy biểu đồ doanh thu khi CSDL có dữ liệu thực tế")
    void testGetRevenueChart_WhenDbHasData_ShouldReturnDbData() {
        RevenueChartDTO dto = mock(RevenueChartDTO.class);
        when(orderRepository.getRevenueByMonth(sellerId)).thenReturn(List.of(dto));

        ResponseEntity<?> response = analyticsController.getRevenueChart();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> list = (List<?>) response.getBody();
        assertEquals(1, list.size());
        verify(orderRepository, times(1)).getRevenueByMonth(sellerId);
    }

    @Test
    @DisplayName("TC_REV_05: Nạp Mock Data 5 tháng dự phòng khi CSDL trống doanh thu")
    void testGetRevenueChart_WhenDbEmpty_ShouldReturnFallbackMockData() {
        when(orderRepository.getRevenueByMonth(sellerId)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = analyticsController.getRevenueChart();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> list = (List<?>) response.getBody();
        assertEquals(5, list.size(), "Mock Data dự phòng phải chứa 5 tháng");
    }

    @Test
    @DisplayName("TC_CAT_01: Lấy doanh thu theo danh mục xe với bộ lọc 'all'")
    void testGetCategoryRevenue_AllPeriod() {
        TopCategoryDTO dto = mock(TopCategoryDTO.class);
        when(orderRepository.getRevenueByCategory(sellerId, "all")).thenReturn(List.of(dto));

        ResponseEntity<?> response = analyticsController.getCategoryRevenue("all", null, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> body = (List<?>) response.getBody();
        assertNotNull(body);
        assertEquals(1, body.size());
    }

    @Test
    @DisplayName("TC_CAT_03: Lọc doanh thu theo danh mục với khoảng ngày tùy chỉnh")
    void testGetCategoryRevenue_CustomRange() {
        TopCategoryDTO dto = mock(TopCategoryDTO.class);
        when(orderRepository.getRevenueByCategoryAndCustomRange(
                eq(sellerId), eq("2026-01-01 00:00:00"), eq("2026-03-31 23:59:59")
        )).thenReturn(List.of(dto));

        ResponseEntity<?> response = analyticsController.getCategoryRevenue("custom", "2026-01-01", "2026-03-31");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> body = (List<?>) response.getBody();
        assertNotNull(body);
        assertEquals(1, body.size());
        verify(orderRepository).getRevenueByCategoryAndCustomRange(sellerId, "2026-01-01 00:00:00", "2026-03-31 23:59:59");
    }

    @Test
    @DisplayName("TC_DASH_01: Lấy thẻ thống kê KPI tổng quan khi CSDL trống -> nạp thẻ mẫu dự phòng")
    void testGetStatCards_WhenDbEmpty_ShouldReturnMockCards() {
        when(orderRepository.getOverviewStats(sellerId, "year")).thenReturn(Collections.emptyMap());

        ResponseEntity<List<Map<String, Object>>> response = analyticsController.getStatCards("year");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<Map<String, Object>> cards = response.getBody();
        assertNotNull(cards);
        assertEquals(2, cards.size(), "Phải trả về 2 thẻ: Doanh thu và Đơn hàng");
        assertEquals("revenue", cards.get(0).get("id"));
        assertEquals("orders", cards.get(1).get("id"));
    }

    @Test
    @DisplayName("TC_DASH_04: Lấy danh sách trạng thái đơn hàng khi CSDL trống -> trả về 5 trạng thái mẫu")
    void testGetOrderStatus_WhenDbEmpty_ReturnsFallbackStatus() {
        when(orderRepository.getOrderStatusCount(sellerId)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = analyticsController.getOrderStatus();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(5, list.size(), "Phải trả về đủ 5 trạng thái đơn hàng chuẩn");
    }

    @Test
    @DisplayName("TC_DASH_05: Lấy danh sách đơn hàng gần đây của riêng Seller")
    void testGetRecentOrders_Success() {
        Order order = new Order();
        order.setId("order-101");
        order.setReceiverName("Khách Mua");

        User seller = new User();
        seller.setId(sellerId);

        Product product = new Product();
        product.setSeller(seller);

        OrderItem item = new OrderItem();
        item.setProduct(product);
        item.setQuantity(2);
        item.setUnitPrice(500000.0);

        order.setItems(List.of(item));

        when(orderRepository.findRecentOrdersBySeller(sellerId)).thenReturn(List.of(order));

        ResponseEntity<?> response = analyticsController.getRecentOrders();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> orders = (List<?>) response.getBody();
        assertNotNull(orders);
        assertEquals(1, orders.size());
    }
}
