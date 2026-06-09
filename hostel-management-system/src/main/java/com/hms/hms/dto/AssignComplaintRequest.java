package com.hms.hms.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignComplaintRequest {
    private Long wardenId;
    private String notes;
}
