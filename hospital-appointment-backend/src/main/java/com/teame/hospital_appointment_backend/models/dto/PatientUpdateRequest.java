package com.teame.hospital_appointment_backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientUpdateRequest {
    private String name;
    private Integer age;
    private String contact;
}
