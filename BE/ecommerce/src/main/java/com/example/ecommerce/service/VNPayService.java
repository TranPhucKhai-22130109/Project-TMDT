package com.example.ecommerce.service;

import com.example.ecommerce.configuration.VNPayConfig;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.entity.Payment;
import com.example.ecommerce.enums.OrderStatus;
import com.example.ecommerce.enums.PaymentGateway;
import com.example.ecommerce.enums.PaymentResult;
import com.example.ecommerce.enums.PaymentStatus;
import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public String createPaymentUrl(String orderId, String ipAddress) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // ✅ Amount: VNPay yêu cầu đơn vị VND * 100, PHẢI là số nguyên
        long amount = Math.round(order.getTotalAmount()) * 100L;

        // ✅ vnp_TxnRef: chỉ [a-zA-Z0-9], tối đa 100 ký tự, UNIQUE mỗi lần
        // Dùng timestamp milliseconds là đủ unique
        String txnRef = String.valueOf(System.currentTimeMillis());

        // ✅ vnp_CreateDate: yyyyMMddHHmmss theo giờ Việt Nam (GMT+7)
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Etc/GMT+7"));
        String createDate = formatter.format(cld.getTime());

        // ✅ IP mặc định
        if (ipAddress == null || ipAddress.isBlank() || "0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        // ✅ vnp_OrderInfo: không dấu, không ký tự đặc biệt
        String orderInfo = "Thanh toan don hang " + txnRef;

        // ✅ Tất cả params — TreeMap tự sort A-Z (bắt buộc)
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version",    "2.1.0");
        vnpParams.put("vnp_Command",    "pay");
        vnpParams.put("vnp_TmnCode",    vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount",     String.valueOf(amount));
        vnpParams.put("vnp_CurrCode",   "VND");
        vnpParams.put("vnp_BankCode",   ""); // để trống → user tự chọn ngân hàng
        vnpParams.put("vnp_TxnRef",     txnRef);
        vnpParams.put("vnp_OrderInfo",  orderInfo);
        vnpParams.put("vnp_OrderType",  "other");
        vnpParams.put("vnp_Locale",     "vn");
        vnpParams.put("vnp_ReturnUrl",  vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr",     ipAddress);
        vnpParams.put("vnp_CreateDate", createDate);

        // ✅ Loại bỏ param rỗng trước khi build
        vnpParams.values().removeIf(v -> v == null || v.isBlank());

        // ✅ Build hash data: key=value, KHÔNG encode, join bằng &
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            if (hashData.length() > 0) hashData.append("&");
            hashData.append(entry.getKey()).append("=").append(entry.getValue());
        }

        // ✅ Build query string: encode UTF-8
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            if (queryString.length() > 0) queryString.append("&");
            queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            queryString.append("=");
            queryString.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }

        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryString.append("&vnp_SecureHash=").append(secureHash);

        // Lưu Payment record
        saveOrUpdatePayment(order, txnRef, orderId);

        // ================= THÊM LOG DEBUG Ở ĐÂY =================
        System.out.println("=== VNPAY DEBUG ===");
        System.out.println("TmnCode: '" + vnPayConfig.getTmnCode() + "'"); // Thêm dấu nháy đơn để dễ soi khoảng trắng thừa
        System.out.println("HashSecret: '" + vnPayConfig.getHashSecret() + "'");
        System.out.println("HashData: " + hashData.toString());
        System.out.println("URL: " + vnPayConfig.getPaymentUrl() + "?" + queryString);
        System.out.println("===================");
        // ========================================================

        return vnPayConfig.getPaymentUrl() + "?" + queryString;
    }

    @Transactional
    public VNPayCallbackResult handleCallback(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");

        Map<String, String> signParams = new TreeMap<>(params);
        signParams.remove("vnp_SecureHash");
        signParams.remove("vnp_SecureHashType");

        // Build hash data từ callback params
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : signParams.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isBlank()) {
                if (hashData.length() > 0) hashData.append("&");
                hashData.append(entry.getKey()).append("=").append(entry.getValue());
            }
        }

        String calculatedHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

        if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
            return VNPayCallbackResult.builder()
                    .success(false)
                    .message("Chu ky khong hop le")
                    .build();
        }

        String responseCode = params.get("vnp_ResponseCode");
        String txnRef       = params.get("vnp_TxnRef");
        String vnpTxnNo     = params.get("vnp_TransactionNo");

        Payment payment = paymentRepository.findByTransactionId(txnRef).orElse(null);
        if (payment == null) {
            return VNPayCallbackResult.builder()
                    .success(false)
                    .message("Khong tim thay giao dich: " + txnRef)
                    .build();
        }

        Order order = payment.getOrder();
        boolean isSuccess = "00".equals(responseCode);

        if (isSuccess) {
            payment.setResult(PaymentResult.SUCCESS);
            payment.setPaidAt(Instant.now());
            payment.setGatewayTransactionNo(vnpTxnNo);
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CONFIRMED);
        } else {
            payment.setResult(PaymentResult.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);

        return VNPayCallbackResult.builder()
                .success(isSuccess)
                .orderId(order.getId())
                .message(isSuccess ? "Thanh toan thanh cong" : "Thanh toan that bai (code: " + responseCode + ")")
                .build();
    }

    private void saveOrUpdatePayment(Order order, String txnRef, String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElse(Payment.builder()
                        .order(order)
                        .amount(order.getTotalAmount())
                        .gateway(PaymentGateway.VNPAY)
                        .build());
        payment.setTransactionId(txnRef);
        payment.setResult(PaymentResult.PENDING);
        paymentRepository.save(payment);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Loi tao chu ky HMAC-SHA512", e);
        }
    }

    @lombok.Data
    @lombok.Builder
    public static class VNPayCallbackResult {
        private boolean success;
        private String orderId;
        private String message;
    }
}