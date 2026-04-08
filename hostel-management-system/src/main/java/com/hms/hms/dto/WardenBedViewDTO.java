package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WardenBedViewDTO {
    private String id;          // e.g. "B1"
    private String status;      // "Available" / "Occupied" / "Maintenance"
    private String studentName; // null if available
    private String enrollment;  // null if available
}

