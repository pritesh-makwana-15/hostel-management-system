package com.hms.hms.controller;

import com.hms.hms.entity.User;
import com.hms.hms.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection
    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user
     * POST /auth/register
     * @param user - User details from request body
     * @return success message
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            // Step 1: Register user (service handles password encryption)
            User registeredUser = userService.registerUser(user);

            // Step 2: Return success response
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully with email: " + registeredUser.getEmail());

        } catch (RuntimeException e) {
            // Handle duplicate email or other errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Login endpoint (simple authentication without JWT)
     * POST /auth/login
     * @param loginRequest - email and password
     * @return success message
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Step 1: Fetch user by email
            User user = userService.getUserByEmail(loginRequest.getEmail());

            // Step 2: Verify password
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                // Authentication successful
                return ResponseEntity.ok("Login successful for user: " + user.getEmail() + " with role: " + user.getRole());
            } else {
                // Wrong password
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid credentials");
            }

        } catch (RuntimeException e) {
            // User not found or other error
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + e.getMessage());
        }
    }

    /**
     * Simple inner class for login request
     */
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and Setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}