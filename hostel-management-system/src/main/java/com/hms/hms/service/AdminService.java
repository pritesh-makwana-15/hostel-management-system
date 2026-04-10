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
    @Autowired private AdminRepository adminRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Admin createAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new RuntimeException("Email already registered: " + request.email);
        }

        // 1. Save user
        User user = new User();
        user.name = request.name;
        user.email = request.email;
        user.password = passwordEncoder.encode(request.password);
        user.phone = request.phone;
        user.role = User.Role.ADMIN;
        user = userRepository.save(user);

        // 2. Save admin profile
        Admin profile = new Admin();
        profile.user = user;
        profile.designation = request.designation;
        profile.phone = request.phone;
        return adminRepository.save(profile);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin getByEmail(String email) {
        if (email == null || email.isBlank()) return null;

        return userRepository.findByEmail(email)
                .flatMap(u -> adminRepository.findByUserId(u.id))
                .orElse(null);
    }

    public Admin save(Admin admin) {
        // Save user first if it has changes
        if (admin.user != null) {
            userRepository.save(admin.user);
        }
        return adminRepository.save(admin);
    }

    @Transactional
    public Admin updateAdmin(Long id, RegisterRequest request) {
        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        User user = existing.user;
        user.name = request.name;
        user.phone = request.phone;
        if (request.password != null && !request.password.isBlank()) {
            user.password = passwordEncoder.encode(request.password);
        }
        userRepository.save(user);

        existing.designation = request.designation;
        existing.phone = request.phone;
        return adminRepository.save(existing);
    }

    @Transactional
    public String deleteAdmin(Long id) {
        Admin profile = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found: " + id));
        adminRepository.delete(profile);
        userRepository.delete(profile.user);
        return "Deleted admin with id: " + id;
    }
}