package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
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
@RequestMapping("/api/admin/students")
public class StudentController {

    @Autowired private StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> create(@RequestBody RegisterRequest request) {
        Student student = studentService.createStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student created", toDTO(student)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> getAll() {
        List<StudentResponseDTO> list = studentService.getAllStudents()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Students fetched", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARDEN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getById(@PathVariable Long id) {
        Student student = studentService.getById(id);
        if (student == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ApiResponse.success("Student found", toDTO(student)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> update(
            @PathVariable Long id, @RequestBody RegisterRequest request) {
        Student updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated", toDTO(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        String result = studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    private StudentResponseDTO toDTO(Student s) {
        return StudentResponseDTO.builder()
                .id(s.getId())
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .course(s.getCourse())
                .dob(s.getDob())
                .joinDate(s.getJoinDate())
                .roomId(s.getRoomId())
                .wardenId(s.getWarden() != null ? s.getWarden().getId() : null)
                .wardenName(s.getWarden() != null ? s.getWarden().getName() : null)
                .build();
    }
}