package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Admin;
import com.hms.hms.entity.User;
import com.hms.hms.repository.AdminRepository;
import com.hms.hms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private AdminRepository AdminRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Admin createAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // 1. Save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.ADMIN)
                .build();
        user = userRepository.save(user);

        // 2. Save admin profile
        Admin profile = Admin.builder()
                .user(user)
                .designation(request.getDesignation())
                .phone(request.getPhone())
                .build();
        return AdminRepository.save(profile);
    }

    public List<Admin> getAllAdmins() {
        return AdminRepository.findAll();
    }

    public Admin getById(Long id) {
        return AdminRepository.findById(id).orElse(null);
    }

    @Transactional
    public Admin updateAdmin(Long id, RegisterRequest request) {
        Admin existing = AdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        User user = existing.getUser();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        existing.setDesignation(request.getDesignation());
        existing.setPhone(request.getPhone());
        return AdminRepository.save(existing);
    }

    @Transactional
    public String deleteAdmin(Long id) {
        Admin profile = AdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));
        AdminRepository.delete(profile);
        userRepository.delete(profile.getUser());
        return "Deleted admin with id: " + id;
    }
}