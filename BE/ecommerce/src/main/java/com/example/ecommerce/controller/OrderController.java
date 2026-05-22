package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.auth.CheckoutRequest;
import com.example.ecommerce.dto.response.ApiResponse;
import com.example.ecommerce.dto.response.OrderResponse;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final VNPayService vnPayService;

    /**
     * 1. API ĐẶT HÀNG (Gọi chính xác hàm checkout của OrderService)
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            Principal principal,
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {

        try {
            String userId = principal.getName();

            // Lấy IP Address và chuẩn hóa từ IPv6 về IPv4 khi chạy localhost
            String ipAddress = httpRequest.getRemoteAddr();
            if (ipAddress == null || ipAddress.equals("0:0:0:0:0:0:0:1")) {
                ipAddress = "127.0.0.1";
            }

            // 🛠️ SỬA TẠI ĐÂY: Gọi đúng hàm checkout(userId, request, ipAddress) từ
            // OrderService của bạn
            OrderResponse orderResponse = orderService.checkout(userId, request, ipAddress);

            return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                    .success(true)
                    .code("ORDER_CREATED")
                    .message("Đặt hàng thành công")
                    .data(orderResponse)
                    .build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<OrderResponse>builder()
                            .success(false)
                            .code("ORDER_FAILED")
                            .message("Đặt hàng thất bại: " + e.getMessage())
                            .build());
        }
    }

    /**
     * 2. API CALLBACK ĐÓN KẾT QUẢ TỪ VNPAY ĐỂ ĐIỀU HƯỚNG TRÌNH DUYỆT
     */
    @GetMapping("/vnpay-callback")
    public ResponseEntity<?> vnpayCallback(@RequestParam Map<String, String> params) {
        String frontendUrl = "http://localhost:3000";
        String redirectUrl = "";

        try {
            var callbackResult = vnPayService.handleCallback(params);

            if (callbackResult.isSuccess()) {
                // Điều hướng về trang chi tiết đơn hàng của Next.js kèm param thành công
                redirectUrl = frontendUrl + "/orders/" + callbackResult.getOrderId() + "?payment=success";
            } else {
                redirectUrl = frontendUrl + "/checkout?payment=cancelled";
            }

        } catch (Exception e) {
            e.printStackTrace();
            redirectUrl = frontendUrl + "/checkout?payment=error";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * 3. API LẤY CHI TIẾT ĐƠN HÀNG THEO ID DON HANG
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderDetail(
            @PathVariable String id,
            Principal principal) {

        // 🛠️ SỬA TẠI ĐÂY: Đổi đúng thứ tự truyền tham số là (userId, orderId) tương
        // ứng (principal.getName(), id)
        OrderResponse order = orderService.getOrderDetail(principal.getName(), id);

        return ResponseEntity.ok(ApiResponse.<OrderResponse>builder()
                .success(true)
                .code("ORDER_FETCHED")
                .message("Lấy chi tiết đơn hàng thành công")
                .data(order)
                .build());
    }

    /**
     * 4. API LẤY LỊCH SỬ DANH SÁCH ĐƠN HÀNG CỦA USER
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrderHistory(Principal principal) {
        List<OrderResponse> history = orderService.getOrderHistory(principal.getName());
        return ResponseEntity.ok(ApiResponse.<List<OrderResponse>>builder()
                .success(true)
                .code("HISTORY_FETCHED")
                .message("Lấy lịch sử đơn hàng thành công")
                .data(history)
                .build());
    }
}