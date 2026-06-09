package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.ResolveComplaintRequest;
import com.hms.hms.dto.WardenResponseDTO;
import com.hms.hms.dto.WardenComplaintDTO;
import com.hms.hms.entity.Warden;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // GET /api/warden/complaints — get complaints assigned to current warden
    @GetMapping("/complaints")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<java.util.List<com.hms.hms.dto.WardenComplaintDTO>>> getComplaints() {
        try {
            // Get current authenticated warden
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            // Fetch complaints from the complaint table for the list view
            java.util.List<com.hms.hms.dto.WardenComplaintDTO> complaints = wardenService.getAllComplaints();
            
            return ResponseEntity.ok(ApiResponse.success("Complaints fetched", complaints));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to fetch complaints: " + e.getMessage()));
        }
    }

    // PUT /api/warden/complaints/{id}/status — persist a status update
    @PutMapping("/complaints/{id}/status")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<WardenComplaintDTO>> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody ResolveComplaintRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            WardenComplaintDTO updated = wardenService.updateComplaintStatus(id, email, request);
            return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to update complaint status: " + e.getMessage()));
        }
    }

    // GET /api/warden/complaints/pending — get pending complaints assigned to current warden
    @GetMapping("/complaints/pending")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<List<com.hms.hms.dto.WardenComplaintDTO>>> getPendingComplaints() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            List<com.hms.hms.dto.WardenComplaintDTO> pending = wardenService.getComplaints(warden.getId())
                    .stream()
                    .filter(c -> c.getStatus() != null)
                    .filter(c -> {
                        String s = c.getStatus().trim();
                        return "Open".equalsIgnoreCase(s) || "In Progress".equalsIgnoreCase(s);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Pending complaints fetched", pending));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to fetch pending complaints: " + e.getMessage()));
        }
    }

    // GET /api/warden/dashboard/stats — dashboard summary stats
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            List<com.hms.hms.dto.WardenComplaintDTO> complaints = wardenService.getComplaints(warden.getId());

            long pending = complaints.stream()
                    .filter(c -> c.getStatus() != null)
                    .filter(c -> {
                        String s = c.getStatus().trim();
                        return "Open".equalsIgnoreCase(s) || "In Progress".equalsIgnoreCase(s);
                    })
                    .count();

            long urgent = complaints.stream()
                    .filter(c -> c.getPriority() != null)
                    .filter(c -> {
                        String p = c.getPriority().trim();
                        return "High".equalsIgnoreCase(p) || "Critical".equalsIgnoreCase(p);
                    })
                    .count();

            long students = complaints.stream()
                    .map(com.hms.hms.dto.WardenComplaintDTO::getStudentUserId)
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .count();

            long rooms = complaints.stream()
                    .map(com.hms.hms.dto.WardenComplaintDTO::getRoomNumber)
                    .filter(r -> r != null && !r.isBlank())
                    .distinct()
                    .count();

            Map<String, Object> stats = Map.of(
                    "studentsUnderWarden", students,
                    "newStudentsThisMonth", 0,
                    "roomsManaged", rooms,
                    "vacanciesRemaining", 0,
                    "pendingComplaints", pending,
                    "urgentEscalations", urgent,
                    "announcementsCount", 0,
                    "lastAnnouncementTime", "No recent announcements"
            );

            return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", stats));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    // GET /api/warden/alerts — dashboard alerts derived from high-priority complaints
    @GetMapping("/alerts")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAlerts() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> alerts = wardenService.getComplaints(warden.getId())
                    .stream()
                    .filter(c -> c.getPriority() != null)
                    .filter(c -> {
                        String p = c.getPriority().trim();
                        return "High".equalsIgnoreCase(p) || "Critical".equalsIgnoreCase(p);
                    })
                    .limit(5)
                    .map(c -> Map.<String, Object>of(
                            "id", c.getComplaintCode() != null ? c.getComplaintCode() : c.getId(),
                            "message", (c.getTitle() != null ? c.getTitle() : "High priority complaint") +
                                    (c.getRoomNumber() != null ? " - Room " + c.getRoomNumber() : ""),
                            "createdAt", (c.getSubmittedDate() != null ? c.getSubmittedDate() : "") +
                                    (c.getSubmittedTime() != null ? " " + c.getSubmittedTime() : ""),
                            "active", true
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Alerts fetched", alerts));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to fetch alerts: " + e.getMessage()));
        }
    }

    // GET /api/warden/activities — dashboard recent activity stream
    @GetMapping("/activities")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getActivities() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            Warden warden = wardenService.getByEmail(email);
            if (warden == null) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> activities = wardenService.getComplaints(warden.getId())
                    .stream()
                    .limit(10)
                    .map(c -> {
                        String status = c.getStatus() == null ? "Open" : c.getStatus();
                        String uiStatus = ("Resolved".equalsIgnoreCase(status) || "Closed".equalsIgnoreCase(status))
                                ? "Completed"
                                : "Pending";
                        String dateTime = (c.getSubmittedDate() != null ? c.getSubmittedDate() : "") +
                                (c.getSubmittedTime() != null ? " " + c.getSubmittedTime() : "");

                        return Map.<String, Object>of(
                                "id", c.getComplaintCode() != null ? c.getComplaintCode() : c.getId(),
                                "type", "Complaint " + status,
                                "description", (c.getComplaintCode() != null ? c.getComplaintCode() + " - " : "") +
                                        (c.getTitle() != null ? c.getTitle() : "Complaint updated"),
                                "createdAt", dateTime.isBlank() ? "Just now" : dateTime,
                                "status", uiStatus
                        );
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Activities fetched", activities));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to fetch activities: " + e.getMessage()));
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
