package com.cybernaut.atms.controller;

import com.cybernaut.atms.model.User;
import com.cybernaut.atms.service.UserService;
import com.cybernaut.atms.service.otp.OtpService;
import com.cybernaut.atms.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

   @Autowired
   private UserService userService;

   @Autowired
   private OtpService otpService;

   @Autowired
   private NotificationService notificationService;

   @GetMapping
   public ResponseEntity<List<User>> getAllUsers() {
       return ResponseEntity.ok(userService.getAllUsers());
   }

   @GetMapping("/{id}")
   public ResponseEntity<User> getUserById(@PathVariable String id) {
       Optional<User> user = userService.getUserById(id);
       return user.map(ResponseEntity::ok)
               .orElseGet(() -> ResponseEntity.notFound().build());
   }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }
    
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

   @PutMapping("/{id}")
   public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
       User updatedUser = userService.updateUser(id, userDetails);
       if (updatedUser != null) {
           return ResponseEntity.ok(updatedUser);
       }
       return ResponseEntity.notFound().build();
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteUser(@PathVariable String id) {
       userService.deleteUser(id);
       return ResponseEntity.noContent().build();
   }

   @GetMapping("/role/{role}")
   public ResponseEntity<List<User>> getUsersByRole(@PathVariable User.Role role) {
       return ResponseEntity.ok(userService.findByRole(role));
   }

   @PostMapping("/login")
   public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
       String email = credentials.get("email");
       String password = credentials.get("password");
       
       Optional<User> user = userService.findByEmail(email);
       if (user.isPresent() && user.get().isAccountLocked()) {
           Map<String, String> response = new HashMap<>();
           response.put("message", "Account is locked due to too many failed attempts. Please try again later.");
           return ResponseEntity.status(HttpStatus.LOCKED).body(response);
       }

       if (userService.authenticate(email, password)) {
           // Generate OTP
           String otp = otpService.generateOTP(email);
           // Send OTP to user's email or phone
           notificationService.sendOTP(user.get(), otp);

           Map<String, Object> response = new HashMap<>();
           response.put("message", "OTP sent to your registered email/phone");
           return ResponseEntity.ok(response);
       }

       // Increase failed attempts
       if (user.isPresent()) {
           userService.increaseFailedAttempts(user.get());
       }

       Map<String, String> response = new HashMap<>();
       response.put("message", "Invalid email or password");
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
   }
}
