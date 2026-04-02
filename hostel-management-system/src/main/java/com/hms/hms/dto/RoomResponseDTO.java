package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RoomResponseDTO {

    private Long id;
    private String hostelBlock;
    private String roomNumber;
    private String roomType;
    private String floor;
    private String description;
    private int totalBeds;
    private int occupiedBeds;
    private int availableBeds;
    private String occupancyStatus; // Available / Partial / Full
    private LocalDateTime createdAt;
    private List<BedDTO> beds;

    @Data
    @Builder
    public static class BedDTO {
        private Long id;
        private String bedNumber;
        private String status;
    }
}
