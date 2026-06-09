package com.hms.hms.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentFeeSummaryDTO {
    private Long feeId;
    private Long studentId;
    private String studentName;
    private String enrollmentNo;
    private String academicCycle;
    private String hostelBlock;
    private String roomType;
    private BigDecimal totalFee;
    private BigDecimal paidAmount;
    private BigDecimal balance;
    private String status;
    private BigDecimal monthlyFee;
    private BigDecimal utilities;
    private BigDecimal securityDeposit;
    private BigDecimal lateFee;
}
