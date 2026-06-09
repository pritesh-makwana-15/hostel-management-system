package com.hms.hms.controller;

import com.hms.hms.dto.ApiResponse;
import com.hms.hms.dto.FeePaymentDTO;
import com.hms.hms.dto.FeeStructureDTO;
import com.hms.hms.dto.StudentFeeSummaryDTO;
import com.hms.hms.dto.SubmitFeePaymentRequest;
import com.hms.hms.entity.Student;
import com.hms.hms.service.FeePaymentService;
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

    @Autowired
    private FeePaymentService feePaymentService;

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

    @GetMapping("/fees")
    public ResponseEntity<ApiResponse<StudentFeeSummaryDTO>> getMyFeeSummary(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @RequestParam(required = false) String academicCycle
    ) {
        StudentFeeSummaryDTO summary = feePaymentService.getMyFeeSummary(user.getUsername(), academicCycle);
        return ResponseEntity.ok(ApiResponse.success("Fee summary fetched", summary));
    }

    @PostMapping("/fees/pay")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> submitFeePayment(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @RequestBody SubmitFeePaymentRequest request
    ) {
        FeePaymentDTO payment = feePaymentService.submitPayment(user.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment submitted for verification", payment));
    }

    @PostMapping("/fees/request")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> submitFeePaymentRequest(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @RequestBody SubmitFeePaymentRequest request
    ) {
        FeePaymentDTO payment = feePaymentService.submitPayment(user.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Payment request submitted for admin verification", payment));
    }

    @GetMapping("/fees/payments")
    public ResponseEntity<ApiResponse<List<FeePaymentDTO>>> getMyFeePayments(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user
    ) {
        List<FeePaymentDTO> payments = feePaymentService.getMyPayments(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Payment history fetched", payments));
    }

    @GetMapping("/fees/payments/{paymentId}")
    public ResponseEntity<ApiResponse<FeePaymentDTO>> getMyFeePaymentById(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User user,
            @PathVariable String paymentId
    ) {
        FeePaymentDTO payment = feePaymentService.getMyPaymentById(user.getUsername(), paymentId);
        return ResponseEntity.ok(ApiResponse.success("Payment receipt fetched", payment));
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