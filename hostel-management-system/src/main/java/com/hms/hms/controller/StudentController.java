package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.dto.StudentResponseDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/students")
public class StudentController {

    @Autowired private StudentService studentService;

    // ── POST /api/admin/students ──────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> create(@RequestBody RegisterRequest request) {
        Student student = studentService.createStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student created successfully", toDTO(student)));
    }

    // ── GET /api/admin/students ───────────────────────────────
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAll() {
        List<StudentResponseDTO> list = studentService.getAllStudents()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Students fetched", list));
    }

    // ── GET /api/admin/students/{id} ──────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getById(@PathVariable Long id) {
        Student student = studentService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Student found", toDTO(student)));
    }

    // ── GET /api/admin/students/{id}/profile ──────────────────
    // Returns full joined data: personal + academic + hostel + fees + complaints
    @GetMapping("/{id}/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile(@PathVariable Long id) {
        StudentProfileDTO profile = studentService.getProfile(id);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", profile));
    }

    // ── PUT /api/admin/students/{id} ──────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> update(
            @PathVariable Long id, @RequestBody RegisterRequest request) {
        Student updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", toDTO(updated)));
    }

    // ── PATCH /api/admin/students/{id}/status ─────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        Student updated = studentService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Status updated", toDTO(updated)));
    }

    // ── POST /api/admin/students/{id}/assign-room ─────────────
    @PostMapping("/{id}/assign-room")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> assignRoom(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        Student updated = studentService.assignRoom(
                id,
                body.get("hostelBlock"),
                body.get("roomType"),
                body.get("roomNo"),
                body.get("bedNo"),
                body.get("roomId") != null ? Long.parseLong(body.get("roomId")) : null
        );
        return ResponseEntity.ok(ApiResponse.success("Room assigned successfully", toDTO(updated)));
    }

    // ── DELETE /api/admin/students/{id} ───────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        String result = studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    // ── DTO mapper ────────────────────────────────────────────
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