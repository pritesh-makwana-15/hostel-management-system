package com.hms.hms.service;

import com.hms.hms.repository.UserRepository;
import com.hms.hms.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection (recommended over @Autowired)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user in the system
     * @param user - User object with details
     * @return saved User entity
     * @throws RuntimeException if email already exists
     */
    public User registerUser(User user) {
        // Step 1: Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }

        // Step 2: Encrypt the password before saving
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // Step 3: Save user to database
        User savedUser = userRepository.save(user);

        return savedUser;
    }

    /**
     * Fetch user by email address
     * @param email - user's email
     * @return User entity
     * @throws RuntimeException if user not found
     */
    public User getUserByEmail(String email) {
        // Fetch user from database or throw exception
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}