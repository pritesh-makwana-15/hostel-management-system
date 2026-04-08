package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.AdminMeDTO;
import com.hms.hms.dto.AdminResponseDTO;
import com.hms.hms.dto.PasswordChangeRequest;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Admin;
import com.hms.hms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponseDTO>>> getAllAdmins() {
        List<AdminResponseDTO> list = adminService.getAllAdmins()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Admins fetched", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdminResponseDTO>> createAdmin(@RequestBody RegisterRequest request) {
        Admin admin = adminService.createAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Admin created", toDTO(admin)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> getById(@PathVariable Long id) {
        Admin profile = adminService.getById(id);
        if (profile == null) return ResponseEntity.status(404).body(ApiResponse.error("Admin not found"));
        return ResponseEntity.ok(ApiResponse.success("Admin found", toDTO(profile)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminMeDTO>> getMe(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Admin profile = adminService.getByEmail(email);
        if (profile == null) return ResponseEntity.status(404).body(ApiResponse.error("Admin not found"));
        return ResponseEntity.ok(ApiResponse.success("Admin profile fetched", toMeDTO(profile)));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<AdminMeDTO>> getProfile(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        Admin profile = adminService.getByEmail(email);
        if (profile == null) return ResponseEntity.status(404).body(ApiResponse.error("Admin not found"));
        return ResponseEntity.ok(ApiResponse.success("Admin profile fetched", toMeDTO(profile)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AdminMeDTO>> updateProfile(Authentication authentication, @RequestBody RegisterRequest request) {
        String email = authentication != null ? authentication.getName() : null;
        Admin admin = adminService.getByEmail(email);
        if (admin == null) return ResponseEntity.status(404).body(ApiResponse.error("Admin not found"));

        // Update name and phone through user entity
        admin.getUser().setName(request.getName());
        admin.getUser().setPhone(request.getPhone());
        admin.setPhone(request.getPhone());
        Admin updated = adminService.save(admin);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", toMeDTO(updated)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Authentication authentication, @RequestBody PasswordChangeRequest request) {
        String email = authentication != null ? authentication.getName() : null;
        Admin admin = adminService.getByEmail(email);
        if (admin == null) return ResponseEntity.status(404).body(ApiResponse.error("Admin not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getUser().getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Current password is incorrect"));
        }

        // Update password
        admin.getUser().setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminService.save(admin);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponseDTO>> updateAdmin(@PathVariable Long id, @RequestBody RegisterRequest request) {
        Admin updated = adminService.updateAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("Admin updated", toDTO(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAdmin(@PathVariable Long id) {
        String result = adminService.deleteAdmin(id);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    private AdminResponseDTO toDTO(Admin a) {
        return AdminResponseDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .email(a.getEmail())
                .phone(a.getPhone())
                .designation(a.getDesignation())
                .build();
    }

    private AdminMeDTO toMeDTO(Admin a) {
        String role = (a.getUser() != null && a.getUser().getRole() != null) ? a.getUser().getRole().name() : null;
        return AdminMeDTO.builder()
                .id(a.getId())
                .name(a.getName())
                .email(a.getEmail())
                .phone(a.getPhone())
                .designation(a.getDesignation())
                .role(role)
                .createdAt(a.getCreatedAt())
                .build();
    }
}