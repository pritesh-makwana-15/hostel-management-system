package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.StudentProfileDTO;
import com.hms.hms.dto.StudentResponseDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.service.StudentService;
import com.hms.hms.service.WardenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/warden/students")
public class WardenStudentController {

    @Autowired 
    private StudentService studentService;

    @Autowired 
    private WardenService wardenService;

    // ───────────────── GET ALL STUDENTS ─────────────────
    @GetMapping
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<Page<StudentResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage = studentService.getAllStudents(pageable);

        Page<StudentResponseDTO> dtoPage = studentPage.map(this::toDTO);

        return ResponseEntity.ok(
                ApiResponse.success("Students fetched successfully", dtoPage)
        );
    }

    // ───────────────── GET BY ID ─────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getById(@PathVariable Long id) {

        Student student = studentService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Student found", toDTO(student))
        );
    }

    // ───────────────── GET PROFILE ─────────────────
    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getProfile(@PathVariable Long id) {

        StudentProfileDTO profile = studentService.getProfile(id);

        return ResponseEntity.ok(
                ApiResponse.success("Profile fetched", profile)
        );
    }

    // ───────────────── UPDATE STUDENT ─────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> update(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        Student updated = studentService.updatePartial(id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Student updated", toDTO(updated))
        );
    }

    // ───────────────── UPDATE STATUS ─────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Student updated = studentService.updateStatus(id, body.get("status"));

        return ResponseEntity.ok(
                ApiResponse.success("Status updated", toDTO(updated))
        );
    }

    // ───────────────── DTO MAPPER (FIXED) ─────────────────
    private StudentResponseDTO toDTO(Student s) {

        return StudentResponseDTO.builder()
                .id(s.getId())
                .enrollmentNo(s.getEnrollmentNo())
                .status(s.getStatus())

                // ── User ──
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())

                // ── Personal ──
                .gender(s.getGender())
                .dob(s.getDob())
                .nationality(s.getNationality())
                .photoUrl(s.getPhotoUrl())

                // ── Academic ──
                .course(s.getCourse())
                .yearSemester(s.getYearSemester())
                .batch(s.getBatch())
                .program(s.getProgram())

                // ── Guardian ──
                .guardianName(s.getGuardianName())
                .guardianPhone(s.getGuardianPhone())
                .guardianRelation(s.getGuardianRelation())
                .address(s.getAddress())

                // ── Hostel ──
                .hostelBlock(s.getHostelBlock())
                .roomType(s.getRoomType())
                .roomNo(s.getRoomNo())
                .bedNo(s.getBedNo())
                .allocatedOn(s.getAllocatedOn())

                // ✅ FIXED (IMPORTANT)
                .roomId(s.getRoom() != null ? s.getRoom().getId() : null)

                // ── Relations ──
                .wardenId(s.getWarden() != null ? s.getWarden().getId() : null)
                .wardenName(s.getWarden() != null ? s.getWarden().getName() : null)

                .joinDate(s.getJoinDate())
                .build();
    }
}