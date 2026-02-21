package com.hms.hms.service;

import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Admin;
import com.hms.hms.entity.User;
import com.hms.hms.entity.Warden;
import com.hms.hms.repository.AdminRepository;
import com.hms.hms.repository.UserRepository;
import com.hms.hms.repository.WardenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WardenService {

    @Autowired private UserRepository userRepository;
    @Autowired private WardenRepository wardenRepository;
    @Autowired private AdminRepository AdminRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Transactional
    public Warden createWarden(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // 1. Save user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.WARDEN)
                .build();
        user = userRepository.save(user);

        // 2. Resolve admin (optional)
        Admin admin = null;
        if (request.getAdminId() != null) {
            admin = AdminRepository.findById(request.getAdminId()).orElse(null);
        }

        // 3. Save warden profile
        Warden warden = Warden.builder()
                .user(user)
                .admin(admin)
                .gender(request.getGender())
                .address(request.getAddress())
                .joinDate(request.getJoinDate())
                .build();
        return wardenRepository.save(warden);
    }

    public List<Warden> getAllWardens() {
        return wardenRepository.findAll();
    }

    public Warden getById(Long id) {
        return wardenRepository.findById(id).orElse(null);
    }

    @Transactional
    public Warden updateWarden(Long id, RegisterRequest request) {
        Warden existing = wardenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warden not found: " + id));

        User user = existing.getUser();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        if (request.getAdminId() != null) {
            AdminRepository.findById(request.getAdminId()).ifPresent(existing::setAdmin);
        }
        existing.setGender(request.getGender());
        existing.setAddress(request.getAddress());
        existing.setJoinDate(request.getJoinDate());
        return wardenRepository.save(existing);
    }

    @Transactional
    public String deleteWarden(Long id) {
        Warden warden = wardenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warden not found: " + id));
        wardenRepository.delete(warden);
        userRepository.delete(warden.getUser());
        return "Deleted warden with id: " + id;
    }
}