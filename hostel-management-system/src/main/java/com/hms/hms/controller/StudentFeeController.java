package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.FeeStructureDTO;
import com.hms.hms.entity.Student;
import com.hms.hms.repository.StudentRepository;
import com.hms.hms.repository.FeeStructureRepository;
import com.hms.hms.entity.FeeStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentFeeController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FeeStructureRepository feeStructureRepository;

    @GetMapping("/fee-structure")
    public ResponseEntity<ApiResponse<List<FeeStructureDTO>>> getStudentFeeStructure(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        
        String email = user.getUsername();
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<FeeStructure> feeStructures;
        
        if (student.getRoomType() != null && student.getHostelBlock() != null) {
            feeStructures = feeStructureRepository.findByHostelBlockAndRoomType(
                student.getHostelBlock(), 
                student.getRoomType()
            ).stream().collect(Collectors.toList());
        } else {
            feeStructures = feeStructureRepository.findByStatus("Active");
        }

        List<FeeStructureDTO> dtos = feeStructures.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Fee structure fetched", dtos));
    }

    @GetMapping("/my-fee")
    public ResponseEntity<ApiResponse<FeeStructureDTO>> getMyFeeDetails(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        
        String email = user.getUsername();
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getRoomType() == null || student.getHostelBlock() == null) {
            return ResponseEntity.ok(ApiResponse.success("No room assigned yet", null));
        }

        FeeStructure feeStructure = feeStructureRepository
                .findByHostelBlockAndRoomType(student.getHostelBlock(), student.getRoomType())
                .orElse(null);

        if (feeStructure == null) {
            return ResponseEntity.ok(ApiResponse.success("No fee structure found for your room type", null));
        }

        return ResponseEntity.ok(ApiResponse.success("Your fee details", mapToDTO(feeStructure)));
    }

    private FeeStructureDTO mapToDTO(FeeStructure feeStructure) {
        return FeeStructureDTO.builder()
                .id(feeStructure.getId())
                .hostelBlock(feeStructure.getHostelBlock())
                .roomType(feeStructure.getRoomType())
                .monthlyFee(feeStructure.getMonthlyFee())
                .securityDeposit(feeStructure.getSecurityDeposit())
                .utilities(feeStructure.getUtilities())
                .lateFee(feeStructure.getLateFee())
                .status(feeStructure.getStatus())
                .createdAt(feeStructure.getCreatedAt())
                .build();
    }
}