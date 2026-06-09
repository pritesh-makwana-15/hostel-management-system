package com.hms.hms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPaymentUpdateRequest {
    private String notes;
}
