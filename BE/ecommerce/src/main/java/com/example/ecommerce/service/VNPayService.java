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

        long amount = Math.round(order.getTotalAmount()) * 100L;
        String txnRef = String.valueOf(System.currentTimeMillis());

        // 1. ÉP BUỘC DÙNG GMT+7 CHUẨN ĐỂ KHÔNG BỊ LỆCH GIỜ GÂY LỖI 70
        TimeZone tz = TimeZone.getTimeZone("GMT+7");
        Calendar cld = Calendar.getInstance(tz);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(tz);

        String createDate = formatter.format(cld.getTime());

        // VNPay v2.1.0 BẮT BUỘC có thời gian hết hạn (sau 15 phút)
        cld.add(Calendar.MINUTE, 15);
        String expireDate = formatter.format(cld.getTime());

        if (ipAddress == null || ipAddress.isBlank() || "0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        // 2. BỎ KHOẢNG TRẮNG Ở ORDER INFO ĐỂ TRÁNH LỖI ENCODE SAI CHỮ KÝ (HASH)
        String orderInfo = "ThanhToanDonHang_" + txnRef;

        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version",    "2.1.0");
        vnpParams.put("vnp_Command",    "pay");
        vnpParams.put("vnp_TmnCode",    vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount",     String.valueOf(amount));
        vnpParams.put("vnp_CurrCode",   "VND");
        // 3. SET CỨNG NGÂN HÀNG NCB ĐỂ VÀO THẲNG FORM THANH TOÁN (TRÁNH LỖI ĐỊNH TUYẾN)
        vnpParams.put("vnp_BankCode",   "NCB");
        vnpParams.put("vnp_TxnRef",     txnRef);
        vnpParams.put("vnp_OrderInfo",  orderInfo);
        vnpParams.put("vnp_OrderType",  "other");
        vnpParams.put("vnp_Locale",     "vn");
        vnpParams.put("vnp_ReturnUrl",  vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr",     ipAddress);
        vnpParams.put("vnp_CreateDate", createDate);
        vnpParams.put("vnp_ExpireDate", expireDate);

        // Xóa các param rỗng
        vnpParams.values().removeIf(v -> v == null || v.isBlank());

        try {
            // 4. ÁP DỤNG CHUẨN ENCODE US_ASCII CỦA VNPAY
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            Iterator<Map.Entry<String, String>> itr = vnpParams.entrySet().iterator();
            while (itr.hasNext()) {
                Map.Entry<String, String> entry = itr.next();
                String fieldName = entry.getKey();
                String fieldValue = entry.getValue();

                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }

            String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);

            saveOrUpdatePayment(order, txnRef, orderId);

            System.out.println("=== VNPAY CHỐNG ĐẠN DEBUG ===");
            System.out.println("CreateDate: " + createDate);
            System.out.println("ExpireDate: " + expireDate);
            System.out.println("HashData: " + hashData.toString());
            System.out.println("===============================");

            return vnPayConfig.getPaymentUrl() + "?" + query.toString();

        } catch (Exception e) {
            throw new RuntimeException("Loi tao URL VNPay", e);
        }
    }

    @Transactional
    public VNPayCallbackResult handleCallback(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");

        Map<String, String> signParams = new TreeMap<>(params);
        signParams.remove("vnp_SecureHash");
        signParams.remove("vnp_SecureHashType");

        try {
            StringBuilder hashData = new StringBuilder();
            Iterator<Map.Entry<String, String>> itr = signParams.entrySet().iterator();
            while (itr.hasNext()) {
                Map.Entry<String, String> entry = itr.next();
                String fieldName = entry.getKey();
                String fieldValue = entry.getValue();

                if (fieldValue != null && !fieldValue.isBlank()) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            String calculatedHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

            if (!calculatedHash.equalsIgnoreCase(receivedHash)) {
                return VNPayCallbackResult.builder().success(false).message("Chu ky khong hop le").build();
            }

            String responseCode = params.get("vnp_ResponseCode");
            String txnRef       = params.get("vnp_TxnRef");
            String vnpTxnNo     = params.get("vnp_TransactionNo");

            Payment payment = paymentRepository.findByTransactionId(txnRef).orElse(null);
            if (payment == null) {
                return VNPayCallbackResult.builder().success(false).message("Khong tim thay giao dich: " + txnRef).build();
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
        } catch (Exception e) {
            throw new RuntimeException("Loi callback VNPay", e);
        }
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