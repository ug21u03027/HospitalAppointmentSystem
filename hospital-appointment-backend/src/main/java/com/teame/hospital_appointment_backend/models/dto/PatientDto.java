package com.teame.hospital_appointment_backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private Long patientId;
    private String name;
    private Integer age;
    private String contact;
    private Long userId;
}
