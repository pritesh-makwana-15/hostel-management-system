package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.FeeStructureDTO;
import com.hms.hms.service.FeeStructureService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fee-structures")
public class FeeStructureController {

    private static final Logger logger = LoggerFactory.getLogger(FeeStructureController.class);

    @Autowired
    private FeeStructureService feeStructureService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        logger.info("Health check called");
        return ResponseEntity.ok("Fee Structure Controller is UP");
    }

    @GetMapping("/public")
    public ResponseEntity<String> publicTest() {
        return ResponseEntity.ok("Public endpoint works");
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeeStructureDTO>> createFeeStructure(@RequestBody FeeStructureDTO dto) {
        logger.info("Creating fee structure: {}", dto);
        FeeStructureDTO created = feeStructureService.createFeeStructure(dto);
        logger.info("Created fee structure: {}", created);
        return ResponseEntity.ok(ApiResponse.success("Fee structure created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeeStructureDTO>>> getAllFeeStructures() {
        List<FeeStructureDTO> feeStructures = feeStructureService.getAllFeeStructures();
        return ResponseEntity.ok(ApiResponse.success("Fee structures fetched successfully", feeStructures));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeeStructureDTO>> getFeeStructureById(@PathVariable Long id) {
        FeeStructureDTO feeStructure = feeStructureService.getFeeStructureById(id);
        return ResponseEntity.ok(ApiResponse.success("Fee structure fetched successfully", feeStructure));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FeeStructureDTO>> updateFeeStructure(
            @PathVariable Long id,
            @RequestBody FeeStructureDTO dto) {
        FeeStructureDTO updated = feeStructureService.updateFeeStructure(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Fee structure updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFeeStructure(@PathVariable Long id) {
        feeStructureService.deleteFeeStructure(id);
        return ResponseEntity.ok(ApiResponse.success("Fee structure deleted successfully", null));
    }

    @GetMapping("/block/{hostelBlock}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeeStructureDTO>>> getFeeStructuresByBlock(@PathVariable String hostelBlock) {
        List<FeeStructureDTO> feeStructures = feeStructureService.getFeeStructuresByBlock(hostelBlock);
        return ResponseEntity.ok(ApiResponse.success("Fee structures fetched successfully", feeStructures));
    }

    @GetMapping("/room-type/{roomType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FeeStructureDTO>>> getFeeStructuresByRoomType(@PathVariable String roomType) {
        List<FeeStructureDTO> feeStructures = feeStructureService.getFeeStructuresByRoomType(roomType);
        return ResponseEntity.ok(ApiResponse.success("Fee structures fetched successfully", feeStructures));
    }
}