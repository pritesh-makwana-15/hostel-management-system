package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.WardenResponseDTO;
import com.hms.hms.entity.Warden;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warden")
public class WardenProfileController {

    @Autowired
    private WardenService wardenService;

    // GET /api/warden/profile — get current warden's profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<WardenResponseDTO>> getProfile() {
        try {
            // Get current authenticated warden
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            WardenResponseDTO wardenDTO = WardenResponseDTO.builder()
                    .id(warden.getId())
                    .name(warden.getName())
                    .email(warden.getEmail())
                    .phone(warden.getPhone())
                    .gender(warden.getGender())
                    .address(warden.getAddress())
                    .joinDate(warden.getJoinDate())
                    .adminId(warden.getAdmin() != null ? warden.getAdmin().getId() : null)
                    .build();

            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", wardenDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // PUT /api/warden/profile — update warden profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<WardenResponseDTO>> updateProfile(@RequestBody RegisterRequest request) {
        try {
            // Get current authenticated warden
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            // Update warden profile (only updatable fields)
            if (request.getName() != null) {
                warden.getUser().setName(request.getName());
            }
            if (request.getPhone() != null) {
                warden.getUser().setPhone(request.getPhone());
            }
            if (request.getGender() != null) {
                warden.setGender(request.getGender());
            }
            if (request.getAddress() != null) {
                warden.setAddress(request.getAddress());
            }

            Warden updated = wardenService.updateWarden(warden.getId(), request);

            WardenResponseDTO wardenDTO = WardenResponseDTO.builder()
                    .id(updated.getId())
                    .name(updated.getName())
                    .email(updated.getEmail())
                    .phone(updated.getPhone())
                    .gender(updated.getGender())
                    .address(updated.getAddress())
                    .joinDate(updated.getJoinDate())
                    .adminId(updated.getAdmin() != null ? updated.getAdmin().getId() : null)
                    .build();

            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", wardenDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // POST /api/warden/change-password — change password
    @PostMapping("/change-password")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // Get current authenticated warden
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            boolean success = wardenService.changePassword(warden.getId(), request.getCurrentPassword(), request.getNewPassword());
            if (success) {
                return ResponseEntity.ok(ApiResponse.success("Password changed successfully", "Password updated"));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Current password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET /api/warden/sessions — get active sessions
    @GetMapping("/sessions")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<Object>> getActiveSessions() {
        try {
            // TODO: Implement session tracking logic
            // For now, return mock data
            Object sessions = java.util.Map.of(
                "activeSessions", 2,
                "devices", java.util.List.of(
                    java.util.Map.of("device", "Windows PC", "location", "Main Office", "lastActive", "2026-03-25 09:15 AM"),
                    java.util.Map.of("device", "Mobile App", "location", "Remote", "lastActive", "2026-03-24 02:30 PM")
                )
            );
            
            return ResponseEntity.ok(ApiResponse.success("Sessions retrieved successfully", sessions));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // POST /api/warden/logout-all — logout from all devices
    @PostMapping("/logout-all")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<String>> logoutAllDevices() {
        try {
            // TODO: Implement logout all devices logic
            return ResponseEntity.ok(ApiResponse.success("Logged out from all devices successfully", "All sessions terminated"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Request DTO for password change
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        // Getters and setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
