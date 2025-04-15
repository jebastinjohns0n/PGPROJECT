//package com.cybernaut.atms.util;
//
//import com.cybernaut.atms.model.User;
//import com.cybernaut.atms.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private BCryptPasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Initialize default users if they don't exist
//        initializeDefaultUsers();
//    }
//
//    private void initializeDefaultUsers() {
//        // Check if super admin exists
//        Optional<User> superAdmin = userRepository.findByEmail("superadmin@example.com");
//        if (superAdmin.isEmpty()) {
//            User user = new User();
//            user.setEmail("superadmin@example.com");
//            user.setPassword(passwordEncoder.encode("password"));
//            user.setName("Super Admin");
//            user.setRole(User.Role.SUPER_ADMIN);
//            user.setDepartment("Management");
//            user.setJoinDate(LocalDate.of(2020, 1, 1));
//            user.setPhone("+1234567890");
//            user.setAddress("123 Admin Street");
//            user.setCompletedBatches(0);
//            user.setStudentsCompleted(0);
//            user.setCompletionRate(0);
//            user.setStatus("active");
//            userRepository.save(user);
//        }
//
//        // Check if admin exists
//        Optional<User> admin = userRepository.findByEmail("admin@example.com");
//        if (admin.isEmpty()) {
//            User user = new User();
//            user.setEmail("admin@example.com");
//            user.setPassword(passwordEncoder.encode("password"));
//            user.setName("Admin User");
//            user.setRole(User.Role.ADMIN);
//            user.setDepartment("Operations");
//            user.setJoinDate(LocalDate.of(2021, 3, 15));
//            user.setPhone("+1987654321");
//            user.setAddress("456 Admin Avenue");
//            user.setCompletedBatches(0);
//            user.setStudentsCompleted(0);
//            user.setCompletionRate(0);
//            user.setStatus("active");
//            userRepository.save(user);
//        }
//
//        // Check if lecturer exists
//        Optional<User> lecturer = userRepository.findByEmail("lecturer@example.com");
//        if (lecturer.isEmpty()) {
//            User user = new User();
//            user.setEmail("lecturer@example.com");
//            user.setPassword(passwordEncoder.encode("password"));
//            user.setName("Lecturer User");
//            user.setRole(User.Role.LECTURER);
//            user.setDepartment("Training");
//            user.setJoinDate(LocalDate.of(2022, 6, 10));
//            user.setPhone("+1122334455");
//            user.setAddress("789 Lecturer Lane");
//            user.setCompletedBatches(5);
//            user.setStudentsCompleted(75);
//            user.setCompletionRate(92);
//            user.setStatus("active");
//            userRepository.save(user);
//        }
//    }
//}
//
