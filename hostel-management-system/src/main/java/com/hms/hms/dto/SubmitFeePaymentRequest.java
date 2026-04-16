package com.hms.hms.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitFeePaymentRequest {
    private String academicCycle;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionId;
    private String paymentDate;
    private String notes;
}
