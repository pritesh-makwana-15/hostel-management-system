package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminMeDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String designation;
    private String role; // "ADMIN", derived from User.role
    private LocalDateTime createdAt; // admin "member since"
}

