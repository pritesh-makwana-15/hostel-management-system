package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class WardenResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String gender;
    private String address;
    private LocalDate joinDate;
    private Long adminId;
}