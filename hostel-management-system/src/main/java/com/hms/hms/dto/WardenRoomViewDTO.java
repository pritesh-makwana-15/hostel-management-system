package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Shape matches the frontend's existing dummy roomsData format
 * used in the Warden Rooms & Beds screens.
 */
@Data
@Builder
public class WardenRoomViewDTO {
    private String id; // e.g. "R001"
    private String blockHostel; // e.g. "Block A"
    private String roomNumber;  // e.g. "101"
    private String roomType;    // "AC" / "Non-AC"
    private String floor;       // e.g. "1st"
    private int totalBeds;
    private int occupiedBeds;
    private int availableBeds;
    private String occupancyStatus; // "Available" / "Partially Occupied" / "Fully Occupied"
    private String description;
    private List<WardenBedViewDTO> beds;
}

