package com.hms.hms.dto;

import lombok.Data;

@Data
public class AssignRoomRequest {
    private Long roomId;
    private String bedNo;
}