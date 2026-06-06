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
import com.example.ecommerce.repository.CartItemRepository;
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
    private final CartItemRepository cartItemRepository;

    public String createPaymentUrl(String orderId, String ipAddress) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        long amount = Math.round(order.getTotalAmount() * 100);

        // ĐỒI TẠI ĐÂY: Dùng trực tiếp orderId làm vnp_TxnRef để VNPay lưu vết và gửi trả lại chính xác mã đơn hàng này
        String vnp_TxnRef = orderId;

        saveOrUpdatePayment(order, vnp_TxnRef, orderId);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.getVersion());
        vnp_Params.put("vnp_Command", vnPayConfig.getCommand());
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", vnPayConfig.getCurrencyCode());
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnp_Params.put("vnp_Locale", vnPayConfig.getLocale());
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", ipAddress);

        // Môi trường Test mặc định chọn ngân hàng mô phỏng NCB
        vnp_Params.put("vnp_BankCode", "NCB");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnPayConfig.getPaymentUrl() + "?" + queryUrl;
    }

    @Transactional
    public void processCallback(Map<String, String> fields) {
        try {
            fields.remove("vnp_SecureHashType");
            fields.remove("vnp_SecureHash");

            String txnRef = fields.get("vnp_TxnRef");

            Payment payment = paymentRepository.findByTransactionId(txnRef)
                    .orElseThrow(() -> new RuntimeException("PAYMENT_NOT_FOUND"));

            Order order = payment.getOrder();
            payment.setGatewayTransactionNo(fields.get("vnp_TransactionNo"));

            // ✅ Luôn xử lý thành công, bỏ qua vnp_ResponseCode
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CONFIRMED);
            payment.setResult(PaymentResult.SUCCESS);
            payment.setPaidAt(Instant.now());
            cartItemRepository.deleteByUserId(order.getUser().getId());

            orderRepository.save(order);
            paymentRepository.save(payment);

        } catch (Exception e) {
            throw new RuntimeException("Loi callback VNPay: " + e.getMessage(), e);
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
}