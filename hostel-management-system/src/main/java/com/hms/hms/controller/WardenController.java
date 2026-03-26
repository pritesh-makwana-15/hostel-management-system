package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.RegisterRequest;
import com.hms.hms.dto.WardenResponseDTO;
import com.hms.hms.entity.Warden;
import com.hms.hms.service.WardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/wardens")
public class WardenController {

    @Autowired private WardenService wardenService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WardenResponseDTO>> create(@RequestBody RegisterRequest request) {
        Warden warden = wardenService.createWarden(request);
        return ResponseEntity.ok(ApiResponse.success("Warden created", toDTO(warden)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<WardenResponseDTO>>> getAll() {
        List<WardenResponseDTO> list = wardenService.getAllWardens()
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Wardens fetched", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WardenResponseDTO>> getById(@PathVariable Long id) {
        Warden warden = wardenService.getById(id);
        if (warden == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(ApiResponse.success("Warden found", toDTO(warden)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<WardenResponseDTO>> update(
            @PathVariable Long id, @RequestBody RegisterRequest request) {
        Warden updated = wardenService.updateWarden(id, request);
        return ResponseEntity.ok(ApiResponse.success("Warden updated", toDTO(updated)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        String result = wardenService.deleteWarden(id);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    private WardenResponseDTO toDTO(Warden w) {
        return WardenResponseDTO.builder()
                .id(w.getId())
                .name(w.getName())
                .email(w.getEmail())
                .phone(w.getPhone())
                .gender(w.getGender())
                .address(w.getAddress())
                .joinDate(w.getJoinDate())
                .adminId(w.getAdmin() != null ? w.getAdmin().getId() : null)
                .build();
    }
}