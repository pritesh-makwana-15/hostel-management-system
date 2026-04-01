package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.AdminResponseDTO;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.entity.Admin;
import com.hms.hms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

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
}