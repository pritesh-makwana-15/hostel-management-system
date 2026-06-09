package com.hms.hms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolveComplaintRequest {
    private String status;
    private String resolutionNotes;
}
