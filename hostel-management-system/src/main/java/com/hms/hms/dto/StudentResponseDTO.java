package com.hms.hms.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String course;
    private LocalDate dob;
    private LocalDate joinDate;
    private Long roomId;
    private Long wardenId;
    private String wardenName;
}