package com.cybernaut.atms.service;

import com.cybernaut.atms.model.User;
import com.cybernaut.atms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

   @Autowired
   private UserRepository userRepository;

   @Autowired
   private BCryptPasswordEncoder passwordEncoder;

   @Autowired
   private OtpService otpService;

   @Autowired
   private NotificationService notificationService;

   private static final int MAX_FAILED_ATTEMPTS = 5;
   private static final long LOCK_TIME_DURATION = 24 * 60 * 60 * 1000; // 24 hours

   public List<User> getAllUsers() {
       return userRepository.findAll();
   }

   public Optional<User> getUserById(String id) {
       return userRepository.findById(id);
   }

   public User createUser(User user) {
       // Encrypt password before saving
       user.setPassword(passwordEncoder.encode(user.getPassword()));
       User savedUser = userRepository.save(user);

       // Generate OTP
       String otp = otpService.generateOTP(user.getEmail());
       // Send OTP to user's email
       notificationService.sendOTP(savedUser, otp);

       return savedUser;
   }

   public User updateUser(String id, User userDetails) {
       Optional<User> user = userRepository.findById(id);
       if (user.isPresent()) {
           User existingUser = user.get();
           existingUser.setName(userDetails.getName());
           existingUser.setEmail(userDetails.getEmail());
           existingUser.setDepartment(userDetails.getDepartment());
           existingUser.setPhone(userDetails.getPhone());
           existingUser.setAddress(userDetails.getAddress());
           existingUser.setRole(userDetails.getRole());
           existingUser.setStatus(userDetails.getStatus());
           
           // Only update password if it's provided
           if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
               existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
           }
           
           return userRepository.save(existingUser);
       }
       return null;
   }

   public void deleteUser(String id) {
       userRepository.deleteById(id);
   }

   public Optional<User> findByEmail(String email) {
       return userRepository.findByEmail(email);
   }

   public List<User> findByRole(User.Role role) {
       return userRepository.findByRole(role);
   }

   public boolean authenticate(String email, String password) {
       Optional<User> user = userRepository.findByEmail(email);
       if (user.isPresent()) {
           User foundUser = user.get();
           if (foundUser.isAccountLocked()) {
               if (unlockWhenTimeExpired(foundUser)) {
                   foundUser.setAccountLocked(false);
                   foundUser.setFailedAttempt(0);
                   userRepository.save(foundUser);
               } else {
                   return false;
               }
           }

           if (passwordEncoder.matches(password, foundUser.getPassword())) {
               foundUser.setFailedAttempt(0);
               userRepository.save(foundUser);
               return true;
           } else {
               increaseFailedAttempts(foundUser);
           }
       }
       return false;
   }

   private void increaseFailedAttempts(User user) {
       int newFailAttempts = user.getFailedAttempt() + 1;
       user.setFailedAttempt(newFailAttempts);
       if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
           user.setAccountLocked(true);
           user.setLockTime(new Date());
       }
       userRepository.save(user);
   }

   private boolean unlockWhenTimeExpired(User user) {
       long lockTimeInMillis = user.getLockTime().getTime();
       long currentTimeInMillis = System.currentTimeMillis();

       if (lockTimeInMillis + LOCK_TIME_DURATION < currentTimeInMillis) {
           user.setAccountLocked(false);
           user.setLockTime(null);
           user.setFailedAttempt(0);
           userRepository.save(user);
           return true;
       }
       return false;
   }
}
