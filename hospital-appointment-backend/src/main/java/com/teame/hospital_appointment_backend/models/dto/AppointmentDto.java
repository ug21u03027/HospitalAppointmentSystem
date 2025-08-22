package com.teame.hospital_appointment_backend.models.dto;

import com.teame.hospital_appointment_backend.models.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long patient_id;
    private Long doctor_id;
    private LocalDate date;
    private LocalTime time;
    private AppointmentStatus status;
}
