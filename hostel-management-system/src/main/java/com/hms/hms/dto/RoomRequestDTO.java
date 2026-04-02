package com.hms.hms.dto;

import lombok.Data;

@Data
public class RoomRequestDTO {
    private String hostelBlock;
    private String roomNumber;
    private String roomType;
    private String floor;
    private String description;
    private int totalBeds;
}
