package com.hms.hms.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStructureDTO {
    public Long id;
    public String hostelBlock;
    public String roomType;
    public Double monthlyFee;
    public Double securityDeposit;
    public Double utilities;
    public Double lateFee;
    public String status;
    public LocalDateTime createdAt;
}