package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.StudentResponseDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentApiController {

    @Autowired private StudentService studentService;

    // ── GET /api/student/roommates ─────────────────────────────
    @GetMapping("/roommates")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getRoommates(@RequestParam String room) {
        List<Student> roommates = studentService.getRoommatesByRoom(room);
        List<StudentResponseDTO> roommateDTOs = roommates.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Roommates fetched", roommateDTOs));
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
                .roomId(s.getRoom() != null ? s.getRoom().getId() : null)
                // Relations
                .wardenId(s.getWarden() != null ? s.getWarden().getId() : null)
                .wardenName(s.getWarden() != null ? s.getWarden().getName() : null)
                .joinDate(s.getJoinDate())
                .build();
    }
}
