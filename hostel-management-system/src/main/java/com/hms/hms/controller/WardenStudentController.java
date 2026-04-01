package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.dto.StudentResponseDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.entity.Warden;
import com.hms.hms.service.StudentService;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/warden/students")
public class WardenStudentController {

    @Autowired private StudentService studentService;
    @Autowired private WardenService wardenService;

    // ── GET /api/warden/students ───────────────────────────────
    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<Page<StudentResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage = studentService.getAllStudents(pageable);
        Page<StudentResponseDTO> dtoPage = studentPage.map(this::toDTO);
        return ResponseEntity.ok(ApiResponse.success("Students fetched", dtoPage));
    }

    // ── GET /api/warden/students/{id} ──────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getById(@PathVariable Long id) {
        StudentResponseDTO student = toDTO(studentService.getById(id));
        return ResponseEntity.ok(ApiResponse.success("Student found", student));
    }

    // ── GET /api/warden/students/{id}/profile ──────────────────
    // Returns full joined data: personal + academic + hostel + fees + complaints
    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile(@PathVariable Long id) {
        StudentProfileDTO profile = studentService.getProfile(id);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", profile));
    }

    // ── PUT /api/warden/students/{id} ──────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> update(
            @PathVariable Long id, @RequestBody Map<String, Object> request) {
        Student updated = studentService.updatePartial(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated", toDTO(updated)));
    }

    // ── PATCH /api/warden/students/{id}/status ─────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        StudentResponseDTO updated = toDTO(studentService.updateStatus(id, body.get("status")));
        return ResponseEntity.ok(ApiResponse.success("Status updated", updated));
    }

    private StudentResponseDTO toDTO(Student s) {
        return StudentResponseDTO.builder()
                .id(s.getId())
                .enrollmentNo(s.getEnrollmentNo())
                .status(s.getStatus())
                // User
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                // Personal
                .gender(s.getGender())
                .dob(s.getDob())
                .nationality(s.getNationality())
                .photoUrl(s.getPhotoUrl())
                // Academic
                .course(s.getCourse())
                .yearSemester(s.getYearSemester())
                .batch(s.getBatch())
                .program(s.getProgram())
                // Guardian
                .guardianName(s.getGuardianName())
                .guardianPhone(s.getGuardianPhone())
                .guardianRelation(s.getGuardianRelation())
                .address(s.getAddress())
                // Hostel
                .hostelBlock(s.getHostelBlock())
                .roomType(s.getRoomType())
                .roomNo(s.getRoomNo())
                .bedNo(s.getBedNo())
                .allocatedOn(s.getAllocatedOn())
                .roomId(s.getRoomId())
                // Relations
                .wardenId(s.getWarden() != null ? s.getWarden().getId() : null)
                .wardenName(s.getWarden() != null ? s.getWarden().getName() : null)
                .joinDate(s.getJoinDate())
                .build();
    }
}