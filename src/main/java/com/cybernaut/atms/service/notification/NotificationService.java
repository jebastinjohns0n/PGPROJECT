package com.cybernaut.atms.service.notification;

import com.cybernaut.atms.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendOTP(User user, String otp) {
        // Send OTP via email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your OTP for ATMS");
        message.setText("Your OTP is: " + otp + "\nThis OTP will expire in 5 minutes.");

        try {
            emailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't throw it to prevent sensitive information exposure
            System.err.println("Failed to send OTP notification: " + e.getMessage());
        }

        // TODO: Implement SMS notification if required
        // For now, we're only implementing email notification
    }

    public void sendNotification(User user, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(content);

        try {
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}