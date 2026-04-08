package com.hms.hms.config;

import com.hms.hms.entity.Admin;
import com.hms.hms.entity.User;
import com.hms.hms.repository.AdminRepository;
import com.hms.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.existsByEmail("admin@hms.com")) {
            // Create admin user
            User adminUser = User.builder()
                    .name("Admin User")
                    .email("admin@hms.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9876543210")
                    .role(User.Role.ADMIN)
                    .build();
            
            adminUser = userRepository.save(adminUser);
            
            // Create admin profile
            Admin adminProfile = Admin.builder()
                    .user(adminUser)
                    .designation("System Administrator")
                    .phone("9876543210")
                    .build();
            
            adminRepository.save(adminProfile);
            
            System.out.println("Admin user created successfully!");
            System.out.println("Email: admin@hms.com");
            System.out.println("Password: admin123");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
