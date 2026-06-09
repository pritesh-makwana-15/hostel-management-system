package com.hms.hms.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeePaymentDTO {
    private String paymentId;
    private Long feeId;
    private Long studentId;
    private String studentName;
    private String enrollmentNo;
    private String roomNo;
    private String hostelBlock;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionId;
    private String proofFile;
    private String status;
    private String paymentDate;
    private String createdAt;
    private String notes;
}
