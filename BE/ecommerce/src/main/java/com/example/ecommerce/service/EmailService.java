package com.example.ecommerce.service;

import com.example.ecommerce.exception.AppException;
import com.example.ecommerce.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendVerificationEmail(String to, String token) {
        String verifyUrl = baseUrl + "/verify-email?token=" + token;
        String subject = "TMDT - Xác nhận email đăng ký";
        String body = """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
                    <h2 style="color:#dc2626;">TMDT</h2>
                    <p>Xin chào,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm nút bên dưới để xác nhận email:</p>
                    <div style="text-align:center;margin:24px 0;">
                        <a href="%s" style="display:inline-block;padding:12px 32px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Xác nhận Email</a>
                    </div>
                    <p style="font-size:13px;color:#6b7280;">Link có hiệu lực trong 24 giờ. Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</p>
                </div>
                """
                .formatted(verifyUrl);

        sendHtmlEmail(to, subject, body);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "TMDT - Mã OTP đặt lại mật khẩu";
        String body = """
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
                    <h2 style="color:#dc2626;">TMDT</h2>
                    <p>Xin chào,</p>
                    <p>Mã OTP để đặt lại mật khẩu của bạn là:</p>
                    <div style="text-align:center;margin:24px 0;">
                        <span style="display:inline-block;padding:16px 32px;background:#f3f4f6;border-radius:8px;font-size:32px;font-weight:bold;letter-spacing:8px;color:#111827;">%s</span>
                    </div>
                    <p style="font-size:13px;color:#6b7280;">Mã có hiệu lực trong 5 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
                </div>
                """
                .formatted(otp);

        sendHtmlEmail(to, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }
}
