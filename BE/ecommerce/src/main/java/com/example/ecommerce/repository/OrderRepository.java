package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Order;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.dto.response.RevenueChartDTO;
import com.example.ecommerce.dto.response.TopCategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

        // ── User: lịch sử đơn hàng ──
        @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
        List<Order> findByUserIdWithItems(@Param("userId") String userId);

        // ── User + Admin: chi tiết 1 đơn ──
        @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.id = :orderId")
        Optional<Order> findByIdWithItems(@Param("orderId") String orderId);

        // ── Admin: tất cả đơn mới nhất trước ──
        @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product ORDER BY o.createdAt DESC")
        List<Order> findAllByOrderByCreatedAtDesc();

        // ── Admin: filter theo status ──
        @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.status = :status ORDER BY o.createdAt DESC")
        List<Order> findAllByStatusOrderByCreatedAtDesc(@Param("status") OrderStatus status);

        // TASK 1: Biểu đồ cột doanh thu theo Tháng (Lọc theo Seller đăng nhập)
        @Query(value = "SELECT " +
                "  DATE_FORMAT(o.created_at, '%b') AS month, " +
                "  CAST(SUM(i.quantity * i.unit_price) AS DECIMAL(10,2)) AS revenue, " +
                "  COUNT(DISTINCT o.id) AS orders " +
                "FROM orders o " +
                "JOIN order_items i ON o.id = i.order_id " +
                "JOIN product p ON i.product_id = p.id " +
                "WHERE o.status = 'DELIVERED' " +
                "  AND p.seller_id = :sellerId " +
                "GROUP BY DATE_FORMAT(o.created_at, '%b')",
                nativeQuery = true)
        List<RevenueChartDTO> getRevenueByMonth(@Param("sellerId") String sellerId);

    // TASK 2: Biểu đồ tròn doanh thu theo Tỉ lệ xe (Lọc theo Seller đăng nhập)
    @Query(value = "SELECT " +
            "  p.scale AS name, " +
            "  COUNT(i.id) AS sold, " +
            "  CAST(SUM(i.quantity * i.unit_price) AS DECIMAL(10,2)) AS revenue " +
            "FROM orders o " +
            "JOIN order_items i ON o.id = i.order_id " +
            "JOIN product p ON i.product_id = p.id " +
            "WHERE o.status = 'DELIVERED' " +
            "  AND p.seller_id = :sellerId " +
            "  AND (:period = 'all' " +
            "       OR (:period = 'month' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
            "       OR (:period = 'quarter' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)) " +
            "       OR (:period = 'year' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) " +
            "GROUP BY p.scale",
            nativeQuery = true)
    List<TopCategoryDTO> getRevenueByCategory(@Param("sellerId") String sellerId, @Param("period") String period);

        // Lấy thống kê tổng quan (Lọc theo Seller đăng nhập và kỳ thời gian lọc)
        @Query(value = "SELECT " +
                "  COALESCE(SUM(i.quantity * i.unit_price), 0) as totalRevenue, " +
                "  COUNT(DISTINCT o.id) as totalOrders " +
                "FROM orders o " +
                "JOIN order_items i ON o.id = i.order_id " +
                "JOIN product p ON i.product_id = p.id " +
                "WHERE o.status = 'DELIVERED' " +
                "  AND p.seller_id = :sellerId " +
                "  AND (:period = 'all' " +
                "       OR (:period = 'today' AND o.created_at >= CURDATE()) " +
                "       OR (:period = '7days' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) " +
                "       OR (:period = '30days' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) " +
                "       OR (:period = '6months' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)) " +
                "       OR (:period = 'year' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)))",
                nativeQuery = true)
        Map<String, Object> getOverviewStats(@Param("sellerId") String sellerId, @Param("period") String period);

        // Đếm số lượng trạng thái đơn hàng (Lọc theo Seller đăng nhập chuẩn xác)
        @Query(value = "SELECT o.status as status, COUNT(DISTINCT o.id) as count " +
                "FROM orders o " +
                "JOIN order_items i ON o.id = i.order_id " +
                "JOIN product p ON i.product_id = p.id " +
                "WHERE p.seller_id = :sellerId " +
                "GROUP BY o.status", nativeQuery = true)
        List<Map<String, Object>> getOrderStatusCount(@Param("sellerId") String sellerId);

        // Lấy danh sách các đơn hàng gần đây chứa sản phẩm của Seller
        @Query("SELECT DISTINCT o FROM Order o JOIN FETCH o.user JOIN o.items i JOIN i.product p WHERE p.seller.id = :sellerId ORDER BY o.createdAt DESC")
        List<Order> findRecentOrdersBySeller(@Param("sellerId") String sellerId);
}