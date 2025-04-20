package com.cybernaut.atms.service.otp;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    private static final int OTP_LENGTH = 6;
    private static final long OTP_VALID_DURATION = 5 * 60 * 1000; // 5 minutes

    private Map<String, OtpData> otpMap = new HashMap<>();

    public String generateOTP(String identifier) {
        String otp = generateRandomOTP();
        otpMap.put(identifier, new OtpData(otp, System.currentTimeMillis()));
        return otp;
    }

    public boolean validateOTP(String identifier, String otp) {
        OtpData otpData = otpMap.get(identifier);
        if (otpData == null) {
            return false;
        }

        // Check if OTP is expired
        if (System.currentTimeMillis() - otpData.timestamp > OTP_VALID_DURATION) {
            otpMap.remove(identifier);
            return false;
        }

        // Validate OTP
        if (otpData.otp.equals(otp)) {
            otpMap.remove(identifier); // Remove OTP after successful validation
            return true;
        }

        return false;
    }

    private String generateRandomOTP() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private static class OtpData {
        String otp;
        long timestamp;

        OtpData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }
}