package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.service.StudentService;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {

    @Autowired private StudentService studentService;
    @Autowired private StudentRepository studentRepository;

    // Get current authenticated student's ID
    private Long getCurrentStudentId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // Get email from authentication
        
        // Find student by email through their user account
        Student student = studentRepository.findByUserEmail(email)
            .orElseThrow(() -> new RuntimeException("Student not found for email: " + email));
        
        return student.getId();
    }

    // GET /api/student/profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile() {
        Long studentId = getCurrentStudentId();
        StudentProfileDTO profile = studentService.getProfile(studentId);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    // PUT /api/student/profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> updateProfile(@RequestBody Map<String, String> updates) {
        Long studentId = getCurrentStudentId();
        
        // Create RegisterRequest with only updatable fields
        RegisterRequest request = new RegisterRequest();
        request.setName(updates.get("name"));
        request.setPhone(updates.get("phone"));
        
        StudentProfileDTO updated = studentService.updateStudentProfile(studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    // POST /api/student/change-password
    @PostMapping("/change-password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody Map<String, String> passwordData) {
        Long studentId = getCurrentStudentId();
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        boolean success = studentService.changePassword(studentId, currentPassword, newPassword);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Current password is incorrect"));
        }
    }

    // GET /api/student/payment-history
    @GetMapping("/payment-history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getPaymentHistory() {
        Long studentId = getCurrentStudentId();
        StudentProfileDTO profile = studentService.getProfile(studentId);
        return ResponseEntity.ok(ApiResponse.success("Payment history fetched", profile));
    }

    // GET /api/student/complaints
    @GetMapping("/complaints")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getComplaints() {
        Long studentId = getCurrentStudentId();
        StudentProfileDTO profile = studentService.getProfile(studentId);
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched", profile));
    }

    // POST /api/student/complaints
    @PostMapping("/complaints")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> createComplaint(@RequestBody Map<String, String> complaintData) {
        Long studentId = getCurrentStudentId();
        String category = complaintData.get("category");
        String description = complaintData.get("description");
        
        String result = studentService.createComplaint(studentId, category, description);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    // POST /api/student/logout-all
    @PostMapping("/logout-all")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> logoutAllDevices() {
        // TODO: Implement logout all devices logic
        // This might involve invalidating all JWT tokens for the user
        return ResponseEntity.ok(ApiResponse.success("Logged out from all devices", null));
    }
}
