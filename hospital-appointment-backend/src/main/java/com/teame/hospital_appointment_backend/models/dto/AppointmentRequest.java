package com.teame.hospital_appointment_backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private String symptoms;
    private LocalDate date;
    private LocalTime time;
}
