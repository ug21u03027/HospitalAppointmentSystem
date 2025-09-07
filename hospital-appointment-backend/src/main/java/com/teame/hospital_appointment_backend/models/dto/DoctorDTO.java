package com.teame.hospital_appointment_backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private Long doctorId;
    private String name;
    private String specialization;
    private String availability;
    private String phone;
    private Double consultationFee;
}
