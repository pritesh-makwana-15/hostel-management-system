package com.hms.hms.controller;

import com.hms.hms.dto.AdminComplaintDTO;
import com.hms.hms.dto.AdminPaymentUpdateRequest;
import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.AdminMeDTO;
import com.hms.hms.dto.AdminResponseDTO;
import com.hms.hms.dto.AssignComplaintRequest;
import com.hms.hms.dto.FeePaymentDTO;
import com.hms.hms.dto.PasswordChangeRequest;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.ResolveComplaintRequest;
import com.hms.hms.dto.StudentFeeSummaryDTO;
import com.hms.hms.entity.Admin;
import com.hms.hms.service.FeePaymentService;
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

    @Autowired
    private FeePaymentService feePaymentService;

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

    // ── Admin Fees API ───────────────────────────────────────────
    @GetMapping("/fees")
    public ResponseEntity<ApiResponse<List<StudentFeeSummaryDTO>>> getAllFeeRecords() {
        List<StudentFeeSummaryDTO> records = feePaymentService.getAllFeeRecords();
        return ResponseEntity.ok(ApiResponse.success("Fee records fetched", records));
    }

    @GetMapping("/fees/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentFeeSummaryDTO>>> getStudentFeeRecords(@PathVariable Long studentId) {
        List<StudentFeeSummaryDTO> records = feePaymentService.getFeeRecordsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student fee records fetched", records));
    }

    @GetMapping("/fees/student/{studentId}/payments")
    public ResponseEntity<ApiResponse<List<FeePaymentDTO>>> getStudentFeePayments(@PathVariable Long studentId) {
        List<FeePaymentDTO> payments = feePaymentService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student payments fetched", payments));
    }

    @GetMapping("/fees/payments")
    public ResponseEntity<ApiResponse<List<FeePaymentDTO>>> getAllFeePayments() {
        List<FeePaymentDTO> payments = feePaymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("All fee payments fetched", payments));
    }

    @PutMapping("/fees/payments/{paymentId}/verify")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> verifyPayment(
            Authentication authentication,
            @PathVariable String paymentId,
            @RequestBody(required = false) AdminPaymentUpdateRequest request
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        String note = request != null ? request.getNotes() : null;
        FeePaymentDTO verified = feePaymentService.verifyPayment(paymentId, adminEmail, note);
        return ResponseEntity.ok(ApiResponse.success("Payment verified", verified));
    }

    @PutMapping("/fees/payments/{paymentId}/reject")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> rejectPayment(
            Authentication authentication,
            @PathVariable String paymentId,
            @RequestBody(required = false) AdminPaymentUpdateRequest request
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        String note = request != null ? request.getNotes() : null;
        FeePaymentDTO rejected = feePaymentService.rejectPayment(paymentId, adminEmail, note);
        return ResponseEntity.ok(ApiResponse.success("Payment rejected", rejected));
    }

    @PutMapping("/fees/payments/{paymentId}/refund")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> refundPayment(
            Authentication authentication,
            @PathVariable String paymentId,
            @RequestBody(required = false) AdminPaymentUpdateRequest request
    ) {
        String adminEmail = authentication != null ? authentication.getName() : "ADMIN";
        String note = request != null ? request.getNotes() : null;
        FeePaymentDTO refunded = feePaymentService.refundPayment(paymentId, adminEmail, note);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded", refunded));
    }

    // ── Admin Complaints API ──────────────────────────────────────
    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<AdminComplaintDTO>>> getAllComplaints() {
        try {
            List<AdminComplaintDTO> complaints = adminService.getAllComplaints();
            return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaints));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch complaints: " + e.getMessage()));
        }
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse<AdminComplaintDTO>> getComplaintById(@PathVariable Long id) {
        try {
            AdminComplaintDTO complaint = adminService.getComplaintById(id);
            return ResponseEntity.ok(ApiResponse.success("Complaint fetched successfully", complaint));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Complaint not found: " + e.getMessage()));
        }
    }

    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<ApiResponse<AdminComplaintDTO>> assignComplaint(
            @PathVariable Long id,
            @RequestBody AssignComplaintRequest request) {
        try {
            AdminComplaintDTO complaint = adminService.assignComplaint(id, request);
            return ResponseEntity.ok(ApiResponse.success("Warden assigned successfully", complaint));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Failed to assign warden: " + e.getMessage()));
        }
    }

    @PutMapping("/complaints/{id}/resolve")
    public ResponseEntity<ApiResponse<AdminComplaintDTO>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody ResolveComplaintRequest request) {
        try {
            AdminComplaintDTO complaint = adminService.resolveComplaint(id, request);
            return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", complaint));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Failed to update complaint: " + e.getMessage()));
        }
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